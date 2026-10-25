import React from 'react';

export default function StatCard({ title, value, icon, change, isPositive = true, subtitle }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <span className="kpi-label">{title}</span>
        {icon && <span style={{ fontSize: '1rem', opacity: 0.85 }}>{icon}</span>}
      </div>
      <div className="kpi-value">{value}</div>
      {(change || subtitle) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
          {change && (
            <span style={{ fontWeight: 600, color: isPositive ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
          )}
          <span>{subtitle || ''}</span>
        </div>
      )}
    </div>
  );
}
