<style>
  .notification-left {
    text-align: center;
    justify-content: center;
    position: absolute;
    left: 65%;
  }

  .notification-right {
    text-align: center;
    justify-content: center;
    position: absolute;
    right: 65%;
  }
</style>

<script lang="ts">
  import { Column, InlineNotification, Row } from 'carbon-components-svelte';
  import { resetNotification } from '../store';

  export let timeout: boolean;
  export let title: string;
  export let kind;
</script>

<div class={timeout ? 'notification-left' : 'notification-right'}>
  <InlineNotification
    lowContrast
    timeout={timeout ? 3000 : 0}
    {kind}
    {title}
    on:close={() => timeout && resetNotification()} />
</div>
