var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//port 8000
const PORT = process.env.PORT || 8000;

var app = express();

const server = app.listen(PORT, () => {
  //log the current path
  console.log(`Working Directory: ${process.cwd()}`);
  //log the current running family
  console.log(`Server running on: ${server.address().family}`);
  //log the current running ip
  console.log(`Server running on ip: ${server.address().address}`);
  //log the port
  console.log(`Server running on port: ${server.address().port}`);
});

//middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/find', require('./routes/FindRouter.js'));
app.use('/create', require('./routes/CreateRouter.js'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
});

module.exports = app;
