const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const { check, body } = require('express-validator')
const User = require('../models/user')
const authController = require('../controllers/auth')
const isAuth = require('../middleware/is-auth')

router.get('/signup', authController.getSignup)

router.post('/signup', [
    body('name', "Please enter a name").isLength({ min: 2 }),
    body('email').isEmail().withMessage('Please enter a valid email!').custom(async (value, { req }) => {
        const user = await User.findOne({ email: value })
        if (user) {
            throw new Error('This e - mail already exists!!!');
        }
    }),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters').isLength({ min: 5 }).isAlphanumeric().trim(),
    body('confirmPassword').trim().custom(async (value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password have to match')
        }
    })
], authController.postSignup)

router.get('/login', authController.getLogin)

router.post('/login', [
    body('password', 'Wrong password').isLength({ min: 5 }).isAlphanumeric().trim().custom(async (value, { req }) => {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                throw new Error("Can't find this email")
            }
            return bcrypt.compare(value, user.password).then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true
                    req.session.user = user
                    return req.session.save((err) => {
                        console.log('hehe');
                    })
                } else {
                    req.session.isLoggedIn = false
                    throw new Error('Wrong password')

                }
            })
        } catch {
            const error = new Error('Something went wrong when you tried to login')
            error.httpStatusCode = 500;
            return next(error)
        }
    })], authController.postLogin)

router.post('/logout', isAuth, authController.postLogout)
module.exports = router