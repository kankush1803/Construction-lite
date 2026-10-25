import React from 'react';

export default function EquipmentStatus({ summary }) {
  const s = summary || { total: 0, active: 0, idle: 0, maintenance: 0, offline: 0, utilizationRate: 0, averageHealth: 0 };

  const items = [
    { label: 'Active in Field', count: s.active, color: 'var(--color-success)' },
    { label: 'Idle / Standby', count: s.idle, color: 'var(--color-warning)' },
    { label: 'In Maintenance', count: s.maintenance, color: 'var(--color-danger)' },
    { label: 'Offline', count: s.offline, color: 'var(--color-text-muted)' },
  ];

  return (
    <div className="card-shell">
      <div className="widget-header">
        <h3 className="widget-title">Fleet Deployment</h3>
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          {s.total} Units Tracked
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        {items.map((it) => (
          <div
            key={it.label}
            style={{
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              padding: '10px 12px',
              borderRadius: 'var(--radius-button)',
              borderLeft: `3px solid ${it.color}`,
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>{it.count}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{it.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--color-text-secondary)', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
        <span>Fleet Utilization: <strong style={{ color: 'var(--color-text)' }}>{s.utilizationRate}%</strong></span>
        <span>Avg Health Score: <strong style={{ color: 'var(--color-success)' }}>{s.averageHealth}/100</strong></span>
      </div>
    </div>
  );
}
