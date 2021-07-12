<script lang="ts">
  import store from '../store';
  import Select from './CanvasMenu.svelte';
  let title = document.title === "Home" ? "" : document.title;
</script>

<div>
  <a href="/">
    <span>
      Home
    </span>
  </a>
  <span>
    {title}
  </span>
  <Select canvasList={$store.canvasList} />
</div>

<style>
  div {
    width: 100%;
    /* position: fixed; */
    color: white;
    top: 0;
    display: flex;
    float: left;
    place-content: center;
    background: #3b3a3a;
    font-size: x-large;
    opacity: .9;
  }
</style>

