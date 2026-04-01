var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql2');

//sql connecttion
const connection = mysql.createConnection({
  host: '138.49.184.123',
  port: 3306,
  user: 'matthai9755',
  password: 'tN2Smzvv!fnfJEBFS',
  database: 'Chinook'
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the SQL database!');
});

var app = express();

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/',sqlRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
