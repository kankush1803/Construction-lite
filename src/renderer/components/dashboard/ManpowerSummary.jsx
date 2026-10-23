import React from 'react';

export default function ManpowerSummary({ summary }) {
  const m = summary || { total: 0, onSite: 0, onBreak: 0, offSite: 0, attendanceRate: 0, safetyCertifiedRate: 100, trades: [] };

  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3 className="widget-title">Workforce Allocation</h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {m.attendanceRate}% Attendance
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{m.onSite}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On Site</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{m.onBreak}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On Break</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{m.offSite}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Off Site</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Active Trade Deployments:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {(m.trades || []).map((t) => (
            <span
              key={t.trade}
              style={{
                backgroundColor: 'var(--bg-surface-hover)',
                fontSize: '0.8rem',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
              }}
            >
              {t.trade}: <strong>{t.count}</strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
