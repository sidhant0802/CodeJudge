const { Server } = require('socket.io');
const battleSocket = require('./battleSocket');
const Message = require('../models/Message');

let io;
const onlineUsers = new Map(); // userhandle -> socket.id

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['polling', 'websocket'], // ← Force polling first
    pingTimeout: 60000,
    pingInterval: 25000,
  });
  // ... rest stays the same

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    // ── Register User ──
    socket.on('register', (userhandle) => {
      if (!userhandle) return;
      onlineUsers.set(userhandle, socket.id);
      console.log(`✅ ${userhandle} registered`);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });

    // ── Send Message ──
    socket.on('sendMessage', async (data) => {
      console.log('📨 [SEND] Payload:', data);
      try {
        const { sender, receiver, content } = data;
        if (!sender || !receiver || !content?.trim()) return;

        const message = await Message.create({ sender, receiver, content: content.trim() });
        const msgData = message.toObject();

        const receiverSocketId = onlineUsers.get(receiver);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', msgData);
          const unread = await Message.countDocuments({ receiver, isRead: false });
          io.to(receiverSocketId).emit('unreadCount', unread);
          console.log(`📤 Delivered to ${receiver}`);
        } else {
          console.log(`⚠️ ${receiver} offline. Message saved to DB.`);
        }

        socket.emit('messageSent', msgData);
      } catch (err) {
        console.error('❌ sendMessage error:', err);
        socket.emit('messageError', { error: 'Send failed' });
      }
    });

    // ── Typing ──
    socket.on('typing', ({ sender, receiver }) => {
      const rid = onlineUsers.get(receiver);
      if (rid) io.to(rid).emit('userTyping', { sender });
    });

    socket.on('stopTyping', ({ sender, receiver }) => {
      const rid = onlineUsers.get(receiver);
      if (rid) io.to(rid).emit('userStopTyping', { sender });
    });

    // ── Mark Read ──
    socket.on('markRead', async ({ currentUser, sender }) => {
      await Message.updateMany({ sender, receiver: currentUser, isRead: false }, { $set: { isRead: true } });
      const rid = onlineUsers.get(sender);
      if (rid) io.to(rid).emit('messagesRead', { reader: currentUser });
      const unread = await Message.countDocuments({ receiver: currentUser, isRead: false });
      socket.emit('unreadCount', unread);
    });

    // ── Unread Count ──
    socket.on('getUnreadCount', async (userhandle) => {
      const count = await Message.countDocuments({ receiver: userhandle, isRead: false });
      socket.emit('unreadCount', count);
    });

    // ── Disconnect ──
    socket.on('disconnect', () => {
      for (const [handle, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(handle);
          console.log(`❌ ${handle} disconnected`);
          break;
        }
      }
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });

    battleSocket(io, socket);
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initSocket, getIO };