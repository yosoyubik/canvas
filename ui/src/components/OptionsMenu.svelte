<script lang="ts">
  import store from '../store';
  import { PutObjectCommand } from '@aws-sdk/client-s3';
  import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
  import copy from 'clipboard-copy';
  import {
    ContextMenu,
    ContextMenuOption,
    ContextMenuDivider,
    ContextMenuGroup
  } from 'carbon-components-svelte';
  import Copy16 from 'carbon-icons-svelte/lib/CopyFile16';
  import Share16 from 'carbon-icons-svelte/lib/Share16';
  import exportSvg from '../lib/exportCanvas';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  // export let canvas: CanvasData;

  export let name: string;
  export let fileURL: string;
  export let location: string;
  export let showMesh: boolean;
  export let canvasNode;

  let menu = false;

  function hasS3(s3) {
    return (
      s3.credentials &&
      s3.credentials.endpoint !== '' &&
      s3.credentials.secretAccessKey !== '' &&
      s3.credentials.AccessKeyId !== '' &&
      s3.configuration.currentBucket !== ''
    );
  }

  // TODO: move to lib
  /*
    Goes from:
      (javascript Date object)
    To:
      ~2018.7.17..23.15.09..5be5    // urbit @da
  */

  function dateToDa(d: Date, mil: boolean = false): string {
    const fil = function (n: number) {
      return n >= 10 ? n : '0' + n;
    };
    return (
      `${d.getUTCFullYear()}.` +
      `${d.getUTCMonth() + 1}.` +
      `${fil(d.getUTCDate())}..` +
      `${fil(d.getUTCHours())}.` +
      `${fil(d.getUTCMinutes())}.` +
      `${fil(d.getUTCSeconds())}` +
      `${mil ? '..0000' : ''}`
    );
  }
</script>

<ContextMenu open={menu}>
  <ContextMenuOption
    labelText="Copy Canvas path..."
    icon={Share16}
    indented
    on:click={() => copy(`~${$store.ship}/${name}`)}
  />
  {#if fileURL}
    <ContextMenuOption
      icon={Copy16}
      indented
      labelText="Copy Image URL..."
      on:click={() => copy(fileURL)}
    />
  {/if}
  {#if $store.gcp || hasS3($store.s3)}
    <ContextMenuOption
      indented
      labelText="Export canvas..."
      on:click={async () => {
        console.log('exporting', $store.s3.credentials);
        const svgData = exportSvg(canvasNode);
        if (!$store.s3.client) {
          throw new Error('Storage not ready');
        }

        const fileExtension = 'svg';
        const timestamp = dateToDa(new Date());
        const bucket = $store.s3.configuration.currentBucket;
        const fileName = `${window.ship}/${timestamp}-${name}.${fileExtension}`;
        const params = new PutObjectCommand({
          Bucket: bucket,
          Key: fileName,
          Body: svgData,
          ACL: 'public-read',
          ContentType: 'image/svg+xml'
        });

        const { $metadata } = await $store.s3.client.send(params);
        if ($metadata.httpStatusCode === 200) {
          const signedUrl = await getSignedUrl($store.s3.client, params);
          console.log(signedUrl);
          // const { location, name } = canvas.metadata;
          fileURL = signedUrl.split('?')[0];
          $store.api.save(location, name, fileURL);
        } else {
          console.log('error');
        }
      }}
    />
  {/if}
  <ContextMenuDivider />
  <ContextMenuGroup>
    <ContextMenuOption
      labelText="Show mesh"
      selected={showMesh}
      on:click={() => (showMesh = !showMesh)}
    />
  </ContextMenuGroup>
</ContextMenu>
