<script>
  import { onMount } from 'svelte';
  import GameCreation from './lib/images/GameCreation.svelte';
  import GameRunning from './GameRunning.svelte';

  let queryParams = new URLSearchParams(window.location.search);
  let configParam = queryParams.get('config');
  let gameConfiguration = null;

  if (configParam) {
    try {
      gameConfiguration = JSON.parse(decodeURIComponent(configParam));
    } catch (e) {
      console.error('Invalid game configuration:', e);
    }
  }
</script>

{#if gameConfiguration}
  <GameRunning {gameConfiguration} />
{:else}
  <GameCreation />
{/if}