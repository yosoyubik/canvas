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
  import {
    Header,
    Tooltip,
    TooltipFooter,
    Row,
    Column,
    InlineLoading
  } from 'carbon-components-svelte';
  import Info from 'carbon-icons-svelte/lib/InformationFilled16';

  function logo() {
    const logos = '▦✎'.split('');
    return logos[Math.floor(Math.random() * logos.length)];
  }
</script>

<Header company={`⬡ ${logo()} ⬢`} platformName="canvas">
  {#if $store.name && $store.canvas && $store.canvas[$store.name]}
    <div>
      <Row>
        <Column padding>
          {#if $store.connection === 'disconnected'}
            <InlineLoading status="error" description="Disconnected" />
          {:else if $store.connection === 'reconnecting'}
            <InlineLoading status="active" description="Reconnecting..." />
          {:else if $store.connection === 'connected'}
            <InlineLoading status="finished" description="Connected" />
          {/if}
        </Column>
        <Column padding noGutter>
          <!-- Using a component here creates a chunk with upper case letters, which doesn't play well with Urbit's %file-server app -->
          {#if $store.canvas[$store.name].metadata.mesh === 'squa'}
            <svg
              width="38"
              height="34"
              viewBox="3 3 40 39"
              style={'margin-right: 5px;'}>
              <path
                d="M 8 8 H 8 V 23 H 23 V 8 H 8 M 38 8 H 23 V 23 H 38 V 8 Z M 38 23 M 38 37 M 38 37 H 23 V 23 H 38 Z M 5 23 H 8 Z M 5 8 H 8 Z M 8 5 V 8 Z M 23 5 V 8 Z M 38 5 V 8 Z M 41 8 H 38 Z M 41 23 H 38 Z M 41 37 H 38 Z M 38 40 V 37 Z M 23 40 V 37 Z M 20 37 H 23 Z M 8 23 V 26 Z"
                stroke="white"
                stroke-width="0.6"
                fill="none" />
            </svg>
          {:else if $store.canvas[$store.name].metadata.mesh === 'hexa'}
            <svg
              width="35"
              height="34"
              viewBox={`0 0 128 128`}
              style={'margin-right: 5px;'}
              transform={'scale(2.3, 2.3)'}>
              >
              <path
                d="m48 57 6-10 12 0 6 10-6 10-12 0 0 0t0 0l0 0m0 0-6-10m24 0h12l6 10-6 10h-12l-6-10m-12 0-6 10 6-10L66 67zM72 77 84 77 90 87 84 97 72 97 66 87ZM54 67 48 57H36L31 67 36 77 48 77ZM72 57 66 47 72 37 84 37 90 47 84 57 72 57 66 47ZM48 77 54 87 66 87 72 77 66 67 54 67Z"
                stroke="white"
                stroke-width="0.7"
                fill="none" />
            </svg>
          {/if}
        </Column>
        <Column padding noGutterLeft>
          <Tooltip icon={Info} align="end" style={'padding-top: 7px;'}>
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
