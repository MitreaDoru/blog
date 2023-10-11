const Post = require('../models/post')
const { validationResult } = require('express-validator')


exports.getCreatePost = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('blogs/create-post', { pageTitle: "Create Post", path: '/create-post', errorMessage: message, oldInput: { title: '', content: '' } })
}
exports.postCreatePost = async (req, res, next) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).render('blogs/create-post', { pageTitle: "Create Post", path: '/create-post', errorMessage: errors.array()[0].msg, oldInput: { title: title, content: content } })
        }
        const post = new Post({ title: title, content: content, userId: req.user._id });
        const createdPost = await post.save()
        req.user.posts.push(createdPost);
        await req.user.save()
        return res.redirect('/')
    } catch {
        const error = new Error('Something went wrong with creating the post')
        error.httpStatusCode = 500;
        return next(error)
    }

}
exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ userId: req.user._id })
        res.render('blogs/my-posts', { pageTitle: "My Posts", posts: posts })
    } catch {
        const error = new Error('Something went wrong with getting the posts')
        error.httpStatusCode = 500;
        return next(error)
    }
}
exports.getEditPost = (req, res, next) => {
    const postId = req.params.postId;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Post.findById(postId)
        .then(post => {
            if (!post) {
                res.redirect('/')
            }
            res.render('blogs/edit-post', { pageTitle: "Edit Post", path: '/edit-post', errorMessage: message, oldInput: { title: post.title, content: post.content }, post: post })
        })
        .catch(err => {
            const error = new Error('Something went wrong with getting the post')
            error.httpStatusCode = 500;
            return next(error)
        }
        )
}

exports.postEditPost = (req, res, next) => {
    const postId = req.body.postId
    const updatedTitle = req.body.title;
    const updatedContent = req.body.content;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('blogs/edit-post', { pageTitle: "Edit Post", path: '/edit-post', errorMessage: errors.array()[0].msg, oldInput: { title: updatedTitle, content: updatedContent }, post: { _id: postId } })
    }
    Post.findById(postId)
        .then(post => {
            if (post.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            post.title = updatedTitle;
            post.content = updatedContent;
            return post.save().then(result => res.redirect('/my-posts'))
        })
        .catch(err => {
            const error = new Error('Something went wrong when you update the post')
            error.httpStatusCode = 500;
            return next(error)
        })
}


exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        await Post.deleteOne({ _id: postId, userId: req.user._id })
        const updatedPostsIds = await req.user.posts.filter(id => id.toString() !== postId.toString())
        req.user.posts = updatedPostsIds
        await req.user.save()
        return res.redirect('/my-posts')
    } catch {
        const error = new Error('Something went wrong when you tried to delete the post')
        error.httpStatusCode = 500;
        return next(error)
    }
}