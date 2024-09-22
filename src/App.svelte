<script>
  import { onMount } from "svelte";
  import GameCreation from "./components/GameCreation.svelte";
  import GameRunning from "./components/GameRunning.svelte";
  import seedrandom from "seedrandom";
  import QRCode from "qrcode";

  let gameConfiguration = null;
  let gameState = null;
  let gameLink = "";
  let qrCodeContainer = null;

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedConfig = urlParams.get("config");

    if (encodedConfig) {
      try {
        gameConfiguration = JSON.parse(atob(encodedConfig));
        // Ensure players is an array
        if (!Array.isArray(gameConfiguration.players)) {
          throw new Error("Invalid game configuration");
        }
        const rng = seedrandom(gameConfiguration.timestamp.toString());
        gameState = {
          currentPlayer: null,
          config: gameConfiguration,
          currentRound: 0,
          rng: rng,
        };
      } catch (error) {
        console.error("Failed to parse game configuration:", error);
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
      timestamp: timestamp,
    };

    const encodedConfig = btoa(JSON.stringify(gameConfiguration));
    gameLink = `${window.location.origin}${window.location.pathname}?config=${encodedConfig}`;

    QRCode.toCanvas(gameLink, { width: 300 }, (error, canvas) => {
      if (error) console.error(error);
      console.log("QR code generated");
      qrCodeContainer.appendChild(canvas);
    });
  }

  function handlePlayerSelection(player) {
    gameState.currentPlayer = player;
  }
</script>

<main>
  {#if gameState}
    {#if !gameState.currentPlayer}
      <h2>Select your player:</h2>
      {#each gameConfiguration.players as player}
        <button on:click={() => handlePlayerSelection(player)}>{player}</button>
      {/each}
    {:else}
      <GameRunning {gameState} />
    {/if}
  {:else}
    <div bind:this={qrCodeContainer}></div>
    {#if gameConfiguration}
      <div class="game-link">
        <p>Or share this link:</p>
        <a href={gameLink} target="_blank" rel="noopener noreferrer">{gameLink}</a
        >
      </div>
    {:else}
      <GameCreation on:gameStart={handleGameStart} />
    {/if}
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
