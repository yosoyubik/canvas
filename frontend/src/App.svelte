<script lang="ts">
  import Subscription from './lib/subscription';
  import Api from './lib/api';

  import Header from './components/Header.svelte';
  import Hexagons from './Hexagons.svelte';

  const width = 1024;
  const height = 1024;

  const appChannel = new window.channel();
  const api = new Api(window.ship, appChannel);
  const subscription = new Subscription(api, appChannel);

  subscription.subscribe('/primary', 'canvas-view');

</script>

<main>
  <Header />
  <Hexagons {width} {height} />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>