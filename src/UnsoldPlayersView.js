import React, { useState } from 'react';
import './UnsoldPlayersView.css'; // Import CSS for styling
import playerIcon from './playerIcon.png'; // Import your player icon image

const UnsoldPlayersView = ({players, set_current_player}) => {

  const handlePlayerClick = (player)=> {
    set_current_player(player)
  }

  return (
    <div className="unsold-players-view">
      <h2>Unsold Players</h2>
      <div className="player-list">
        {players.map((player, index) => (
          <div key={index} onClick={()=>handlePlayerClick(player)} className="player-item">
            <img src={playerIcon} alt="Player Icon" className="player-icon" />
            <div className="player-details">
              <h3>{player.Name}</h3>
            </div>
              <p>Base Price: {player.Price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnsoldPlayersView;
