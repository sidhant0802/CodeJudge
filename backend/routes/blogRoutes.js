// backend/routes/blogRoutes.js
const express = require('express');
const router  = express.Router();
const blogController = require('../controllers/BlogController');
const auth    = require('../middleware/auth');

// Public routes (no auth needed)
router.get('/readall',            blogController.readAll);
router.get('/read/:id',           blogController.read);
router.get('/byuser/:userhandle', blogController.byUser);

// Protected routes (user or admin)
router.post('/create',            auth(['user', 'admin']), blogController.create);
router.put('/update/:id',         auth(['user', 'admin']), blogController.update);
router.delete('/delete/:id',      auth(['user', 'admin']), blogController.delete);
router.put('/like/:id',           auth(['user', 'admin']), blogController.like);
router.put('/dislike/:id',        auth(['user', 'admin']), blogController.dislike);

module.exports = router;