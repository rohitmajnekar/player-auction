// src/lib/stores/socket.ts
import { io } from "socket.io-client";
export const socket = io("http://192.168.0.112:5000");
