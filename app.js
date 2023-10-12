const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const csrf = require('csurf');
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')
const User = require('./models/user')
const blogRoutes = require('./routes/blog')
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')
const errorController = require('./controllers/error')
require('dotenv').config();
const csfrProtection = csrf()


const MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.SECRET
const app = express()
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.use(flash())
app.set('view engine', 'ejs');
app.set('views', 'views')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: SECRET, resave: false, saveUninitialized: false, store: store, cookie: { maxAge: 3600000 } }))

app.use(csfrProtection)

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use((req, res, next) => {
    if (!req.session.cookie.expires)
        req.session.destroy((err) => {
            res.redirect('/');
        })
    next()
})

app.use((req, res, next) => {
    if (!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next()
            }
            req.user = user;
            next()
        })
        .catch(err => {
            next(new Error(err))
        })
})



app.use(blogRoutes)
app.use(authRoutes)
app.use(adminRoutes)
app.use(errorController.get404)
app.use((error, req, res, next) => {
    console.log(error);

    res.status(500).render('500', { pageTitle: "Database failed", path: '/500', isAuthenticated: req.session.isLoggedIn })
})
mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(3000)
    }).catch(err => console.log(err))