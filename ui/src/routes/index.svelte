<script lang="ts">
  import store from '../store';
  import Hexagons from '../components/Hexagons.svelte';
  import { Loading } from "carbon-components-svelte";
  import {Row, Column, Dropdown} from "carbon-components-svelte";
  import CreateCanvas from '../components/CreateCanvas.svelte';

   let name = 'welcome'
</script>

<Row noGutter>
  <Column style="text-align: center; justify-content: center;">
    {#if $store.canvasList && $store.canvasList.length > 0}
      <Dropdown
        size="sm"
        type="inline"
        name="Choose"
        label="Select Canvas"
        on:select="{(event) => {
          name = event.detail.selectedItem.text;
        }}"
        items="{$store.canvasList.map((d, i) => {
          return { id: i.toString(), text: d };
        })}" />
    {/if}
    <CreateCanvas />
  </Column>
</Row>
<Row>
  <Column>
    <div>
      {#if $store.canvas && $store.canvas[name]}
        <Hexagons
          canvas={$store.canvas[name]}
          width={$store.canvas[name].metadata.width}
          height={$store.canvas[name].metadata.height} />
      {:else}
        <Loading small />
      {/if}
    </div>
  </Column>
</Row>

<style>
  div {
    text-align: center;
    display: flex;
    justify-content: center;
    height: 100%;
  }

  @media (min-width: 648px) {
    div {
      max-width: none;
    }
  }
</style>
