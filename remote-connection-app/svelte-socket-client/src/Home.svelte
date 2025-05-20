<script>
  import { onMount } from "svelte";
  import { socket } from './lib/socket';
  let messages = [];
  const teams = [{
        name: "AGRI TITANS",
        logo: "1.jpg",
        totalPoints: 10000000,
        pointsUsed: 0,
        balancePoints: 10000000,
        players: [],
        key: 1
      },
    {
      name: "AGRI CHALLENGERS",
      logo: "2.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 2
    },
    {
      name: "AGRI CHARGERS",
      logo: "3.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 3
    },
    {
      name: "AGRI WARRIORS",
      logo: "4.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 4
    },
    {
      name: "AGRI SPARTANS",
      logo: "5.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 5
    },
    {
      name: "AGRI STARTS",
      logo: "6.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 6
    },
    {
      name: "AGRI STRIKERS",
      logo: "7.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 7
    },
    {
      name: "AGRI ROYALS",
      logo: "8.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 8
    },
    {
      name: "AGRI THUNDER",
      logo: "9.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 9
    },
    {
      name: "AGRI BLASTERS",
      logo: "10.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 10
    },
    {
      name: "AGRI DEVILS",
      logo: "11.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 11
    },
    {
      name: "AGRI KINGS",
      logo: "12.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 12
    },
    {
      name: "AGRI FIGHTERS",
      logo: "13.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 13
    },
    {
      name: "AGRI RIDERS",
      logo: "14.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 14
    },
    // Add more teams as needed
  ];
  onMount(() => {

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
  <br>
  <div class="button-grid">
    {#each ["-1L", "+1L"] as option}
      <button style="background-color: chocolate;" on:click={() => sendMessage(option)}>
        {option}
      </button>
    {/each}
  </div>
  <br>
  <div class="button-grid">
    {#each teams as team}
      <button on:click={() => sendMessage(team.name)}>
        {team.name}
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
    max-width: 120vw;
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
    font-size: 0.6rem;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 8px;
    transition: background-color 0.2s;
    overflow-wrap: break-word;
    max-width: 100%; /* Prevent overflow */
    text-align: center;

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
