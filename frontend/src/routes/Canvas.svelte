<script lang="ts">
  import store from '../store';
  import Hexagons from '../components/Hexagons.svelte';
  
  type Params = {
    name?: string;
  };

  export let params: Params = {};
  let name = params.name || 'welcome'; 

  console.log(params);
</script>

<main>
  {#if $store.canvas && params}
    <Hexagons canvas={$store.canvas[name]} width={$store.width} height={$store.height}  />
  {:else}
    Loading...
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;

    display: flex;
    place-items: center;
    height: 100vh;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>