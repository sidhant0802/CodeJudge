const express = require('express');
const router = express.Router();
const Controller1 = require('../controllers/ProblemExecutionController.js');
const Controller2=require('../controllers/Compiler/generateFile.js');
const Controller3= require('../controllers/Compiler/generateInputFile.js');
const Controller4=require('../controllers/Compiler/executeCpp.js');
const auth = require('../middleware/auth');
// router.get('/a', Controller1.a);
// router.get('/b',auth(["admin"]), Controller1.b);
router.post('/submitAll/:id',auth(["admin","user"]), Controller1.submitAll);
router.post('/generateFile',auth(["admin","user"]), Controller2.generateFile);
router.post('/generateInputFile',auth(["admin","user"]), Controller3.generateInputFile);
router.post('/executeCpp',auth(["admin","user"]), Controller3.executeCpp);
router.post('/executeCpp2',auth(["admin","user"]), Controller3.executeCpp2);


module.exports = router;