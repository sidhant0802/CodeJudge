const { Server } = require('socket.io');
const battleSocket = require('./battleSocket');
const Message = require('../models/Message');

let io;
const onlineUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [                           // ✅ NO wildcard *
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        process.env.FRONTEND_URL,
        process.env.INSTANCE_IP,
      ].filter(Boolean),                  // ✅ removes undefined
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['polling', 'websocket'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    // ── Register ──
    socket.on('register', (userhandle) => {
      if (!userhandle) return;
      const cleanHandle = userhandle.trim();
      onlineUsers.set(cleanHandle, socket.id);
      console.log(`✅ ${cleanHandle} registered → ${socket.id}`);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });

    // ── Send Message ──
    socket.on('sendMessage', async (data) => {
      console.log('📨 [SEND] Payload:', data);
      try {
        const { sender, receiver, content } = data;
        if (!sender || !receiver || !content?.trim()) return;

        const message = await Message.create({
          sender,
          receiver,
          content: content.trim(),
        });
        const msgData = message.toObject();

        const receiverSocketId = onlineUsers.get(receiver.trim());
        console.log(`🔍 Lookup receiver "${receiver}" → ${receiverSocketId || '❌ NOT FOUND'}`);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', msgData);
          const unread = await Message.countDocuments({ receiver, isRead: false });
          io.to(receiverSocketId).emit('unreadCount', unread);
        }

        socket.emit('messageSent', msgData); // ✅ always confirm to sender
      } catch (err) {
        console.error('❌ sendMessage error:', err);
        socket.emit('messageError', { error: 'Send failed' });
      }
    });

    // ── Typing ──
    socket.on('typing', ({ sender, receiver }) => {
      const rid = onlineUsers.get(receiver.trim());
      if (rid) io.to(rid).emit('userTyping', { sender });
    });

    socket.on('stopTyping', ({ sender, receiver }) => {
      const rid = onlineUsers.get(receiver.trim());
      if (rid) io.to(rid).emit('userStopTyping', { sender });
    });

    // ── Mark Read ──
    socket.on('markRead', async ({ currentUser, sender }) => {
      try {
        await Message.updateMany(
          { sender, receiver: currentUser, isRead: false },
          { $set: { isRead: true } }
        );
        const rid = onlineUsers.get(sender.trim());
        if (rid) io.to(rid).emit('messagesRead', { reader: currentUser });
        const unread = await Message.countDocuments({ receiver: currentUser, isRead: false });
        socket.emit('unreadCount', unread);
      } catch (err) {
        console.error('markRead error:', err);
      }
    });

    // ── Unread Count ──
    socket.on('getUnreadCount', async (userhandle) => {
      try {
        const count = await Message.countDocuments({
          receiver: userhandle.trim(),
          isRead: false,
        });
        socket.emit('unreadCount', count);
      } catch (err) {
        console.error('getUnreadCount error:', err);
      }
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

    // ── Battle Socket ──
    battleSocket(io, socket);
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initSocket, getIO };