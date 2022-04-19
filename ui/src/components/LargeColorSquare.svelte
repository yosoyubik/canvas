<style>
  svg {
    background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
      linear-gradient(-45deg, #808080 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #808080 75%),
      linear-gradient(-45deg, transparent 75%, #808080 75%);
    background-size: 11px 11px;
    background-position: 0 0, 0 5.5px, 5.5px -5.5px, -5.5px 0px;
  }
</style>

<script lang="ts">
  export let color;
  export let size = 24;
</script>

<svg width={size} height={size}>
  <g id="selectedColor">
    <rect
      x="0.5"
      y="0.5"
      width={size - 1}
      height={size - 1}
      stroke="gray"
      fill={color} />
  </g>
</svg>
