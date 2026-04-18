// backend/routes/battleRoutes.js
const express = require('express');
const router = express.Router();
const battleController = require('../controllers/battleController');
const auth = require('../middleware/auth');

// ✅ Protected routes (need login)
router.post('/create', auth(['admin', 'user']), battleController.createRoom);
router.post('/join',   auth(['admin', 'user']), battleController.joinRoom);

// ✅ Public routes (no login needed)
router.get('/room/:roomId',        battleController.getRoomDetails);
router.get('/active-rooms',        battleController.getActiveRooms);
router.get('/history/:userhandle', battleController.getBattleHistory);

module.exports = router;