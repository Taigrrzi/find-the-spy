<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import QRCode from 'qrcode';
  import { browser } from '$app/environment';

  let players = [''];
  let qrCodeDataUrl = '';
  let gameStarted = false;
  let gameUrl = '';
  let showModal = false;
  let modalMessage = '';

  let topics = []; // To store the topics fetched from 'topics.json'

  onMount(async () => {
    if (browser) {
      try {
        const res = await fetch('/topics.json');
        if (!res.ok) {
          throw new Error(`Failed to load topics: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        // Initialize topics with 'selected' property
        topics = data.map((topic) => ({ ...topic, selected: true }));
      } catch (error) {
        console.error('Error loading topics:', error);
        alert('Failed to load topics. Please try again later.');
      }
    }
  });

  function addPlayer() {
    players = [...players, ''];
  }

  function removePlayer(index) {
    players = players.filter((_, i) => i !== index);
  }

  function toggleCategory(index) {
    topics = topics.map((topic, i) => 
      i === index ? { ...topic, selected: !topic.selected } : topic
    );
  }

  function validateGameStart() {
    const validPlayers = players.filter(p => p.trim() !== '');
    const selectedCategories = topics.filter(t => t.selected);

    if (validPlayers.length < 3) {
      showModal = true;
      modalMessage = 'You need at least 3 players to start the game.';
      return false;
    }

    if (selectedCategories.length === 0) {
      showModal = true;
      modalMessage = 'You need to select at least one category to start the game.';
      return false;
    }

    return true;
  }

  async function startGame() {
    if (!validateGameStart()) return;

    const timestamp = Date.now();

    // Get indices of selected categories
    const selectedCategoryIndices = topics
      .map((topic, index) => (topic.selected ? index : null))
      .filter((index) => index !== null);

    const gameConfiguration = {
      players: players.filter((p) => p.trim() !== ''),
      timestamp,
      selectedCategoryIndices,
    };

    const queryParams = encodeURIComponent(JSON.stringify(gameConfiguration));

    if (browser) {
      gameUrl = `${window.location.origin}${window.location.pathname}?config=${queryParams}`;
    } else {
      gameUrl = `/?config=${queryParams}`;
    }

    qrCodeDataUrl = await QRCode.toDataURL(gameUrl);
    gameStarted = true;
  }

  function closeModal() {
    showModal = false;
  }

  function handleModalKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
</script>

{#if !gameStarted}
  <div class="container">
    <!-- Logo -->
    <div class="logo-container">
      <img src="/logo.jpg" alt="Game Logo" />
    </div>

    <!-- Category Selection Section -->
    <div class="section category-section">
      <h2>Select Categories</h2>
      <div class="categories-grid">
        {#each topics as topic, index (topic.topic)}
          <button
            type="button"
            class="category-item"
            class:selected={topic.selected}
            on:click={() => toggleCategory(index)}
          >
            {topic.topic}
          </button>
        {/each}
      </div>
    </div>

    <!-- Player List Section -->
    <div class="section player-section">
      <h2>Add Players</h2>
      <ul class="player-list">
        {#each players as player, index (index)}
          <li transition:fly={{ y: 20, duration: 200 }}>
            <div class="player-input">
              <input type="text" bind:value={players[index]} placeholder="Player Name" />
              {#if players.length > 1}
                <button on:click={() => removePlayer(index)} class="remove-player-button">✕</button>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
      <button on:click={addPlayer}>Add Player</button>
    </div>

    <!-- Start Game Button -->
    <button on:click={startGame} class="start-game-button">Start Game</button>
  </div>
{:else}
  <div class="container post-game">
    <h2>Share the Game</h2>
    <div class="qr-code-container">
      <img src={qrCodeDataUrl} alt="Game QR Code" />
    </div>
    <p>Or share this link:</p>
    <p class="game-link"><a href="{gameUrl}">{gameUrl}</a></p>
  </div>
{/if}

{#if showModal}
  <div 
    class="modal-overlay" 
    on:click={closeModal}
    on:keydown={handleModalKeydown}
    tabindex="0"
    role="dialog"
    aria-labelledby="modal-title"
  >
    <div class="modal-content" on:click|stopPropagation>
      <h3 id="modal-title">Attention</h3>
      <p>{modalMessage}</p>
      <button on:click={closeModal}>Close</button>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 1em;
    text-align: center;
  }

  .logo-container {
    margin-bottom: 2em;
  }

  .logo-container img {
    width: 100%;
    max-width: 350px;
    height: auto;
    margin: 0 auto;
  }

  .section {
    margin-bottom: 3em;
  }

  .category-section {
    margin-bottom: 4em;
  }

  .section h2 {
    margin-bottom: 1em;
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1em;
    justify-content: center;
  }

  .category-item {
    background-color: var(--input-background);
    color: var(--input-text-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0.75em 1em;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s, color 0.3s;
    font: inherit;
    outline: none;
    width: 100%;
  }

  .category-item.selected {
    background-color: var(--primary-color);
    color: #ffffff;
  }

  .category-item:hover {
    background-color: var(--button-background);
    color: #ffffff;
  }

  .player-list {
    list-style: none;
    padding: 0;
  }

  .player-input {
    display: flex;
    gap: 0.5em;
    margin-bottom: 0.5em;
  }

  .remove-player-button {
    background-color: var(--border-color);
    color: var(--text-color);
    padding: 0.5em;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8em;
  }

  .start-game-button {
    margin-top: 1em;
    font-size: 1.2em;
    padding: 0.8em 1.5em;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: var(--background-color);
    padding: 2em;
    border-radius: 8px;
    text-align: center;
  }

  .post-game {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .qr-code-container {
    margin: 1em 0;
  }

  .qr-code-container img {
    max-width: 100%;
    height: auto;
  }

  .game-link {
    word-break: break-all;
  }

  @media (max-width: 600px) {
    .categories-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }
</style>