const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/updateUser', auth, userCtrl.updateUser);
router.get('/getUser', userCtrl.getUser);
router.delete('/deleteUser', userCtrl.deleteUser);

module.exports = router;