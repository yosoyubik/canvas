<script>
  export let width, height, stroke, strokeWidth, fill, type;
</script>

{#if type === 'squa'}
  <svg {width} {height} viewBox="3 3 40 39" style={'margin-right: 5px;'}>
    <path
      d="M 8 8 H 8 V 23 H 23 V 8 H 8 M 38 8 H 23 V 23 H 38 V 8 Z M 38 23 M 38 37 M 38 37 H 23 V 23 H 38 Z M 5 23 H 8 Z M 5 8 H 8 Z M 8 5 V 8 Z M 23 5 V 8 Z M 38 5 V 8 Z M 41 8 H 38 Z M 41 23 H 38 Z M 41 37 H 38 Z M 38 40 V 37 Z M 23 40 V 37 Z M 20 37 H 23 Z M 8 23 V 26 Z"
      {stroke}
      stroke-width={strokeWidth}
      {fill} />
  </svg>
{:else if type === 'hexa'}
  <svg
    {width}
    {height}
    viewBox={`0 0 128 128`}
    style={'margin-right: 5px;'}
    transform={'scale(1.2, 1.2)'}>
    <path
      d="m 48 57 l 6 -10 l 12 0 l 6 10 l -6 10 l -12 0 l 0 0 t 0 0 l 0 0 m 0 0 l -6 -10 m 24 0 h 12 l 6 10 l -6 10 h -12 l -6 -10 m -12 0 l -6 10 l 6 -10 L 66 67 z M 72 77 L 84 77 L 90 87 L 84 97 L 72 97 L 66 87 L 72 77 Z M 54 67 L 48 57 H 36 L 31 67 L 36 77 L 48 77 L 54 67 Z M 72 57 L 66 47 L 72 37 L 84 37 L 90 47 L 84 57 L 72 57 L 66 47 Z M 48 77 L 54 87 L 66 87 L 72 77 L 66 67 L 54 67 L 48 77 Z"
      {stroke}
      stroke-width={strokeWidth + 0.5}
      {fill} />
  </svg>
{/if}
