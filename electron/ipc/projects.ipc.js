const projectService = require('../../src/backend/services/project.service');

function registerProjectsIPC(ipcMain) {
  ipcMain.handle('projects:get-all', async () => {
    return projectService.getAllProjects();
  });

  ipcMain.handle('projects:get-by-id', async (_event, id) => {
    return projectService.getProjectById(id);
  });
}

module.exports = registerProjectsIPC;
