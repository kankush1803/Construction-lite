const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller');
const validateRequest = require('../middleware/validateRequest');
const { z } = require('zod');

const createProjectSchema = {
  body: z
    .object({
      name: z.string().min(2, 'Project name is required and must be at least 2 characters'),
      code: z.string().min(2, 'Project code is required').optional(),
      project_code: z.string().min(2, 'Project code is required').optional(),
      client: z.string().min(2, 'Client is required'),
      location: z.string().min(2, 'Location is required'),
      budget: z.coerce.number().positive('Budget must be positive'),
      progress: z.coerce
        .number()
        .min(0, 'Progress must be between 0 and 100')
        .max(100, 'Progress must be between 0 and 100')
        .optional()
        .default(0),
      status: z
        .enum(['Planned', 'Planning', 'In Progress', 'On Hold', 'Completed', 'Near Completion'])
        .optional()
        .default('Planned'),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
    })
    .refine((data) => Boolean(data.code || data.project_code), {
      message: 'Project code is required',
      path: ['code'],
    }),
};

const updateProjectSchema = {
  body: z.object({
    name: z.string().min(2).optional(),
    code: z.string().min(2).optional(),
    project_code: z.string().min(2).optional(),
    client: z.string().min(2).optional(),
    location: z.string().min(2).optional(),
    budget: z.coerce.number().positive().optional(),
    progress: z.coerce.number().min(0).max(100).optional(),
    status: z.enum(['Planned', 'Planning', 'In Progress', 'On Hold', 'Completed', 'Near Completion']).optional(),
  }),
};

const updateProgressSchema = {
  body: z.object({
    progress: z.coerce.number().min(0).max(100, 'Progress must be between 0 and 100'),
  }),
};

router.get('/', projectsController.getAll);
router.get('/:id', projectsController.getById);
router.post('/', validateRequest(createProjectSchema), projectsController.create);
router.put('/:id', validateRequest(updateProjectSchema), projectsController.update);
router.delete('/:id', projectsController.delete);
router.patch('/:id/progress', validateRequest(updateProgressSchema), projectsController.updateProgress);

module.exports = router;
