<script lang="ts">
  import 'carbon-components-svelte/css/all.css';
  import { onMount } from 'svelte';
  import { addApi, addSubscription } from '../store';
  import { Content, Grid } from 'carbon-components-svelte';
  import Api from '$lib/canvasApi';

  import Header from '../components/Header.svelte';

  onMount(async () => {
    const api = new Api("");
    api.ship = window.ship;
    addApi(api);
    api.start();
  });
</script>

<Header />
<Content style={'background-color: white;'}>
  <Grid>
    <slot />
  </Grid>
</Content>
