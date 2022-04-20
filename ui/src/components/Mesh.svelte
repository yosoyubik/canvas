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

  .eyedropping {
    cursor: crosshair;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as topojson from 'topojson-client';
  import {
    Loading,
    Row,
    Column,
    Tooltip,
    InlineNotification,
    Grid
  } from 'carbon-components-svelte';

  import store, { setNotification } from '../store';
  import type { CanvasTopology, Metadata } from '../types/canvas';
  import { Tool } from '../types/canvas';

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

  export let snoopy: string = '';

  const dispatch = createEventDispatcher();

  let canvasNode,
    apiPaints = {},
    showMesh = false,
    viewBox = { width: 0, height: 0 },
    radius = $store.radius,
    pixels = [];

  // FIXME: calculate this properly, so the mesh doesn't cut off on the top/right sides
  function calculateViewBox(radius, type) {
    const width =
      type === 'hexa' ? radius * 2 * Math.sin(Math.PI / 3) : 2.5 * radius + 1;
    const height = type === 'hexa' ? 2.5 * radius : 2 * radius + 1;
    return { width, height };
  }

  function saveStroke(stroke) {
    const { id } = stroke;
    // const index =
    //   canvas.metadata.columns !== columns
    //     ? transformIndex(id, canvas.metadata.columns, columns)
    //     : id;
    apiPaints[id] = { mesh: { ...stroke } };
    dispatch('stroke', stroke);
  }

  function handleSave(event) {
    saveStroke(event.detail);
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

  function handleInspect(event) {
    // setNotification({
    //   text: event.detail.properties.who,
    //   type: 'info'
    // });
    if (!event.detail.properties) return;
    const properties = event.detail.properties;
    snoopy =
      properties && properties.who && properties.when
        ? `${properties.who}-${new Date(properties.when).toUTCString()}`
        : '';
  }

  function setDifference(setA, setB) {
    let _difference = new Set(setA);
    for (let elem of setB) {
      _difference.delete(elem);
    }
    return _difference;
  }

  function handleFill(event) {
    let start = Date.now();
    let { pixelId, colorToReplace } = event.detail;
    let recentlyFilledPixelIds = [pixelId];
    let allTouchedPixelIds = new Set([pixelId]);
    let loopCount = 0;
    while (recentlyFilledPixelIds.length > 0 && loopCount < 5000) {
      let adjacentPixelIds = recentlyFilledPixelIds.map(id => {
        return getAdjacent(columns, metadata.mesh, id);
      });
      let adjacentPixelIdsSet = new Set(adjacentPixelIds.flat());
      adjacentPixelIdsSet = setDifference(
        adjacentPixelIdsSet,
        allTouchedPixelIds
      );
      adjacentPixelIds = [...adjacentPixelIdsSet];

      recentlyFilledPixelIds = adjacentPixelIds.map(id => {
        let pixel = pixels[+id];
        let shouldFill = pixel?.shouldFill(colorToReplace);
        if (shouldFill) {
          pixel.immediatePaint();
          saveStroke({
            id,
            color
          });
        }
        return shouldFill ? id : false;
      });
      allTouchedPixelIds = new Set([
        ...allTouchedPixelIds,
        ...adjacentPixelIds
      ]);
      recentlyFilledPixelIds = recentlyFilledPixelIds.filter(id => !!id);
      loopCount += 1;
    }
    handleFlush();
  }

  $: viewBox = calculateViewBox(radius, metadata.mesh);
  $: columns = calculateColumns(metadata.width, radius, metadata.mesh);
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
  class:eyedropping={selectedTool == Tool.Eyedropper}
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
        on:inspect={handleInspect}
        on:locked={handleLocked}
        on:save={handleSave}
        on:flush={handleFlush}
        on:fill={handleFill} />
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
