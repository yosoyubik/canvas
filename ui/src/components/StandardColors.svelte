<script lang="ts">
  import * as d3 from 'd3';

  export let size: number;

  export let selectedColor;

  const colors: number[] = d3.range(18),
    color = d3
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
    let hexColor = d < 9 ? color(d) : gray(d);
    selectedColor = d3.color(hexColor).formatRgb();
  }
</script>

{#each colors as d}
  <rect
    x={(d < 9 ? d * 15 : (d + 1) * 15) + 1}
    y={1}
    width={size}
    height={size}
    stroke="gray"
    fill={d < 9 ? color(d) : gray(d)}
    on:click={() => clicklegend(d)} />
{/each}
