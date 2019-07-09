const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const mongoose = require('mongoose');
require('./userModel');
require('./projectModel');
const User = mongoose.model('User');
const Project = mongoose.model('Project');

//Connect to DB
mongoose.connect('mongodb://localhost:27017/cado', 
{ useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
mongoose.connection.on('error', () => console.log('Connection with DB fail !'));

//Create app
const app = express();

//First middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


//Register route
app.post('/api/register', (req, res) => {
	if (req.body.username && req.body.password && req.body.email) {
		const user = new User(req.body);
		user.save((err, newUser) => {
			if (err) {
				errorHandler(err, res);
			} else {
				//Send Token for authentification
				res.json({
					status: 200,
					newUser
				});
			}
		});
	} else {
		res.sendStatus(401);
	}
});

//Authentification route
app.post('/api/auth', (req, res) => {
	//Authentify user
	User.findOne({ username: req.body.user }, (err, user) => {
		if (err || user === null) {
			res.status(401);
			res.json({ status: 401 });
			return;
		}
		bcrypt.compare(req.body.password, user.password, function (err2, result) {
			if (result == true) {
				//Create token
				const payload = {
					username: user.username,
					password: user.password,
					email: user.email,
					uid: user.uid,
					_id: user._id
				};
				jwt.sign(payload, 'private.key', function (err3, token) {
					if (err3) {
						errorHandler(err3, res);
					}
					res.json({ status: 200, token });
				});
			} else {
				errorHandler(err, res);
			}
		});
	});
});

//Verify Token before read and write on API
app.use(verifyToken);

//Find one user route
//Get informations for user who have the uid equal to token payload uid
app.get('/api/user/', (req, res) => {
	const token = req.headers['authorization'];
	jwt.verify(token, 'private.key', function (err, decoded) {
		if(err){
			errorHandler(err, res);
		}
		User.findOne({ uid: decoded.uid }, (err1, user) => {
			if(err1){
				errorHandler(err1, res);		
			}
			res.json(user);
		});
	});
});

//Create New project route
app.post('/api/project/', (req, res) => {
	const token = req.headers['authorization'];
	jwt.verify(token, 'private.key', function (err, decoded) {
		req.body.author = decoded._id;
		const project = new Project(req.body);
		project.save((err1, newProject) => {
			if (err1) {
				errorHandler(err1, res);
			} else {
				User.findOne({ uid: decoded.uid }, (err3, user) => {
					if (err3) {
						errorHandler(err3, res);
					} else {
						user.projects.push(newProject);
						user.save((err4) => {
							if (err4)
								errorHandler(err4, res);
							else {
								res.json({ status: 200, newProject });
							}
						});
					}
				});
			}
		});
	});
});

//Get all project of authentifiate user
app.get('/api/projects/', (req, res) => {
	const token = req.headers['authorization'];
	jwt.verify(token, 'private.key', function (err1, decoded) {
		if(err1){
			errorHandler(err1, res);
		}
		Project.find({ author: decoded._id }, (err, projects) => {
			if (err) {
				errorHandler(err);
			} else {
				res.json({ status: 200, projects });
			}
		});
	});
});

//Get project by id route
app.get('/api/project/:pid', (req, res) => {
	const token = req.headers['authorization'];
	jwt.verify(token, 'private.key', function (err, decoded) {
		Project.findOne({ author: decoded._id, pid: req.params.pid }, (err, project) => {
			if (err) {
				errorHandler(err, res);
			} else {
				res.json({ status: 200, project });
			}
		});
	});
});

//Add point { lng, lat } at zone route
app.post('/api/zone/', (req, res) => {
	const token = req.headers['authorization'];
	jwt.verify(token, 'private.key', function (err, decoded) {
		if(err){
			errorHandler(err, res);
		}
		Project.findOne({ author: decoded._id, pid: req.body.pid }, (err1, project) => {
			if (err1) {
				errorHandler(err1, res);
			} else {
				if (req.body.action === 'remove') {
					project.zone.pop();
				} else {
					project.zone.push({ lat: req.body.lat, lng: req.body.lng });
				}
				project.save((err, p) => {
					if (err) {
						errorHandler(err, res);
					} else {
						res.json({ status: 200, p });
					}
				});
			}
		});
	});
});

function errorHandler(err, res, status = 403) {
	res.status(status);
	res.json({ status, err });
}

function verifyToken(req, res, next) {
	const token = req.headers['authorization'];
	if (token == null || token == '' || token === undefined) {
		res.sendStatus(401);
	}
	jwt.verify(token, 'private.key', function (err, decoded) {
		if (err) {
			return next(err);
		}
		next();
	});
}

app.listen(3002, () => console.log('CADO Backend start at port 3002'));