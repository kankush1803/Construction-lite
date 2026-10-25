const projectRepository = require('../repositories/project.repository');
const equipmentRepository = require('../repositories/equipment.repository');
const manpowerRepository = require('../repositories/manpower.repository');

const projectService = {
  async getAllProjects() {
    return projectRepository.findAll();
  },

  async getProjectById(id) {
    const project = await projectRepository.findById(id);
    if (!project) return null;

    const equipment = await equipmentRepository.findAll(id);
    const workers = await manpowerRepository.findAll(id);

    return {
      ...project,
      equipmentCount: equipment.length,
      workerCount: workers.length,
      equipment,
      workers,
    };
  },

  async createProject(data) {
    return projectRepository.create(data);
  },

  async updateProject(id, data) {
    return projectRepository.update(id, data);
  },

  async deleteProject(id) {
    return projectRepository.delete(id);
  },

  async updateProgress(id, progress) {
    return projectRepository.updateProgress(id, progress);
  },

  async allocateEquipment(projectId, equipmentIds) {
    const ids = Array.isArray(equipmentIds) ? equipmentIds : [equipmentIds];
    const results = [];
    for (const eqId of ids) {
      if (eqId) {
        const item = await equipmentRepository.allocateToProject(eqId, projectId);
        results.push(item);
      }
    }
    return equipmentRepository.findAll(projectId);
  },

  async deallocateEquipment(projectId, equipmentId) {
    await equipmentRepository.deallocateFromProject(equipmentId);
    return equipmentRepository.findAll(projectId);
  },

  async createAndAllocateEquipment(projectId, data) {
    const item = await equipmentRepository.create({ ...data, project_id: projectId });
    return item;
  },

  async assignWorkers(projectId, workerIds) {
    const ids = Array.isArray(workerIds) ? workerIds : [workerIds];
    const results = [];
    for (const wId of ids) {
      if (wId) {
        const item = await manpowerRepository.assignToProject(wId, projectId);
        results.push(item);
      }
    }
    return manpowerRepository.findAll(projectId);
  },

  async unassignWorker(projectId, workerId) {
    await manpowerRepository.unassignFromProject(workerId);
    return manpowerRepository.findAll(projectId);
  },

  async createAndAssignWorker(projectId, data) {
    const item = await manpowerRepository.create({ ...data, project_id: projectId });
    return item;
  },
};

module.exports = projectService;
