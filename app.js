const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const querystring = require('querystring');
const session = require('express-session');
const config = require('./config');

const middleware = require('./middleware')

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const actionsRouter = require('./routes/actions');
const errorRouter = require('./routes/error');
const getRefreshToken = require("./routes/refreshAccessToken");
const { log } = require('console');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use session to store access tokens securely
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// unauthenticated routes
app.use('/error', errorRouter);
app.use('/login',loginRouter)

// authenticate

// authenticated routes
app.use('/',middleware.checkAuth,middleware.refreshToken, indexRouter);
app.use('/actions', actionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;