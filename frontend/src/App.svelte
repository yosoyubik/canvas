<script lang="ts">
  import Router  from 'svelte-spa-router';
  import routes from './routes';
  import store from './store';
  import Header from './components/Header.svelte';
  import HexagonMesh from './components/HexagonMesh.svelte';
  import CreateCanvas from './components/CreateCanvas.svelte';

</script>

<main>
  <Header />
  <CreateCanvas />
  <Router {routes} />
  <HexagonMesh width={$store.width} height={$store.height}  />
</main>

<style>
</style>