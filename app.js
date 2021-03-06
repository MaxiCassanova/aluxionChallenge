const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const connect = require('./src/db/index');
require('dotenv').config()

const indexRouter = require('./src/routes/index');

const app = express();
connect();
app.use(cors())


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send({message: err.message});
});

module.exports = app;
