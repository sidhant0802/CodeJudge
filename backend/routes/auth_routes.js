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

router.put('/updateAdmin/:id',auth(["admin"]),exampleController.updateAdmin);
router.put('/update/:id',auth(["admin","user"]),exampleController.update);

router.delete('/delete/:id',auth(["admin"]),exampleController.delete);
router.get('/logout', exampleController.logout);
router.post('/upload/:id',auth(["admin","user"]), uploadimg.single('file'),exampleController.upload);
router.delete('/removeImg/:id',auth(["admin","user"]),exampleController.removeImg);
router.post('/forgotPassword', exampleController.forgotPassword);
router.post('/verifyOTP', exampleController.verifyOTP);
router.put('/changePassword',exampleController.changePassword);
router.post('/createAdmin/:id',auth(["admin"]),exampleController.createAdmin);
router.post('/friendToggle/:id',auth(["admin","user"]),exampleController.friendToggle);
router.get('/myFriends',auth(["admin","user"]),exampleController.myFriends);

module.exports = router;