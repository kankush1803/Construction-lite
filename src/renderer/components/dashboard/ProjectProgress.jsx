import React from 'react';
import StatusBadge from '../common/StatusBadge';

export default function ProjectProgress({ projects = [], onSelectProject }) {
  return (
    <div className="card-shell">
      <div className="widget-header">
        <h3 className="widget-title">Active Construction Projects</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {projects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => onSelectProject && onSelectProject(proj.id)}
            style={{
              cursor: 'pointer',
              padding: '10px 12px',
              borderRadius: 'var(--radius-button)',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--color-text)' }}>{proj.name}</strong>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                  {proj.code}
                </span>
              </div>
              <StatusBadge status={proj.status} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              <span>{proj.location}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{proj.progress}%</span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '5px', backgroundColor: '#E8ECEF', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${proj.progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--color-primary), var(--color-teal))',
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
