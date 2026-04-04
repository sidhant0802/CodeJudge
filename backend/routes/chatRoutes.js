const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// GET /api/chat/conversations?currentUser=xxx
router.get('/conversations', chatController.getConversations);

// GET /api/chat/unread?currentUser=xxx
router.get('/unread', chatController.getUnreadCount);

// GET /api/chat/:userhandle?currentUser=xxx&page=1&limit=50
router.get('/:userhandle', chatController.getConversation);

// POST /api/chat/send
router.post('/send', chatController.sendMessage);

// POST /api/chat/read
router.post('/read', chatController.markAsRead);

module.exports = router;