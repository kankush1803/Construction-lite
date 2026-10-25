const manpowerService = require('../services/manpower.service');

const manpowerController = {
  async getAll(req, res, next) {
    try {
      const workers = await manpowerService.getAllWorkers(req.query.projectId);
      res.json({ success: true, data: workers });
    } catch (error) {
      next(error);
    }
  },

  async getSummary(req, res, next) {
    try {
      const summary = await manpowerService.getSummary();
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = manpowerController;
