<script>
  import { onMount } from 'svelte';
  import GameCreation from './components/GameCreation.svelte';
  import GameRunning from './components/GameRunning.svelte';
  import seedrandom from 'seedrandom';
  import QRCode from 'qrcode';

  let gameConfiguration = null;
  let gameState = null;
  let gameLink = '';
  let qrCodeGenerated = false;

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedConfig = urlParams.get('config');
    
    if (encodedConfig) {
      try {
        gameConfiguration = JSON.parse(atob(encodedConfig));
        // Ensure players is an array
        if (!Array.isArray(gameConfiguration.players)) {
          throw new Error('Invalid game configuration');
        }
        const rng = seedrandom(gameConfiguration.timestamp.toString());
        gameState = {
          currentPlayer: null,
          config: gameConfiguration,
          currentRound: 0,
          rng: rng
        };
      } catch (error) {
        console.error('Failed to parse game configuration:', error);
        gameConfiguration = null;
        gameState = null;
      }
    }
  });

  function handleGameStart(event) {
    const config = event.detail;
    const timestamp = Date.now();
    gameConfiguration = {
      ...config,
      timestamp: timestamp
    };
    
    const rng = seedrandom(timestamp.toString());
    gameState = {
      currentPlayer: null,
      config: gameConfiguration,
      currentRound: 0,
      rng: rng
    };
    
    const encodedConfig = btoa(JSON.stringify(gameConfiguration));
    gameLink = `${window.location.origin}${window.location.pathname}?config=${encodedConfig}`;
    
    QRCode.toCanvas(document.getElementById('qrcode'), gameLink, { width: 300 }, (error) => {
      if (error) console.error(error);
      console.log('QR code generated');
      qrCodeGenerated = true;
    });
  }

  function handlePlayerSelection(player) {
    gameState.currentPlayer = player;
  }
</script>

<main>
  {#if !gameConfiguration}
    <GameCreation on:gameStart={handleGameStart} />
    {#if qrCodeGenerated}
      <canvas id="qrcode"></canvas>
      <div class="game-link">
        <p>Or share this link:</p>
        <a href={gameLink} target="_blank" rel="noopener noreferrer">{gameLink}</a>
      </div>
    {/if}
  {:else if !gameState.currentPlayer}
    <h2>Select your player:</h2>
    {#each gameConfiguration.players as player}
      <button on:click={() => handlePlayerSelection(player)}>{player}</button>
    {/each}
  {:else}
    <GameRunning {gameState} />
  {/if}
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

  .game-link {
    margin-top: 20px;
  }

  .game-link a {
    word-break: break-all;
  }
</style>
