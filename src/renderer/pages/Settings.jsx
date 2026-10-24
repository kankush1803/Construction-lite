import React, { useState } from 'react';

export default function Settings() {
  const [simulationSpeed, setSimulationSpeed] = useState('3000');
  const [anomalyThreshold, setAnomalyThreshold] = useState('2.5');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>System & Telemetry Settings</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Configure desktop application thresholds, simulated IoT intervals, and notifications
        </p>
      </div>

      <div className="widget-card" style={{ gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            IoT Telemetry Simulation Interval (ms)
          </label>
          <input
            type="number"
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.75rem',
              color: 'var(--text-primary)',
              width: '100%',
              maxWidth: '300px',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            AI/ML Anomaly Z-Score Sensitivity
          </label>
          <input
            type="number"
            step="0.1"
            value={anomalyThreshold}
            onChange={(e) => setAnomalyThreshold(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.75rem',
              color: 'var(--text-primary)',
              width: '100%',
              maxWidth: '300px',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="checkbox"
            id="notifications"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <label htmlFor="notifications" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
            Enable desktop push notifications for Critical anomalies
          </label>
        </div>

        <div>
          <button className="btn btn-primary" onClick={() => alert('Settings saved successfully.')}>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
