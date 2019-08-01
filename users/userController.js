
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./userModel');

exports.register_user_post = function(req, res){
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
}

exports.login_user_post = function(req, res){
	//Authentify user
	User.findOne({ username: req.body.user }, (err, user) => {
		if (err || user === null) {
			errorHandler(err, res, 401);
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
				errorHandler(err2, res);
			}
		});
	});
}

exports.get_user_informations = function(req, res){
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
}

function errorHandler(err, res, status = 403) {
	res.status(status);
	res.json({ status, err });
}