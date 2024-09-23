<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment'; // Import browser variable
  import Round from '$lib/Round.svelte';

  export let gameConfiguration;

  let gameState = {
    currentRound: 0,
    playerName: '',
    gameConfiguration,
  };

  let playerSelected = false;
  let players = [];

  if (browser) {
    players = gameConfiguration.players;
  }

  function selectPlayer(name) {
    gameState.playerName = name;
    playerSelected = true;
  }
</script>

<div class="container">
  {#if !playerSelected}
    <h2>Select Your Player</h2>
    <ul>
      {#each players as player}
        <li>
          <button on:click={() => selectPlayer(player)} style="width: 100%; margin-bottom: 0.5em;">{player}</button>
        </li>
      {/each}
    </ul>
  {:else}
    <Round {gameState} />
  {/if}
</div>