<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as d3 from 'd3';

  export let colors: number[];
  export let size: number;

  let currentColor = 0;

  const dispatch = createEventDispatcher();

  const color = d3
    .scaleOrdinal<number, string>()
    .domain(d3.range(9))
    .range([
      '#d53e4f',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#ffffbf',
      '#e6f598',
      '#abdda4',
      '#66c2a5',
      '#3288bd'
    ]);

  const gray = d3
    .scaleOrdinal<number, string>()
    .domain(d3.range(9))
    .range(d3.schemeGreys[9]);

  function clicklegend(d) {
    currentColor = d;
    dispatch('color', {
      color: d < 9 ? color(d) : gray(d)
    });
  }
</script>

{#each colors as d}
  <rect
    x={d < 9 ? d * 15 : (d + 1) * 15}
    width={size}
    height={size}
    stroke={d === currentColor ? '#000' : 'gray'}
    fill={d < 9 ? color(d) : gray(d)}
    on:click={() => clicklegend(d)}
  />
{/each}
