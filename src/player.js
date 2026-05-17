import React, { forwardRef, useEffect, useState,useRef } from 'react';
import './PlayerCard.css'; // Import CSS for styling
import PriceModifier from './priceModifier';
import Confetti from 'react-confetti'; // Import Confetti component
import { useImperativeHandle } from 'react';
import {io} from 'socket.io-client'
import { sellPlayer } from './helper';
import PriceCard from './PriceCard';


const DetailCard = ({ label, value }) => (
  <div className="detail-card">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value}</span>
  </div>
);

const PlayerCard = forwardRef((props, ref) => {
  const { player, teams, set_current_player, set_all_players, set_sold_player, setTeamsData, sale_price, isEnterPressed, set_next_player,set_previous_player,handleAdd5000,handleAdd10000,set_currrent_category, setShowSpinner, setSpinTheWheel, setMaxBidTriggered } = props
  const [showTeams, setShowTeams] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const currentPlayersRef = useRef(player);
  const salePriceRef = useRef(sale_price);

  
  useEffect(() => {
    currentPlayersRef.current = player
  }, [player]);
  useEffect(() => {
    salePriceRef.current = sale_price
  }, [sale_price]);

  const handleTeamSelect = async (team) => {
    const teamName = team.name;
    const currentPlayer = currentPlayersRef.current;
    const playerCopy = {
      ...currentPlayer,
      sold: true,
      team_id: team.id || team.key || null,
      team_name: teamName,
      team_logo: team.logo,
      sale_price: salePriceRef.current,
    };

    try {
      await sellPlayer({
        photo: playerCopy.Photo,
        team_id: playerCopy.team_id,
        team_name: playerCopy.team_name,
        team_logo: playerCopy.team_logo,
        sale_price: playerCopy.sale_price,
      });
    } catch (error) {
      console.error('Unable to persist player sale to server:', error);
    }

    setShowTeams(false);
    if (set_current_player) {
      set_current_player(playerCopy);
    }
    set_all_players((oldPlayers) => {
      return oldPlayers.map((existingPlayer) => {
        if (existingPlayer.Photo === playerCopy.Photo) {
          return playerCopy;
        }
        return existingPlayer;
      });
    });
    setTimeout(() => {
      set_sold_player((old_player) => [...old_player, playerCopy]);
      setTeamsData((oldTeams) => {
        return oldTeams.map((oldTeam) => {
          if (oldTeam.name === teamName) {
            return {
              ...oldTeam,
              pointsUsed: oldTeam.pointsUsed + playerCopy.sale_price,
              balancePoints: oldTeam.balancePoints - playerCopy.sale_price,
              players: [...oldTeam.players, playerCopy],
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
        console.log("meesage-recieve", msg, msg.includes("next"))
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
        }else if (msg.includes("Go to 1st Player in List")){
          console.log("inside player go to")
          set_next_player(0)
        }else if (msg.includes("spinTheWheel")){
          console.log("spinning the wheel...")
          setSpinTheWheel(prev => !prev)
         }
        else if (msg.includes("toggleSpinner")){
          console.log("toggling spinner...")
          if (msg.includes("true")){
            setShowSpinner(prev => true)
          }else{
            setShowSpinner(prev => false)
          }
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
        
      });
  
      // return () => newSocket.close();
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
        
        <div className="player-info">
          {/* <h1 style={{fontSize: 'xxx-large'}} >{player.Name}</h1>
          <p>Player Style: {player.Style}</p>
          <p>Player Category: {player.Category}</p>
          <p>Base Price: {player.Price}</p>
          <h1 className='bidding-price'> Price: {sale_price/100000}L</h1> */}
          <div className="player-details">
            <h1>{player.Name}</h1>

            <DetailCard
              label="PLAYER STYLE"
              value={player.Style}
            />

            <DetailCard
              label="CATEGORY"
              value={player.Category}
            />

            <DetailCard
              label="BASE PRICE"
              value={player.Price}
            />
          </div>
          <div className="player-image-wrapper">
            <div className="image-glow" />

            <img src={`./photos/${player.Photo}.jpg`} alt={player.Name} />
          </div>
          {/* Add more relevant information */}
        </div>
        <PriceCard price={sale_price/100000} />
        {/* <div className="player-photo">
          <img src={`./photos/${player.Photo}.jpg`} alt={player.Name} />
        </div> */}
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
