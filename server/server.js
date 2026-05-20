const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
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
        'http://192.168.0.112:3000',
        'http://192.168.0.112:5173'
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('message', (msg) => {
    console.log('Message from client:', msg);
    socket.broadcast.emit('message', msg);
  });

  socket.on('bid', (data) => {
    console.log('Bid event from client:', data);
    socket.broadcast.emit('bid', data);
  });
  socket.on('teamdata', (data) => {
    console.log('Team data from client');
    socket.broadcast.emit('teamdata', data);
  });

  socket.on('selectedTeams', (data) => {
    console.log('Selected teams from client:', data);
    socket.broadcast.emit('selectedTeams', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
