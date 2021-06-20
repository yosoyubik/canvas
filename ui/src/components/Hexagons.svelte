<script lang='ts'>
  import * as d3 from 'd3';
  import store from '../store';

  import type { CanvasData } from "../types/canvas";

  import hexTopology from "../lib/hexTopology";

  import Hexagon from './Hexagon.svelte';
  import Palette from './Palette.svelte';
  import {
    ContextMenu, ContextMenuOption, ContextMenuDivider, ContextMenuGroup}
  from 'carbon-components-svelte';

  export let width: number;
  export let height: number;
  export let canvas: CanvasData;
  console.log(height);
  const radius = 10;

  let geometries, topology, menu = false
    , apiPaints = {}
    , mousing = 0
    , colors = d3.range(18)
    , showPalette = true
    , color = '#d53e4f';

  //  $ allows to render hexagons on route change
  $: if (canvas.data) {
    topology = hexTopology(
      canvas.metadata.name,
      radius,
      width,
      height,
      canvas.data,
      canvas.metadata.width
    );
    geometries = topology.objects.hexagons.geometries;
  }

  function handleUpdate(event) {
    canvas.data[event.detail.id] = event.detail.data;
	}

  function handleSave(event) {
    const { id, fill, color } = event.detail;
    apiPaints[id] = {mesh: { id, fill, color }};
	}

  function handleFlush() {
    const strokes = Object.values(apiPaints);
    const { location, name } = canvas.metadata;
    if ((strokes.length > 0) && (canvas.metadata.template !== 'mesh-welcome')) {
      $store.api.send(location, name, strokes);
    }
    apiPaints = {};
	}

  function changeColor(event) {
    color = event.detail.color;
  }
</script>

<svg
  {width}
  {height}
  id='canvas'
  viewBox={`0 0 ${width} ${height + 2.5*radius}`}
  preserveAspectRatio='xMaxYMin meet'
  on:mouseleave={ () => { mousing = 0; } }
>
  <g class='hexagon' transform={`translate(${radius}, ${radius})`}>
    {#if geometries && topology}
      {#each geometries as d}
        <Hexagon
          bind:topology={topology}
          bind:d={d}
          bind:selectedColor={color}
          on:update={handleUpdate}
          on:save={handleSave}
          on:flush={handleFlush}
          bind:mousing={mousing}
        />
      {/each}
    {/if}
  </g>
  {#if showPalette}
    <g  class='palette'
        transform={`translate(${width / 2 - (18 * 24) / 2 - 3}, ${2.5*radius})`}
    >
      <Palette bind:colors={colors} on:color={changeColor}/>
    </g>
  {/if}
  <rect {width} height={height + 2.5*radius} class='border' />
</svg>

{#if canvas.data}
  <ContextMenu open={menu}>
    {#if $store.gcp || $store.s3.credentials}
      <ContextMenuOption indented
        labelText="Export canvas..."
        on:click={()=> console.log('exporting') }
      />
      <ContextMenuDivider />
    {/if}
    <ContextMenuOption
      labelText="Show color palette"
      selected={showPalette}
      on:click={()=> showPalette = !showPalette }
    />
  </ContextMenu>
{/if}

<style>
  svg {
    overflow: hidden;
    max-width: 1024px;
    min-width: 320px;
    display: block;
    margin: auto;
    height: 100%;
  }

  .border {
    fill:none;
    stroke-width: 0.5;
    stroke:gray;
  }

  .hexagon {
    fill: #fff0;
    pointer-events: all;
  }

  .palette {
    cursor: pointer;
  }

</style>