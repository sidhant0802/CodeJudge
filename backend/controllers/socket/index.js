// backend/socket/index.js
const { Server } = require('socket.io');
const battleSocket = require('./battleSocket');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Battle socket handlers
    battleSocket(io, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };