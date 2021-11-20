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
  import MeshPreview from './MeshPreview.svelte';

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
            <MeshPreview
              width="38"
              height="34"
              stroke="white"
              strokeWidth="0.6"
              fill="none"
              type="squa" />
            <!-- <svg
              width="38"
              height="34"
              viewBox="3 3 40 39"
              style={'margin-right: 5px;'}>
              <path
                d="M8 8H8V23H23V8H8M38 8H23V23H38V8ZM38 23M38 37M38 37H23V23H38ZM5 23H8ZM5 8H8ZM8 5V8ZM23 5V8ZM38 5V8ZM41 8H38ZM41 23H38ZM41 37H38ZM38 40V37ZM23 40V37ZM20 37H23ZM8 23V26Z"
                stroke="white"
                stroke-width="0.6"
                fill="none" />
            </svg> -->
          {:else if $store.canvas[$store.name].metadata.mesh === 'hexa'}
            <MeshPreview
              width="34"
              height="34"
              stroke="white"
              strokeWidth="0.3"
              fill="none"
              type="hexa" />
            <!-- <svg
              width="35"
              height="34"
              viewBox={`0 0 128 128`}
              style={'margin-right: 5px;'}
              transform={'scale(2.3, 2.3)'}>
              >
              <path
                d="m48 57 6-10 12 0 6 10-6 10-12 0 0 0t0 0l0 0m0 0-6-10m24 0h12l6 10-6 10h-12l-6-10m-12 0-6 10 6-10L66 67zM72 77 84 77 90 87 84 97 72 97 66 87ZM54 67 48 57H36L31 67 36 77 48 77ZM72 57 66 47 72 37 84 37 90 47 84 57 72 57 66 47ZM48 77 54 67Z"
                stroke="white"
                stroke-width="0.7"
                fill="none" />
            </svg> -->
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
