const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();
const Papa = require('papaparse');

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from localhost and local network IPs
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://192.168.0.103:3000',
      'http://192.168.0.103:5173'
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests from localhost and local network IPs
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://192.168.0.103:3000',
        'http://192.168.0.103:5173'
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  },
});

const dbPath = path.join(__dirname, 'auction.db');
const csvPath = path.join(__dirname, '..', 'public', 'players.csv');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite database:', err);
    process.exit(1);
  }
  console.log('SQLite database opened at', dbPath);
});

const runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
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
    },
    {
      name: "AGRI WARRIORS",
      owner: "Vicky Mhatre",
      ownerImage: "owners/Vicky Mhatre.jpg",
      logo: "2.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
    },
    {
      name: "AGRI SPARTANS",
      owner: "Manish Avkirkar",
      ownerImage: "owners/Manish Avkirkar.jpg",
      logo: "3.jpg",
      totalPoints: 10000000,
      pointsUsed: 300000,
      balancePoints: 9700000,
    },
    {
      name: "AGRI KINGS",
      owner: "Pranay Patil",
      ownerImage: "owners/Pranay Patil.jpg",
      logo: "4.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
    },
    {
      name: "AGRI RIDERS",
      owner: "Mehandra Wavekar",
      ownerImage: "owners/Mehandra Wavekar.jpg",
      logo: "5.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
    },
    {
      name: "AGRI STARTS",
      owner: "Prajot Dhumal",
      ownerImage: "owners/Prajot Dhumal.jpg",
      logo: "6.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
    },
    {
      name: "AGRI ROYALS",
      owner: "Ritanshu Thakur",
      ownerImage: "owners/Ritanshu Thakur.jpg",
      logo: "7.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
    },
    {
      name: "AGRI THUNDER",
      owner: "Mukesh Mali",
      ownerImage: "owners/Mukesh Mali.jpg",
      logo: "8.jpg",
      totalPoints: 10000000,
      pointsUsed: 0,
      balancePoints: 10000000,
    }
  ];
const initDb = async () => {
  await runAsync(`CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Timestamp TEXT,
    Username TEXT,
    Name TEXT,
    Photo TEXT UNIQUE,
    Style TEXT,
    Category TEXT,
    Price INTEGER,
    sold INTEGER DEFAULT 0,
    team_name TEXT,
    team_logo TEXT,
    sale_price INTEGER,
    team_id INTEGER
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    logo TEXT,
    ownerImage TEXT,
    owner TEXT,
    totalPoints INTEGER,
    pointsUsed INTEGER,
    balancePoints INTEGER
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);

  await ensurePlayersSchema();
};

const ensurePlayersSchema = async () => {
  const columns = await allAsync('PRAGMA table_info(players)');
  const hasTeamId = columns.some((col) => col.name === 'team_id');
  if (!hasTeamId) {
    console.log('Adding missing team_id column to players table');
    await runAsync('ALTER TABLE players ADD COLUMN team_id INTEGER');
  }
};

const rowToPlayer = (row) => ({
  Timestamp: row.Timestamp,
  Username: row.Username,
  Name: row.Name,
  Photo: row.Photo,
  Style: row.Style,
  Category: row.Category,
  Price: row.Price,
  sold: row.sold === 1,
  team_name: row.team_name,
  team_logo: row.team_logo,
  sale_price: row.sale_price,
  team_id: row.team_id,
});

const rowToTeam = (row) => ({
  id: row.id,
  name: row.name,
  logo: row.logo,
  ownerImage: row.ownerImage,
  owner: row.owner,
  totalPoints: row.totalPoints,
  pointsUsed: row.pointsUsed,
  balancePoints: row.balancePoints,
});

const getMeta = async (key) => {
  const row = await getAsync('SELECT value FROM meta WHERE key = ?', [key]);
  return row ? row.value : null;
};

const setMeta = async (key, value) => {
  await runAsync('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)', [key, value]);
};

const loadPlayersFromCsv = async () => {
    console.log('Loading players from CSV at', csvPath);
  const csvText = await fs.readFile(csvPath, 'utf8');
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  return parsed.data.map((row) => ({
    Timestamp: row.Timestamp,
    Username: row.Username,
    Name: row['Name'] ? row['Name'].toUpperCase() : row['Name'],
    Photo: row['Common Code'],
    Style: row['Player Style'],
    Category: row['Category'],
    Price: row['Category'] === 'A' ? 300000 : row['Category'] === 'B' ? 200000 : 100000,
    sold: false,
    team_name: null,
    team_logo: null,
    sale_price: null,
    team_id: null,
  }));
};

const savePlayers = async (players) => {
  for (const player of players) {
    await runAsync(
      `INSERT INTO players (Timestamp, Username, Name, Photo, Style, Category, Price, sold, team_name, team_logo, sale_price, team_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        player.Timestamp,
        player.Username,
        player.Name,
        player.Photo,
        player.Style,
        player.Category,
        player.Price,
        player.sold ? 1 : 0,
        player.team_name || null,
        player.team_logo || null,
        player.sale_price || null,
        player.team_id || null,
      ]
    );
  }
};

const saveTeams = async (teams) => {
  for (const team of teams) {
    await runAsync(
      `INSERT INTO teams (name, logo, ownerImage, owner, totalPoints, pointsUsed, balancePoints)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [team.name, team.logo, team.ownerImage,team.owner, team.totalPoints, team.pointsUsed, team.balancePoints]
    );
  }
};

const saveState = async ({ all_players, teamsData }) => {
  await runAsync('BEGIN TRANSACTION');
  try {
    await runAsync('DELETE FROM players');
    await runAsync('DELETE FROM teams');
    await savePlayers(all_players);
    await saveTeams(teamsData);
    await setMeta('initialized', '1');
    await runAsync('COMMIT');
  } catch (error) {
    await runAsync('ROLLBACK');
    throw error;
  }
};

const saveTeamsOnly = async (teamsData) => {
  await runAsync('BEGIN TRANSACTION');
  try {
    await runAsync('DELETE FROM teams');
    await saveTeams(teamsData);
    await runAsync('COMMIT');
  } catch (error) {
    await runAsync('ROLLBACK');
    throw error;
  }
};

const loadAppState = async () => {
    const initialized = (await getMeta('initialized')) === '1';
    console.log('Application initialized:', initialized);
  
  // Check if players table has any data
  const playerCount = await getAsync('SELECT COUNT(*) as count FROM players');
  const hasPlayers = playerCount?.count > 0;
  
  console.log('Players in database:', playerCount?.count);
  
  // If no players in database, load from CSV
  if (!hasPlayers) {
    console.log('Players table is empty. Loading from CSV...');
    try {
      const players = await loadPlayersFromCsv();
      await saveState({ all_players: players, teamsData: defaultTeamsData });
      return await loadAppState(); // Recursively load the newly saved state
    } catch (error) {
      console.error('Failed to load from CSV:', error);
      return { initialized: false };
    }
  }

  const players = (await allAsync('SELECT * FROM players ORDER BY id')).map(rowToPlayer);
  const teams = (await allAsync('SELECT * FROM teams ORDER BY id')).map(rowToTeam);
  const soldPlayers = players.filter((player) => player.sold);

  const teamsData = teams.map((team) => ({
    ...team,
    players: players.filter((player) => player.team_name === team.name),
  }));

  return {
    initialized: true,
    all_players: players,
    soldPlayers,
    teamsData,
  };
};


const initializeAppState = async ({ loadFromServer = false, all_players = [], teamsData = [] } = {}) => {
    console.log('Initializing application state with loadFromServer:', loadFromServer);
  if (loadFromServer) {
    const players = await loadPlayersFromCsv();
    await saveState({ all_players: players, teamsData: defaultTeamsData });
    return await loadAppState();
  }

  await saveState({ all_players, teamsData });
  return await loadAppState();
};

app.use(express.json());

app.get('/', (req, res) => {
  res.send('SQL Auction Server is running');
});

app.get('/hoobby', (req, res) => {
  res.send(toString(teamsData));
});

// HTTP REST endpoints for state management
app.get('/api/auction-state', async (req, res) => {
  try {
    const state = await loadAppState();
    res.json(state);
  } catch (error) {
    console.error('loadAuctionState error:', error);
    res.status(500).json({ initialized: false, error: error.message });
  }
});

app.post('/api/auction-state/initialize', async (req, res) => {
  try {
    const state = await initializeAppState(req.body);
    res.json(state);
  } catch (error) {
    console.error('initializeAuctionState error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auction-state/save', async (req, res) => {
  try {
    await saveState(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('saveAuctionState error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/players/sell', async (req, res) => {
  console.log('Received sellPlayer request with body:', req.body);
  try {
    const { photo, team_id, team_name, team_logo, sale_price } = req.body;
    if (!photo) {
      return res.status(400).json({ error: 'Player photo identifier is required' });
    }

    await runAsync(
      `UPDATE players SET sold = 1, team_id = ?, team_name = ?, team_logo = ?, sale_price = ? WHERE Photo = ?`,
      [team_id || null, team_name || null, team_logo || null, sale_price || null, photo]
    );

    const updatedPlayer = await getAsync('SELECT * FROM players WHERE Photo = ?', [photo]);
    res.json(rowToPlayer(updatedPlayer));
  } catch (error) {
    console.error('sellPlayer error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/players/unsell', async (req, res) => {
  try {
    const { photo } = req.body;
    if (!photo) {
      return res.status(400).json({ error: 'Player photo identifier is required' });
    }

    await runAsync(
      `UPDATE players SET sold = 0, team_id = NULL, team_name = NULL, team_logo = NULL, sale_price = NULL WHERE Photo = ?`,
      [photo]
    );

    const updatedPlayer = await getAsync('SELECT * FROM players WHERE Photo = ?', [photo]);
    res.json(rowToPlayer(updatedPlayer));
  } catch (error) {
    console.error('unsellPlayer error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Socket.io for real-time team data broadcasts
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('teamdata', (data) => {
    // Broadcast team data updates to all connected clients
    socket.broadcast.emit('teamdata', data);
  });

  socket.on('message', (msg) => {
    socket.broadcast.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

initDb()
  .then(async () => {
    // Check and load players from CSV if table is empty
    await loadAppState();
    
    server.listen(5001, () => {
      console.log('SQL Auction Server running on port 5001');
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
