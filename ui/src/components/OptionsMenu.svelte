<script lang="ts">
  import store, {
    leaveCanvas,
    makePublic,
    setNotification,
    updateImageURL
  } from '../store';

  import type { Notification } from '../types/store';

  import { PutObjectCommand } from '@aws-sdk/client-s3';
  import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
  import copy from 'clipboard-copy';
  import {
    ContextMenu,
    ContextMenuOption,
    ContextMenuDivider,
    ContextMenuGroup
  } from 'carbon-components-svelte';
  import Copy from 'carbon-icons-svelte/lib/CopyFile16';
  import Leave from 'carbon-icons-svelte/lib/Unlink16';
  import Share from 'carbon-icons-svelte/lib/Share16';
  import Public from 'carbon-icons-svelte/lib/Unlocked16';

  import exportSvg from '../lib/exportCanvas';

  export let name: string;
  export let fileURL: string;
  export let location: string;
  export let showMesh: boolean;
  export let privateCanvas: boolean;
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

  function leave(location: string, name: string) {
    $store.api.leave(location, name).then(() => {
      console.log('[ success leave canvas... ]', location, name);
      leaveCanvas(location, name);
    });
  }

  function unlock(name: string) {
    $store.api.makePublic(name).then(() => {
      console.log('[ success unlocking canvas... ]', name);
      makePublic(name);
    });
  }
</script>

<ContextMenu open={menu}>
  <ContextMenuOption
    labelText="Copy Canvas path..."
    icon={Share}
    indented
    on:click={() => {
      setNotification({
        text: 'Canvas path copied to clipboard',
        type: 'info'
      });
      copy(`~${$store.ship}/${name}`);
    }} />
  {#if location !== `~${$store.ship}`}
    <ContextMenuOption
      labelText="Leave Canvas..."
      icon={Leave}
      indented
      on:click={() => {
        setNotification({
          text: 'Unsubscribing from host...',
          type: 'info'
        });
        leave(location, name);
      }} />
  {/if}
  <!-- {#if privateCanvas}
    <ContextMenuOption
      labelText="Make Public"
      icon={Public}
      indented
      on:click={() => unlock(name)} />
  {/if} -->
  {#if fileURL}
    <ContextMenuOption
      icon={Copy}
      indented
      labelText="Copy Image URL..."
      on:click={() => {
        setNotification({
          text: 'image URL copied to clipboard',
          type: 'info'
        });
        copy(fileURL);
      }} />
  {/if}
  {#if $store.gcp || hasS3($store.s3)}
    <ContextMenuOption
      indented
      labelText="Export canvas..."
      on:click={async () => {
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
          fileURL = signedUrl.split('?')[0];
          $store.api.save(location, name, fileURL).then(() => {
            console.log('[image file saved]', signedUrl);
            copy(fileURL);
            console.log('[copied]', fileURL);
            updateImageURL(location, name, fileURL);
            setNotification({
              text:
                'Canvas SVG exported successfully (URL copied to clipboard)',
              type: 'success'
            });
          });
        } else {
          console.log('error');
        }
      }} />
  {/if}
  <ContextMenuDivider />
  <ContextMenuGroup>
    <ContextMenuOption
      labelText="Show mesh"
      selected={showMesh}
      on:click={() => (showMesh = !showMesh)} />
  </ContextMenuGroup>
</ContextMenu>
