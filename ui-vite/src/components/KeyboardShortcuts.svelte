<script lang="ts">
  import { Tool } from '../types/canvas';
  import { textFieldFocused } from '../lib/utils';

  export let selectedTool: Tool;

  let previouslySelectedTool;
  let tempSelectedToolUsed;

  function selectTool(tool: Tool) {
    return {
      action: 'selectTool',
      target: tool
    };
  }

  let shortcuts = {
    b: selectTool(Tool.Brush),
    p: selectTool(Tool.Brush),
    e: selectTool(Tool.Eraser),
    backspace: selectTool(Tool.Eraser),
    i: selectTool(Tool.Eyedropper),
    d: selectTool(Tool.Eyedropper),
    f: selectTool(Tool.Fill),
    g: selectTool(Tool.Fill)
    // 'c': { action: 'openColorPicker' }, // For now, implemented in ColorPickerTooltip.svelte
    // 'Escape': { action: 'closeColorPicker' }, // For now, implemented in ColorPickerTooltip.svelte
  };
  let heldKeys = {};
</script>

<svelte:window
  on:keydown={event => {
    let key = event.key.toLowerCase();
    let shortcut = shortcuts[key];
    if (shortcut) {
      if (heldKeys[key] || textFieldFocused()) {
        return;
      }
      heldKeys[key] = true;

      switch (shortcut.action) {
        case 'selectTool':
          tempSelectedToolUsed = false;
          if (!previouslySelectedTool) {
            previouslySelectedTool = selectedTool;
          }
          selectedTool = shortcut.target;
          break;
        case 'openColorPicker':
          // TODO
          break;
        default:
      }
    }
  }}
  on:keyup={event => {
    if (!(event && event.key)) return;
    let key = event.key.toLowerCase();
    let shortcut = shortcuts[key];
    if (shortcut) {
      delete heldKeys[key];
      if (textFieldFocused()) {
        return;
      }
      switch (shortcut.action) {
        case 'selectTool':
          if (selectedTool == shortcut.target) {
            if (tempSelectedToolUsed) {
              selectedTool = previouslySelectedTool;
            }
            previouslySelectedTool = undefined;
          }
          break;
        default:
      }
    }
  }}
  on:mousedown={() => {
    tempSelectedToolUsed = true;
  }} />
