const express = require('express');
const router = express.Router();
const manpowerController = require('../controllers/manpower.controller');

router.get('/summary', manpowerController.getSummary);
router.get('/', manpowerController.getAll);

module.exports = router;
