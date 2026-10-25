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

  async create(projectData) {
    if (window.electronAPI?.createProject) {
      return window.electronAPI.createProject(projectData);
    }
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    const json = await res.json();
    if (!res.ok) {
      const detailsMsg = Array.isArray(json.error?.details)
        ? json.error.details.map((d) => (Array.isArray(d.path) ? `${d.path.join('.')}: ${d.message}` : d.message)).join(' | ')
        : null;
      throw new Error(detailsMsg || json.error?.message || json.message || 'Failed to create project');
    }
    return json.data;
  },

  async update(id, projectData) {
    if (window.electronAPI?.updateProject) {
      return window.electronAPI.updateProject(id, projectData);
    }
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error?.message || json.message || 'Failed to update project');
    }
    return json.data;
  },

  async delete(id) {
    if (window.electronAPI?.deleteProject) {
      return window.electronAPI.deleteProject(id);
    }
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error?.message || json.message || 'Failed to delete project');
    }
    return json.data;
  },

  async allocateEquipment(projectId, equipmentIds) {
    if (window.electronAPI?.allocateEquipment) {
      return window.electronAPI.allocateEquipment(projectId, equipmentIds);
    }
    const res = await fetch(`${API_BASE}/projects/${projectId}/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ equipmentIds }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || json.message || 'Failed to allocate equipment');
    return json.data;
  },

  async deallocateEquipment(projectId, equipmentId) {
    if (window.electronAPI?.deallocateEquipment) {
      return window.electronAPI.deallocateEquipment(projectId, equipmentId);
    }
    const res = await fetch(`${API_BASE}/projects/${projectId}/equipment/${equipmentId}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || json.message || 'Failed to deallocate equipment');
    return json.data;
  },

  async createEquipmentForProject(projectId, data) {
    if (window.electronAPI?.createEquipmentForProject) {
      return window.electronAPI.createEquipmentForProject(projectId, data);
    }
    const res = await fetch(`${API_BASE}/projects/${projectId}/equipment/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || json.message || 'Failed to create and allocate equipment');
    return json.data;
  },

  async assignWorkers(projectId, workerIds) {
    if (window.electronAPI?.assignWorkers) {
      return window.electronAPI.assignWorkers(projectId, workerIds);
    }
    const res = await fetch(`${API_BASE}/projects/${projectId}/workers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerIds }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || json.message || 'Failed to assign personnel');
    return json.data;
  },

  async unassignWorker(projectId, workerId) {
    if (window.electronAPI?.unassignWorker) {
      return window.electronAPI.unassignWorker(projectId, workerId);
    }
    const res = await fetch(`${API_BASE}/projects/${projectId}/workers/${workerId}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || json.message || 'Failed to unassign personnel');
    return json.data;
  },

  async createWorkerForProject(projectId, data) {
    if (window.electronAPI?.createWorkerForProject) {
      return window.electronAPI.createWorkerForProject(projectId, data);
    }
    const res = await fetch(`${API_BASE}/projects/${projectId}/workers/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || json.message || 'Failed to create and assign personnel');
    return json.data;
  },
};
