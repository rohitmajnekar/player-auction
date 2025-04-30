<script>
  import { onMount } from "svelte";
  import { io } from "socket.io-client";

  let socket;
  let messages = [];
  const names = ["Agri Katta", "Agri Warriors", "Agri Champions", "Agri Tigers", "Agri Boys", "Agri Imperior", "Agri Attackers", "Agri Fighters", "Agri Makers", "Agri Cultures"];

  onMount(() => {
    socket = io("http://192.168.31.79:5000");

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("message", (msg) => {
      messages = [...messages, msg];
    });
  });

  const sendMessage = (num) => {
    const msg = `Button ${num} clicked`;
    socket.emit("message", msg);
  };
</script>

<main>
  <h1>📡 Remote Client</h1>

  <div class="button-grid">
    {#each names as name}
      <button on:click={() => sendMessage(name)}>
        {name}
      </button>
    {/each}
  </div>

  <div class="button-grid">
    {#each ["prev", "next"] as option}
      <button style="background-color: chocolate;" on:click={() => sendMessage(option)}>
        {option}
      </button>
    {/each}
  </div>

  <h2>Messages:</h2>
  <ul>
    {#each messages as msg}
      <li>{msg}</li>
    {/each}
  </ul>
</main>

<style>
  main {
    max-width: 90vw;
    margin: auto;
    padding: 1.5rem;
    font-family: system-ui, sans-serif;
    text-align: center;
  }

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  .button-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 12px;
    margin-bottom: 1.5rem;
  }

  button {
    padding: 1rem;
    font-size: 1rem;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 8px;
    transition: background-color 0.2s;
  }

  button:active {
    background-color: #0056b3;
  }

  ul {
    list-style: none;
    padding-left: 0;
    max-height: 200px;
    overflow-y: auto;
    background: #f9f9f9;
    border-radius: 8px;
    padding: 0.5rem;
  }

  li {
    padding: 0.3rem 0;
    font-size: 0.95rem;
  }
</style>
