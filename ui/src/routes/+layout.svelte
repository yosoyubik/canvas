<script lang="ts">
  import 'carbon-components-svelte/css/all.css';
  import Channel from '../lib/channel';
  import { onMount } from 'svelte';
  import { addApi, addSubscription } from '../store';
  import { Content, Grid } from 'carbon-components-svelte';
  import Subscription from '$lib/canvasSubscription';
  import Api from '$lib/canvasApi';
  import GCP from '$lib/gcp';
  import gcpManager from '$lib/gcpManager';

  import Header from '../components/Header.svelte';

  onMount(async () => {
    const channel = new Channel();
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

<Header />
<Content style={'background-color: white;'}>
  <Grid>
    <slot />
  </Grid>
</Content>
