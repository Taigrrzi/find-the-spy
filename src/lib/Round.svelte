<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { SeededRandom } from '$lib/PRNG.js';
  import { fade } from 'svelte/transition';

  export let gameState;

  let currentTopic = null;
  let currentItem = null;
  let revealEndTime = null;
  let spyPlayer = null;
  let roundStarted = false;
  let revealState = 'initial';

  let topics = [];
  let topicsLoaded = false;
  let topicsError = null;

  let seededRandom; // Initialize once

  // New variables for image handling
  let imageUrl = '';
  let imageLoading = false;
  let imageError = null;

  // Countdown State Variables
  let revealDisabled = true; // Initially disabled
  let revealCountdown = 10;  // Countdown duration in seconds
  let revealInterval;         // Interval ID for the countdown

  // Pexels API Configuration
  const PEXELS_API_KEY = 'JkQ5ojRZSa6GzTWnNEGYKivJqf6LqFxy0D0QWuVfWRuxvYPjFUCTU0jp';

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

        // Generate a unique seed by combining timestamp with a random component
        const uniqueSeed = gameState.gameConfiguration.timestamp;
        seededRandom = SeededRandom(uniqueSeed);

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

    // Generate the random number for the topic
    const topicRandomNumber = seededRandom();
    const topicIndex = Math.floor(topicRandomNumber * topics.length);
    currentTopic = topics[topicIndex];
  }

// Function to start the reveal countdown
function startRevealCountdown() {
    revealDisabled = true;
    revealCountdown = 10; // Initialize to 10 seconds

    const now = Date.now();
    revealEndTime = now + 10 * 1000; // Set the end time 10 seconds from now

    revealInterval = setInterval(() => {
      const currentTime = Date.now();
      const remainingTime = Math.max(0, Math.floor((revealEndTime - currentTime) / 1000));
      revealCountdown = remainingTime;

      if (remainingTime <= 0) {
        clearInterval(revealInterval);
        revealDisabled = false;
      }
    }, 1000); // Update every second
  }

  // Clear the interval when the component is destroyed
  onDestroy(() => {
    if (revealInterval) {
      clearInterval(revealInterval);
    }
  });

  // Modify the startRound function to initiate the countdown
  async function startRound() {
    if (!browser) return; // Prevent code from running during SSR

    // Generate the random number for the item
    const itemRandomNumber = seededRandom();
    const itemIndex = Math.floor(itemRandomNumber * currentTopic.items.length);
    currentItem = currentTopic.items[itemIndex];

    // Generate the random number for the spy
    const spyRandomNumber = seededRandom();
    const spyIndex = Math.floor(spyRandomNumber * gameState.gameConfiguration.players.length);
    spyPlayer = gameState.gameConfiguration.players[spyIndex];

    // If the current player is not the spy and the topic allows images, fetch the image
    if (gameState.playerName !== spyPlayer && currentTopic.showImage) {
      fetchImage(currentItem);
    }

    roundStarted = true;
    revealState = 'initial';

    // Start the countdown for the Reveal button
    startRevealCountdown();
  }

  async function fetchImage(query) {
    imageLoading = true;
    imageError = null;
    imageUrl = '';

    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
        {
          headers: {
            Authorization: PEXELS_API_KEY
          }
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (data.photos && data.photos.length > 0) {
        imageUrl = data.photos[0].src.medium; // Choose the appropriate size
      } else {
        imageError = 'No image found for this keyword.';
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      imageError = 'Failed to load image. Please try again later.';
    } finally {
      imageLoading = false;
    }
  }

  function reveal() {
    revealState = 'revealed';
  }

  function nextRound() {
    gameState.currentRound += 1;
    roundStarted = false;
    revealState = 'initial';
    imageUrl = '';
    imageError = null;

    // Prepare the next round
    prepareRound();
  }
</script>

<div class="container">
  {#if !roundStarted}
    <h2>Round {gameState.currentRound + 1}</h2>
    <p>Topic: <strong>{currentTopic ? currentTopic.topic : 'Loading...'}</strong></p>

    {#if topicsError}
      <p class="error">{topicsError}</p>
    {:else if !topicsLoaded}
      <p>Loading topics...</p>
    {:else}
      <button on:click={startRound} class="start-round-button">Start Round</button>
    {/if}
  {:else}
    {#if revealState === 'initial'}
      {#if gameState.playerName === spyPlayer}
        <h2>You are the <span class="spy-text">Spy</span>!</h2>
      {:else}
        <h2>Your item is:</h2>
        {#if currentTopic.showImage}
          {#if imageLoading}
            <p>Loading image...</p>
          {:else if imageError}
            <p class="error">{imageError}</p>
          {:else if imageUrl}
            <img src="{imageUrl}" alt="{currentItem}" class="item-image" transition:fade />
          {/if}
        {/if}
        <p class="item-text">{currentItem}</p>
      {/if}
      <button on:click={reveal} class="reveal-button" disabled={revealDisabled}>Reveal</button>
      {#if revealDisabled}
        <p class="countdown-text">Reveal available in {revealCountdown} seconds</p>
      {/if}
    {:else if revealState === 'revealed'}
      {#if gameState.playerName === spyPlayer}
        <h2>The word was:</h2>
        <p class="item-text">{currentItem}</p>
      {:else}
        <h2>The spy was:</h2>
        <p class="spy-player-text">{spyPlayer}</p>
      {/if}
      <button on:click={nextRound} class="next-round-button">Next Round</button>
    {/if}
  {/if}
</div>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2em;
    text-align: center;
  }

  h2 {
    margin-bottom: 1em;
  }

  .spy-text {
    color: var(--primary-color);
    font-weight: bold;
  }

  .item-text {
    font-size: 1.5em;
    color: var(--primary-color);
    margin: 1em 0;
  }

  .spy-player-text {
    font-size: 1.5em;
    color: var(--primary-color);
    margin: 1em 0;
  }

  .error {
    color: red;
    margin: 1em 0;
  }

  .countdown-text {
    color: #d9d9d9;
    margin-top: 0.5em;
    font-size: 1em;
  }

  .start-round-button,
  .reveal-button,
  .next-round-button {
    margin-top: 1em;
    font-size: 1.2em;
    padding: 0.8em 1.5em;
    background-color: var(--primary-color);
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, opacity 0.3s;
  }

  .start-round-button:hover,
  .reveal-button:hover,
  .next-round-button:hover {
    background-color: var(--primary-color-dark);
  }

  .reveal-button:disabled {
    background-color: #cccccc; /* Greyed out color */
    cursor: not-allowed;
    opacity: 0.6;
  }

  .item-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 1em;
  }

  @media (max-width: 600px) {
    .container {
      padding: 1em;
    }

    .item-text,
    .spy-player-text {
      font-size: 1.2em;
    }

    .start-round-button,
    .reveal-button,
    .next-round-button {
      width: 100%;
      padding: 1em;
    }
  }
</style>