<style>
  div {
    /* display: block; */
    margin-left: auto;
    margin-right: 10px;
    /* width: 48px; */
    /* float: left; */
  }
</style>

<script lang="ts">
  import 'carbon-components-svelte/css/all.css';
  import store from '../store';
  import { onMount } from 'svelte';
  import { addApi, addSubscription } from '../store';
  import {
    Content,
    Grid,
    Header,
    Tooltip,
    TooltipFooter,
    Row,
    Column
  } from 'carbon-components-svelte';
  import Info from 'carbon-icons-svelte/lib/InformationFilled16';
  import Subscription from '$lib/canvasSubscription';
  import Api from '$lib/canvasApi';
  import GCP from '$lib/gcp';
  import gcpManager from '$lib/gcpManager';

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

  function logo() {
    const logos = '▦✎'.split('');
    return logos[Math.floor(Math.random() * logos.length)];
  }
</script>

<Header company={`⬡ ${logo()} ⬢`} platformName="canvas">
  {#if $store.name && $store.canvas && $store.canvas[$store.name]}
    <div>
      <Row>
        <Column padding noGutter>
          <!-- Using a component here creates a chunk with upper case letters, which doesn't play well with Urbit's %file-server app -->
          {#if $store.canvas[$store.name].metadata.mesh === 'squa'}
            <svg
              width="38"
              height="34"
              viewBox="3 3 40 39"
              style={'margin-right: 5px;'}
            >
              <path
                d="M 8 8 H 8 V 23 H 23 V 8 H 8 M 38 8 H 23 V 23 H 38 V 8 Z M 38 23 M 38 37 M 38 37 H 23 V 23 H 38 Z M 5 23 H 8 Z M 5 8 H 8 Z M 8 5 V 8 Z M 23 5 V 8 Z M 38 5 V 8 Z M 41 8 H 38 Z M 41 23 H 38 Z M 41 37 H 38 Z M 38 40 V 37 Z M 23 40 V 37 Z M 20 37 H 23 Z M 8 23 V 26 Z"
                stroke="white"
                stroke-width="0.6"
                fill="none"
              />
            </svg>
          {:else if $store.canvas[$store.name].metadata.mesh === 'hexa'}
            <svg
              width="35"
              height="34"
              viewBox={`1 1 48 44`}
              style={'margin-right: 5px;'}
            >
              <path
                d="m 5 13 l 6 -10 l 12 0 l 6 10 l -6 10 l -12 0 l 0 0 t 0 0 l 0 0 m 0 0 l -6 -10 m 24 0 h 11 l 6 10 l -6 10 h -11 l -6 -10 m -12 0 l -6 10 l 5 10 l 15 0 l 4 -10 l -6 -10 z"
                stroke="white"
                stroke-width="0.6"
                fill="none"
              />
            </svg>
          {/if}
        </Column>
        <Column padding noGutterLeft>
          <Tooltip icon={Info} align="end" style={'padding-top: 10px;'}>
            <p>
              Welcome to Canvas!
              <TooltipFooter selectorPrimaryFocus="#d">
                If you have S3 Storage configured, you can export your canvas as
                SVG files.
              </TooltipFooter>
              <TooltipFooter selectorPrimaryFocus="#d">
                You can see the color picker by clicking on the Palette icon.
              </TooltipFooter>
              <TooltipFooter selectorPrimaryFocus="#d">
                To show more options, right click anywhere in the canvas.
              </TooltipFooter>
              <TooltipFooter selectorPrimaryFocus="#d">
                Feedback, questions? Contact ~norsyr-torryn :)
              </TooltipFooter>
            </p>
          </Tooltip>
        </Column>
      </Row>

      <!-- {#if $store.canvas[$store.name].metadata.mesh === 'hexa'}
        <HexPreview
          width="35"
          height="34"
          stroke="white"
          strokeWidth="0.6"
          fill="none"
        />

        <SquaPreview
          width="38"
          height="34"
          stroke="white"
          strokeWidth="0.6"
          fill="none"
        />
      {/if} -->
    </div>
  {/if}
</Header>
<Content style={'background-color: white;'}>
  <Grid>
    <slot />
  </Grid>
</Content>
