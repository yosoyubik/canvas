<script lang="ts">
  import store, {
    leaveCanvas,
    makePublic,
    setNotification,
    updateImageURL
  } from '../store';
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

  function canUploadFilesToStorage() {
    return $store.gcp || hasS3($store.s3);
  }

  async function uploadFileToStorage(data, fileName: string) {
    if (!$store.s3.client) {
      throw new Error('Storage not ready');
    }

    const bucket = $store.s3.configuration.currentBucket;
    const params = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: data,
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
        setNotification(
          'Canvas SVG exported successfully (URL copied to clipboard)'
        );
      });
    } else {
      throw new Error(`Failed to upload to s3. Request failed with this status code: ${$metadata.httpStatusCode}`);
    }
  }

  function downloadFile(data, fileName: string, mimetype: string = 'text/plain;charset=utf-8') {
    let element = document.createElement('a');
    let fileString = `data:${mimetype},` + encodeURIComponent(data);
    element.setAttribute('href', fileString);
    element.setAttribute('download', fileName);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
</script>

<ContextMenu open={menu}>
  <ContextMenuOption
    labelText="Copy Canvas path..."
    icon={Share}
    indented
    on:click={() => {
      setNotification('Canvas path copied to clipboard');
      copy(`~${$store.ship}/${name}`);
    }} />
  {#if location !== `~${$store.ship}`}
    <ContextMenuOption
      labelText="Leave Canvas..."
      icon={Leave}
      indented
      on:click={() => {
        setNotification('Unsubscribing from host...');
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
        setNotification('image URL copied to clipboard');
        copy(fileURL);
      }} />
  {/if}
  <ContextMenuOption
    indented
    labelText="Export canvas..."
    on:click={async () => {
      const svgData = exportSvg(canvasNode);

      const fileExtension = 'svg';
      const timestamp = dateToDa(new Date());
      const fileName = `${window.ship}/${timestamp}-${name}.${fileExtension}`;
      if (canUploadFilesToStorage()) {
        try {
          await uploadFileToStorage(svgData, fileName);
          return;
        } catch (e) {
          console.error(`Encountered error uploading to s3: ${e.message}\nDownloading svg file`, e);
        }
      }
      downloadFile(svgData, fileName, 'image/svg+xml');
    }} />
  <ContextMenuDivider />
  <ContextMenuGroup>
    <ContextMenuOption
      labelText="Show mesh"
      selected={showMesh}
      on:click={() => (showMesh = !showMesh)} />
  </ContextMenuGroup>
</ContextMenu>
