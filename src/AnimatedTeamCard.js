import React from 'react';
import './AnimatedTeamsView.css';

const AnimatedTeamCard = ({ team, index, row, col, cols, rows }) => {
  console.log(`Rendering card for ${team.logo} ${team.ownerImage} `);
  return (
    <div
      className="animated-team-card"
      style={{
        '--card-delay': `${index * 5}s`,
        '--row': row,
        '--col': col,
        '--cols': cols,
        '--rows': rows,
      }}
    >
      
      <div className="card-content">
        <img src={`./logos/${team.logo}`} alt="Team Logo" className="animated-team-logo" />
        
        <div className="animated-team-info">
          <h2 className="animated-team-name">{team.name}</h2>
          <img src={`/${team.ownerImage}`} alt="Owner" className="animated-owner-image" />
          {console.log(team)}
          <p className="animated-owner-name">{team.owner}</p>
          <p className="animated-total-points">Total Points: {team.totalPoints}</p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTeamCard;