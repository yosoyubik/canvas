<style>
  .toolbar {
    text-align: center;
    display: flex;
    justify-content: center;
    height: auto;
  }

  .toolbar-item {
    padding-left: .5rem;
    padding-right: .5rem;
    border-radius: .25rem;
  }

  .toolbar-item.selected {
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>

<script lang="ts">
  import * as d3 from 'd3';

  import PaintBrushAlt16 from "carbon-icons-svelte/lib/PaintBrushAlt16";
  import Erase16 from "carbon-icons-svelte/lib/Erase16";
  import Eyedropper16 from "carbon-icons-svelte/lib/Eyedropper16";
  import TextFill16 from "carbon-icons-svelte/lib/TextFill16";

  import { Tool } from '../types/canvas';
  import ColorPickerTooltip from './ColorPickerTooltip.svelte';

  export let color;
  export let selectedTool = Tool.Brush;
  let tools = [
    {
      name: Tool.Brush,
      icon: PaintBrushAlt16,
    },
    {
      name: Tool.Eraser,
      icon: Erase16,
    },
    {
      name: Tool.Eyedropper,
      icon: Eyedropper16,
    },
    {
      name: Tool.Fill,
      icon: TextFill16,
    }
  ]

  function selectTool(name) {
    selectedTool = name;
  }
</script>

<div class="toolbar">
  {#each tools as tool}
    <div class="toolbar-item" class:selected={tool.name == selectedTool}
      on:click={() => selectTool(tool.name)} >
      <svelte:component this="{tool.icon}" name="{tool.name}" />
    </div>
  {/each}
  <div class="toolbar-item">
    <ColorPickerTooltip on:colorChange bind:color />
  </div>
</div>