<script lang="ts">
  import store, { updateCurrentCanvas } from '../store';
  import Hexagons from '../components/Hexagons.svelte';
  import { Loading, Select, SelectItem, Row, Column, Dropdown } from "carbon-components-svelte";
  import CreateCanvas from '../components/CreateCanvas.svelte';
  import JoinCanvas from '../components/JoinCanvas.svelte';

  // export let name;
</script>
<div>
<Row>

    <Column><CreateCanvas /></Column>
    <Column>
      {#if $store.canvasList && $store.canvasList.length > 0}
        <!-- <Dropdown
          size="sm"
          type="inline"
          name="Choose"
          label="Select"
          on:select={(event) => {
            console.log(23);
            return updateCurrentCanvas(event.detail.selectedItem.text);
          }}
          items="{$store.canvasList.map((d, i) => {
            return { id: i.toString(), text: d };
          })}" /> -->
        <Select light size="sm" inline selected={$store.name}
          on:change={(event) => updateCurrentCanvas(event.detail)}>
          {#each $store.canvasList as canvas}
            <SelectItem value={canvas} text={canvas} />
          {/each}

          <!-- <SelectItem value="white" text="White" />
          <SelectItem value="g10" text="Gray 10" />
          <SelectItem value="g90" text="Gray 90" />
          <SelectItem value="g100" text="Gray 100" /> -->
        </Select>

      {/if}
    </Column>
    <Column><JoinCanvas /></Column>
</Row>
</div>
<Row>
  <Column>
    <div>
      {#if $store.canvas && $store.canvas[$store.name]}
        <Hexagons
          canvas={$store.canvas[$store.name]}
          width={$store.canvas[$store.name].metadata.width}
          height={$store.canvas[$store.name].metadata.height} />
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
