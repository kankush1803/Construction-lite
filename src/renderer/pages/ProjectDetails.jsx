import React, { useState, useEffect } from 'react';
import { projectService } from '../services/project.service';
import StatusBadge from '../components/common/StatusBadge';
import Loading from '../components/common/Loading';
import ProjectProgressChart from '../components/charts/ProjectProgressChart';
import { useDashboard } from '../hooks/useDashboard';

export default function ProjectDetails() {
  const { selectedProjectId, setActiveTab } = useDashboard();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = selectedProjectId || 1;
    projectService.getById(id).then((data) => {
      setProject(data);
      setLoading(false);
    });
  }, [selectedProjectId]);

  if (loading) return <Loading message="Loading project details..." />;
  if (!project) return <div>Project not found.</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={() => setActiveTab('projects')}>
          ← Back to Projects
        </button>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{project.name}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Code: {project.code} • Client: {project.client} • Location: {project.location}
          </span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-title">Budget Allocation</span>
          <div className="stat-value">${Number(project.budget).toLocaleString()}</div>
          <div className="stat-footer">Spent: ${Number(project.spent || 0).toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Overall Progress</span>
          <div className="stat-value">{project.progress}%</div>
          <div className="stat-footer">Target Date: {project.end_date}</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Assigned Fleet</span>
          <div className="stat-value">{project.equipmentCount || 0} Units</div>
          <div className="stat-footer">Active machinery</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Deployed Crew</span>
          <div className="stat-value">{project.workerCount || 0} Workers</div>
          <div className="stat-footer">On site personnel</div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <ProjectProgressChart />
      </div>
    </div>
  );
}
