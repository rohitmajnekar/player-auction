const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'auction.db');
const db = new sqlite3.Database(dbPath);

const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const main = async () => {
  try {
    console.log('=== PLAYERS TABLE ===');
    const players = await runQuery('SELECT * FROM players LIMIT 10');
    console.table(players);

    console.log('\n=== TEAMS TABLE ===');
    const teams = await runQuery('SELECT * FROM teams');
    console.table(teams);

    console.log('\n=== SOLD PLAYERS ===');
    const soldPlayers = await runQuery('SELECT * FROM players WHERE sold = 1');
    console.table(soldPlayers);

    console.log('\n=== META TABLE ===');
    const meta = await runQuery('SELECT * FROM meta');
    console.table(meta);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    db.close();
  }
};

main();