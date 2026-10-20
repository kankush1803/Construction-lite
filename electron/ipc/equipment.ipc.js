const equipmentService = require('../../src/backend/services/equipment.service');

function registerEquipmentIPC(ipcMain) {
  ipcMain.handle('equipment:get-all', async (_event, projectId) => {
    return equipmentService.getAllEquipment(projectId);
  });

  ipcMain.handle('equipment:get-summary', async () => {
    return equipmentService.getSummary();
  });
}

module.exports = registerEquipmentIPC;
