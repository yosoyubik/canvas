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
    margin-left: -0.5rem;
  }
</style>

<script lang="ts">
  import * as d3 from 'd3';

  import { Tooltip } from 'carbon-components-svelte';

  import { textFieldFocused } from '../lib/utils';
  import LargeColorSquare from './LargeColorSquare.svelte';
  import ColorPicker from './ColorPicker.svelte';

  export let open = false;
  export let color;
  export let size;

  $: startColor = d3.color(color)?.formatRgb() || 'rgb(213, 62, 79)';

  function colorCallback(event) {
    const { r, g, b, a } = event.detail;
    if (!(isNaN(r) || isNaN(r) || isNaN(b))) {
      color = d3.rgb(r, g, b, a).formatRgb();
    }
  }
</script>

<div class="button-only-tooltip">
  <Tooltip bind:open align="center" triggerText={undefined}>
    <div class={'colorPicker'}>
      <ColorPicker on:colorChange={colorCallback} {startColor} />
    </div>
    <LargeColorSquare {color} {size} slot="icon" />
  </Tooltip>
</div>

<svelte:window
  on:keydown={event => {
    switch (event.key) {
      case 'Escape':
        open = false;
        break;
      case 'c':
        if (!textFieldFocused()) {
          open = true;
        }
        break;
      default:
    }
  }} />
