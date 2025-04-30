import React, { useEffect, useState, useRef  } from 'react';
import './PlayerCard.css'; // Import CSS for styling
import { saveDataToLocalStorage, getDataFromLocalStorage } from './helper';
import PriceModifier from './priceModifier';
import Confetti from 'react-confetti'; // Import Confetti component
import {io} from 'socket.io-client'


const PlayerCard = ({ player, teams, set_sold_player, setTeamsData, sale_price, isEnterPressed }) => {
  const [showTeams, setShowTeams] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const playerRef = useRef(player);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on('message', (msg) => {
      if (msg.includes("Button")){
        console.log(teams.at(0))
        handleTeamSelect(teams.at(0))
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => newSocket.close();
  }, []);
  

  const handleTeamSelect = (team) => {
    // Handle team selection logic here
    // const data = getDataFromLocalStorage("soldTeams")
    player = playerRef.current
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
      console.log(playerRef.current)
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
    }, 3000);
    
  };

  useEffect(() => console.log('mounted'), [player]);
  
 

  return (
    <div key={player.Name} className="player-card">
       {player.sold && <Confetti gravity={1} />}
       <div className='card-title'>
         APL 2024
       </div>
        <div className="player-photo">
          <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200/lsci/db/PICTURES/CMS/263600/263697.jpg" alt={player.Name} />
        </div>
        <div className="player-info">
          <h1>{player.Name}</h1>
          <p>Age: {player.Age}</p>
          <p>Role: {player.Style}</p>
          <p>Batting Style: {player.battingStyle}</p>
          <p>Bowling Style: {player.bowlingStyle}</p>
          <p>Country: India</p>
          <p>Base Price: {player.Price}</p>
          <h1 className='bidding-price'>Bidding Price: {sale_price}</h1>
          {/* Add more relevant information */}
        </div>
        {player.sold?(
          <div>
            <div className='sold-image'></div>
            <div className='sold-information'>
              <h1 style={{padding: '25px'}}> 
                Sold To
              </h1>
              <div style={{fontWeight: 'bold', fontSize: 'x-large'}}>
                <img style={{alignSelf: 'end'}} src={player.team_logo} alt="Team Logo" className="team-logo card-logo" />
                <p>
                  {player.team_name}
                </p>
              </div>
                {/* <img src={player.team.src}></img> */}
            </div>
          </div>
        ):(
          <div>
            <div className="sale-button button-8" style={{backgroundColor: isEnterPressed? "green":""}} onClick={() => setShowTeams(!showTeams)}>
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
