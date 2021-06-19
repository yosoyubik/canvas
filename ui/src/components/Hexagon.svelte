<script lang='ts'>
  import * as d3 from 'd3';
  import * as topojson from 'topojson-client';
  import {createEventDispatcher} from 'svelte';

  import { hexProjection } from "../lib/hexTopology";

  export let topology;
  export let d;
  export let selectedColor;
  export let mousing;

  $: color = d3.color(selectedColor).formatHex();

  const radius = 10;

  const dispatch = createEventDispatcher();
  const projection = hexProjection(radius);
  const path = d3.geoPath().projection(projection);

  function mousedown(event) {
    //  right click
    if (event.which === 3) return;
    mousing = d.attr.fill && d.attr.color === color ? -1 : +1;
    mousemove();
  };

  function mousemove() {
    if (mousing) {
      const fill = mousing > 0;
      dispatch('update', {
        id: d.id,
        data: {
          fill: fill,
          color: fill ? color : undefined
        }
      });
      // if (mousing !== 0 && canvas.metadata.template !== 'mesh-welcome') {
      if (mousing !== 0) {
        // Save stroke remotely
        dispatch('save', {
          id: d.id,
          fill: fill,
          color: mousing > 0 ? color : ''
        });
      }
    }
  };

  function mouseup() {
    mousemove();
    mousing = 0;
    dispatch('flush');
  };
</script>

<path
  d={path(topojson.feature(topology, d))}
  fill={d.attr && d.attr.fill ? d.attr.color : undefined}
  on:mousedown={mousedown}
  on:mouseup={mouseup}
  on:mousemove={mousemove}
/>

<style>
  path:hover {
    fill: pink;
  }
</style>