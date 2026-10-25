import React from 'react';

export default function ManpowerSummary({ summary }) {
  const m = summary || { total: 0, onSite: 0, onBreak: 0, offSite: 0, attendanceRate: 0, safetyCertifiedRate: 100, trades: [] };

  return (
    <div className="card-shell">
      <div className="widget-header">
        <h3 className="widget-title">Workforce Allocation</h3>
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          {m.attendanceRate}% Attendance
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', padding: '12px', borderRadius: 'var(--radius-button)', marginBottom: '14px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-success)' }}>{m.onSite}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>On Site</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-warning)' }}>{m.onBreak}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>On Break</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>{m.offSite}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Off Site</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
          Active Trade Deployments:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(m.trades || []).map((t) => (
            <span
              key={t.trade}
              style={{
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                fontSize: '11.5px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-input)',
                color: 'var(--color-text)',
              }}
            >
              {t.trade}: <strong style={{ color: 'var(--color-primary-dark)' }}>{t.count}</strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
