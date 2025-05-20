// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
//   autoConnect: false, // Optional: manually connect when needed
});

export default socket;
