<script>
    import io from 'socket.io-client';

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
    const socket = io("http://192.168.0.112:5000");

  let selectedTeams = [];

  function handleSubmit() {
    socket.emit('selectedTeams', selectedTeams);
    console.log('Selected teams:', selectedTeams);
  }
</script>

<h2>Select Teams</h2>

<!-- Option 1: Checkboxes -->
{#each teams as team}
  <div style="display: flex; flex-direction: column; margin-bottom: 10px;">
    <label style="display: flex; align-items: center; ">
      <input
        type="checkbox"
        bind:group={selectedTeams}
        value={team.name}
      />
      {team.name}
    </label>
  </div>
{/each}

<!-- Submit Button -->
<button on:click={handleSubmit}>
  Submit Selected Teams
</button>

<!-- Optionally show selected -->
<!-- <p>Currently selected: {selectedTeams.join('\\n')}</p> -->
<div class="button-grid">
   {#each selectedTeams as team}
     <p>{team}</p>

   {/each}
 </div>
