const express = require('express');

const router = express.Router();

const controller = require('./poubelleController');

router.post('/poubelle', controller.create_poubelle);

router.get('/poubelles', controller.get_all_poubelle);


module.exports = router;