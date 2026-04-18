const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/ProblemController.js');
const auth = require('../middleware/auth.js');

router.post('/create', auth(["admin"]), exampleController.create);
router.get('/read/:id', exampleController.read);
router.get('/readall', exampleController.readall);
router.put('/update/:id', auth(["admin"]), exampleController.update);
router.delete('/delete/:id', auth(["admin"]), exampleController.deleteProblem); 

module.exports = router;