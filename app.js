const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


require('./userModel');
const mongoose = require('mongoose');
const User = mongoose.model('User');

//Connect to DB
mongoose.connect('mongodb://localhost:27017/cado', { useNewUrlParser: true });
mongoose.connection.on('error', () => console.log('Connection with DB fail !'));

const app = express();

//Parse All request to JSON and put it into req.body before read request
app.use(bodyParser.json());

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
                res.sendStatus(403);
            } else {
                //Send Token for authentification
                res.json({
                    message: 'Welcome ',
                    newUser
                });
            }
        });
    }
});

app.post('/api/auth', (req, res) => {
    //Authentify user
    User.findOne({ username: req.body.user }, (err, user) => {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
            if (result == true) {
                //Create token
                const payload = {
                    username: user.username,
                    password: user.password,
                    email: user.email,
                    uid: user.uid
                };
                jwt.sign(payload, 'private.key', function (err, token) {
                    if (err) {
                        res.sendStatus(403);
                    }
                    res.json({
                        message: "Authentification OK",
                        token
                    })
                });
            }
        });
    });
});

//Verify Token before read and write on API
app.use(verifyToken);

app.get('/api', (req, res) => {
    res.send({
        message: 'Welcome to CADO API !'
    });
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (token == null || token == '' || token === undefined) {
        res.sendStatus(401);
    }

    jwt.verify(token, 'private.key', function (err, decoded) {
        if (err) {
            return next(err);
        }
        console.log(decoded);
        next();
    });
}

app.listen(3002, () => console.log('CADO Backend start at port 3002'));