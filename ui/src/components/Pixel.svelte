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
  export let lockup;
  // export let path;

  // $: console.log(topology, d);

  $: color = selectedColor;

  const dispatch = createEventDispatcher();
  const oneDay = 1000 * 3600 * 24;

  function canPaint() {
    if (!attr.when || !attr.who) {
      return true;
    } else if (attr.who === $store.ship) {
      //  The owner is updating
      //
      return true;
    } else {
      console.log(
        Date.now(),
        attr,
        lockup,
        Math.abs(Date.now() - attr.when) >= lockup
      );
      return Math.abs(Date.now() - attr.when) >= lockup;
    }
  }

  function mousedown(event) {
    if (event.which === 3) return; //  right click
    mousing = attr.color === color ? -1 : +1;
    mousemove();
  }

  function mousemove() {
    if (mousing && canPaint()) {
      const fill = mousing > 0;
      const when = Date.now();
      const del = fill ? false : true;
      let stroke = {
        id,
        del,
        color,
        when,
        who: $store.ship
      };
      // this updates the color right away
      attr = {
        ...attr,
        color: fill ? color : null
      };

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
    if (mousing && !canPaint()) {
      dispatch('locked', { id });
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
