<style>
  div {
    text-align: center;
    display: flex;
    justify-content: center;
    height: 100%;
  }
  .palette {
    cursor: pointer;
  }

  .colorPicker {
    display: inline-block;
    vertical-align: top;
    color: black;
    margin: 0 auto;
    text-align: justify;
  }

  @media (min-width: 648px) {
    div {
      max-width: none;
    }
  }

  svg {
    margin-top: 7px;
  }
</style>

<script lang="ts">
  import * as d3 from 'd3';
  import store, { resetNotification } from '../store';

  import { projection as calculateProjection } from '$lib/topology';

  import type { CanvasTopology, Metadata } from '../types/canvas';
  // import FreeHand from '../components/FreeHand.svelte';
  import {
    Loading,
    Row,
    Column,
    Tooltip,
    InlineNotification
  } from 'carbon-components-svelte';
  import ColorPalette from 'carbon-icons-svelte/lib/ColorPalette16';

  import Mesh from '../components/Mesh.svelte';
  import CanvasMenu from '../components/CanvasMenu.svelte';
  import ColorPicker from '../components/ColorPicker.svelte';
  import CreateCanvas from '../components/CreateCanvas.svelte';
  import JoinCanvas from '../components/JoinCanvas.svelte';
  import Palette from '../components/Palette.svelte';

  let color = '#d53e4f',
    startColor = color,
    topology: CanvasTopology,
    path;

  function isMesh(metadata: Metadata) {
    return metadata.template !== 'draw';
  }

  function isFreeHand(metadata: Metadata) {
    return metadata.template === 'draw';
  }

  function colorCallback(event) {
    const { r, g, b, a } = event.detail;
    if (!(isNaN(r) || isNaN(r) || isNaN(b))) {
      color = d3.rgb(r, g, b, a).formatRgb();
    }
    startColor = d3.rgb(r, g, b, a).formatHex();
  }

  $: if ($store.name && $store.canvas && $store.canvas[$store.name]) {
    const { mesh } = $store.canvas[$store.name].metadata;
    topology = $store.canvas[$store.name].data;
    path = d3.geoPath().projection(calculateProjection($store.radius, mesh));
  }
</script>

<div>
  {#if $store.canvas}
    <Row>
      <Column padding
        ><Row><CanvasMenu selectedCanvas={$store.name} /></Row></Column>
      <Column padding><Row><CreateCanvas /></Row></Column>
      <Column padding><Row><JoinCanvas /></Row></Column>
      <Column>
        <!-- <Row> -->
        <Tooltip align="center" icon={ColorPalette}>
          <div class={'colorPicker'}>
            <ColorPicker on:colorChange={colorCallback} {startColor} />
          </div>
        </Tooltip>
        <!-- </Row> -->

        <svg height={15}>
          <g id="legend" class="palette" transform={`translate(13, 1)`}>
            <Palette
              on:color={event => {
                color = event.detail.color;
                startColor = color;
              }}
              size={12} />
          </g>
        </svg>
      </Column>
    </Row>
  {/if}
</div>
<Row padding>
  <Column>
    <div>
      {#if topology && !$store.leaving}
        {#if isMesh($store.canvas[$store.name].metadata)}
          <Mesh
            {topology}
            {color}
            {path}
            metadata={$store.canvas[$store.name].metadata} />
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
      <div class="notification">
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
