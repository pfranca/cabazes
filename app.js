const createError = require('http-errors');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const personsRouter = require('./routes/person');
const foodRouter = require('./routes/food');
const deliveriesRouter = require('./routes/deliveries');
const familiesRouter = require('./routes/families');
const helpers = require('./public/js/helpers');
// const mapsRouter = require('./routes/map');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: helpers.helpers,
}));
app.set('view engine', 'handlebars');


app.use(logger('dev'));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  key: 'user_sid',
  secret: 'wtfis_this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,
  },
}));
app.use(flash());

// Verifica se o cookie está guardado no browser e se o utilizador não está definido
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

// Regista mensagens
app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  res.locals.user = req.session.user;
  delete req.session.sessionFlash;
  next();
});


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/persons', personsRouter);
app.use('/food', foodRouter);
app.use('/families', familiesRouter);
app.use('/deliveries', deliveriesRouter);
// app.use('/map', mapsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
