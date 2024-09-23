<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { SeededRandom } from '$lib/PRNG.js';
  import { fade } from 'svelte/transition';

  export let gameState;

  let currentTopic = null;
  let currentItem = null;
  let spyPlayer = null;
  let roundStarted = false;
  let revealState = 'initial';

  let topics = [];
  let topicsLoaded = false;
  let topicsError = null;

  let seededRandom;

  onMount(async () => {
    if (browser) {
      try {
        // Fetch topics.json from the static directory
        const res = await fetch('/topics.json');
        if (!res.ok) {
          throw new Error(`Failed to load topics: ${res.status} ${res.statusText}`);
        }
        const allTopics = await res.json();

        // Get selected category indices from gameConfiguration
        const selectedIndices = gameState.gameConfiguration.selectedCategoryIndices;

        if (!selectedIndices || selectedIndices.length === 0) {
          topicsError = 'No categories selected. Please restart the game and select at least one category.';
          return;
        }

        // Filter topics based on selected indices
        topics = selectedIndices.map((index) => allTopics[index]);

        topicsLoaded = true;

        // Prepare the first round
        prepareRound();
      } catch (error) {
        console.error('Error loading topics:', error);
        topicsError = 'Failed to load topics. Please try again later.';
      }
    }
  });

  function prepareRound() {
    if (!browser) return;

    if (topics.length === 0) {
      topicsError = 'No categories selected. Please restart the game and select at least one category.';
      return;
    }

    // Calculate how many random numbers to skip to get to the topic for the current round
    const skips = gameState.currentRound * 3;

    // Create a new instance of the PRNG
    const tempRandom = SeededRandom(gameState.gameConfiguration.timestamp);

    // Advance the PRNG state to the current round
    for (let i = 0; i < skips; i++) {
      tempRandom();
    }

    // Generate the random number for the topic
    const topicRandomNumber = tempRandom();
    const topicIndex = Math.floor(topicRandomNumber * topics.length);
    currentTopic = topics[topicIndex];

    // Now, seededRandom continues from tempRandom, which has advanced by one step
    seededRandom = tempRandom;
  }

  function startRound() {
    if (!browser) return; // Prevent code from running during SSR

    // Generate the random number for the item
    const itemRandomNumber = seededRandom();
    const itemIndex = Math.floor(itemRandomNumber * currentTopic.items.length);
    currentItem = currentTopic.items[itemIndex];

    // Generate the random number for the spy
    const spyRandomNumber = seededRandom();
    const spyIndex = Math.floor(spyRandomNumber * gameState.gameConfiguration.players.length);
    spyPlayer = gameState.gameConfiguration.players[spyIndex];

    roundStarted = true;
    revealState = 'initial';
  }

  function reveal() {
    revealState = 'revealed';
  }

  function nextRound() {
    gameState.currentRound += 1;
    roundStarted = false;
    revealState = 'initial';

    // Prepare the next round
    prepareRound();
  }
</script>

<div class="container">
  {#if !roundStarted}
    <h2>Round {gameState.currentRound + 1}</h2>
    <p>Topic: <strong>{currentTopic ? currentTopic.topic : 'Loading...'}</strong></p>

    {#if topicsError}
      <p style="color: red;">{topicsError}</p>
    {:else if !topicsLoaded}
      <p>Loading topics...</p>
    {:else}
      <button on:click={startRound}>Start Round</button>
    {/if}
  {:else}
    {#if revealState === 'initial'}
      {#if gameState.playerName === spyPlayer}
        <h2>You are the <span style="color: var(--primary-color);">Spy</span>!</h2>
      {:else}
        <h2>Your item is:</h2>
        <p style="font-size: 1.5em; color: var(--primary-color);">{currentItem}</p>
      {/if}
      <button on:click={reveal} style="margin-top: 1em;">Reveal</button>
    {:else if revealState === 'revealed'}
      {#if gameState.playerName === spyPlayer}
        <h2>The spy was you!</h2>
      {:else}
        <h2>The spy was:</h2>
        <p style="font-size: 1.5em; color: var(--primary-color);">{spyPlayer}</p>
      {/if}
      <button on:click={nextRound} style="margin-top: 1em;">Next Round</button>
    {/if}
  {/if}
</div>

<style>
  /* Existing styles */

  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2em;
  }
</style>