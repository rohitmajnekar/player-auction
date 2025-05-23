import './App.css';
import reportWebVitals from './reportWebVitals';
import PlayerCard from './player';
import PlayerNavBar from './PlayerNavBar';
import { useEffect, useRef, useState,useCallback, useContext } from 'react';
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
import { SocketContext } from "./SocketContext";

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
        logo: "1.jpg",
        totalPoints: 1000000,
        pointsUsed: 0,
        balancePoints: 1000000,
        players: [],
        key: 1
      },
    {
      name: "AGRI CHALLENGERS",
      logo: "2.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 2
    },
    {
      name: "AGRI CHARGERS",
      logo: "3.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 3
    },
    {
      name: "AGRI WARRIORS",
      logo: "4.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 4
    },
    {
      name: "AGRI SPARTANS",
      logo: "5.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 5
    },
    {
      name: "AGRI STARTS",
      logo: "6.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 6
    },
    {
      name: "AGRI STRIKERS",
      logo: "7.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 7
    },
    {
      name: "AGRI ROYALS",
      logo: "8.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 8
    },
    {
      name: "AGRI THUNDER",
      logo: "9.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 9
    },
    {
      name: "AGRI BLASTERS",
      logo: "10.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 10
    },
    {
      name: "AGRI DEVILS",
      logo: "11.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 11
    },
    {
      name: "AGRI KINGS",
      logo: "12.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 12
    },
    {
      name: "AGRI FIGHTERS",
      logo: "13.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 13
    },
    {
      name: "AGRI RIDERS",
      logo: "14.jpg",
      totalPoints: 1000000,
      pointsUsed: 0,
      balancePoints: 1000000,
      players: [],
      key: 14
    },
    // Add more teams as needed
  ]);
  const playerCardRef = useRef(null)
  const [isEnterPressed, set_enter_pressed] = useState(false)
  const [keyCollected, set_keyCollected] = useState("")
  const allPlayersRef = useRef(all_players);
  const soldPlayersRef = useRef(all_players);
  const currentPlayersRef = useRef(all_players);
  const socket = useContext(SocketContext);
  const [currrent_category, set_currrent_category] = useState('A')

  
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
          Name: row['Name']?row['Name'].toUpperCase():row['Name'],
          Age: row['Age'],
          // Contact: row['खेळाडूचे  कॉन्टॅक्ट / Player Contact'],
          Photo: row['Common Code'],
          Style: row['Player Style'],
          // CommonCode: row['टीशर्ट साईझ / Tshirt Size'],
          Category: row['Category'],
          Price: row['Category'] === 'A'? 300000:row['Category'] === 'B'?200000:100000,
          sold:false
        }));
        
        set_all_players(players)
        console.log('data:', players);
        const sold_players_loc = getDataFromLocalStorage("soldPlayers")
        const teamsData_loc = getDataFromLocalStorage("teamsData")
        
        if (sold_players_loc === null){
          var unsold_players = players
          console.log(all_players)
        }else{
          unsold_players = players.filter(player => !sold_players_loc.some(s_player => s_player.Photo === player.Photo))
          set_sold_player(sold_players_loc)
          setTeamsData(teamsData_loc)
        }
        console.log('debug', unsold_players)
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

  useEffect(() => {
    allPlayersRef.current = all_players;
    soldPlayersRef.current = sold_players
    currentPlayersRef.current = current_player
  }, [all_players, sold_players, current_player]);

  function get_current_index(){
    const unsold_with_current = all_players.filter(
      player => !sold_players.some(s_player => s_player.Photo === player.Photo && s_player.Photo != current_player.Photo)
    ); 
    const currentIndex = unsold_with_current.findIndex(
      player => player.Photo === current_player?.Photo
    );
    return currentIndex
  }    


  useEffect(()=>{
    
    console.log(typeof sold_players)
    
    const re_calc_unsold = all_players.filter(player => !sold_players.some(s_player => s_player.Photo === player.Photo))
    console.log(all_players)
    set_unsold_player(re_calc_unsold)
    if (re_calc_unsold.length !== 0){
      socket.emit("teamdata", teamsData, (response) => {
        console.log("Server ACK:", response);
      });
      const currentIndex = get_current_index()
      console.log(currentIndex)
      const nextIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextPlayer = re_calc_unsold[nextIndex] || re_calc_unsold[0];
      setPrice(nextPlayer.Price)
      set_current_player(nextPlayer);
      saveDataToLocalStorage("soldPlayers", sold_players)
      saveDataToLocalStorage("teamsData",teamsData)
    }
  },[sold_players])
  
  const [activeView, setActiveView] = useState('sold'); // Initial active view state
  
  const handleViewChange = (view) => {
    setActiveView(view);
};

  const handleUnsold = (sold_player_index) =>{
    console.log(sold_players.at(sold_player_index).Name)
    const player = sold_players.at(sold_player_index)
    setTeamsData((oldTeams) => {
      return oldTeams.map((oldTeam) => {
        if (oldTeam.name === player.team_name) {
          return {
            ...oldTeam,
            pointsUsed: oldTeam.pointsUsed - player.sale_price,
            balancePoints: oldTeam.balancePoints + player.sale_price,
            players: oldTeam.players.filter((teamPlayer) => (teamPlayer.name !== player.Name && teamPlayer.Photo !== player.Photo)),
          };
        }
        return oldTeam;
      });
    });
    sold_players.at(sold_player_index).sold = false
    set_sold_player((old_sold_player_list) => {
        const new_list = [...old_sold_player_list];
        // Remove the item at the specified index
        new_list.splice(sold_player_index, 1);
        // Return the new array to update the state
        return new_list;  
      })
    // const re_calc_sold = all_players.filter(player => !sold_players.some(s_player => s_player.Contact === player.Contact))

  }
  const [price, setPrice] = useState(100000);

  const handleAdd5000 = () => {
    setPrice(prevPrice => prevPrice - 100000);
  };

  const handleAdd10000 = () => {
    setPrice(prevPrice => prevPrice + 100000);
  };

  function get_current_index_alt(){
    const unsold_with_current = all_players.filter(
      player => !sold_players.some(s_player => s_player.Photo === player.Photo && s_player.Photo)
    ); 
    const currentIndex = unsold_with_current.findIndex(
      player => player.Photo === current_player?.Photo
    );
    return currentIndex
  }

  const set_next_player = useCallback(() => {
    console.log("soldplauyer",soldPlayersRef.current)
    console.log("all_players",allPlayersRef.current )
    const re_calc_unsold = allPlayersRef.current.filter(
      player => !soldPlayersRef.current.some(s_player => s_player.Photo === player.Photo)
    );
    console.log("re_calc_unsold",re_calc_unsold )
    const currentIndex = re_calc_unsold.findIndex(
      player => player.Photo === currentPlayersRef.current?.Photo
    );
    console.log("currentIndex",currentIndex )
    const nextIndex = currentIndex+1 >= 0 ? currentIndex+1 : 0;
    const nextPlayer = re_calc_unsold[nextIndex] || re_calc_unsold[0];
    console.log(nextPlayer)

    setPrice(nextPlayer.Price);
    set_current_player(nextPlayer);
  }, [allPlayersRef.current , soldPlayersRef.current]);

  const set_previous_player = useCallback(() => {
    console.log("soldplauyer",soldPlayersRef.current)
    console.log("all_players",allPlayersRef.current )
    const re_calc_unsold = allPlayersRef.current.filter(
      player => !soldPlayersRef.current.some(s_player => s_player.Photo === player.Photo)
    );
    console.log("re_calc_unsold",re_calc_unsold )
    const currentIndex = re_calc_unsold.findIndex(
      player => player.Photo === currentPlayersRef.current?.Photo
    );
    console.log("currentIndex",currentIndex )
    const nextIndex = currentIndex-1 >= 0 ? currentIndex-1 : 0;
    const nextPlayer = re_calc_unsold[nextIndex] || re_calc_unsold[0];
    console.log(nextPlayer)

    setPrice(nextPlayer.Price);
    set_current_player(nextPlayer);
  }, [allPlayersRef.current , soldPlayersRef.current]);

  const renderView = () => {
    
    switch (activeView) {
      case 'sold':
        return <SoldPlayersView players={sold_players} set_current_player={set_current_player} handleUnsold={handleUnsold}/>;
      case 'unsold':
        return <UnsoldPlayersView players={unsold_players} set_current_player={set_current_player}/>;
      case 'teams':
        return <div style={{display: 'flex', flexWrap: 'wrap', width: '100%', paddingTop: '10px'}}>
          {teamsData.map((team, index) => (
                <TeamView key={index} team={team} />
              ))}
        </div>
      default:
        return null;
    }
  };
  const childRef = useRef(null);

  const handleKeyPress = (event) => {
    // Check if the "s" key is pressed
    console.log(event.key)

    if (event.key ==='s' || event.key ==='S'){
	handleAdd10000()
    }
    if (isEnterPressed && Number.parseInt(event.key) >= 0 && Number.parseInt(event.key) <=9){
      set_keyCollected(keyCollected + event.key)
      
    }
    if (event.key === 'Enter' || event.key === 'ENTER') {
      set_enter_pressed(!isEnterPressed) // Call handleSold function when "s" is pressed
      if (isEnterPressed){
        teamsData.map((team, index)=>{
          if (team.key === Number.parseInt(keyCollected)){
            if (childRef.current) {
              childRef.current.handleTeamSelect(team);
            }
          }
          else{
            console.log('wrong key', team.key, keyCollected)
          }
        })
        console.log("inside", keyCollected)
        set_keyCollected('')
    }
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
        ref={childRef}
        set_next_player={set_next_player}
        set_previous_player={set_previous_player}
        handleAdd5000={handleAdd5000}
        handleAdd10000={handleAdd10000}
        set_currrent_category={set_currrent_category}
        />
      </div>
        <PriceModifier
          price={price}
          onAdd5000={handleAdd5000}
          onAdd10000={handleAdd10000}
        />
        <PlayerNavBar activeView={activeView} onViewChange={handleViewChange} />
        {renderView()}
      </div>
  );
}

export default App;
