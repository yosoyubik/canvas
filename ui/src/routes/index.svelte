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
  import store from '../store';

  import {
    topology as calculateTopology,
    projection as calculateProjection
  } from '$lib/topology';

  import type { Metadata } from '../types/canvas';
  // import FreeHand from '../components/FreeHand.svelte';
  import { Loading, Row, Column, Tooltip } from 'carbon-components-svelte';
  import ColorPalette from 'carbon-icons-svelte/lib/ColorPalette16';

  import Mesh from '../components/Mesh.svelte';
  import CanvasMenu from '../components/CanvasMenu.svelte';
  import ColorPicker from '../components/ColorPicker.svelte';
  import CreateCanvas from '../components/CreateCanvas.svelte';
  import JoinCanvas from '../components/JoinCanvas.svelte';
  import Palette from '../components/Palette.svelte';

  let colors = d3.range(18),
    color = '#d53e4f',
    startColor = color,
    currentCanvas = $store.name;

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

  let topology,
    projection,
    canvas,
    path,
    radius = $store.radius;

  $: if ($store.name && $store.canvas) {
    const { width, height, mesh } = $store.canvas[$store.name].metadata;
    canvas = $store.canvas[$store.name];
    topology = calculateTopology(canvas.metadata.mesh)(
      canvas.metadata.name,
      radius,
      width,
      height,
      canvas.data,
      canvas.metadata.columns
    );
    projection = calculateProjection(radius, mesh);
    path = d3.geoPath().projection(projection);
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
              bind:colors
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
      {#if canvas && !$store.leaving && topology}
        {#if isMesh($store.canvas[$store.name].metadata)}
          {#key canvas}
            <Mesh
              {canvas}
              {topology}
              {color}
              {path}
              metadata={$store.canvas[$store.name].metadata} />
          {/key}
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
