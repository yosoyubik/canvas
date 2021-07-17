<script>
  export let width, height, stroke, strokeWidth, fill, type;
</script>

{#if type === 'squa'}
  <svg {width} {height} viewBox="3 3 40 39" style={'margin-right: 5px;'}>
    <path
      d="M 8 8 H 8 V 23 H 23 V 8 H 8 M 38 8 H 23 V 23 H 38 V 8 Z M 38 23 M 38 37 M 38 37 H 23 V 23 H 38 Z M 5 23 H 8 Z M 5 8 H 8 Z M 8 5 V 8 Z M 23 5 V 8 Z M 38 5 V 8 Z M 41 8 H 38 Z M 41 23 H 38 Z M 41 37 H 38 Z M 38 40 V 37 Z M 23 40 V 37 Z M 20 37 H 23 Z M 8 23 V 26 Z"
      {stroke}
      stroke-width={strokeWidth}
      {fill}
    />
  </svg>
{:else if type === 'hexa'}
  <svg {width} {height} viewBox={`1 1 48 44`} style={'margin-right: 5px;'}>
    <path
      d="m 5 13 l 6 -10 l 12 0 l 6 10 l -6 10 l -12 0 l 0 0 t 0 0 l 0 0 m 0 0 l -6 -10 m 24 0 h 11 l 6 10 l -6 10 h -11 l -6 -10 m -12 0 l -6 10 l 5 10 l 15 0 l 4 -10 l -6 -10 z"
      {stroke}
      stroke-width={strokeWidth}
      {fill}
    />
  </svg>
{/if}
