<style>
  .empty-cell {
    cursor: auto;
  }
</style>

<script lang="ts">
  export let size: number;
  export let length: number;
  export let selectedColor;
  export let lastUsedColor;

  let colors = Array(19).fill(undefined);

  function clicklegend(color) {
    if (color) {
      selectedColor = color;
    }
  }

  $: {
    if (lastUsedColor != selectedColor && lastUsedColor != colors[0]) {
      colors = [lastUsedColor, ...colors];
      colors = colors
        .filter((color, index) => {
          return !color || colors.indexOf(color) === index;
        })
        .slice(0, length);
    }
  }
</script>

{#each colors as color, i}
  <rect
    x={i * 15 + 1}
    y={14 + 4 + 1}
    width={size}
    height={size}
    stroke={color ? 'gray' : 'lightgray'}
    stroke-dasharray={color ? '' : '3,1'}
    class:empty-cell={!color}
    fill={color || '#fff0'}
    on:click={() => clicklegend(color)} />
{/each}
