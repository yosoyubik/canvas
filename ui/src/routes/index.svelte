<style>
  .container {
    text-align: center;
    display: flex;
    justify-content: center;
    height: 100%;
  }

  @media (min-width: 648px) {
    div {
      max-width: none;
    }
  }
</style>

<script lang="ts">
  import * as d3 from 'd3';
  import store, { resetNotification } from '../store';

  import { projection as calculateProjection } from '$lib/topology';

  import type { CanvasTopology, Metadata } from '../types/canvas';
  import { Tool } from '../types/canvas';
  // import FreeHand from '../components/FreeHand.svelte';
  import {
    Loading,
    Row,
    Column,
    InlineNotification
  } from 'carbon-components-svelte';

  import Mousing from '../lib/mousing';

  import Mesh from '../components/Mesh.svelte';
  import CanvasMenu from '../components/CanvasMenu.svelte';
  import CreateCanvas from '../components/CreateCanvas.svelte';
  import JoinCanvas from '../components/JoinCanvas.svelte';
  import Palette from '../components/Palette.svelte';
  import Toolbar from '../components/Toolbar.svelte';
  import KeyboardShortcuts from '../components/KeyboardShortcuts.svelte';

  let color = 'rgb(213, 62, 79)',
    lastUsedColor,
    selectedTool: Tool = Tool.Brush,
    mousing: Mousing = new Mousing(),
    topology: CanvasTopology,
    path;

  function isMesh(metadata: Metadata) {
    return metadata.template !== 'draw';
  }

  function isFreeHand(metadata: Metadata) {
    return metadata.template === 'draw';
  }

  function handleStroke(event) {
    let { color } = event.detail;
    if (color) {
      lastUsedColor = color;
    }
  }

  $: if ($store.name && $store.canvas && $store.canvas[$store.name]) {
    const { mesh } = $store.canvas[$store.name].metadata;
    topology = $store.canvas[$store.name].data;
    path = d3.geoPath().projection(calculateProjection($store.radius, mesh));
  }
</script>

<svelte:window
  on:mouseleave={() => {
    mousing.active = false;
  }}
  on:mousedown={() => {
    mousing.pressed = true;
    if (!mousing.onCanvas) {
      mousing.drawMode = true;
    }
  }}
  on:mouseup={() => {
    mousing.pressed = false;
  }} />

<KeyboardShortcuts bind:selectedTool />

<div class="container">
  {#if $store.canvas}
    <Row>
      <Column padding
        ><Row><CanvasMenu selectedCanvas={$store.name} /></Row></Column>
      <Column padding><Row><CreateCanvas /></Row></Column>
      <Column padding><Row><JoinCanvas /></Row></Column>
      <Column padding>
        <Palette bind:color {lastUsedColor} />
      </Column>
      <Column padding>
        <Toolbar bind:selectedTool />
      </Column>
    </Row>
  {/if}
</div>
<Row padding>
  <Column>
    <div class="container">
      {#if topology && !$store.leaving}
        {#if isMesh($store.canvas[$store.name].metadata)}
          <Mesh
            {topology}
            bind:color
            {selectedTool}
            bind:mousing
            {path}
            metadata={$store.canvas[$store.name].metadata}
            on:stroke={handleStroke} />
          <!-- {:else if $store.canvas[$store.name] && isFreeHand($store.canvas[$store.name].metadata)}
          <FreeHand
            canvas={$store.canvas[$store.name]}
            width={$store.canvas[$store.name].metadata.width}
            height={$store.canvas[$store.name].metadata.height}
          /> -->
        {/if}
      {:else}
        <Loading small />
      {/if}
    </div>
  </Column>
</Row>

{#if $store.notification}
  <Row>
    <Column padding>
      <div class="container notification">
        <InlineNotification
          timeout={3000}
          lowContrast
          kind="success"
          title={$store.notification}
          on:close={() => resetNotification()} />
      </div>
    </Column>
  </Row>
{/if}
