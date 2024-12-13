import { Server } from "socket.io";
import {
  handleAdminMessage,
  handleReconnection,
  handleSocketDisconnect,
  handleUserRegistration
} from "./socketHandlers/socketEvents.js";

const configureSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("register", (userId) => {
      console.log(`User registered: ${userId}`);
      handleUserRegistration(socket, userId); 
    });

    socket.on("adminMessage", ({ userId, message }) => {
      console.log(`Admin message to User ${userId}: ${message}`);
      handleAdminMessage(socket, userId, message); 
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(`Reconnected: Attempt ${attemptNumber}`);
      handleReconnection(socket, attemptNumber);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
      handleSocketDisconnect(socket, reason);
    });
  });
};

export default configureSockets;
