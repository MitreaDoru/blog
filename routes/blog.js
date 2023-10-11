const isAuth = require('../middleware/is-auth')
const blogController = require('../controllers/blog')
const express = require('express');
const router = express.Router();

router.get('/', blogController.getPosts)
router.get('/view-post/:postId', blogController.getPost)
router.get('/likes/:postId', isAuth, blogController.postGetLikes)
module.exports = router;