const { Schema, model } = require('mongoose');

const userSchema = Schema({
	name: String,
	user: String,
	password: String,
	admin: Boolean,
	mostrar: Boolean,
	asistencia: [{
    type: Date,
    default: []
  }]
}, {
	timestamp: true
});

module.exports = model('User', userSchema);