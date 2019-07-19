const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const mongoose = require('mongoose');
const access = require('./access');
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
				console.log("[REGISTER]" + newUser.username + ": " + newUser.password);
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
			errorHandler(err, res, 401);
			return;
		}
		bcrypt.compare(req.body.password, user.password, function (err2, result) {
			console.log("response: " + result);
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
					console.log(user.username + " : " + user.password);
					res.json({ status: 200, token });
				});
			} else {
				errorHandler(err2, res);
			}
		});
	});
});

app.use(verifyAccess);

//Public route
//Get project by id route
app.get('/api/project/:pid', (req, res) => {
	Project.findOne({ pid: req.params.pid }, (err, project) => {
		if (err) {
			errorHandler(err, res);
		} else {
			res.json({ status: 200, project });
		}
	});
});

//Authentifiate mobile app
app.post('/api/mobile/auth', (req, res) => {
	console.log('Auth mobile app');
	Project.findOne({ pid: req.body.pid }, (err, project) => {
		if(err){
			errorHandler(err, res)
		} else {
			if(project.mobiles.apps.find((e) =>  e.mid === req.body.mid) !== null){
				console.log(project);
				//change mobile mid status to use
				res.json({ status: 200, project});
			} else {
				res.sendStatus(401);
			}
		}
	});
});

app.post('/api/mobile/marker', (req, res) => {
	Project.findOne({ pid: req.body.pid}, (err, project) => {
		if(err){
			errorHandler(err, res);
		} else {
			if(project.mobiles.apps.find((e) =>  e.mid === req.body.mid) !== null){
				Array.prototype.push.apply(project.markers, req.body.marker);	
				project.save((p) => {
					res.sendStatus(200);
				});
			} else {
				res.sendStatus(401);
			}
		}
	});
});

app.delete('/api/mobile/marker', (req, res) => {
	Project.findOne({ pid: req.body.pid }, (err, project) => {
		if(err || project === null){
			errorHandler(err, res);
		} else {
			for(let i = 0; i < project.markers.length; i++){
				if(project.markers[i]._id.toString() === req.body.marker_id){
					project.markers.splice(i, 1);
					break;
				}
			}
			project.save((err_save) => {
				if(err_save){
					errorHandler(err_save, res);
				} else {
					res.json({ status: 200, project});
				}
			});
		}
	});
});

//Private route
//Verify Token before read and write on API
app.use(verifyToken);

//Find one user route
//Get informations for user who have the uid equal to token payload uid
app.get('/api/user/', (req, res) => {
	const token = req.headers['authorization'].split('Bearer ')[1];
	jwt.verify(token, 'private.key', function (err, decoded) {
		if (err) {
			errorHandler(err, res);
		}
		User.findOne({ uid: decoded.uid }, (err1, user) => {
			if (err1) {
				errorHandler(err1, res);
			}
			res.json(user);
		});
	});
});

//Create New project route
app.post('/api/project/', (req, res) => {
	const token = req.headers['authorization'].split('Bearer ')[1];
	jwt.verify(token, 'private.key', function (err, decoded) {
		req.body.author = decoded._id;
		const project = new Project(req.body);
		console.log(req.body);
		project.save((err1, newProject) => {
			if (err1) {
				console.log(err1);
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
	const token = req.headers['authorization'].split('Bearer ')[1];
	jwt.verify(token, 'private.key', function (err1, decoded) {
		if (err1) {
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

//Add point { lng, lat } at zone route
app.post('/api/zone/', (req, res) => {
	const token = req.headers['authorization'].split('Bearer ')[1];
	jwt.verify(token, 'private.key', function (err, decoded) {
		if (err) {
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

//Create new mobile
app.post('/api/mobile', (req, res) => {
	const token = req.headers['authorization'].split('Bearer ')[1];
	jwt.verify(token, 'private.key', function (err, decode) {
		if (err)
			errorHandler(err, res);
		else {
			Project.findOne({ pid: req.body.pid, author: decode._id }, (err1, project) => {
				if (err1 || project === null)
					errorHandler(err1, res);
				else {
					project.mobiles.counter++;
					project.mobiles.apps.push({ mid: project.mobiles.counter });
					project.save((err2, update) => {
						if (err2)
							errorHandler(err2, res);
						else
							res.json({ status: 200, update })
					});
				}
			});
		}
	});
})

function errorHandler(err, res, status = 403) {
	res.status(status);
	res.json({ status, err });
}

function verifyToken(req, res, next) {

	const token = req.headers['authorization'].split('Bearer ')[1];
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

function verifyAccess(req, res, next) {
	const access_name = req.headers['authorization'].split('Access ')[1].split('Bearer ')[0];
	const method = req.method;
	const route = req.path;
	const rule = { method, route }
	if (access[access_name] === '*') {
		return next();
	}
	let ok = false;
	access[access_name].forEach(element => {
		if (element.method === rule.method) {
			let route_e = element.route;
			let route_r = rule.route;
			if (route_e.split('/')[route_e.split('/').length - 1] === ':id') {
				route_e = route_e.replace(':id', route_r.split('/')[route_e.split('/').length - 1]);
			}
			if (route_e == route_r)
				ok = true;
		}
	});

	if (ok) {
		next();
	} else {
		res.sendStatus(401);
	}
}

app.listen(3002, () => console.log('CADO up 3002 ...'));
