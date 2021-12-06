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
</style>

<script lang="ts">
  import * as topojson from 'topojson-client';

  import store from '../store';
  import type { CanvasTopology, Metadata, Tool } from '../types/canvas';

  import { columns as calculateColumns, getAdjacent } from '$lib/topology';
  import Mousing from '../lib/mousing';
  import Pixel from './Pixel.svelte';
  import OptionsMenu from './OptionsMenu.svelte';

  export let topology: CanvasTopology;
  export let metadata: Metadata;
  export let color: string;
  export let selectedTool: Tool;
  export let mousing: Mousing = new Mousing();
  export let path: any;

  let canvasNode,
    apiPaints = {},
    showMesh = false,
    viewBox = { width: 0, height: 0 },
    radius = $store.radius,
    columns,
    pixels = [];

  // FIXME: calculate this properly, so the mesh doesn't cut off on the top/right sides
  function calculateViewBox(radius, type) {
    const width =
      type === 'hexa' ? radius * 2 * Math.sin(Math.PI / 3) : 2.5 * radius + 1;
    const height = type === 'hexa' ? 2.5 * radius : 2 * radius + 1;
    return { width, height };
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

  function handleFill(event) {
    let { pixelId, colorToReplace } = event.detail;
    let adjacentPixelIds = getAdjacent(metadata.width, radius, metadata.mesh, pixelId);
    for (let id of adjacentPixelIds) {
      let pixel = pixels[id];
      pixel?.fill(colorToReplace);
    }
  }

  $: viewBox = calculateViewBox(radius, metadata.mesh);
  columns = calculateColumns(metadata.width, metadata.columns, metadata.mesh);
</script>

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
    mousing.onCanvas = false;
  }}
  on:mouseenter={() => {
    mousing.onCanvas = true;
  }}>
  <!-- FIXME: look into fixing translate transformation -->
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
        bind:this={pixels[d.id]}
        data={d}
        path={path(topojson.feature(topology, d))}
        bind:selectedColor={color}
        {selectedTool}
        lockup={metadata.lockup}
        bind:mousing
        on:locked={handleLocked}
        on:save={handleSave}
        on:flush={handleFlush}
        on:fill={handleFill}
      />
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
