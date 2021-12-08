<style>
  path:hover {
    stroke: gray;
  }
  path:hover:not(.eyedropping path) {
    stroke: none;
    fill: pink;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as d3 from 'd3';

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
  const defaultColor = 'rgba(255, 255, 255, 0)';

  $: pixelColor = data?.properties?.color
    ? d3.color(data.properties.color).formatRgb()
    : defaultColor;

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
    mousing.drawMode = !(pixelColor === color);
    mousemove();
  }

  export function immediatePaint(draw: boolean = true) {
    data.properties = { ...data.properties, color: draw ? color : null };
    // console.log(`[pixel immediatePaint] painting over ${pixelColor} with ${color}`);
  }

  function paint(draw: boolean = true) {
    let stroke = { id: data.id };

    if (draw) Object.assign(stroke, { color });

    // Save stroke remotely, only if modifying a pixel
    if (pixelColor !== defaultColor || draw) dispatch('save', stroke);

    // this updates the color right away
    immediatePaint(draw);
  }

  export function shouldFill(colorToReplace) {
    return colorToReplace == pixelColor && colorToReplace != selectedColor;
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
          selectedColor = pixelColor;
          break;
        case Tool.Fill:
          let colorToReplace = pixelColor;

          if (shouldFill(colorToReplace)) {
            paint();
            dispatch('fill', {
              pixelId: data.id,
              colorToReplace
            });
          }
          break;
        default:
      }
    }
  }

  // TODO
  function mousemoveWithCheck() {
    if (mousing.active && canPaint()) {
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
  fill={pixelColor}
  stroke-width={1}
  on:mousedown={mousedown}
  on:mouseup={mouseup}
  on:mousemove={mousemove} />
