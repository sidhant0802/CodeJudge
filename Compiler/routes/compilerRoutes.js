const express = require('express');
const router = express.Router();
const exampleController = require('../CompilerController.js');
// router.get('/a', exampleController.a);
router.get('/b', exampleController.b);
router.post('/run', exampleController.run);
router.post('/submit', exampleController.submit);


module.exports = router;