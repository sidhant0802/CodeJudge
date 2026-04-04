// backend/routes/commentRoutes.js
const express = require('express');
const router  = express.Router();
const commentController = require('../controllers/CommentController');
const auth    = require('../middleware/auth');

// Public routes
router.get('/byblog/:blogId', commentController.byBlog);

// Protected routes
router.post('/create',       auth(['user', 'admin']), commentController.create);
router.delete('/delete/:id', auth(['user', 'admin']), commentController.delete);

module.exports = router;