// backend/routes/battleRoutes.js
const express = require('express');
const router = express.Router();
const battleController = require('../controllers/battleController');
const auth = require('../middleware/auth');

router.post('/create', auth(['admin', 'user']), battleController.createRoom);
router.post('/join',   auth(['admin', 'user']), battleController.joinRoom);

module.exports = router;