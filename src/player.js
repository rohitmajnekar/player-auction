import React, { useEffect, useState } from 'react';
import './PlayerCard.css'; // Import CSS for styling
import { saveDataToLocalStorage, getDataFromLocalStorage } from './helper';
import PriceModifier from './priceModifier';


const PlayerCard = ({ player, teams, set_sold_player, setTeamsData, sale_price }) => {
  const [showTeams, setShowTeams] = useState(false);


  const handleTeamSelect = (team) => {
    // Handle team selection logic here
    // const data = getDataFromLocalStorage("soldTeams")
    
    const teamName = team.name
    player.sold = true
    player.team_name = teamName
    player.team_logo = team.logo
    player.sale_price = sale_price
    // const updatedData = {...data, [teamName]:player}
    // saveDataToLocalStorage("soldTeams", updatedData)
    // console.log("Selected team:", updatedData);
    console.log("ouside")
    setShowTeams(false)
    setTimeout(() => {
      set_sold_player((old_player) => [...old_player,player])
      console.log("inside")
      setTeamsData((oldTeams) => {
        return oldTeams.map((oldTeam) => {
          if (oldTeam.name === teamName) {
            return {
              ...oldTeam,
              players: [...oldTeam.players, player],
            };
          }
          return oldTeam;
        });
      });
    }, 1000);
    
  };

  useEffect(() => console.log('mounted'), [player]);
  
 

  return (
    <div key={player.Name} className="player-card">
      <div className="player-photo">
        <img src="https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2024/2.png" alt={player.Name} />
      </div>
      <div className="player-info">
        <h2>{player.Name}</h2>
        <p>Age: {player.Age}</p>
        <p>Role: {player.Style}</p>
        <p>Batting Style: {player.battingStyle}</p>
        <p>Bowling Style: {player.bowlingStyle}</p>
        <p>Country: India</p>
        <p>Base Price: {player.Price}</p>
        {/* Add more relevant information */}
      </div>
      {player.sold?(
        <div>
          <div className='sold-image'></div>
          <div className='sold-information'>
            <h3>
              Sold To
            </h3>
            <div style={{fontWeight: 'bold'}}>
              <img style={{alignSelf: 'end'}} src={player.team_logo} alt="Team Logo" className="team-logo card-logo" />
              {player.team_name}
            </div>
              {/* <img src={player.team.src}></img> */}
          </div>
        </div>
      ):(
        <div>
          <div className="sale-button button-8" onClick={() => setShowTeams(!showTeams)}>
            Sale
          </div>
          <div className={`team-overlay ${showTeams ? 'show' : ''}`}>
            <ul className="team-list">
              {teams.map((team, index) => (
                <li key={index} onClick={() => handleTeamSelect(team)}>
                  {team.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
