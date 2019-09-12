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

/**
 * Module dependencies.
 */

var debug = require('debug')('myapp:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


module.exports = app;
