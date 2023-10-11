const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', { pageTitle: "Signup", path: "/signup", errorMessage: message, oldInput: { name: '', email: '', password: '', confirmPassword: '' } })
}

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', { pageTitle: "Signup", path: '/signup', errorMessage: errors.array()[0].msg, oldInput: { name: name, email: email, password: password, confirmPassword: confirmPassword } })
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({ name: name, email: email, password: hashedPassword });
            return user.save()
        })
        .then(result => res.redirect('/login'))
        .catch(err => {
            const error = new Error('Something went wrong with creating the account')
            error.httpStatusCode = 500;
            return next(error)
        })

}
exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', { pageTitle: "Login", path: '/login', errorMessage: message, oldInput: { email: '', password: '' } })
}
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', { pageTitle: 'Login', path: 'login', errorMessage: errors.array()[0].msg, oldInput: { email: email, password: password } })
    }
    return res.redirect('/')
}
exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect('/')
    })
}
