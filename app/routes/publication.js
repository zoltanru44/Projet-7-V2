const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/publication');

router.post('/addPost', userCtrl.addPost);
router.post('/addComment', userCtrl.addComment);
router.put('/updatePost', userCtrl.updatePost);
router.put('/updateComment', userCtrl.updateComment);
router.get('/getPosts', userCtrl.getPosts);
router.get('/getComments', userCtrl.getComments);
router.delete('/deletePost', userCtrl.deletePost);
router.delete('/deleteComment', userCtrl.deleteComment);

module.exports = router;