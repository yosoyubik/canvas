<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, context }) {
    console.log(page, context);
    return {
      props: {
        name: page.params.name
      }
    };
  }
</script>


<script lang="ts">
  import { Loading } from "carbon-components-svelte";
  import store from '../../store';
  import Hexagons from '../../components/Hexagons.svelte';

  export let name;
</script>

<div>
  {#if $store.canvas && name && $store.canvas[name]}
    <Hexagons canvas={$store.canvas[name]}
       width={$store.canvas[name].metadata.width}
       height={$store.canvas[name].metadata.height}
    />
  {:else}
    <Loading small />
  {/if}
</div>
