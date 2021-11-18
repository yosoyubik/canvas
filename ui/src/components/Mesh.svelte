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
  import type { CanvasData, Metadata, Topology } from '../types/canvas';

  import { columns as calculateColumns } from '$lib/topology';
  import { InlineNotification } from 'carbon-components-svelte';
  import Pixel from '././Pixel.svelte';
  import OptionsMenu from './OptionsMenu.svelte';

  export let canvas: CanvasData;
  export let topology: Topology;
  export let metadata: Metadata;
  export let color: string;
  export let path: any;

  let canvasNode,
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
    if (event.detail.del) {
      delete canvas.data[event.detail.id];
    } else {
      canvas.data[event.detail.id] = event.detail.data;
    }
  }

  function handleSave(event) {
    const { id } = event.detail;
    // const index =
    //   canvas.metadata.columns !== columns
    //     ? transformIndex(id, canvas.metadata.columns, columns)
    //     : id;
    apiPaints[id] = { mesh: { ...event.detail } };
  }

  function handleLocked(event) {
    const { id } = event.detail;
    console.log(id, apiPaints[id]);
  }

  function handleFlush() {
    const strokes = Object.values(apiPaints);
    const { location, name } = metadata;
    if (strokes.length > 0) {
      $store.api.send(location, name, strokes);
    }
    apiPaints = {};
  }

  viewBox = calculateViewBox(radius, metadata.mesh);
  columns = calculateColumns(metadata.width, metadata.columns, metadata.mesh);
</script>

<!-- <div class="notification">
  <InlineNotification lowContrast kind="success" title="Success:" />
</div> -->
<svg
  bind:this={canvasNode}
  width={metadata.width}
  height={metadata.height}
  id="canvas"
  viewBox={`0 0 ${metadata.width + viewBox.width} ${
    metadata.height + viewBox.height
  }`}
  preserveAspectRatio="xMaxYMin meet"
  on:mouseleave={() => {
    mousing = 0;
  }}>
  <g
    id="hexagons"
    class="hexagon"
    transform={`translate(${radius}, ${
      metadata.mesh === 'hexa' ? radius : radius + 1
    })`}>
    {#if showMesh}
      <path
        shape-rendering="crispEdges"
        class="mesh"
        id="mesh"
        d={path(topojson.mesh(topology, topology.objects.pixels))} />
    {/if}
    {#each topology.objects.pixels.geometries as d}
      <Pixel
        id={d.id}
        d={path(topojson.feature(topology, d))}
        attr={d.attr}
        selectedColor={color}
        lockup={metadata.lockup}
        bind:mousing
        on:update={handleUpdate}
        on:locked={handleLocked}
        on:save={handleSave}
        on:flush={handleFlush} />
    {/each}
  </g>
</svg>

<OptionsMenu
  name={metadata.name}
  location={metadata.location}
  fileURL={metadata.file}
  privateCanvas={metadata.private}
  bind:showMesh
  {canvasNode} />
