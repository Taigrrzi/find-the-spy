<script>
  import { onMount } from 'svelte';
  import { fly, slide, fade } from 'svelte/transition';
  import QRCode from 'qrcode';
  import { browser } from '$app/environment';
  import { base } from '$app/paths';

  let players = ['', '', ''];
  let qrCodeDataUrl = '';
  let gameStarted = false;
  let gameUrl = '';
  let showModal = false;
  let modalMessage = '';
  let showRulesModal = false;

  let topics = [];

  onMount(async () => {
    if (browser) {
      try {
        const res = await fetch(base + '/topics.json');
        if (!res.ok) {
          throw new Error(`Failed to load topics: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
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
    if (index >= 3) {
      players = players.filter((_, i) => i !== index);
    }
  }

  function toggleCategory(index) {
    topics = topics.map((topic, i) =>
      i === index ? { ...topic, selected: !topic.selected } : topic
    );
  }

  $: validPlayers = players.filter((p) => p.trim() !== '');
  $: selectedCategories = topics.filter((t) => t.selected);
  $: canStartGame = validPlayers.length >= 3 && selectedCategories.length >= 1;

  $: startGamePreventMessage = (() => {
    if (validPlayers.length < 3) {
      return 'You need at least 3 players to start the game.';
    } else if (selectedCategories.length === 0) {
      return 'You need to select at least one category to start the game.';
    }
    return '';
  })();

  async function startGame() {
    if (!canStartGame) return;

    const timestamp = Date.now();
    const selectedCategoryIndices = topics
      .map((topic, index) => (topic.selected ? index : null))
      .filter((index) => index !== null);

    const gameConfiguration = {
      players: validPlayers,
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

  function openRulesModal() {
    showRulesModal = true;
  }

  function closeRulesModal() {
    showRulesModal = false;
  }

  function handleModalKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
      closeRulesModal();
    }
  }
</script>

<div class="question-mark" on:click={openRulesModal}>?</div>

{#if !gameStarted}
  <div class="container" transition:slide>
    <div class="logo-container">
      <img src="{base}/logo.jpg" alt="Game Logo" />
    </div>

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
    
    <div class="section player-section">
      <h2>Add Players</h2>
      <ul class="player-list">
        {#each players as player, index (index)}
          <li transition:fly={{ y: 20, duration: 200 }}>
            <div class="player-input">
              <input type="text" bind:value={players[index]} placeholder="Player Name" />
              {#if index >= 3}
                <button on:click={() => removePlayer(index)} class="remove-player-button">✕</button>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
      <button on:click={addPlayer}>Add Player</button>
    </div>

    <button
      on:click={startGame}
      class="start-game-button"
      disabled={!canStartGame}
    >
      Start Game
    </button>
    {#if startGamePreventMessage}
      <p class="prevent-message">{startGamePreventMessage}</p>
    {/if}
  </div>
{:else}
  <div class="container post-game" transition:slide>
    <h2>Share the Game</h2>
    <div class="qr-code-container">
      <img src={qrCodeDataUrl} alt="Game QR Code" />
    </div>
    <p>Or share this link:</p>
    <p class="game-link"><a href="{gameUrl}" target="_blank" rel="noopener noreferrer">{gameUrl}</a></p>
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
    <div
      class="modal-content"
      on:click|stopPropagation
      on:keydown|stopPropagation
      tabindex="0"
    >
      <h3 id="modal-title">Attention</h3>
      <p>{modalMessage}</p>
      <button on:click={closeModal}>Close</button>
    </div>
  </div>
{/if}

{#if showRulesModal}
  <div
    class="modal-overlay"
    on:click={closeRulesModal}
    on:keydown={handleModalKeydown}
    tabindex="0"
    role="dialog"
    aria-labelledby="rules-modal-title"
    transition:fade={{ duration: 200 }}
  >
    <div
      class="modal-content rules-modal"
      on:click|stopPropagation
      on:keydown|stopPropagation
      tabindex="0"
      transition:fly={{ y: 20, duration: 300 }}
    >
      <h3 id="rules-modal-title">🕵️‍♂️ How to Play Find The Spy!</h3>
      <div class="rules-content">
        <div class="rule-item">
          <h4>1. Setup</h4>
          <p>Host chooses categories and players, then shares the game link.</p>
        </div>
        <div class="rule-item">
          <h4>2. Roles</h4>
          <p>All players get a topic (e.g., "Animals"). Most players receive a specific word (e.g., "Lion"), while one player becomes the <strong>Spy</strong> without knowing the word.</p>
        </div>
        <div class="rule-item">
          <h4>3. Discussion</h4>
          <p>Players take turns saying one word related to the secret word. You have <strong>10 seconds</strong> to speak or think. Known players, be subtle! Spy, try to blend in!</p>
        </div>
        <div class="rule-item">
          <h4>4. Voting</h4>
          <p>After one round, players vote on who they think is the Spy. Majority wins!</p>
        </div>
        <div class="rule-item">
          <h4>5. Reveal</h4>
          <ul>
            <li>Caught Spy: Gets one guess at the secret word. Correct guess means Spy wins!</li>
            <li>Undiscovered Spy: Automatic win for the Spy!</li>
          </ul>
        </div>
      </div>
      <p class="rules-footer"><strong>Be clever, be sneaky, and may the best Spy win! 🕵️‍♀️🎉</strong></p>
      <button on:click={closeRulesModal} class="close-button">Close</button>
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

  /* Removed hover effect on category items */

  .player-list {
    list-style: none;
    padding: 0;
  }

  .player-input {
    display: flex;
    gap: 0.5em;
    margin-bottom: 0.5em;
  }

  .player-input input {
    font-size: 16px; /* Prevents mobile zoom on focus */
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
    transition: background-color 0.3s, color 0.3s;
  }

  .start-game-button:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .prevent-message {
    color: #ff0000;
    margin-top: 0.5em;
    font-size: 0.9em;
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
    z-index: 1000;
  }

  .modal-content {
    background-color: var(--background-color);
    padding: 1.5rem;
    border-radius: 8px;
    max-width: 90%;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

  @media (min-width: 768px) {
    .modal-content {
      max-width: 600px;
    }

    .rules-modal h3 {
      font-size: 1.6rem;
    }

    .rule-item h4 {
      font-size: 1.2rem;
    }

    .rule-item p, .rule-item ul {
      font-size: 1rem;
    }
  }

  .question-mark {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 30px;
    height: 30px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
  }

  .rules-modal {
    display: flex;
    flex-direction: column;
  }

  .rules-modal h3 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .rules-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .rule-item {
    background-color: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border-radius: 4px;
  }

  .rule-item h4 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }

  .rule-item p, .rule-item ul {
    font-size: 0.9rem;
    margin: 0;
  }

  .rule-item ul {
    padding-left: 1.2rem;
    margin-top: 0.5rem;
  }

  .rules-footer {
    text-align: center;
    margin-top: 1rem;
    font-size: 1rem;
  }

  .close-button {
    margin-top: 1rem;
    align-self: center;
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
</style>