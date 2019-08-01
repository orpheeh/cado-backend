
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Project = require('./projectModel');
const User = require('../users/userModel');

exports.create_project_post = function (req, res) {
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
}

exports.create_zone_post = function (req, res) {
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
}

exports.get_all_project = function (req, res) {
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
}

exports.get_one_project = function(req, res){
    Project.findOne({ pid: req.params.pid }, (err, project) => {
		if (err) {
			errorHandler(err, res);
		} else {
			res.json({ status: 200, project });
		}
	});
}