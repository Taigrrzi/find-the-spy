<script>
  import { createEventDispatcher } from "svelte";
  import { fade, slide } from "svelte/transition";

  const dispatch = createEventDispatcher();

  let players = ["Player 1", "Player 2", "Player 3"];

  function addPlayer() {
    players = [...players, `Player ${players.length + 1}`];
  }

  function removePlayer(index) {
    players = players.filter((_, i) => i !== index);
  }

  function startGame() {
    dispatch("gameStart", { players });
  }
</script>

<div class="game-creation">
  <h2>Create New Game</h2>
  {#each players as player, i (i)}
    <div class="player-input" transition:slide>
      <input bind:value={players[i]} placeholder="Player name" />
      <button on:click={() => removePlayer(i)}>Remove</button>
    </div>
  {/each}
  <button on:click={addPlayer} transition:fade>Add Player</button>
  {#if players.length >= 3}
    <button on:click={startGame} transition:slide>Create Game</button>
  {/if}
</div>

<style>
  .game-creation {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .player-input {
    display: flex;
    gap: 10px;
  }

  button {
    cursor: pointer;
  }
</style>
