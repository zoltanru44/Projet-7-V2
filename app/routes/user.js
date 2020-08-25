const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/updateUser', userCtrl.updateUser);
router.get('/getUser', userCtrl.getUser);
router.delete('/deleteUser', userCtrl.deleteUser);

module.exports = router;