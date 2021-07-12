<script lang='ts'>
  import { initHexMesh } from '../lib/hexagons';

  export let width: number;
  export let height: number;
  let mesh;
  $: if (mesh) {
    console.log('[ drawing mesh ]');
    initHexMesh(width, height);
  }
</script>

<svg 
  {width} 
  {height} 
  class='db' 
  id='mesh' 
  viewBox={`0 0 ${width} ${height}`}
  preserveAspectRatio='xMinYMid'
>
  <rect {width} {height} class='border' />
  <g class='mesh-group' bind:this={mesh}/>
</svg>

<style>
  svg {
    position: fixed;
  }

  .mesh-group{
    fill: none;
    stroke: rgb(0, 0, 0);
    stroke-opacity: .2;
    pointer-events: none;
  }

  .border {
    /* border: thin solid black; */
    fill:none; 
    stroke-width:1; 
    stroke:gray;
  }
</style>