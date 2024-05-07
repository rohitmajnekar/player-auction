import React, { useState } from 'react';
import './SoldPlayerView.css'; // Import CSS for styling
import playerIcon from './playerIcon.png'; // Import your player icon image
import { Color } from 'three';

const SoldPlayersView = ({players, set_current_player}) => {
  const handlePlayerClick = (player)=> {
    set_current_player(player)
  }
  return (
    <div className="unsold-players-view">
      <h2>Sold Players</h2>
      <div className="player-list">
        {players.map((player, index) => (
          <div key={index} onClick={()=>handlePlayerClick(player)} className="player-item">
            <img src={playerIcon} alt="Player Icon" className="player-icon" />
            <div className="player-details">
              <h3>{player.Name}</h3>
            </div>
            <div className='price-diff'>
              <p style={{color: 'green'}}>Base Price: {player.Price}</p>
              <p style={{color: 'red'}}>Sale Price: {player.sale_price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoldPlayersView;
