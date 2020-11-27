<script lang='ts'>
  import { select } from "d3-selection";
  import createColorPicker from './lib/colorPicker';
  import { initHexMesh,
         drawHexCanvas }
  from './lib/hexagons';

  export let width: number;
  export let height: number;

  let legend, hexagons;

  $: if (legend) {
    createColorPicker(width, select(legend));
  }

  $: if (hexagons) {
    console.log('loading')
    drawHexCanvas(
      'mesh', 
      {},
      {
          name: 'test',
          type: 'mesh-welcome',
          location: '~/norsyr-torryn',
          saved: false,
          private: true
      }, 
      width, height
    );
    initHexMesh(width, height);
  }
</script>

<svg 
  {width} 
  {height} 
  class='db' 
  id='canvas' 
  viewBox={`0 0 ${width} ${height}`}
  preserveAspectRatio='xMinYMid'
>
  <g class='mesh-group' />
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

  :global(.mesh) {
    fill: none;
    stroke: #000;
    stroke-opacity: .2;
    pointer-events: none;
  }
</style>