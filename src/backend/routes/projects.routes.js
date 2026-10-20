const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller');
const validateRequest = require('../middleware/validateRequest');
const { z } = require('zod');

const createProjectSchema = {
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    code: z.string().min(2, 'Code is required'),
    client: z.string().min(2, 'Client is required'),
    location: z.string().min(2, 'Location is required'),
    budget: z.number().positive('Budget must be positive'),
    start_date: z.string(),
    end_date: z.string(),
    status: z.string().optional(),
  }),
};

const updateProgressSchema = {
  body: z.object({
    progress: z.number().min(0).max(100, 'Progress must be between 0 and 100'),
  }),
};

router.get('/', projectsController.getAll);
router.get('/:id', projectsController.getById);
router.post('/', validateRequest(createProjectSchema), projectsController.create);
router.patch('/:id/progress', validateRequest(updateProgressSchema), projectsController.updateProgress);

module.exports = router;
