const API_BASE = '/api';

export const projectService = {
  async getAll() {
    if (window.electronAPI?.getProjects) {
      return window.electronAPI.getProjects();
    }
    const res = await fetch(`${API_BASE}/projects`);
    const json = await res.json();
    return json.data;
  },

  async getById(id) {
    if (window.electronAPI?.getProjectById) {
      return window.electronAPI.getProjectById(id);
    }
    const res = await fetch(`${API_BASE}/projects/${id}`);
    const json = await res.json();
    return json.data;
  },
};
