<!-- src/routes/details/+page.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { io } from "socket.io-client";

  let socket;
  let teamData = [];

  onMount(() => {
    socket = io("http://192.168.0.110:5000");

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    socket.on("teamData", (data) => {
      teamData = data;
    });

    return () => {
      socket.off("teamData");
      socket.disconnect();
    };
  });
  
</script>

<h1>📋 Live Team Detail</h1>

{#if teamData.length === 0}
  <p>No team data received yet.</p>
{:else}
  {#each teamData as team}
    <div class="team-card">
      <h2>{team.name}</h2>
      <p>Balance Points: {team.balancePoints.toLocaleString()}</p>
      <p>Players: {team.players.length}</p>
    </div>
  {/each}
{/if}

<style>
  .team-card {
    margin: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
</style>
