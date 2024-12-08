import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

// Create an Express app
const app = express();

// Create an HTTP server using Express app
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = new Server(server);

// Serve static files (optional)
app.use(express.static('public'));

// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for a message from the client
  socket.on('message', (data) => {
    console.log('Message from client:', data);
  });

  // Send a message to the client
  socket.emit('message', 'Welcome to the server!');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
