<style>
  svg {
    overflow: hidden;
    max-width: 1024px;
    min-width: 320px;
    display: block;
    margin: auto;
    height: 100%;
  }

  .hexagon {
    /* fill: #fff0; */
    pointer-events: all;
  }

  .mesh {
    fill: none;
    stroke: rgb(97, 94, 94);
    stroke-width: 0.3px;
    pointer-events: none;
  }

  /* .notification {
    position: absolute;
    right: 10%;
    margin: auto;
  } */
</style>

<script lang="ts">
  import * as d3 from 'd3';
  import * as topojson from 'topojson-client';

  import store from '../store';
  import type { CanvasData } from '../types/canvas';

  import {
    topology as calculateTopology,
    projection as calculateProjection,
    transformIndex,
    columns as calculateColumns
  } from '$lib/topology';
  import { InlineNotification } from 'carbon-components-svelte';
  import Pixel from '././Pixel.svelte';
  import OptionsMenu from './OptionsMenu.svelte';

  export let canvas: CanvasData;
  export let width: number;
  export let height: number;
  export let color: string;

  let topology,
    geometries,
    canvasNode,
    projection,
    path,
    apiPaints = {},
    mousing = 0,
    showMesh = false,
    viewBox = { width: 0, height: 0 },
    radius = $store.radius,
    columns;

  function calculateViewBox(radius, type) {
    const width = type === 'hexa' ? radius * 2 * Math.sin(Math.PI / 3) : radius;
    const height = type === 'hexa' ? 2.5 * radius : 2 * radius + 1;
    return { width, height };
  }

  function handleUpdate(event) {
    // const index =
    //   canvas.metadata.columns !== columns
    //     ? transformIndex(event.detail.id, canvas.metadata.columns, columns)
    //     : event.detail.id;
    canvas.data[event.detail.id] = event.detail.data;
  }

  function handleSave(event) {
    const { id } = event.detail;
    // const index =
    //   canvas.metadata.columns !== columns
    //     ? transformIndex(id, canvas.metadata.columns, columns)
    //     : id;
    apiPaints[id] = { mesh: { ...event.detail } };
  }

  function handleFlush() {
    const strokes = Object.values(apiPaints);
    const { location, name } = canvas.metadata;
    if (strokes.length > 0) {
      $store.api.send(location, name, strokes);
    }
    apiPaints = {};
  }

  // FIXME: this is called for every stroke... (performance issues?)
  // but needs to be added for switching between canvas
  //
  // The only noticeable performance issue is drawing with the
  // mesh on (?)
  //
  $: {
    viewBox = calculateViewBox(radius, canvas.metadata.mesh);

    topology = calculateTopology(canvas.metadata.mesh)(
      canvas.metadata.name,
      radius,
      width,
      height,
      canvas.data,
      canvas.metadata.columns
    );
    geometries = topology.objects.pixels.geometries;
    projection = calculateProjection(radius, canvas.metadata.mesh);
    path = d3.geoPath().projection(projection);
    columns = calculateColumns(
      width,
      canvas.metadata.columns,
      canvas.metadata.mesh
    );
  }
</script>

<!-- <div class="notification">
  <InlineNotification lowContrast kind="success" title="Success:" />
</div> -->
<svg
  bind:this={canvasNode}
  {width}
  {height}
  id="canvas"
  viewBox={`0 0 ${width + viewBox.width} ${height + viewBox.height}`}
  preserveAspectRatio="xMaxYMin meet"
  on:mouseleave={() => {
    mousing = 0;
  }}>
  <g
    id="hexagons"
    class="hexagon"
    transform={`translate(${radius}, ${
      canvas.metadata.mesh === 'hexa' ? radius : radius + 1
    })`}>
    {#if showMesh}
      <path
        shape-rendering="crispEdges"
        class="mesh"
        id="mesh"
        d={path(topojson.mesh(topology, topology.objects.pixels))} />
    {/if}
    <!-- {#if topology && geometries} -->
    {#each geometries as d}
      <Pixel
        {topology}
        {d}
        {path}
        selectedColor={color}
        bind:mousing
        on:update={handleUpdate}
        on:save={handleSave}
        on:flush={handleFlush} />
    {/each}
    <!-- {/if} -->
  </g>
</svg>

{#if canvas.metadata}
  <OptionsMenu
    name={canvas.metadata.name}
    location={canvas.metadata.location}
    fileURL={canvas.metadata.file}
    privateCanvas={canvas.metadata.private}
    bind:showMesh
    {canvasNode} />
{/if}
