// middleware/socketEvents.js

export const handleUserRegistration = (socket, userId) => {
    console.log(`User registered with ID: ${userId}`);
    socket.join(userId); // Join user to their specific room
  };
  
  export const handleAdminMessage = (io, socket, { userId, message }) => {
    console.log(`Admin sent message to User ${userId}: ${message}`);
    io.to(userId).emit("message", { message }); // Send message to the specific user
  };
  
  export const handleSocketDisconnect = (socket) => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Cleanup logic if needed, like removing the user from specific rooms
  };
  
  export const handleReconnection = (socket) => {
    console.log(`Socket reconnected: ${socket.id}`);
  };
  
