<style>
  path:hover {
    fill: pink;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import store from '../store';
  import type Mousing from '../lib/mousing';
  import { Tool } from '../types/canvas';

  export let path;
  export let data;
  export let selectedColor;
  export let selectedTool: Tool;
  export let mousing: Mousing;
  export let lockup;

  $: color = selectedColor;

  const dispatch = createEventDispatcher();
  const oneDay = 1000 * 3600 * 24;
  const defaultColor = '#fff0';

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
    mousing.active = true;
    mousing.drawMode = !(data.properties && data.properties.color === color);
    mousemove();
  }

  export function paint(draw: boolean = true) {
    let stroke = { id: data.id };

    if (draw) Object.assign(stroke, { color });

    // Save stroke remotely, only if modifying a pixel
    if ((data.properties && data.properties.color) || draw)
      dispatch('save', stroke);

    // this updates the color right away
    data.properties = { ...data.properties, color: draw ? color : null };
  }

  export function fill(colorToReplace) {
    if (colorToReplace == data.properties?.color && colorToReplace != selectedColor) {
      paint();
      dispatch('fill', {
        pixelId: data.id,
        colorToReplace,
      });
    }
  }

  function mousemove() {
    if (mousing.active) {
      let draw = mousing.drawMode;
      switch (selectedTool) {
        case Tool.Eraser:
          draw = false;
        case Tool.Brush:
          paint(draw);
          break;
        case Tool.Eyedropper:
          selectedColor = data.properties?.color || defaultColor;
          break;
        case Tool.Fill:
          let colorToReplace = data.properties?.color;

          fill(colorToReplace);
          break;
        default:
      }
    }
  }

  // TODO
  function mousemoveWithCheck() {
    if (mousing && canPaint()) {
      const draw = mousing.drawMode;
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
        color: draw ? color : null
      };

      // Save stroke locally
      dispatch('update', {
        id: data.id,
        data: {
          color: draw ? color : null
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
    dispatch('flush');
  }
</script>

<path
  d={path}
  fill={data.properties && data.properties.color
    ? data.properties.color
    : // 'white' instead?
      defaultColor}
  stroke-width={1}
  on:mousedown={mousedown}
  on:mouseup={mouseup}
  on:mousemove={mousemove} />
