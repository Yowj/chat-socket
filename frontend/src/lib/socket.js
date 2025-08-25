import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: false,
});