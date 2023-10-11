module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        console.log('login');
        res.redirect('/login')
    } else {
        next()

    }
}