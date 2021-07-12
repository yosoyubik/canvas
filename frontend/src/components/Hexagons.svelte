<script lang='ts'>
  import { select } from "d3-selection";
  import createColorPicker from '../lib/colorPicker';
  import { initHexMesh,
         drawHexCanvas }
  from '../lib/hexagons';
import type { Strokes, Metadata } from "../types/canvas";

  type CanvasData = {
    data: Strokes;
    metadata: Metadata;
  }

  export let width: number;
  export let height: number;
  export let canvas: CanvasData;

  let legend, hexagons;

  $: if (legend) {
    createColorPicker(width, select(legend));
  }

  $: if (hexagons && canvas) {
    console.log('loading', canvas.metadata.name);
    drawHexCanvas(
      canvas.data,
      canvas.metadata,
      width, 
      height
    );  }
</script>

<svg 
  {width} 
  {height} 
  class='db' 
  id='canvas' 
  viewBox={`0 0 ${width} ${height}`}
  preserveAspectRatio='xMinYMid'
>
  <g class='hexagon' bind:this={hexagons} />
  <g class='legend' bind:this={legend}  />
</svg>

<style>
  .hexagon {
    fill: #fff0;
    pointer-events: all;
  }

  /* Investigate how not to use :global */
  :global(.hexagon path) {
    -webkit-transition: fill 250ms linear;
    transition: fill 250ms linear;
  }

  :global(.hexagon :hover) {
    fill: pink;
  }

  :global(.hexagon .fill) {
    fill: red;
  }
</style>