<script lang="ts">
  import store, { updateCurrentCanvas } from '../store';
  import {
    Select,
    SelectItem,
    SelectItemGroup
  } from 'carbon-components-svelte';

  export let selectedCanvas: string;
</script>

{#if $store.privateCanvas || $store.publicCanvas}
  <Select
    light
    size="sm"
    inline
    selected={selectedCanvas}
    on:change={event => {
      console.log('canvasMenu', event, event.detail, $store.name);
      if (event.detail) {
        updateCurrentCanvas(event.detail);
      }
    }}
  >
    {#if $store.publicCanvas.length > 0}
      <SelectItemGroup label="Public">
        {#each $store.publicCanvas as canvas}
          <SelectItem value={canvas} text={canvas} />
        {/each}
      </SelectItemGroup>
    {/if}
    {#if $store.privateCanvas.length > 0}
      <SelectItemGroup label="Private">
        {#each $store.privateCanvas as canvas}
          <SelectItem value={canvas} text={canvas} />
        {/each}
      </SelectItemGroup>
    {/if}
  </Select>
{:else}
  <Select light size="sm" inline />
{/if}
