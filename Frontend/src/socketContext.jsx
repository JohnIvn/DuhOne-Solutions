import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Create a Context to store socket instance
const SocketContext = createContext();

// SocketProvider component to manage socket connection and provide it to the rest of the app
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // To track connection status

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket'], // Optional: To enforce websocket as transport protocol
    });

    setSocket(newSocket);

    // Handle socket events
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to Socket.IO server');
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('Disconnected:', reason);
    });

    // Optionally handle incoming messages
    newSocket.on('message', (data) => {
      console.log('Message from server:', data);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
      setIsConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to access socket and connection status in any component
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
