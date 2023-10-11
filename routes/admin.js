const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth')
const adminController = require('../controllers/admin')
const { body } = require('express-validator')

router.get('/create-post', isAuth, adminController.getCreatePost)
router.post('/create-post', [body('title', "Please enter a longer title").isLength({ min: 2 }),
body('content', 'Content need to be longer').trim().isLength({ min: 10 })], isAuth, adminController.postCreatePost)
router.get('/my-posts', isAuth, adminController.getPosts)
router.get('/edit-post/:postId', isAuth, adminController.getEditPost)
router.post('/edit-post', [body('title', "Please enter a longer title").isLength({ min: 2 }),
body('content', 'Content need to be longer').trim().isLength({ min: 10 })], isAuth, adminController.postEditPost)
router.post('/delete-post/:postId', isAuth, adminController.deletePost)
module.exports = router