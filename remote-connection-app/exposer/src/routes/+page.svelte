<script lang="ts">
    import { onMount } from 'svelte';
    import { socket } from '$lib/socket';

    let teams = [];
    let selectedTeamKey = null;

    const toggleTeam = (key) => {
        selectedTeamKey = selectedTeamKey === key ? null : key;
    };

    onMount(() => {
        socket.on('teamdata', (data) => {
            teams = data;
            console.log('teamdata:', data);
        });
        return () => socket.disconnect();
    });

    fetch("http://localhost:5001/api/auction-state")
        .then(res => res.json())
        .then(data => {
            teams = data.teamsData || [];
            console.log('Initial team data:', data);
        })
        .catch(err => console.error('Error fetching initial team data:', err));

    const formatPrice = (price) => {
        if (!price) return '0';

        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(1)}Cr`;
        }

        return `₹${(price / 100000).toFixed(1)}L`;
    };
</script>

<main class="page">
    <div class="header">
        <h1>LIVE AUCTION</h1>
        <p>Team Purse & Squad Tracker</p>
    </div>

    {#if teams.length === 0}
        <div class="waiting">
            Waiting for auction data...
        </div>
    {:else}
        <div class="team-grid">
            {#each teams as team}
                <div
                    class:selected={selectedTeamKey === team.key}
                    class:expanded={selectedTeamKey === team.key}
                    class="team-card"
                    on:click={() => toggleTeam(team.key)}
                >
                    <div class="team-top">

                        <div class="team-name">
                            {team.name}
                        </div>

                        <div class="team-stats">
                            <div class="mini-stat">
                                <span>P</span>
                                <strong>{team.players.length}</strong>
                            </div>

                            <div class="mini-stat purse">
                                <span>₹</span>
                                <strong>{formatPrice(team.balancePoints)}</strong>
                            </div>
                        </div>
                    </div>

                    {#if selectedTeamKey === team.key}
                        <div class="players">
                            {#each team.players.filter(p => p.Name) as player}
                                <div class="player-row">

                                    <div class="player-left">
                                        <div class="player-name">
                                            {player.Name}
                                        </div>

                                        <div class="player-style">
                                            {player.Style}
                                        </div>
                                    </div>

                                    <div class="player-price">
                                        {formatPrice(player.sale_price)}
                                    </div>

                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</main>

<style>
    :global(body) {
        margin: 0;
        background:
            radial-gradient(circle at top, #181825 0%, #0b0b12 60%);
        color: white;
        font-family: Inter, sans-serif;
    }

    .page {
        padding: 1rem;
        max-width: 500px;
        margin: auto;
    }

    .header {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .header h1 {
        margin: 0;
        font-size: 2rem;
        letter-spacing: 2px;
        color: #00f0ff;
        text-shadow:
            0 0 10px rgba(0,240,255,0.7),
            0 0 30px rgba(0,240,255,0.4);
    }

    .header p {
        margin-top: 0.3rem;
        color: #8f9bb3;
        font-size: 0.9rem;
    }

    .team-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .team-card {
        border-radius: 20px;
        background:
            rgba(20, 20, 30, 0.7);
        border: 1px solid rgba(0,255,255,0.15);

        backdrop-filter: blur(14px);

        overflow: hidden;

        transition: 0.25s ease;

        box-shadow:
            0 0 10px rgba(0,255,255,0.05);
    }

    .team-card.selected {
        border: 1px solid rgba(0,255,255,0.5);

        box-shadow:
            0 0 15px rgba(0,255,255,0.25),
            0 0 40px rgba(0,255,255,0.08);
    }

    .team-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 1rem;
    }

    .team-info h2 {
        margin: 0;
        font-size: 1.2rem;
    }

    .stats {
        display: flex;
        gap: 1rem;
        margin-top: 0.7rem;
    }

    .stat {
        display: flex;
        flex-direction: column;
    }

    .label {
        font-size: 0.65rem;
        color: #6e7b91;
        letter-spacing: 1px;
    }

    .purse span:last-child {
        color: #00ffae;
        font-weight: 700;
    }

    .expand {
        width: 34px;
        height: 34px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        background: rgba(0,255,255,0.08);

        color: #00f0ff;

        font-size: 1.3rem;
        font-weight: bold;
    }

    .players {
        padding:
            0 1rem 1rem 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.7rem;
    }

    .player-card {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 0.9rem;

        border-radius: 14px;

        background:
            rgba(255,255,255,0.04);

        border:
            1px solid rgba(255,255,255,0.05);
    }

    .player-name {
        font-weight: 600;
        font-size: 0.95rem;
    }

    .player-style {
        font-size: 0.75rem;
        color: #8892a6;
        margin-top: 0.2rem;
    }

    .price {
        color: #00ffae;
        font-weight: 700;
        font-size: 0.95rem;
    }

    .waiting {
        text-align: center;
        padding: 3rem 1rem;
        color: #7c8598;
    }

    @media (max-width: 480px) {
        .team-top {
            padding: 0.9rem;
        }

        .player-card {
            padding: 0.8rem;
        }

        .header h1 {
            font-size: 1.7rem;
        }
    }
    .team-grid {
    display: grid;

    grid-template-columns:
        repeat(auto-fit, minmax(170px, 1fr));

    gap: 12px;

    align-items: start;
}

    /* CARD */

    .team-card {
        background:
            linear-gradient(
                145deg,
                rgba(18,18,30,0.95),
                rgba(10,10,18,0.92)
            );

        border-radius: 18px;

        border:
            1px solid rgba(0,255,255,0.08);

        padding: 14px;

        cursor: pointer;

        transition: 0.25s ease;

        overflow: hidden;

        backdrop-filter: blur(10px);

        box-shadow:
            0 0 12px rgba(0,255,255,0.05);
    }

    .team-card:hover {
        transform: translateY(-2px);

        border:
            1px solid rgba(0,255,255,0.22);
    }

    .team-card.selected {
        border:
            1px solid rgba(0,255,255,0.4);

        box-shadow:
            0 0 20px rgba(0,255,255,0.16);
    }

    /* IMPORTANT */
    /* expanded card becomes full width */

    .team-card.expanded {
        grid-column: 1 / -1;
    }

    /* TOP */

    .team-top {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .team-name {
        font-size: 1rem;
        font-weight: 700;

        color: white;

        line-height: 1.2;
    }

    /* STATS */

    .team-stats {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    .mini-stat {
        flex: 1;

        background:
            rgba(255,255,255,0.04);

        border-radius: 12px;

        padding: 8px;

        display: flex;
        flex-direction: column;

        border:
            1px solid rgba(255,255,255,0.04);
    }

    .mini-stat span {
        font-size: 0.65rem;
        color: #8892a6;
    }

    .mini-stat strong {
        margin-top: 4px;

        color: white;

        font-size: 0.95rem;
    }

    .purse strong {
        color: #00ffb7;
    }

    /* PLAYERS */

    .players {
        margin-top: 14px;

        display: grid;

        grid-template-columns:
            repeat(auto-fit, minmax(220px, 1fr));

        gap: 10px;
    }

    .player-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 10px 12px;

        border-radius: 14px;

        background:
            rgba(255,255,255,0.04);

        border:
            1px solid rgba(255,255,255,0.04);
    }

    .player-name {
        font-size: 0.9rem;
        font-weight: 600;
    }

    .player-style {
        margin-top: 3px;

        font-size: 0.7rem;

        color: #8892a6;
    }

    .player-price {
        color: #00ffb7;

        font-size: 0.9rem;
        font-weight: 700;
    }

    /* MOBILE */

    @media (max-width: 480px) {

        .team-grid {
            grid-template-columns:
                repeat(2, 1fr);
        }

        .team-name {
            font-size: 0.92rem;
        }

        .mini-stat strong {
            font-size: 0.82rem;
        }

        .players {
            grid-template-columns: 1fr;
        }
    }
</style>