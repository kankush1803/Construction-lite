const equipmentService = require('../services/equipment.service');

const equipmentController = {
  async getAll(req, res, next) {
    try {
      const list = await equipmentService.getAllEquipment(req.query.projectId);
      res.json({ success: true, data: list });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const item = await equipmentService.getEquipmentById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, error: { message: 'Equipment not found' } });
      }
      res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },

  async getSummary(req, res, next) {
    try {
      const summary = await equipmentService.getSummary();
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = equipmentController;
