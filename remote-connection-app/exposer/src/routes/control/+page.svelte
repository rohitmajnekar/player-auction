<script>
  import { onMount } from "svelte";
  import { socket } from '$lib/socket';
  let messages = [];
  let selectedOption = 'A'
  let showSpinnerOptions = false;
  const teams = [
  {
    name: "AGRI TITANS",
    logo: "1.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    players: [],
    key: 1,
    owner: "Owner 1",
    ownerImage: "1.jpg",
  },
  {
    name: "AGRI CHALLENGERS",
    logo: "2.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    players: [],
    key: 2,
    owner: "Owner 2",
    ownerImage: "2.jpg",
  },
  {
    name: "AGRI CHARGERS",
    logo: "3.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    owner: "Owner 3",
    ownerImage: "3.jpg",
    players: [],
    key: 3,
  },
  {
    name: "AGRI WARRIORS",
    logo: "4.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    owner: "Owner 4",
    ownerImage: "owner4.jpg",
    players: [],
    key: 4,
  },
  {
    name: "AGRI SPARTANS",
    logo: "5.jpg",
    totalPoints: 10000000,
    owner: "Owner 5",
    ownerImage: "owner5.jpg",
    pointsUsed: 0,
    balancePoints: 10000000,
    players: [],
    key: 5,
  },
  {
    name: "AGRI STARTS",
    owner: "Owner 6",
    ownerImage: "owner6.jpg",
    logo: "6.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    players: [],
    key: 6,
  },
  {
    name: "AGRI STRIKERS",
    owner: "Owner 7",
    ownerImage: "owner7.jpg",
    logo: "7.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    players: [],
    key: 7,
  },
  {
    name: "AGRI ROYALS",
    owner: "Owner 8",
    ownerImage: "owner8.jpg",
    logo: "8.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    players: [],
    key: 8,
  },
  {
    name: "AGRI THUNDER",
    owner: "Owner 9",
    ownerImage: "owner9.jpg",
    logo: "9.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    players: [],
    key: 9,
  },
  {
    name: "AGRI BLASTERS",
    logo: "10.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    owner: "Owner 10",
    ownerImage: "owner10.jpg",
    balancePoints: 10000000,
    players: [],
    key: 10,
  },
  {
    name: "AGRI DEVILS",
    owner: "Owner 11",
    ownerImage: "owner11.jpg",
    logo: "11.jpg",
    owner: "Owner 12",
    ownerImage: "owner12.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    players: [],
    key: 11,
  },
  {
    name: "AGRI KINGS",
    logo: "12.jpg",
    owner: "Owner 13",
    ownerImage: "owner13.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    players: [],
    key: 12,
  },
  {
    owner: "Owner 14",
    ownerImage: "owner14.jpg",
    name: "AGRI FIGHTERS",
    logo: "13.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    players: [],
    key: 13,
  },
  {
    name: "AGRI RIDERS",
    logo: "14.jpg",
    totalPoints: 10000000,
    pointsUsed: 0,
    balancePoints: 10000000,
    players: [],
    key: 14,
  },
];
  let selectedTeams = [];

  function handleSubmit() {
    socket.emit('selectedTeams', selectedTeams);
    console.log('Selected teams:', selectedTeams);
    selectedTeams = []
  }

  function handleSpin() {
    socket.emit('message', 'spinTheWheel');
  }

  onMount(() => {
    

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("message", (msg) => {
      console.log("spinner:", msg);
      messages = [...messages, msg];
    });
  });

  const setSpinner = () => {
    showSpinnerOptions = !showSpinnerOptions
    socket.emit("message", `toggleSpinner-${showSpinnerOptions}`);
  };
  
  const sendMessage = (num) => {
    const msg = `${num}`;
    selectedOption=msg
    socket.emit("message", msg);
  };
</script>
<main>
  <h1>📡 Remote Client</h1>
   <div class="button-grid">
    {#each ["Go to 1st Player in List"] as option}
      <button style="background-color: red" on:click={() => sendMessage(  option)}>
        {option}
      </button>
    {/each}
    <button style="background-color: {showSpinnerOptions ? 'green' : 'lightgray'}" on:click={() => setSpinner()} >
        Toggle Spinner
    </button>
  </div>
  {#if showSpinnerOptions}
    <h2>Select Teams</h2>

    <!-- Option 1: Checkboxes -->
  <div style="display: flex; flex-wrap: wrap; margin-bottom: 10px;">
    {#each teams as team}
      <label style="display: flex; align-items: center; margin: 5px; width: calc(25% - 10px);">
          <input
            type="checkbox"
            bind:group={selectedTeams}
            value={team.name}
          />
          {team.name}
        </label>
        {/each}
    </div>

    <!-- Submit Button -->
    <button on:click={handleSubmit}>
      Submit Selected Teams
    </button>
    <button on:click={handleSpin}>
      Spin
    </button>

    <!-- Optionally show selected -->
    <!-- <p>Currently selected: {selectedTeams.join('\\n')}</p> -->
    <div class="button-grid">
      {#each selectedTeams as team}
        <p>{team}</p>

      {/each}
    </div>

  {/if}
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
  :root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

.card {
  padding: 2em;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}

</style>
