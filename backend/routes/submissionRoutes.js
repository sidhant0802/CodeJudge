// const express = require('express');
// const router = express.Router();
// const exampleController = require('../controllers/SubmissionController.js');
// const auth = require('../middleware/auth.js');

// // router.get('/a', exampleController.a);

// router.get('/b',auth(["admin","user"]), exampleController.b);
// router.post('/create', auth(["admin","user"]),exampleController.create);
// router.get('/readbyPID/:id',auth(["admin","user"]), exampleController.readbyPID);
// router.get('/readbyhandle', auth(["admin","user"]),exampleController.readbyhandle);
// router.get('/readbyhandle', auth(["admin","user"]),exampleController.readbyhandle);
// router.get('/read',auth(["admin","user"]),exampleController.read);
// router.delete('/delete/:id',auth(["admin"]),exampleController.delete);
// module.exports = router;
















// const express = require('express');
// const router = express.Router();
// const exampleController = require('../controllers/SubmissionController.js');
// const auth = require('../middleware/auth.js');

// // ✅ PUBLIC ROUTES (no login needed)
// router.get('/read', exampleController.read);
// router.get('/readbyPID/:id', exampleController.readbyPID);
// router.get('/readbyhandle', exampleController.readbyhandle);

// // 🔒 PROTECTED ROUTES (login required)
// router.post('/create', auth(["admin","user"]), exampleController.create);

// // 🔒 ADMIN ONLY
// router.delete('/delete/:id', auth(["admin"]), exampleController.delete);

// module.exports = router;



const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/SubmissionController.js');
const auth = require('../middleware/auth.js');

// ✅ PUBLIC
router.get('/read',          exampleController.read);
router.get('/readbyPID/:id', exampleController.readbyPID);


module.exports = router;