//----[1] IMPORTAR PAQUETES CON MIDDLEWARES
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials'); //importar la factoria express-partials
var methodOverride = require('method-override');
var session = require('express-session');



//---- [2] IMPORTAR ENRUTADORES
var routes = require('./routes/index');


//---- [3] CREAR APLICACIÓN
var app = express();


//---- [4] INSTALAR/CONFIGURAR EL GENARADOR DE VISTAS.
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(partials()); //instalar la factoria express-partials en app
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());  //---[6] INSTALAR MIDDLEWARES
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));//añadir semilla ‘Quiz 2015’ para cifrar cookie
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
// Helpers dinamicos:
app.use(function(req, res, next) {

  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;

  //Controlamos si se ha sobrepasado el tiempo de sesión de 2 minutos
  if (req.session.startTime ){
      console.log("Comprobamos tiempo de sesión");
      var lastTime = new Date().getTime();
      console.log("lasTime: " + lastTime.toString());
      var intervalo = lastTime - req.session.startTime;
      console.log("intervalo: " + intervalo.toString() );
      if ( intervalo > (2 * 60 * 1000) ) {
         delete req.session.startTime;
         req.session.autoLogout = true;
         res.redirect("/logout");
      }else{
        //Si el usuario está inactivo, y pasan los dos minutos, no llegará
        //aquí
        req.session.startTime = lastTime.
      }
  }
  next();
});

//----[7]  INSTALAR ENRUTADORES: Asociar rutas a sus gestores.
//----[7.1]
app.use('/', routes);

//----[7.2] resto de rutas: genera error 404 de HTTP
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


//----[7.3] gestión de errores
// error handlers
//----[7.3.1] gestión de errores durante el desarrollo
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err, // print err
            errors: []
        });
    });
}

//----[7.3.2] gestión de errores de producción
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},  //don't print err (empty object)
        errors: []
    });
});

//----[8] exportar app para comando de arranque
module.exports = app;
