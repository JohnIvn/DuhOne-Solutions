
export const handleUserRegistration = (socket, userId) => {
    console.log(`User registered with ID: ${userId}`);
    socket.join(userId); 
  };
  
  export const handleAdminMessage = (io, socket, { userId, message }) => {
    console.log(`Admin sent message to User ${userId}: ${message}`);
    io.to(userId).emit("message", { message }); 
  };
  
  export const handleSocketDisconnect = (socket) => {
    console.log(`Socket disconnected: ${socket.id}`);
    
  };
  
  export const handleReconnection = (socket) => {
    console.log(`Socket reconnected: ${socket.id}`);
  };
  
