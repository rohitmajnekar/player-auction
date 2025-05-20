// src/lib/stores/socket.ts
import { io } from "socket.io-client";
export const socket = io("http://192.168.31.79:5000");
