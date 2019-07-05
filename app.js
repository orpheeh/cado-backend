const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');


require('./userModel');
require('./projectModel');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Project = mongoose.model('Project');

//Connect to DB
mongoose.connect('mongodb://localhost:27017/cado', { useNewUrlParser: true });
mongoose.connection.on('error', () => console.log('Connection with DB fail !'));

const app = express();

//Parse All request to JSON and put it into req.body before read request
app.use(bodyParser.json());

app.use(cors());

//Register User to CADO
app.post('/api/register', (req, res) => {
    //Verify req.body user information
    if (req.body.username && req.body.password && req.body.email) {
        //Create a new user
        const user = new User(req.body);
        //Save it on to DB
        user.save((err, newUser) => {
            if (err) {
                //Forbidden
                console.log(err);
				res.status(403);
				res.json({
					status: 403,
					err
				})
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

//Result status
//If 401 : error on username or email
//If 403 erro on password
app.post('/api/auth', (req, res) => {
    //Authentify user
    User.findOne({ username: req.body.user }, (err, user) => {
		if(err || user === null) {
			res.status(401);
			res.json ({
				status: 401 
			});
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
                        res.status(403);
						res.json({
							status: 403,
							err
						});
                    }
                    res.json({
                        status: 200,
                        token
                    });
                });
            } else {
				res.status(403);
				res.json({ status: 403, err});
			}
        });
    });
});

//Verify Token before read and write on API
app.use(verifyToken);

//Get informations for user who have the uid equal to token payload uid
app.get('/api/user/', (req, res) => {
	const token = req.headers['authorization'];
    jwt.verify(token, 'private.key', function (err, decoded) {
       User.findOne({ uid: decoded.uid }, (err, user) => { 
			res.json(user);
	   });
    });
});

//Create project
app.post('/api/project/', (req, res) => {
	const token = req.headers['authorization'];
    jwt.verify(token, 'private.key', function (err, decoded) {
	   req.body.author = decoded._id;
	   console.log(decoded);
	   console.log(req.body);
	   const project = new Project(req.body);
	   project.save((err, newProject) => {
			if(err){
				errorHandler(err, res);
			} else {
				User.findOne({ uid: decoded.uid }, (err3, user) => { 
					if(err){
						errorHandler(err3, res);
					} else {
						user.projects.push(newProject);
						user.save((err4, user1) => { 
							if(err4)
								errorHandler(err4, res);
							else {
								res.json({status: 200, newProject});
							}
						});
					}
				});
			}
	   });
    });
});

//Get all project for auth user
app.get('/api/project/', (req, res) => {
	const token = req.headers['authorization'];
    jwt.verify(token, 'private.key', function (err, decoded) {
	   Project.find({ author: decoded._id }, (err, projects) => {
			if(err){
				errorHandler(err);
			} else {
				res.json( { status: 200, projects} );
			}
	   });
    });
});

function errorHandler(err, res){
	res.status(403);
	res.json({ status: 403, err});
}

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
	console.log('le fameux token: ' + token);
    if (token == null || token == '' || token === undefined) {
        res.sendStatus(401);
    }

    jwt.verify(token, 'private.key', function (err, decoded) {
        if (err) {
            console.log("token error");
			return next(err);
        }
        console.log(decoded);
        next();
    });
}

app.listen(3002, () => console.log('CADO Backend start at port 3002'));