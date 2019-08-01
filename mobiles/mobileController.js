const jwt = require('jsonwebtoken');

const Project = require('../projects/projectModel');

exports.create_mobile_post = function (req, res) {
	const token = req.headers['authorization'].split('Bearer ')[1];
	jwt.verify(token, 'private.key', function (err, decode) {
		if (err)
			errorHandler(err, res);
		else {
			Project.findOne({ pid: req.body.pid, author: decode._id }, (err1, project) => {
				if (err1 || project === null)
					errorHandler(err1, res);
				else {
					project.mobiles.counter += project.pid + 1;
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
}

exports.authentify_mobile = function (req, res) {
	console.log('authentify user');
	Project.findOne({ pid: req.body.pid }, (err, project) => {
		if (err) {
			errorHandler(err, res);
		} else {
			if (project.mobiles.apps.find((e) => e.mid === req.body.mid) !== null) {
				//change mobile mid status to use
				res.json({ status: 200, project });
			} else {
				res.sendStatus(401);
			}
		}
	});
}

exports.create_marker = function (req, res) {
	Project.findOne({ pid: req.body.pid }, (err, project) => {
		if (err) {
			errorHandler(err, res);
		} else {
			if (project.mobiles.apps.find((e) => e.mid === req.body.mid) !== null) {
				Array.prototype.push.apply(project.markers, req.body.marker);
				project.save((p) => {
					res.sendStatus(200);
				});
			} else {
				res.sendStatus(401);
			}
		}
	});
}

exports.delete_marker = function (req, res) {
	Project.findOne({ pid: req.body.pid }, (err, project) => {
		if (err || project === null) {
			errorHandler(err, res);
		} else {
			for (let i = 0; i < project.markers.length; i++) {
				if (project.markers[i]._id.toString() === req.body.marker_id) {
					project.markers.splice(i, 1);
					break;
				}
			}
			project.save((err_save) => {
				if (err_save) {
					errorHandler(err_save, res);
				} else {
					res.json({ status: 200, project });
				}
			});
		}
	});
}

function errorHandler(err, res, status = 403) {
	console.log(err);
	res.status(status);
	res.json({ status, err });
}