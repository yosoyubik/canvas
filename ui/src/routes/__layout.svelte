<script lang="ts">
  import 'carbon-components-svelte/css/all.css';

  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { addApi, addSubscription } from '../store';
  import {
    Content,
    Grid,
    Row,
    Column,
    Dropdown
  } from "carbon-components-svelte";
  import { goto } from '$app/navigation';

  import store from '../store';

  import Header from '../components/Header.svelte';
  import CreateCanvas from '../components/CreateCanvas.svelte';

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
      <Row noGutter>
        <Column>
          <CreateCanvas />
          {#if $store.canvasList && $store.canvasList.length > 0 }
            <Dropdown
              size='sm'
              type='inline'
              name='Choose'
              label='Open'
              on:select={(event) => goto(`${base}/c/${event.detail.selectedItem.text}`, {
                "replaceState": false
              })}
              items={
                $store.canvasList.map(
                (d, i) => {
                  return { "id": i.toString(), "text": d }
                })
              } />
          {/if}
        </Column>
      </Row>
      <Row>
        <Column>
         <div>
           <slot />
         </div>
        </Column>
      </Row>
    </Grid>
  </Content>
</main>

<style>
  div {
    text-align: center;
    /* padding: 2em; */
    display: flex;
    justify-content: center;
  }

  @media (min-width: 648px) {
    div {
      max-width: none;
    }
  }
</style>





