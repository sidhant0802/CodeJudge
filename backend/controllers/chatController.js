const Message = require('../models/Message');
const User = require('../models/User');

// Send a message (REST fallback, mainly use socket)
exports.sendMessage = async (req, res) => {
  try {
    const sender = req.user?.userhandle || req.body.sender;
    const { receiver, content } = req.body;

    if (!sender || !receiver || !content) {
      return res.status(400).json({ error: 'sender, receiver, and content are required' });
    }

    if (sender === receiver) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    // Check receiver exists
    const receiverUser = await User.findOne({ userhandle: receiver });
    if (!receiverUser) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const message = await Message.create({
      sender,
      receiver,
      content: content.trim(),
    });

    return res.status(201).json(message);
  } catch (err) {
    console.error('sendMessage error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const currentUser = req.user?.userhandle || req.query.currentUser;
    const { userhandle } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    if (!currentUser || !userhandle) {
      return res.status(400).json({ error: 'Both users are required' });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUser, receiver: userhandle },
        { sender: userhandle, receiver: currentUser },
      ],
    })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Mark unread messages from the other user as read
    await Message.updateMany(
      { sender: userhandle, receiver: currentUser, isRead: false },
      { $set: { isRead: true } }
    );

    return res.json(messages.reverse());
  } catch (err) {
    console.error('getConversation error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get all conversations list (recent chats)
exports.getConversations = async (req, res) => {
  try {
    const currentUser = req.user?.userhandle || req.query.currentUser;

    if (!currentUser) {
      return res.status(400).json({ error: 'currentUser is required' });
    }

    // Get all unique users this person has chatted with
    const sent = await Message.distinct('receiver', { sender: currentUser });
    const received = await Message.distinct('sender', { receiver: currentUser });
    const allUsers = [...new Set([...sent, ...received])];

    // For each user, get last message and unread count
    const conversations = await Promise.all(
      allUsers.map(async (userhandle) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUser, receiver: userhandle },
            { sender: userhandle, receiver: currentUser },
          ],
        })
          .sort({ timestamp: -1 })
          .lean();

        const unreadCount = await Message.countDocuments({
          sender: userhandle,
          receiver: currentUser,
          isRead: false,
        });

        // Get user info
        const userInfo = await User.findOne(
          { userhandle },
          'userhandle firstName lastName imgPath rating badge'
        ).lean();

        return {
          userhandle,
          userInfo,
          lastMessage,
          unreadCount,
        };
      })
    );

    // Sort by last message time (most recent first)
    conversations.sort((a, b) => {
      const timeA = a.lastMessage?.timestamp || 0;
      const timeB = b.lastMessage?.timestamp || 0;
      return new Date(timeB) - new Date(timeA);
    });

    return res.json(conversations);
  } catch (err) {
    console.error('getConversations error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get total unread count (for navbar badge)
exports.getUnreadCount = async (req, res) => {
  try {
    const currentUser = req.user?.userhandle || req.query.currentUser;

    if (!currentUser) {
      return res.status(400).json({ error: 'currentUser is required' });
    }

    const unreadCount = await Message.countDocuments({
      receiver: currentUser,
      isRead: false,
    });

    return res.json({ unreadCount });
  } catch (err) {
    console.error('getUnreadCount error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const currentUser = req.user?.userhandle || req.body.currentUser;
    const { sender } = req.body;

    if (!currentUser || !sender) {
      return res.status(400).json({ error: 'currentUser and sender are required' });
    }

    await Message.updateMany(
      { sender, receiver: currentUser, isRead: false },
      { $set: { isRead: true } }
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('markAsRead error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};