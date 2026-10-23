import React from 'react';

export default function EquipmentStatus({ summary }) {
  const s = summary || { total: 0, active: 0, idle: 0, maintenance: 0, offline: 0, utilizationRate: 0, averageHealth: 0 };

  const items = [
    { label: 'Active in Field', count: s.active, color: 'var(--accent-emerald)' },
    { label: 'Idle / Standby', count: s.idle, color: 'var(--accent-amber)' },
    { label: 'In Maintenance', count: s.maintenance, color: 'var(--accent-rose)' },
    { label: 'Offline', count: s.offline, color: 'var(--text-muted)' },
  ];

  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3 className="widget-title">Fleet Deployment</h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {s.total} Units Tracked
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {items.map((it) => (
          <div
            key={it.label}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${it.color}`,
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{it.count}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{it.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
        <span>Fleet Utilization: <strong style={{ color: 'var(--text-primary)' }}>{s.utilizationRate}%</strong></span>
        <span>Avg Health Score: <strong style={{ color: 'var(--accent-emerald)' }}>{s.averageHealth}/100</strong></span>
      </div>
    </div>
  );
}
