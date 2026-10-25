const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alerts.controller');
const validateRequest = require('../middleware/validateRequest');
const { z } = require('zod');

const createAlertSchema = {
  body: z.object({
    message: z.string().min(3, 'Message must be at least 3 characters'),
    type: z.enum(['Equipment', 'Safety', 'Schedule', 'Environmental', 'System']).optional(),
    severity: z.enum(['Critical', 'Warning', 'Info']).optional(),
    project_id: z.number().nullable().optional(),
    equipment_id: z.number().nullable().optional(),
  }),
};

router.get('/', alertsController.getAll);
router.post('/', validateRequest(createAlertSchema), alertsController.create);
router.patch('/:id/acknowledge', alertsController.acknowledge);

module.exports = router;
