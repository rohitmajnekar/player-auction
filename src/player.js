import React, { forwardRef, useEffect, useState,useRef } from 'react';
import './PlayerCard.css'; // Import CSS for styling
import { saveDataToLocalStorage, getDataFromLocalStorage } from './helper';
import PriceModifier from './priceModifier';
import Confetti from 'react-confetti'; // Import Confetti component
import { useImperativeHandle } from 'react';
import {io} from 'socket.io-client'


const PlayerCard = forwardRef((props, ref) => {
  const { player, teams, set_sold_player, setTeamsData, sale_price, isEnterPressed, set_next_player,set_previous_player,handleAdd5000,handleAdd10000,set_currrent_category } = props
  const [showTeams, setShowTeams] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const currentPlayersRef = useRef(player);

  
  useEffect(() => {
    currentPlayersRef.current = player
  }, [player]);

  const handleTeamSelect = (team) => {
    // Handle team selection logic here
    // const data = getDataFromLocalStorage("soldTeams")
    const teamName = team.name
    const player = currentPlayersRef.current
    player.sold = true
    player.team_name = teamName
    player.team_logo = team.logo
    player.sale_price = sale_price
    console.log(player)
    // const updatedData = {...data, [teamName]:player}
    // saveDataToLocalStorage("soldTeams", updatedData)
    // console.log("Selected team:", updatedData);
    setShowTeams(false)
    setTimeout(() => {
      set_sold_player((old_player) => [...old_player,player])
      console.log("inside team handler")
      console.log(player)
      setTeamsData((oldTeams) => {
        return oldTeams.map((oldTeam) => {
          if (oldTeam.name === teamName) {
            return {
              ...oldTeam,
              pointsUsed: oldTeam.pointsUsed + player.sale_price,
              balancePoints: oldTeam.balancePoints - player.sale_price,
              players: [...oldTeam.players, player],
            };
          }
          return oldTeam;
        });
      });
    }, 3000);
    
  };

  // function get_current_index(){
  //   const unsold_with_current = all_players.filter(
  //     player => !sold_players.some(s_player => s_player.Photo === player.Photo && s_player.Photo != current_player.Photo)
  //   );
  //   const currentIndex = unsold_with_current.findIndex(
  //     player => player.Photo === current_player?.Photo
  //   );
  //   return currentIndex
  // }

  useEffect(() => console.log('mounted'), [player]);
  
    useEffect(() => {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);
  
      newSocket.on('connect', () => {
        console.log("Connected:", newSocket.id);
      });
  
      newSocket.on('message', (msg) => {
        if (msg.includes("Button")){
          if (msg.includes("prev")){
            console.log("prev click...")
            set_previous_player()
          }else if (msg.includes("next")){
            console.log("next click...")
            set_next_player()
          }else if (msg.includes("-1L")){
            handleAdd5000()
          }else if (msg.includes("+1L")){
            handleAdd10000()
          }else if (msg.includes("set category")){
            handleAdd10000()
          }else{
            teams.forEach(team => {
              if (msg.includes(team.name)){
                handleTeamSelect(team)
                console.log(team.name)
                console.log(teams)
              }
            });
          }
          setMessages(prev => [...prev, msg]);
        }
      });
  
      return () => newSocket.close();
    }, []);
    

  useImperativeHandle(ref, () => ({
    handleTeamSelect,
  }));

  return (
    <div key={player.Name} className={`player-card ${player.sold? 'soldPlayer': ''}`}>
       {player.sold && <Confetti gravity={1} />}
       <div className='card-title'>
         APL 2024 Auctions
       </div>
        <div className="player-photo">
          <img src={`./photos/${player.Photo}.jpg`} alt={player.Name} />
        </div>
        <div className="player-info">
          <h1 style={{fontSize: 'xxx-large'}} >{player.Name}</h1>
          <p>Age: {player.Age}</p>
          <p>Player Style: {player.Style}</p>
          <p>Player Category: {player.Category}</p>
          <p>Base Price: {player.Price}</p>
          <h1 className='bidding-price'> Price: {sale_price/100000}L</h1>
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
                <img style={{alignSelf: 'end'}} src={`./logos/${player.team_logo}`} alt="Team Logo" className="team-logo card-logo" />
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
});

export default PlayerCard;
