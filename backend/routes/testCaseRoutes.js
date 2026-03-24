const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/testController.js');
const auth = require('../middleware/auth.js');

// router.get('/a', exampleController.a);


// router.post('/login', exampleController.login);
module.exports = router;