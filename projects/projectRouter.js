const express = require('express');

const router = express.Router();

const controller = require('./projectController');

router.post('/project', controller.create_project_post);

router.get('/projects', controller.get_all_project);

router.post('/zone', controller.create_zone_post);

router.get('/project/:pid', controller.get_one_project);

router.post('/project/image', controller.save_image);

module.exports = router;