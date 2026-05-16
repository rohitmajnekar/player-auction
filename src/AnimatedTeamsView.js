import React, { useEffect, useState } from 'react';
import AnimatedTeamCard from './AnimatedTeamCard';
import './AnimatedTeamsView.css';

const AnimatedTeamsView = ({ teamsData }) => {
  const [animationPhase, setAnimationPhase] = useState('entering'); // 'entering', 'glowing'
  
  useEffect(() => {
    const totalDelay = teamsData.length * 5; // Each card waits for the previous card to finish
    const timer = setTimeout(() => {
      setAnimationPhase('glowing');
    }, (totalDelay + 1) * 1000); // +1s delay after all cards finish

    return () => clearTimeout(timer);
  }, [teamsData.length]);

  const gridRows = 2;
  const gridCols = Math.ceil(teamsData.length / gridRows);

  return (
    <div className={`animated-teams-view ${animationPhase}`}>
      <div
        className="teams-grid"
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100vh - 120px)',
          padding: '20px',
          boxSizing: 'border-box',
          '--cols': gridCols,
          '--rows': gridRows,
          '--gap': '16px'
        }}
      >
        {teamsData.map((team, index) => {
          const row = Math.floor(index / gridCols);
          const col = index % gridCols;
          return (
            <AnimatedTeamCard
              key={team.key}
              team={team}
              index={index}
              row={row}
              col={col}
              cols={gridCols}
              rows={gridRows}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedTeamsView;