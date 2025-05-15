import React from 'react';
import './PlayerNavBar.css'; // Import CSS for styling

const PlayerNavBar = ({ activeView, onViewChange }) => {
  return (
    <div className="player-nav-bar">
      <button
        className={activeView === 'sold' ? 'active' : ''}
        onClick={() => onViewChange('sold')}
      >
        Sold Players
      </button>
      <button
        className={activeView === 'unsold' ? 'active' : ''}
        onClick={() => onViewChange('unsold')}
      >
        Unsold Players
      </button>
      <button
        className={activeView === 'teams' ? 'active' : ''}
        onClick={() => onViewChange('teams')}
      >
        Teams
      </button>
    </div>
  );
};

export default PlayerNavBar;
