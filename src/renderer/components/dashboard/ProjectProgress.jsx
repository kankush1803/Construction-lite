import React from 'react';
import StatusBadge from '../common/StatusBadge';

export default function ProjectProgress({ projects = [], onSelectProject }) {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3 className="widget-title">Active Construction Projects</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {projects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => onSelectProject && onSelectProject(proj.id)}
            style={{
              cursor: 'pointer',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{proj.name}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  {proj.code}
                </span>
              </div>
              <StatusBadge status={proj.status} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              <span>{proj.location}</span>
              <span>{proj.progress}% Complete</span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${proj.progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-amber), var(--accent-cyan))',
                  borderRadius: '3px',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
