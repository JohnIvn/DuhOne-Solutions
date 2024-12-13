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

    // Handle user registration
    socket.on("register", (userId) => {
      console.log(`User registered: ${userId}`);
      handleUserRegistration(socket, userId); // Pass socket and userId to the handler
    });

    // Handle admin message
    socket.on("adminMessage", ({ userId, message }) => {
      console.log(`Admin message to User ${userId}: ${message}`);
      handleAdminMessage(socket, userId, message); // Pass necessary info
    });

    // Handle reconnection
    socket.on("reconnect", (attemptNumber) => {
      console.log(`Reconnected: Attempt ${attemptNumber}`);
      handleReconnection(socket, attemptNumber); // Handle reconnection logic
    });

    // Handle disconnect
    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
      handleSocketDisconnect(socket, reason); // Pass socket and reason
    });
  });
};

export default configureSockets;
