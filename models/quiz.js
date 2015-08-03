// Definicion del modelo de Quiz con validaciones
/* Define la estructura de la tabla de quizes (preguntas) con 2 campos(tipo string)
y que ambos tendrán una validación de not null asociada*/
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',
    { pregunta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Pregunta"}}
      },
      respuesta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Respuesta"}}
      },
        tema: {
          type: DataTypes.STRING,
          validate: { notEmpty: {msg: "-> Falta Tema"}}
      }
    }
  );
}
