<style>
  div {
    /* display: block; */
    margin-left: auto;
    margin-right: 10px;
    /* width: 48px; */
    /* float: left; */
  }
  a {
    color: lightblue;
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

  import Info from 'carbon-icons-svelte/lib/InformationFilled.svelte';
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
          {:else if $store.canvas[$store.name].metadata.mesh === 'hexa'}
            <MeshPreview
              width="34"
              height="34"
              stroke="white"
              strokeWidth="0.3"
              fill="none"
              type="hexa" />
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
                You can see the color picker by clicking on the large color
                square.
              </TooltipFooter>
              <TooltipFooter selectorPrimaryFocus="#d">
                You can switch between tools with keyboard shortcuts:
                <br />
                B or P — Paint Brush
                <br />
                E or ⌫ — Eraser
                <br />
                I or D — Eyedropper (select colors on the canvas)
                <br />
                F or G — Fill Tool (be very careful with this one!)
                <br />
                C and Esc open and close the Color Picker
              </TooltipFooter>
              <TooltipFooter selectorPrimaryFocus="#d">
                To show more options, right click anywhere in the canvas.
              </TooltipFooter>
              <TooltipFooter selectorPrimaryFocus="#d">
                <span>
                  Feedback, questions? Join
                  <a
                    href="/apps/landscape/perma/group/~norsyr-torryn/canvas"
                    target="_blank">~norsyr-torryn/canvas</a>
                  or contact ~norsyr-torryn :)
                </span>
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
