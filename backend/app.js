var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');
var authRouter = require('./src/routes/auth');
var imageRouter = require('./src/routes/image');
var courseRouter = require('./src/routes/courses');
var blockRouter = require('./src/routes/block');
var scoreRouter = require('./src/routes/score');
var mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const { swaggerJson } = require('./src/utils/swagger.utils');
require('dotenv').config();

const connectionString = process.env.MONGO_CON_STRING;
const host = connectionString.split('@')[1];

mongoose
  .connect(
    connectionString,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`MongoDB Connected at ${host}`))
  .catch(err => console.log(err));
console.log(mongoose.connection.readyState);
var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/swagger', swaggerUi.serve,swaggerUi.setup(swaggerJson));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/image', imageRouter);
app.use('/course',courseRouter);
app.use('/block',blockRouter);
app.use('/score',scoreRouter);
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
