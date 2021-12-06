<style>
  .colorPicker {
    display: inline-block;
    height: 100%;
    vertical-align: top;
    color: black;
    margin: 0 auto;
    text-align: justify;
    justify-content: center;
  }

  .button-only-tooltip {
    margin-left: -.5rem;
  }
</style>

<script lang="ts">
  import * as d3 from 'd3';

  import {
      Tooltip,
  } from 'carbon-components-svelte';

  import ColorPalette from 'carbon-icons-svelte/lib/ColorPalette16';

  import ColorPicker from './ColorPicker.svelte';

  export let color;
  $: startColor = d3.color(color).formatHex();

  function colorCallback(event) {
    const { r, g, b, a } = event.detail;
    if (!(isNaN(r) || isNaN(r) || isNaN(b))) {
      color = d3.rgb(r, g, b, a).formatRgb();
    }
  }
</script>

<div class="button-only-tooltip">
  <Tooltip align="center" icon={ColorPalette} triggerText={undefined}>
    <div class={'colorPicker'}>
      <ColorPicker on:colorChange={colorCallback} {startColor} />
    </div>
  </Tooltip>
</div>
