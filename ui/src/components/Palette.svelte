<style>
  .palette-container {
    display: flex;
    height: 32px;
  }

  .palette-container > div:not(:last-child) {
    margin-right: 15px;
  }

  .palette {
    cursor: pointer;
  }
</style>

<script lang="ts">
  import ColorPickerTooltip from './ColorPickerTooltip.svelte';
  import StandardColors from '../components/StandardColors.svelte';
  import LastUsedColors from '../components/LastUsedColors.svelte';

  export let color;
  export let lastUsedColor;
</script>

<div class="palette-container">
  <div>
    <ColorPickerTooltip bind:color size={32} />
  </div>
  <div>
    <svg height={32} width={284}>
      <g id="legend" class="palette">
        <StandardColors bind:selectedColor={color} size={12} />
        <LastUsedColors
          bind:selectedColor={color}
          {lastUsedColor}
          size={12}
          length={19} />
      </g>
    </svg>
  </div>
</div>
