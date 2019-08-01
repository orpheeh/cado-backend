const express = require('express');

const router = express.Router();

const controller = require('./mobileController');

router.post('/mobile', controller.create_mobile_post);

router.delete('/mobile/marker', controller.delete_marker);

router.post('/mobile/marker', controller.create_marker);

router.post('/mobile/auth', controller.authentify_mobile);

module.exports = router;