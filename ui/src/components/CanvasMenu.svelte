<script lang="ts">
  import store, { updateCurrentCanvas } from '../store';
  import {
    Select,
    SelectItem,
    SelectItemGroup
  } from 'carbon-components-svelte';
  import { cite, daToDate, dateToShortDa } from '$lib/utils';

  export let selectedCanvas: string;

  function parseCanvasName(name: string) {
    const [host, canvas] = name.split('/');
    const citeHost = cite(host);
    const parse = canvas.split('-');
    if (parse.length === 1) return [citeHost, canvas].join('/');
    const date = daToDate(parse[parse.length - 1]);
    if (date === null) return [citeHost, canvas].join('/');
    parse.pop();
    return `${[citeHost, parse.join('-')].join('/')} [${dateToShortDa(date)}] `;
  }
</script>

{#if $store.privateCanvas || $store.publicCanvas}
  <Select
    light
    size="sm"
    inline
    selected={selectedCanvas}
    on:change={event => {
      if (event.detail) {
        updateCurrentCanvas(event.detail);
      }
    }}>
    {#if $store.publicCanvas.length > 0}
      <SelectItemGroup label="Public">
        {#each $store.publicCanvas as canvas}
          <SelectItem value={canvas} text={parseCanvasName(canvas)} />
        {/each}
      </SelectItemGroup>
    {/if}
    {#if $store.privateCanvas.length > 0}
      <SelectItemGroup label="Private">
        {#each $store.privateCanvas as canvas}
          <SelectItem value={canvas} text={parseCanvasName(canvas)} />
        {/each}
      </SelectItemGroup>
    {/if}
  </Select>
{:else}
  <Select light size="sm" inline />
{/if}
