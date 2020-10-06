const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const userCtrl = require('../controllers/publication');

router.post('/addPost', auth, userCtrl.addPost);
router.post('/addComment', auth, userCtrl.addComment);
router.put('/updatePost', auth, userCtrl.updatePost);
router.put('/updateComment', auth, userCtrl.updateComment);
router.get('/getPosts', userCtrl.getPosts);
router.get('/getComments', userCtrl.getComments);
router.delete('/deletePost', auth, userCtrl.deletePost);
router.delete('/deleteComment', auth, userCtrl.deleteComment);

module.exports = router;