import { Server } from "socket.io"; 

 const configureSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", 
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("register", (userId) => {
      console.log(`User registered with ID: ${userId}`);
    });

    socket.on("adminMessage", ({ userId, message }) => {
      console.log(`Admin sent message to User ${userId}: ${message}`);
      io.to(userId).emit("message", { message });
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });

  });
};

export default configureSockets;
