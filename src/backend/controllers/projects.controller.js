const projectService = require('../services/project.service');

const projectsController = {
  async getAll(req, res, next) {
    try {
      const projects = await projectService.getAllProjects();
      res.json({ success: true, data: projects });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const project = await projectService.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, error: { message: 'Project not found' } });
      }
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const created = await projectService.createProject(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (error) {
      if (error.code === 'DUPLICATE_CODE' || error.status === 409 || error.code === '23505') {
        return res.status(409).json({
          success: false,
          error: { message: error.message || 'Project code already exists. Please choose a unique code.' },
        });
      }
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await projectService.updateProject(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: { message: 'Project not found' } });
      }
      res.json({ success: true, data: updated });
    } catch (error) {
      if (error.code === 'DUPLICATE_CODE' || error.status === 409 || error.code === '23505') {
        return res.status(409).json({
          success: false,
          error: { message: error.message || 'Project code already exists.' },
        });
      }
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const deleted = await projectService.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: { message: 'Project not found' } });
      }
      res.json({ success: true, data: deleted, message: 'Project removed successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updateProgress(req, res, next) {
    try {
      const updated = await projectService.updateProgress(req.params.id, req.body.progress);
      if (!updated) {
        return res.status(404).json({ success: false, error: { message: 'Project not found' } });
      }
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = projectsController;
