<style>
  path:hover {
    fill: pink;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import store from '../store';

  export let path;
  export let data;
  export let selectedColor;
  export let mousing;
  export let lockup;

  $: color = selectedColor;

  const dispatch = createEventDispatcher();
  const oneDay = 1000 * 3600 * 24;

  function canPaint() {
    if (!data.properties.when || !data.properties.who) {
      return true;
    } else if (data.who === $store.ship) {
      //  The owner is updating
      //
      return true;
    } else {
      console.log(
        Date.now(),
        data,
        lockup,
        Math.abs(Date.now() - data.properties.when) >= lockup
      );
      return Math.abs(Date.now() - data.properties.when) >= lockup;
    }
  }

  function mousedown(event) {
    if (event.which === 3) return; //  right click
    mousing = data.properties && data.properties.color === color ? -1 : +1;
    mousemove();
  }

  function mousemove() {
    if (mousing) {
      const fill = mousing > 0;
      let stroke = { id: data.id };

      if (fill) Object.assign(stroke, { color });

      // Save stroke remotely, only if modifying a pixel
      if ((data.properties && data.properties.color) || fill)
        dispatch('save', stroke);

      // this updates the color right away
      data.properties = { ...data.properties, color: fill ? color : null };
    }
  }

  // TODO
  function mousemoveWithCheck() {
    if (mousing && canPaint()) {
      const fill = mousing > 0;
      const when = Date.now();
      let stroke = {
        id: data.id,
        color,
        when,
        who: $store.ship
      };
      // this updates the color right away
      data = {
        ...data,
        color: fill ? color : null
      };

      // Save stroke locally
      dispatch('update', {
        id: data.id,
        data: {
          color: fill ? color : null
        }
      });

      // Save stroke remotely
      dispatch('save', stroke);
    }
    if (mousing && !canPaint()) {
      dispatch('locked', { id: data.id });
    }
  }

  function mouseup() {
    mousemove();
    mousing = 0;
    dispatch('flush');
  }
</script>

<path
  d={path}
  fill={data.properties && data.properties.color
    ? data.properties.color
    : // 'white' instead?
      '#fff0'}
  stroke-width={1}
  on:mousedown={mousedown}
  on:mouseup={mouseup}
  on:mousemove={mousemove} />
