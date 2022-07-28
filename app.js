var createError = require('http-errors');
require('dotenv').config()
var express = require('express');
const session = require('express-session');







var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');


var indexRouter = require('./routes/user/index');
var loginRouter = require('./routes/user/login');
let adminRouter = require('./routes/admin/adminlog')



hbs.registerPartials(__dirname+'/views/partials')
hbs.registerHelper({plus:(value)=>{
  return Number(value) + 1
  
}})

hbs.registerHelper({null:(value)=>{
  return value=="cart"?true:false
  
}})
hbs.registerHelper('payed',function(value) {
  return value=='paid'
})



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(
  session({

      // It holds the secret key for session
      secret: "0001",

      // Forces the session to be saved
      // back to the session store
      resave: true,

      // Forces a session that is "uninitialized"
      // to be saved to the store
      saveUninitialized: false,
      cookie: {

          // Session expires after 1 min of inactivity.
          expires: 30000
      }
  })
);
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use('/public/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/admin',adminRouter);




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
