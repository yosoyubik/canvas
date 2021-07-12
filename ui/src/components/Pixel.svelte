<style>
  path:hover {
    fill: pink;
  }
</style>

<script lang="ts">
  import * as d3 from 'd3';
  import * as topojson from 'topojson-client';
  import { createEventDispatcher } from 'svelte';

  import store from '../store';

  export let topology;
  export let d;
  export let selectedColor;
  export let mousing;
  export let path;

  $: color = selectedColor;

  const dispatch = createEventDispatcher();

  function mousedown(event) {
    //  right click
    if (event.which === 3) return;
    mousing = d.attr.color === color ? -1 : +1;
    mousemove();
  }

  function mousemove() {
    if (mousing) {
      const fill = mousing > 0;
      const paint = { color, when: Date.now(), who: $store.ship };
      let stroke = {
        id: d.id
      };
      // d.attr = { ...d.attr, color: fill ? color : null };
      if (mousing > 0) Object.assign(stroke, paint);

      // Save stroke locally
      dispatch('update', {
        id: d.id,
        data: {
          color: fill ? color : null
        }
      });

      // Save stroke remotely
      dispatch('save', stroke);
    }
  }

  function mouseup() {
    mousemove();
    mousing = 0;
    dispatch('flush');
  }
</script>

<path
  d={path(topojson.feature(topology, d))}
  fill={d.attr && d.attr.color
    ? d.attr.color
    : // 'white' instead?
      '#fff0'}
  stroke-width={1}
  on:mousedown={mousedown}
  on:mouseup={mouseup}
  on:mousemove={mousemove}
/>
