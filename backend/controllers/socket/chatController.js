const Message = require('../models/Message');
const User = require('../models/User');

// Helper: safely get current user handle from auth, query, or body
const getCurrentUser = (req) => {
  return req.user?.userhandle || req.query.currentUser || req.body.sender;
};

// Send a message (REST fallback — mainly done via socket)
exports.sendMessage = async (req, res) => {
  try {
    const sender = getCurrentUser(req);
    const { receiver, content } = req.body;

    if (!sender) return res.status(401).json({ error: 'Not authenticated' });
    if (!receiver || !content?.trim()) {
      return res.status(400).json({ error: 'Receiver and content required' });
    }
    if (sender === receiver) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    const receiverUser = await User.findOne({ userhandle: receiver });
    if (!receiverUser) return res.status(404).json({ error: 'User not found' });

    const message = await Message.create({
      sender,
      receiver,
      content: content.trim(),
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const currentUser = getCurrentUser(req);
    const { userhandle } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!currentUser) return res.status(401).json({ error: 'Not authenticated' });
    if (!userhandle) return res.status(400).json({ error: 'Userhandle required' });

    const messages = await Message.find({
      $or: [
        { sender: currentUser, receiver: userhandle },
        { sender: userhandle, receiver: currentUser },
      ],
    })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Mark unread messages from the other user as read
    await Message.updateMany(
      { sender: userhandle, receiver: currentUser, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages.reverse());
  } catch (err) {
    console.error('getConversation error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all conversations (chat list)
exports.getConversations = async (req, res) => {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) return res.status(401).json({ error: 'Not authenticated' });

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUser }, { receiver: currentUser }],
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $addFields: {
          otherUser: {
            $cond: [{ $eq: ['$sender', currentUser] }, '$receiver', '$sender'],
          },
        },
      },
      {
        $group: {
          _id: '$otherUser',
          lastMessage: { $first: '$content' },
          lastTimestamp: { $first: '$timestamp' },
          lastSender: { $first: '$sender' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', currentUser] }, { $eq: ['$isRead', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastTimestamp: -1 } },
    ]);

    const userhandles = messages.map((m) => m._id);
    const users = await User.find(
      { userhandle: { $in: userhandles } },
      'userhandle firstName lastName imgPath rating badge'
    ).lean();

    const userMap = {};
    users.forEach((u) => { userMap[u.userhandle] = u; });

    const conversations = messages.map((m) => ({
      userhandle: m._id,
      userInfo: userMap[m._id] || { userhandle: m._id },
      lastMessage: {
        content: m.lastMessage,
        timestamp: m.lastTimestamp,
        sender: m.lastSender,
      },
      unreadCount: m.unreadCount,
    }));

    res.json(conversations);
  } catch (err) {
    console.error('getConversations error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get total unread count (for navbar badge)
exports.getUnreadCount = async (req, res) => {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) return res.status(401).json({ error: 'Not authenticated' });

    const count = await Message.countDocuments({
      receiver: currentUser,
      isRead: false,
    });

    res.json({ unreadCount: count });
  } catch (err) {
    console.error('getUnreadCount error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const currentUser = getCurrentUser(req);
    const { sender } = req.body || req.params;

    if (!currentUser) return res.status(401).json({ error: 'Not authenticated' });
    if (!sender) return res.status(400).json({ error: 'Sender required' });

    await Message.updateMany(
      { sender, receiver: currentUser, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (err) {
    console.error('markAsRead error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};