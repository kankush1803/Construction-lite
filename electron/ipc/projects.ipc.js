const projectService = require('../../src/backend/services/project.service');

function registerProjectsIPC(ipcMain) {
  ipcMain.handle('projects:get-all', async () => {
    return projectService.getAllProjects();
  });

  ipcMain.handle('projects:get-by-id', async (_event, id) => {
    return projectService.getProjectById(id);
  });

  ipcMain.handle('projects:create', async (_event, data) => {
    return projectService.createProject(data);
  });

  ipcMain.handle('projects:update', async (_event, id, data) => {
    return projectService.updateProject(id, data);
  });

  ipcMain.handle('projects:delete', async (_event, id) => {
    return projectService.deleteProject(id);
  });

  ipcMain.handle('projects:allocate-equipment', async (_event, projectId, equipmentIds) => {
    return projectService.allocateEquipment(projectId, equipmentIds);
  });

  ipcMain.handle('projects:deallocate-equipment', async (_event, projectId, equipmentId) => {
    return projectService.deallocateEquipment(projectId, equipmentId);
  });

  ipcMain.handle('projects:assign-workers', async (_event, projectId, workerIds) => {
    return projectService.assignWorkers(projectId, workerIds);
  });

  ipcMain.handle('projects:unassign-worker', async (_event, projectId, workerId) => {
    return projectService.unassignWorker(projectId, workerId);
  });

  ipcMain.handle('projects:create-equipment', async (_event, projectId, data) => {
    return projectService.createAndAllocateEquipment(projectId, data);
  });

  ipcMain.handle('projects:create-worker', async (_event, projectId, data) => {
    return projectService.createAndAssignWorker(projectId, data);
  });
}

module.exports = registerProjectsIPC;
