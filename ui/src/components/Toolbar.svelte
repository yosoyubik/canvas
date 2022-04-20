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
  import PaintBrushAlt16 from 'carbon-icons-svelte/lib/PaintBrushAlt16';
  import Erase16 from 'carbon-icons-svelte/lib/Erase16';
  import Eyedropper16 from 'carbon-icons-svelte/lib/Eyedropper16';
  import TextFill16 from 'carbon-icons-svelte/lib/TextFill16';
  import Search16 from 'carbon-icons-svelte/lib/Search16';

  import { Tool } from '../types/canvas';

  export let selectedTool: Tool = Tool.Brush;

  let tools = [
    {
      name: Tool.Brush,
      icon: PaintBrushAlt16
    },
    {
      name: Tool.Eraser,
      icon: Erase16
    },
    {
      name: Tool.Eyedropper,
      icon: Eyedropper16
    },
    {
      name: Tool.Fill,
      icon: TextFill16
    },
    {
      name: Tool.Snoop,
      icon: Search16
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
