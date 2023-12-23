const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const fechaSchema = Schema({
  fecha: {
    type: Date,
    required: true,
    min: '2023-11-01', // Fecha mínima permitida
    max: '2030-12-31' // Fecha máxima permitida
  },
  //El tipo de dato de cada elemento en el Array es mongoose.Schema.Types.ObjectId, que se utiliza para almacenar los IDs de los usuarios.
  usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
});

module.exports = model('fecha', fechaSchema);