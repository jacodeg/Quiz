//Importamos ../models/models.js
var models = require ('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
//GET /quizes?search=texto_a_buscar
exports.index = function(req, res){

  if(!req.query.search){    // GET /quizes
    var condicion = {order : "pregunta ASC"};
    models.Quiz.findAll(condicion).then(function(quizes){
      res.render('quizes/index', {quizes: quizes, errors: []});
    }).catch(function(error) { next(error);})

  }else{ //GET /quizes?search=texto_a_buscar
    //Delimitamos el contenido antes y despues con %
    var search = '%' + req.query.search + '%';
    // Cambiamos los espacios por %
    search = search.replace(' ', '%');

    // Le pasamos a findAll un objeto con los parámetros de la búsqueda
    //Si finAll termina correctamente el metodo la promesa ejecuta el callback
    //que renderiza el resultado del a búsqueda, es decir, renderiza el
    //el array devuelto. En caso de ocurrir un error, se captura con .catch()
    // y ejecuta el callback encargado de gestionar el error.
    //http://docs.sequelizejs.com/en/latest/docs/querying/#operators
    //NOTA en las ref. dice que el operador se escribe con $like, sin embargo
    //me dar un error "Possibly unhandled ReferenceError: next is not defined"
    //cuando intenta construir la consulta sql. Sin $, funciona correctamente
    //Y me construye la URL
    var condicion= { where : { pregunta: {
                      like: search
                      }} ,
                  order : 'pregunta'};

    //var condicion = { where: ['pregunta LIKE ?', search],
                // order : 'pregunta ASC'};
    models.Quiz.findAll(condicion)
        .then(function(quizes){
            res.render('quizes/index', {quizes: quizes, errors: []});
          }).catch(function(error) { next(error);})
  }

};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};


// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  console.log ('export.create => Quiz[pregunta]=' + quiz.pregunta + 'Quiz[respuesta]=' + quiz.respuesta);
  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')})  // res.redirect: Redirección HTTP a lista de preguntas
      }
    }
  );
};


// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz
  console.log ('export.edit=> Quiz[pregunta]=' + quiz.pregunta + 'Quiz[respuesta]=' + quiz.respuesta);
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
<<<<<<< HEAD
  console.log ('export.update => Quiz[pregunta]=' + quiz.pregunta + 'Quiz[respuesta]=' + quiz.respuesta);
=======
  console.log ('export.update => Quiz[pregunta]=' + req.quiz.pregunta + 'Quiz[respuesta]=' + req.quiz.respuesta);
>>>>>>> Editar Preguntas
  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  );
};
