<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import topics from "../data/topics.js";

  export let gameState;

  let currentTopic = "";
  let currentItem = "";
  let currentSpy = "";
  let isRevealed = false;
  let roundStarted = false;

  onMount(() => {
    startNewRound();
  });

  function startNewRound() {
    gameState.currentRound++;
    isRevealed = false;
    roundStarted = false;

    const topicIndex = Math.floor(gameState.rng() * topics.length);
    currentTopic = topics[topicIndex].name;
    const itemIndex = Math.floor(
      gameState.rng() * topics[topicIndex].items.length,
    );
    currentItem = topics[topicIndex].items[itemIndex];

    const spyIndex = Math.floor(
      gameState.rng() * gameState.config.players.length,
    );
    currentSpy = gameState.config.players[spyIndex];
  }

  function startRound() {
    roundStarted = true;
  }

  function revealSpy() {
    isRevealed = true;
  }
</script>

<div class="game-running">
  <h2>Round {gameState.currentRound}</h2>

  {#if !roundStarted}
    <p>Topic: {currentTopic}</p>
    <button on:click={startRound}>Start Round</button>
  {:else if !isRevealed}
    <p>Topic: {currentTopic}</p>
    {#if gameState.currentPlayer !== currentSpy}
      <p transition:fade>Item: {currentItem}</p>
    {:else}
      <p transition:fade>You are the spy!</p>
    {/if}
    <button on:click={revealSpy}>Reveal</button>
  {:else}
    {#if gameState.currentPlayer !== currentSpy}
      <p>The spy was: {currentSpy}</p>
    {:else}
      <p>The item was: {currentItem}</p>
    {/if}
    <button on:click={startNewRound}>Next Round</button>
  {/if}
</div>

<style>
  .game-running {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  button {
    cursor: pointer;
  }
</style>
