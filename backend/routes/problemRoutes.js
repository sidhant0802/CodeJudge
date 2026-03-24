const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/ProblemController.js');
const auth = require('../middleware/auth.js');
// router.get('/a', exampleController.a);
router.get('/b',auth(["admin"]), exampleController.b);
router.post('/create',auth(["admin"]), exampleController.create);
// router.get('/read/:id',auth(["admin","user"]), exampleController.read);
router.get('/read/:id',  exampleController.read);
// router.get('/readall',auth(["admin","user"]), exampleController.readall);
router.get('/readall',   exampleController.readall);
router.put('/update/:id',auth(["admin"]), exampleController.update);
router.delete('/delete/:id',auth(["admin"]),exampleController.delete);


// router.post('/login', exampleController.login);
module.exports = router;