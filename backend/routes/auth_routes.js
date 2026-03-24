const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/AuthController.js');
const auth = require('../middleware/auth.js');
const uploadimg=require('../middleware/uploadimg.js');
router.get('/a', exampleController.a);
router.get('/b', exampleController.b);
router.post('/register', exampleController.register);
router.post('/login', exampleController.login);
router.get('/read/:id',exampleController.read);
router.get('/readAll',exampleController.readAll);

module.exports = router;