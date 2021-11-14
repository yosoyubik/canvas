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

  // export let topology;
  export let d;
  export let id;
  export let attr;
  export let selectedColor;
  export let mousing;
  // export let path;

  // $: console.log(topology, d);

  $: color = selectedColor;

  const dispatch = createEventDispatcher();
  const oneDay = 1000 * 3600 * 24;

  function canPaint() {
    if (!attr.when || !attr.who) {
      return true;
    } else if (attr.who === $store.ship) {
      return true;
    } else {
      return Math.abs(Date.now() - attr.when) >= oneDay;
    }
  }

  function mousedown(event) {
    // console.log('mousedown');
    if (event.which === 3) return; //  right click
    mousing = attr.color === color ? -1 : +1;
    mousemove();
  }

  function mousemove() {
    // console.log('mousemove');
    // if (mousing && canPaint()) {  // Keeps pixels for at least oneDay
    if (mousing) {
      const paint = { color, when: Date.now(), who: $store.ship };
      const fill = mousing > 0;
      let stroke = {
        id
      };
      // this updates the color right away, making it very fast
      attr = { ...attr, color: fill ? color : null };
      if (fill) Object.assign(stroke, paint);

      // Save stroke locally
      dispatch('update', {
        id,
        data: {
          color: fill ? color : null
        }
      });

      // Save stroke remotely
      dispatch('save', stroke);
    }
  }

  function mouseup() {
    // console.log('mouseup');
    mousemove();
    mousing = 0;
    dispatch('flush');
  }
</script>

<path
  {d}
  fill={attr && attr.color
    ? attr.color
    : // 'white' instead?
      '#fff0'}
  stroke-width={1}
  on:mousedown={mousedown}
  on:mouseup={mouseup}
  on:mousemove={mousemove} />
