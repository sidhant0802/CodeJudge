const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/Compiler/CompilerController.js');
const auth = require('../middleware/auth.js');
// router.get('/a', exampleController.a);
router.get('/b',auth(["admin"]), exampleController.b);
// router.post('/run',auth(["admin","user"]), exampleController.run);
router.post('/run',   exampleController.run); 
router.post('/submit',auth(["admin","user"]), exampleController.submit);


module.exports = router;