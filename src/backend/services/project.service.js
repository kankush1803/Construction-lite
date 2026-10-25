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
};

module.exports = projectService;
