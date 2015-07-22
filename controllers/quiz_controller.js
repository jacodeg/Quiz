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
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index', {quizes: quizes});
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
    models.Quiz.findAll({
      where: ["pregunta like ?", search]})
        .then(function(quizes){
            res.render('quizes/index', {quizes: quizes});
          }).catch(function(error) { next(error);})
  }

};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
