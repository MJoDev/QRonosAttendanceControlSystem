const { Router } = require('express');
var moment = require('moment');
const router = Router();

//Cargo los modelos a almacenar en la base de datos
//Fecha guarda todo lo relacionado al dia en que se presente
//User guarda la informacion de los usuarios

const Fecha = require('../models/fecha');

const User = require('../models/User');

const jwt = require('jsonwebtoken');


//Creo la ruta de registro
router.post('/register', async (req, res) => {
	//Recibe por medio de un metodo post el nombre, el usuario, la contrase;a y si es admin o no
	const { name, user, password, admin } = req.body;
	//crea el nuevo usuario en base al modelo del usuario
	const newUser = new User({name, user, password, admin});
	//guardarlo en la base de datos
	await newUser.save();

	//asignarle un token
	const token = jwt.sign({_id: newUser._id}, 'secretkey');
	//devolver el token
	res.status(200).json({token});
});

//Creo la ruta de inicio de sesion
router.post('/sigin', async (req, res) => {
	//Recibe por medio de un metodo post el usuario y la contrase;a
	const { user, password } = req.body;
	//busca en la base de datos un modelo usuario con los valores otorgados p
	const thisuser = await User.findOne({user});
	//si el usuario no se encuentra, devuelve un estado de no encontrado
	if(!thisuser) return res.status(404).send('not found');
	//si la constrase;a no es igual, entonces devuelve que la contrase;a es incorrecta
	if(thisuser.password !== password) return res.status(401).send('Wrong password');
	//si el usuario es un admin, guarda en una constante que es admin para que asi pueda acceder a las
	//partes especiales del programa, devuelve un token.
	if(thisuser.admin == true){
			const isAdmin = true;
			const token = jwt.sign({_id: user._id}, 'secretkey');
			return res.status(200).json({token, isAdmin});
	}
	//si el usuario es encontrado, devuelve un token
	const token = jwt.sign({_id: user._id}, 'secretkey');
	return res.status(200).json({token});

});

//Creo la ruta para guardar las fechas.
router.post('/fecha', async (req, res) => {

		// Obtén el usuario actual y su ID
		const { user, password } = req.body;
		const thisUser = await User.findOne({user});
		const idUsuario = thisUser._id;

		// Obtén la fecha actual
		

		const fechaActualLatino = moment().format("YYYY-MM-DD");
		
	 	User.findByIdAndUpdate(idUsuario, { $push: { asistencia: fechaActualLatino } }, { new: true })
	 		.then((usuario) => {
	 			return res.json(usuario);
	 		})
	 		.catch((error) => {
	 			 return res.status(500).send(err);
	 		});
});

router.get('/home', verifyToken, async (req, res) => {
  let _id = req.userId;
  let usuario = await User.findOne({_id})
  res.json({usuario})
});

//Encontrar todos los usuarios guardados en la base de datos
router.get('/usuarios', (req, res) => {
  User.find()
    .then((usuarios) => {
      res.status(200).json(usuarios);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    });
});
//Encontrar un usuario por ID
router.get('/usuarios/:id', (req, res) => {
  let update = {mostrar: false};
  const usuarioId = req.params.id;
  User.findByIdAndUpdate(usuarioId, update, {new: true})
    .then((usuario) => {
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    });
});

router.get('/delete/:id', async (req, res) => {
	try{
		let user = await User.findById(req.params.id);

		if(!user){
			res.status(404).json({msg: 'No existe el user'});
		}
		user.mostrar = false;
		//asdasasd


	}catch(error){
		console.log(error);
		res.status(500).send('HUBO UN ERROR');
	}
});

module.exports = router; 

function verifyToken(req, res, next){
	if(!req.headers.authorization){
		return res.status(401).send('failed');
	}
	const token = req.headers.authorization.split(' ')[1];
	if (token == null){
		return res.status(401).send('failed');
	}
	console.log(token);

	const payload = jwt.verify(token, 'secretkey');
	console.log(payload);
	req.userId = payload._id;
	next();
}
