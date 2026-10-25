const safetyService = require('../services/safety.service');

const safetyController = {
  async getOverview(req, res, next) {
    try {
      const overview = await safetyService.getOverview();
      res.json({ success: true, data: overview });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = safetyController;
