const express = require('express');

const router = express.Router();

const controller = require('./unitController');

router.post('/unit', controller.create_unit);

router.get('/units', controller.get_all_unit);


module.exports = router;