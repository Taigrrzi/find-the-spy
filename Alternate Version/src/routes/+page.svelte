<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment'; // Import browser variable
	import GameCreation from '$lib/GameCreation.svelte';
	import GameRunning from '$lib/GameRunning.svelte';
  
	let gameConfiguration = null;
  
	if (browser) {
	  const queryParams = new URLSearchParams(window.location.search);
	  const configParam = queryParams.get('config');
  
	  if (configParam) {
		try {
		  gameConfiguration = JSON.parse(decodeURIComponent(configParam));
		} catch (e) {
		  console.error('Invalid game configuration:', e);
		}
	  }
	}
  </script>
  
  {#if gameConfiguration}
	<GameRunning {gameConfiguration} />
  {:else}
	<GameCreation />
  {/if}