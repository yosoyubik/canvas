<script lang="ts">
  import 'carbon-components-svelte/css/all.css';
  import store from '../store';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { addApi, addSubscription } from '../store';
  import {
    Content,
    Grid,

  } from "carbon-components-svelte";
  import Header from '../components/Header.svelte';

  import Subscription from '../lib/canvasSubscription';
  import Api from '../lib/canvasApi';
  import GCP from '../lib/gcp';
  import gcpManager from '../lib/gcpManager';

  onMount(async () => {
    const channel = new window.channel();
    const api = new Api(window.ship, channel);
    const gcpApi = new GCP(window.ship, channel);
    const subscription = new Subscription(api, channel);

    addApi(api);
    addSubscription(subscription);
    gcpManager.configure(gcpApi);
    gcpManager.start();
    subscription.start();
  });

</script>

<main>
  <Header />
  <Content>
    <Grid>
      <slot />
    </Grid>
  </Content>
</main>





