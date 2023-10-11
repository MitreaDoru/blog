const Post = require('../models/post')

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.render('blogs/blogs', { pageTitle: "Home", posts: posts })
    } catch {
        const error = new Error('Something went wrong when you tried to see all posts')
        error.httpStatusCode = 500;
        return next(error)
    }
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            res.render('blogs/view-post', { pageTitle: "View", path: 'view', post: post })
        })
        .catch(err => {
            const error = new Error('Something went wrong when you tried to view the post')
            error.httpStatusCode = 500;
            return next(error)
        })
}
exports.postGetLikes = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId)
        if (!post) {
            res.redirect('/')
        }
        const userPostLikeId = post.likesId.find(id => id.toString() === req.user._id.toString())
        if (userPostLikeId) {
            const updatedLikesIds = post.likesId.filter(id => id.toString() !== req.user._id.toString())
            post.likesId = updatedLikesIds
        } else {
            post.likesId.push(req.user._id)
        }
        await post.save()
        return res.json({ postLikesId: post.likesId.length })

    } catch {
        const error = new Error('Something went wrong when updating the likes')
        error.httpStatusCode = 500;
        return next(error)
    }
}