<script lang="ts">
    import { onMount } from 'svelte';
    import io from 'socket.io-client';
    let socket;

    let teams = [];
    let selectedTeamKey = null;

    socket = io("http://192.168.31.79:5000");

    const toggleTeam = (key) => {
        selectedTeamKey = selectedTeamKey === key ? null : key;
    };

    onMount(() => {
        socket.on('teamdata', (data) => {
        console.log('Received data:', data);
        teams = data;
        });

        // Clean up on unmount
        return () => socket.disconnect();
    });
    teams = [{
    "name": "AGRI TITANS",
    "logo": "1.jpg",
    "totalPoints": 10000000,
    "pointsUsed": 960000,
    "balancePoints": 9040000,
    "players": [
        {
        "Name": "PARAG MHATRE",
        "Age": "32",
        "Photo": "Parag MhatreAll Rounder A",
        "Style": "All Rounder ",
        "Category": "A",
        "Price": 300000,
        "sold": true,
        "team_name": "AGRI TITANS",
        "team_logo": "1.jpg",
        "sale_price": 300000
        },
        {
        "Name": "TEJAN SHEDGE",
        "Age": "28",
        "Photo": "Tejan ShedgeAll Rounder A",
        "Style": "All Rounder ",
        "Category": "A",
        "Price": 300000,
        "sold": true,
        "team_name": "AGRI TITANS",
        "team_logo": "1.jpg",
        "sale_price": 300000
        },
        {
        "Name": "NITU GORIWALE",
        "Age": "30",
        "Photo": "Nitu GoriwaleAll Rounder A",
        "Style": "All Rounder ",
        "Category": "A",
        "Price": 300000,
        "sold": true,
        "team_name": "AGRI STARTS",
        "team_logo": "6.jpg",
        "sale_price": 300000
        }
    ],
    "key": 1
    }]
    </script>

    <main>
    <h1>Live Team Details</h1>

    {#if teams.length === 0}
        <p>Waiting for team data...</p>
    {:else}
        {#each teams as team}
        <div class="team-card" on:click={() => toggleTeam(team.key)}>
            <div class="team-header">
                <h2>{team.name}</h2>
                <p>Players: {team.players.length}</p>
                <p>Balance Points: {team.balancePoints.toLocaleString()}</p>
            </div>

            {#if selectedTeamKey === team.key}
            <table>
                <thead>
                <tr>
                    <th>Player Name</th>
                    <th>Sale Price</th>
                    <th>Style</th>
                </tr>
                </thead>
                <tbody>
                {#each team.players.filter(p => p.Name) as player}
                    <tr>
                    <td>{player.Name}</td>
                    <td>{player.sale_price?.toLocaleString()}</td>
                    <td>{player.Style}</td>
                    </tr>
                {/each}
                </tbody>
            </table>
            {/if}
        </div>
        {/each}
    {/if}
    </main>

    <style>
    main {
        max-width: 900px;
        margin: auto;
        padding: 1rem;
    }

    .team-card {
        background: #f7f7f7;
        border-radius: 10px;
        margin-bottom: 1rem;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }

    .team-header {
        margin-left: 10px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between  ;
        gap: 1rem;
    }

    .logo {
        width: 60px;
        height: 60px;
        object-fit: contain;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }

    th, td {
        padding: 0.6rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: #e8e8e8;
    }
</style>
