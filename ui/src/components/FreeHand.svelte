<style>
  #canvas {
    overflow: hidden;
    max-width: 1024px;
    min-width: 320px;
    display: block;
    margin: auto;
    height: 100%;
    border: 1px solid rgb(97, 94, 94, 0.3);
  }
</style>

<script lang="ts">
  import * as d3 from 'd3';
  import { Runtime, Inspector } from '@observablehq/runtime';
  import notebook from '@yosoyubik/draw-me';
  import { onMount } from 'svelte';
  import store from '../store';
  import type { CanvasData } from '../types/canvas';
  import { PutObjectCommand } from '@aws-sdk/client-s3';
  import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

  import exportSvg from '../lib/exportCanvas';

  import {
    ContextMenu,
    ContextMenuOption,
    ContextMenuDivider
  } from 'carbon-components-svelte';

  export let width: number;
  export let height: number;
  export let canvas: CanvasData;

  let canvasRef, lineRef, colorRef, notebookModule, runtime;

  // onMount(() => {
  //   const runtime = new Runtime();
  //   notebookModule = runtime.module(notebook, name => {
  //     console.log(name);
  //     switch (name) {
  //       case 'viewof exposedData':
  //         return new Inspector(canvasRef);
  //       case 'viewof lineWidth':
  //         return new Inspector(lineRef);
  //       case 'viewof strokeStyle':
  //         return new Inspector(colorRef);
  //     }
  //   });
  // });

  $: if (canvasRef) {
    runtime = new Runtime();
    notebookModule = runtime.module(notebook, name => {
      console.log(name);
      switch (name) {
        case 'viewof exposedData':
          return new Inspector(canvasRef);
        case 'viewof lineWidth':
          return new Inspector(lineRef);
        case 'viewof strokeStyle':
          return new Inspector(colorRef);
      }
    });
  }

  // component to notebook
  // beforeUpdate(() => {
  //   if (notebookModule) {
  //     notebookModule.redefine('boost', lineRef);
  //     notebookModule.redefine('speed', colorRef);
  //   }
  // });

  let radius = canvas.metadata.radius;

  let canvasNode,
    menu = false,
    apiPaints = {},
    showPalette = true,
    color = '#d53e4f';
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

<div id="canvas">
  <input
    bind:this={lineRef}
    class="input"
    id="line"
    type="range"
    min="0.5"
    max="20"
    value="5"
    step="0.5" />
  <input bind:this={colorRef} class="input" id="color" type="color" />
  <div bind:this={canvasRef} {width} {height} />
</div>

{#if canvas.data}
  <ContextMenu open={menu}>
    {#if $store.gcp || $store.s3.credentials}
      <ContextMenuOption
        indented
        labelText="Export canvas..."
        on:click={async () => {
          // console.log('exporting');
          const svgData = exportSvg(canvasNode);
          if (!$store.s3.client) {
            throw new Error('Storage not ready');
          }

          const fileExtension = 'svg';
          const timestamp = dateToDa(new Date());
          const bucket = $store.s3.configuration.currentBucket;
          const fileName = `${window.ship}/${timestamp}-${canvas.metadata.name}.${fileExtension}`;
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
            // console.log(signedUrl.split('?')[0]);
            //  TODO: add signedUrl to canvas metadata
            //
          } else {
            console.log('error');
          }
        }} />
      <ContextMenuDivider />
    {/if}
    <ContextMenuOption
      labelText="Show color palette"
      selected={showPalette}
      on:click={() => (showPalette = !showPalette)} />
  </ContextMenu>
{/if}
