const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Your Socket.IO server logic here...
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send list of players to the client
    // socket.emit('players', players);

    // Handle bid events from the client
    socket.on('bid', (data) => {
        console.log(data)
        // const { playerName, newPrice } = data;
        // const player = players.find(player => player.name === playerName);

        // if (player && newPrice > player.currentPrice) {
        //     player.currentPrice = newPrice;
        //     // Broadcast the updated player info to all clients
        //     io.emit('playerUpdate', player);
        // }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


server.listen(8080, () => {
    console.log('Socket.IO server running on port 8080');
});
