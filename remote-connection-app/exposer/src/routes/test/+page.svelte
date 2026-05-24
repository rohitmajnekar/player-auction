<script>
    import io from 'socket.io-client';

 const teams =[
    {
      name: "AGRI TITANS",
      owner: "Manish Thakur",
      ownerImage: "owners/Manish Thakur.jpg",
      logo: "1.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 1
    },
    {
      name: "AGRI WARRIORS",
      owner: "Vicky Mhatre",
      ownerImage: "owners/Vicky Mhatre.jpg",
      logo: "2.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 2
    },
    {
      name: "AGRI SPARTANS",
      owner: "Manish Avkirkar",
      ownerImage: "owners/Manish Avkirkar.jpg",
      logo: "3.jpg",
      totalPoints: 10000000,
      pointsUsed: 300000,
      balancePoints: 9700000,
      players: [],
      key: 3
    },
    {
      name: "AGRI KINGS",
      owner: "Pranay Patil",
      ownerImage: "owners/Pranay Patil.jpg",
      logo: "4.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 4
    },
    {
      name: "AGRI RIDERS",
      owner: "Mehandra Wavekar",
      ownerImage: "owners/Mehandra Wavekar.jpg",
      logo: "5.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 5
    },
    {
      name: "AGRI STARTS",
      owner: "Prajot Dhumal",
      ownerImage: "owners/Prajot Dhumal.jpg",
      logo: "6.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 6
    },
    {
      name: "AGRI ROYALS",
      owner: "Ritanshu Thakur",
      ownerImage: "owners/Ritanshu Thakur.jpg",
      logo: "7.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 7
    },
    {
      name: "AGRI THUNDER",
      owner: "Mukesh Mali",
      ownerImage: "owners/Mukesh Mali.jpg",
      logo: "8.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 8
    }
  ];
    const socket = io("http://192.168.0.103:5005");

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
