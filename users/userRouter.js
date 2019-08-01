const express = require('express');

const controller = require('./userController');

const router = express.Router();

router.post('/register', controller.register_user_post);

router.post('/auth', controller.login_user_post);

router.get('/user', controller.get_user_informations);

module.exports = router;