<script lang="ts">
  import { push, pop, replace } from 'svelte-spa-router'
  export let canvasList;

  let open = true;
	let selected = "";
</script>

<!-- svelte-ignore a11y-no-onchange -->
<select on:change={(event) => push(`/canvas/${event.currentTarget.value}`)}>
  {#each canvasList as canvas}
    <option value={canvas}>
      {canvas}
    </option>
  {/each}
</select>

<style>

</style>

