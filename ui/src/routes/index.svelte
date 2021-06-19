<script lang="ts">
  import store from '../store';
  import Hexagons from '../components/Hexagons.svelte';
  import { Loading } from "carbon-components-svelte";
</script>

<div>
  <p>Welcome to Canvas!</p>
  {#if $store.canvas && $store.canvas['welcome']}
    <Hexagons canvas={$store.canvas['welcome']}
       width={$store.canvas['welcome'].metadata.width}
       height={$store.canvas['welcome'].metadata.height}
    />
  {:else}
    <Loading small />
  {/if}
</div>