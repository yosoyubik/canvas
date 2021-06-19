<script lang="ts">
  import { goto } from '$app/navigation';

  export let canvasList;

  let open = true;
	let selected = "";

  console.log(canvasList);

</script>

<!-- svelte-ignore a11y-no-onchange -->
<select on:change={(event) => goto(`/~canvas/${event.currentTarget.value}`, {
  "replaceState": true
})}>
  {#each canvasList as canvas}
    <option value={canvas}>
      {canvas}
    </option>
  {/each}
</select>

<style>

</style>

