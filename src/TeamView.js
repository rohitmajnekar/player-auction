// TeamView.js

import React from 'react';
import './TeamView.css'; // Import CSS for styling
import playerIcon from './playerIcon.png'; // Import your player icon image

const TeamView = ({ team }) => {
  return (
    <div className="team-view">
      <div className="team-header">
        <img src={team.logo} alt="Team Logo" className="team-logo" />
        <div className="team-info">
          <h2>{team.name}</h2>
          <div className='team-points-details'>
            <div>
              <p>Total Points: {team.totalPoints}</p>
              <p>Points Used: {team.pointsUsed}</p>
            </div>
            <div>
              <p>Balance Points: {team.balancePoints}</p>
              <p>Number of Players Bought: {team.players.length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="player-list">
        {team.players.map((player, index) => (
          <div key={index} className="player-item">
            <img src={playerIcon} alt="Player Icon" className="player-icon" />
            <div className="player-details">
                <h3>{player.Name}</h3>
            </div>
            <div className='price-diff'>
              <p>Role: {player.Style}</p>
              <p style={{color: 'green'}}>Base Price: {player.Price}</p>
              <p style={{color: 'red'}}>Sale Price: {player.sale_price}</p>
            </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default TeamView;
