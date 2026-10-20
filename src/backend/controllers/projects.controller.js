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
