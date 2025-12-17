<style>
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .toolbar-item.selected {
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>

<script lang="ts">
  import { Button } from 'carbon-components-svelte';
  import PaintBrushAlt from 'carbon-icons-svelte/lib/PaintBrushAlt.svelte';
  import Erase from 'carbon-icons-svelte/lib/Erase.svelte';
  import Eyedropper from 'carbon-icons-svelte/lib/Eyedropper.svelte';
  import TextFill from 'carbon-icons-svelte/lib/ColorPalette.svelte';
  import Search from 'carbon-icons-svelte/lib/Search.svelte';

  import { Tool } from '../types/canvas';

  export let selectedTool: Tool = Tool.Brush;

  let tools = [
    {
      name: Tool.Brush,
      icon: PaintBrushAlt
    },
    {
      name: Tool.Eraser,
      icon: Erase
    },
    {
      name: Tool.Eyedropper,
      icon: Eyedropper
    },
    {
      name: Tool.Fill,
      icon: TextFill
    },
    {
      name: Tool.Snoop,
      icon: Search
    }
  ];

  function selectTool(event, name) {
    selectedTool = name;
    event.target.blur();
  }

  function blurTarget(event) {
    event.target.blur();
  }
</script>

<div class="toolbar">
  {#each tools as tool}
    <div class="toolbar-item" class:selected={tool.name == selectedTool}>
      <Button
        kind="ghost"
        size="small"
        on:click={event => selectTool(event, tool.name)}
        on:mouseleave={event => blurTarget(event)}>
        <svelte:component this={tool.icon} name={tool.name} />
      </Button>
    </div>
  {/each}
</div>
