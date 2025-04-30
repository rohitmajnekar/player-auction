import './App.css';
import reportWebVitals from './reportWebVitals';
import PlayerCard from './player';
import PlayerNavBar from './PlayerNavBar';
import { useEffect, useRef, useState } from 'react';
import UnsoldPlayersView from './UnsoldPlayersView';
import PriceModifier from './priceModifier';
import { saveDataToLocalStorage } from './helper';
import Papa  from 'papaparse';
import { getDataFromLocalStorage } from './helper';
import SoldPlayersView from './SoldPlayerView';
import TeamView from './TeamView';
import logo from "./logo.svg"
import {io} from 'socket.io-client'
import Confetti from 'react-confetti'; // Import Confetti component

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="logo" />
        <span className="title">Agripada Premier League</span>
      </div>
    </nav>
  );
};

function App() {
  const [all_players, set_all_players] = useState([])
  const [current_player, set_current_player] = useState({})
  const [unsold_players, set_unsold_player] = useState([])
  const [sold_players, set_sold_player] = useState([])
  const [teamsData, setTeamsData] = useState([
    {
      name: "AGRI TITANS",
      logo: "1.jpeg",
      totalPoints: 10000,
      pointsUsed: 5000,
      balancePoints: 5000,
      players: []
    },
    {
      name: "AGRI CHALLENGERS",
      logo: "1.jpeg",
      totalPoints: 10000,
      pointsUsed: 5000,
      balancePoints: 5000,
      players: []
    },
    // Add more teams as needed
  ]);
  const playerCardRef = useRef(null)
  const [isEnterPressed, set_enter_pressed] = useState(false)


  // useEffect(() => {
  //   socket.on('message', (msg) => {
  //     // Trigger a specific function depending on the message
  //   });

  //   return () => {
  //     socket.off('message');
  //   };
  // }, []);


  
  useEffect(() => {
    const load = async ()=>{
      await fetch( './players.csv' )
      .then( response => response.text() )
      .then( responseText => {
        // -- parse csv
        var data = Papa.parse(responseText,{header:true, quoteChar:'"'});
        const players = data.data.map(row => ({
          Timestamp: row.Timestamp,
          Username: row.Username,
          Name: row['नाव / Player Name '],
          Age: row['खेळाडूचे वय / Player Age'],
          Contact: row['खेळाडूचे  कॉन्टॅक्ट / Player Contact'],
          Photo: row['खेळाडूचे फोटो / Player Photo'],
          Style: row['खेळाडू शैली / Player Style'],
          TshirtSize: row['टीशर्ट साईझ / Tshirt Size'],
          Price: 100000
        }));
        set_all_players(players)
        console.log('data:', players);
        const sold_players_loc = getDataFromLocalStorage("soldPlayers")
        const teamsData_loc = getDataFromLocalStorage("teamsData")
        if (sold_players_loc === null){
          var unsold_players = players
          console.log(all_players)
        }else{
          unsold_players = players.filter(player => !sold_players_loc.some(s_player => s_player.Contact === player.Contact))
          set_sold_player(sold_players_loc)
          setTeamsData(teamsData_loc)
        }
        set_current_player(unsold_players.at(0))
        set_unsold_player(unsold_players)
        setPrice(unsold_players.at(0).Price)
        console.log(unsold_players)
      })
    };
    load()
    if (playerCardRef.current) {
      playerCardRef.current.focus();
    }

    
  }, [])

//   const handleBid = (player) => {
//     const socket = io('http://localhost:8080');
//     socket.emit('bid', { player });
// };
  
  useEffect(()=>{
    console.log(typeof sold_players)
    const re_calc_unsold = all_players.filter(player => !sold_players.some(s_player => s_player.Contact === player.Contact))
    set_unsold_player(re_calc_unsold)
    if (re_calc_unsold.length !== 0){
      setPrice(current_player.Price)
      set_current_player(re_calc_unsold.at(0))
      saveDataToLocalStorage("soldPlayers", sold_players)
      saveDataToLocalStorage("teamsData",teamsData)
    }
  },[sold_players])
  
  const [activeView, setActiveView] = useState('sold'); // Initial active view state
  
  const handleViewChange = (view) => {
    setActiveView(view);
};

  const [price, setPrice] = useState(10000);

  const handleSub100000 = () => {
    setPrice(prevPrice => prevPrice - 100000);
  };

  const handleAdd10000 = () => {
    setPrice(prevPrice => prevPrice + 10000);
  };
  const renderView = () => {
    
    switch (activeView) {
      case 'sold':
        return <SoldPlayersView players={sold_players} set_current_player={set_current_player}/>;
      case 'unsold':
        return <UnsoldPlayersView players={unsold_players} set_current_player={set_current_player}/>;
      case 'teams':
        return <div>
            {teamsData.map((team, index) => (
              <TeamView key={index} team={team} />
            )) }
            {teamsData.map((team, index) => (
              <TeamView key={index} team={team} />
            )) }
        </div>
      default:
        return null;
    }
  };

  const handleKeyPress = (event) => {
    // Check if the "s" key is pressed
    console.log(event.key)
    if (event.key === 'Enter' || event.key === 'ENTER') {
      set_enter_pressed(!isEnterPressed) // Call handleSold function when "s" is pressed

      // if (isEnterPressed){
        
      // }
    }
  };
  return (
    <div className="App" onKeyDown={handleKeyPress} ref={playerCardRef} tabIndex={0}>
      <NavBar/>
      <div className="player-card-container">
        <PlayerCard 
        player={current_player} 
        teams={teamsData} 
        set_sold_player={set_sold_player}
        setTeamsData={setTeamsData}
        sale_price={price}
        isEnterPressed={isEnterPressed}
        />
      </div>
        <PriceModifier
          price={price}
          onAdd5000={handleSub100000}
          onAdd10000={handleAdd10000}
        />
        <PlayerNavBar activeView={activeView} onViewChange={handleViewChange} />
        {renderView()}
      </div>
  );
}

export default App;
