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
  const oneDay = 1000 * 3600 * 24;

  function canPaint() {
    if (!d.attr.when || !d.attr.who) {
      return true;
    } else if (d.attr.who === $store.ship) {
      return true;
    } else {
      return Math.abs(Date.now() - d.attr.when) >= oneDay;
    }
  }

  function mousedown(event) {
    //  right click
    if (event.which === 3) return;
    mousing = d.attr.color === color ? -1 : +1;
    mousemove();
  }

  function mousemove() {
    // if (mousing && canPaint()) {  // Keeps pixels for at least oneDay
    if (mousing) {
      const paint = { color, when: Date.now(), who: $store.ship };
      const fill = mousing > 0;
      let stroke = {
        id: d.id
      };
      // d.attr = { ...d.attr, color: fill ? color : null };
      if (fill) Object.assign(stroke, paint);

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
  on:mousemove={mousemove} />
