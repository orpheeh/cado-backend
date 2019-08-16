const express = require('express');

const router = express.Router();

const controller = require('./dispositifController')

router.post('/dispositif', controller.create_dispositif);
router.get('/dispositifs', controller.get_all_dispositif);
router.put('/dispositif/:id', controller.update_dispositif);
router.delete('/dispositif/:id', controller.delete_dispositif);
router.get('/poubelles/:id', controller.get_all_poubelles);
router.post('/operation', controller.post_operation);

module.exports = router;