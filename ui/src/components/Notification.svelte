<style>
  .container {
    text-align: center;
    display: flex;
    justify-content: center;
    height: 100%;
  }
</style>

<script lang="ts">
  import { Column, InlineNotification, Row } from 'carbon-components-svelte';
  import { resetNotification } from '../store';

  export let timeout: boolean;
  export let title: string;
  export let kind;
</script>

<Row>
  <Column padding>
    <div class="container notification">
      <InlineNotification
        lowContrast
        timeout={timeout ? 3000 : 0}
        {kind}
        {title}
        on:close={() => timeout && resetNotification()} />
    </div>
  </Column>
</Row>
