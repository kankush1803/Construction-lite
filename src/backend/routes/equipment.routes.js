const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller');

router.get('/summary', equipmentController.getSummary);
router.get('/', equipmentController.getAll);
router.get('/:id', equipmentController.getById);

module.exports = router;
