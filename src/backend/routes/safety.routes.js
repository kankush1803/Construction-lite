const express = require('express');
const router = express.Router();
const safetyController = require('../controllers/safety.controller');

router.get('/overview', safetyController.getOverview);

module.exports = router;
