import './App.css';
import reportWebVitals from './reportWebVitals';
import PlayerCard from './player';
import PlayerNavBar from './PlayerNavBar';
import { useEffect, useRef, useState,useCallback, useContext } from 'react';
import UnsoldPlayersView from './UnsoldPlayersView';
import PriceModifier from './priceModifier';
import { loadAppState, initializeAppState, saveAppState, parseCSV } from './helper';
import SoldPlayersView from './SoldPlayerView';
import TeamView from './TeamView';
import AnimatedTeamsView from './AnimatedTeamsView';
import logo from "./logo.svg"
import Confetti from 'react-confetti'; // Import Confetti component
import { SocketContext } from "./SocketContext";
import LogoPopup from './LogoPopup';
import Spinner from './Spinner';

import FluidBackground from "./FluidBackground";

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

const defaultTeamsData = [
    {
      name: "AGRI TITANS",
      owner: "Manish Thakur",
      ownerImage: "owners/Manish Thakur.jpg",
      logo: "1.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 1
    },
    {
      name: "AGRI WARRIORS",
      owner: "Vicky Mhatre",
      ownerImage: "owners/Vicky Mhatre.jpg",
      logo: "2.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 2
    },
    {
      name: "AGRI SPARTANS",
      owner: "Manish Avkirkar",
      ownerImage: "owners/Manish Avkirkar.jpg",
      logo: "3.jpg",
      totalPoints: 10000000,
      pointsUsed: 300000,
      balancePoints: 9700000,
      players: [],
      key: 3
    },
    {
      name: "AGRI KINGS",
      owner: "Pranay Patil",
      ownerImage: "owners/Pranay Patil.jpg",
      logo: "4.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 4
    },
    {
      name: "AGRI RIDERS",
      owner: "Mehandra Wavekar",
      ownerImage: "owners/Mehandra Wavekar.jpg",
      logo: "5.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 5
    },
    {
      name: "AGRI STARTS",
      owner: "Prajot Dhumal",
      ownerImage: "owners/Prajot Dhumal.jpg",
      logo: "6.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 6
    },
    {
      name: "AGRI ROYALS",
      owner: "Ritanshu Thakur",
      ownerImage: "owners/Ritanshu Thakur.jpg",
      logo: "7.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 7
    },
    {
      name: "AGRI THUNDER",
      owner: "Mukesh Mali",
      ownerImage: "owners/Mukesh Mali.jpg",
      logo: "8.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
      players: [],
      key: 8
    }
  ];

function App() {
  const [all_players, set_all_players] = useState([]);
  const [current_player, set_current_player] = useState({});
  const [unsold_players, set_unsold_player] = useState([]);
  const [sold_players, set_sold_player] = useState([]);
  const [teamsData, setTeamsData] = useState(defaultTeamsData);
  const [loading, setLoading] = useState(true);
  const playerCardRef = useRef(null);
  const [isEnterPressed, set_enter_pressed] = useState(false);
  const [keyCollected, set_keyCollected] = useState("");
  const allPlayersRef = useRef(all_players);
  const soldPlayersRef = useRef(all_players);
  const currentPlayersRef = useRef(all_players);
  const socket = useContext(SocketContext);
  const [currrent_category, set_currrent_category] = useState('A');
  const [showPopup, setShowPopup] = useState(false);
  const stateSaveRef = useRef(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [spinTheWheel, setSpinTheWheel] = useState(false);
  const [maxBidTriggered, setMaxBidTriggered] = useState(false);
  
  const loadPlayersFromCSV = async () => {
    const response = await fetch('./players.csv');
    const responseText = await response.text();
    const data = await parseCSV(responseText);
    return data.map(row => ({
      Timestamp: row.Timestamp,
      Username: row.Username,
      Name: row['Name'] ? row['Name'].toUpperCase() : row['Name'],
      Photo: row['Common Code'],
      Style: row['Player Style'],
      Category: row['Category'],
      Price: row['Category'] === 'A' ? 300000 : row['Category'] === 'B' ? 200000 : 100000,
      sold: false,
    }));
  };

  
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await loadAppState();

        if (savedState?.initialized && Array.isArray(savedState.all_players)) {
          const players = savedState.all_players;
          const savedSoldPlayers = Array.isArray(savedState.soldPlayers) ? savedState.soldPlayers : [];
          const savedTeams = Array.isArray(savedState.teamsData) ? savedState.teamsData : defaultTeamsData;

          set_all_players(players);
          set_sold_player(savedSoldPlayers);
          setTeamsData(savedTeams);

          const unsold_players = players.filter(
            (player) => !savedSoldPlayers.some((s_player) => s_player.Photo === player.Photo)
          );

          set_current_player(unsold_players[0] || {});
          set_unsold_player(unsold_players);
          setPrice(unsold_players[0]?.Price || 100000);
        } else {
          const initializedState = await initializeAppState({ loadFromServer: true });
          const players = Array.isArray(initializedState.all_players) ? initializedState.all_players : [];
          const savedSoldPlayers = Array.isArray(initializedState.soldPlayers) ? initializedState.soldPlayers : [];
          const savedTeams = Array.isArray(initializedState.teamsData) ? initializedState.teamsData : defaultTeamsData;

          set_all_players(players);
          set_sold_player(savedSoldPlayers);
          setTeamsData(savedTeams);

          const unsold_players = players.filter(
            (player) => !savedSoldPlayers.some((s_player) => s_player.Photo === player.Photo)
          );

          set_current_player(unsold_players[0] || {});
          set_unsold_player(unsold_players);
          setPrice(unsold_players[0]?.Price || 100000);
        }
      } catch (error) {
        console.error('Unable to load saved state:', error);
        // const players = await loadPlayersFromCSV();
        // const unsold_players = players;

        // set_all_players(players);
        // set_unsold_player(unsold_players);
        // set_current_player(unsold_players[0] || {});
        // setPrice(unsold_players[0]?.Price || 100000);
      } finally {
        if (playerCardRef.current) {
          playerCardRef.current.focus();
        }
      }
    };

    loadState();
  }, []);

//   const handleBid = (player) => {
//     const socket = io('http://localhost:8080');
//     socket.emit('bid', { player });
// };

  useEffect(() => {
    allPlayersRef.current = all_players;
    soldPlayersRef.current = sold_players;
    currentPlayersRef.current = current_player;
  }, [all_players, sold_players, current_player]);

  useEffect(() => {
    if (!stateSaveRef.current) {
      stateSaveRef.current = true;
      return;
    }

    saveAppState({
      soldPlayers: sold_players,
      teamsData,
      all_players,
    }).catch((error) => {
      console.error('Failed to persist app state:', error);
    });
  }, [sold_players, teamsData, all_players]);

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
    }
  },[sold_players])
  
  const [activeView, setActiveView] = useState('sold'); // Initial active view state
  const [screenSaverMode, setScreenSaverMode] = useState(false); // Screen saver toggle
  
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
    set_all_players((oldPlayers) => {
      return oldPlayers.map((existingPlayer) => {
        if (existingPlayer.Photo === player.Photo) {
          return {
            ...existingPlayer,
            sold: false,
            team_id: null,
            team_name: null,
            team_logo: null,
            sale_price: null,
          };
        }
        return existingPlayer;
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
  setPrice(prevPrice => {
    const newPrice = prevPrice + 100000;
    if (newPrice === 3000000) {
      setMaxBidTriggered(true);
    }

    return newPrice;
  });
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

  const set_next_player = useCallback((index=null) => {
    if( index != null){
      console.log("go ro rop teripafwre")
      const re_calc_unsold = allPlayersRef.current.filter(
        player => !soldPlayersRef.current.some(s_player => s_player.Photo === player.Photo)
      );
      const nextPlayer = re_calc_unsold[0];
      console.log(nextPlayer)
      setPrice(nextPlayer.Price);
      set_current_player(nextPlayer);
    }else{
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
      
    }
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
        if (screenSaverMode) {
          return <AnimatedTeamsView teamsData={teamsData} />;
        } else {
          return <div style={{display: 'flex', flexWrap: 'wrap', width: '100%', paddingTop: '10px'}}>
            {teamsData.map((team, index) => (
                  <TeamView key={index} team={team} />
                ))}
          </div>;
        }
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
      {/* <NavBar/> */}
      <FluidBackground 
        maxBidTriggered={maxBidTriggered}
        setMaxBidTriggered={setMaxBidTriggered}
      />
      {/* <div className="p-10">
        <button
          onClick={() => setShowPopup(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Show Logo Popup
        </button>

        <LogoPopup show={showPopup} onClose={() => setShowPopup(false)} />
      </div> */}
      {/* {screenSaverMode && <AnimatedTeamsView teamsData={teamsData} />} */}
      <div className='app-ui'>

        <div className="player-card-container">
          <PlayerCard 
          player={current_player} 
          teams={teamsData} 
          set_current_player={set_current_player}
          set_all_players={set_all_players}
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
          setShowSpinner={setShowSpinner}
          setSpinTheWheel={setSpinTheWheel}
          setMaxBidTriggered={setMaxBidTriggered}
          />
        </div>
          <PriceModifier
            price={price}
            onAdd5000={handleAdd5000}
            onAdd10000={handleAdd10000}
          />
          <PlayerNavBar activeView={activeView} onViewChange={handleViewChange} screenSaverMode={screenSaverMode} setScreenSaverMode={setScreenSaverMode} />
          {renderView()}
          {showSpinner && (
            <Spinner
              size={420}
              onClose={() => setShowSpinner(false)}
              onResult={(result) => console.log(result)}
              spinTheWheel={spinTheWheel}
            />
          )}      
          </div>
      </div>
  );
}

export default App;
