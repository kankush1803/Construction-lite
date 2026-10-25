import React, { useState } from 'react';

export default function Settings() {
  const [simulationSpeed, setSimulationSpeed] = useState('3000');
  const [anomalyThreshold, setAnomalyThreshold] = useState('2.5');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('15');
  const [telemetryMode, setTelemetryMode] = useState('simulated');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div style={{ maxWidth: '840px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="card-shell" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 650, color: 'var(--color-text)' }}>
            IoT Telemetry & Simulator Parameters
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Configure transmission cadence, sensor thresholds, and simulated IoT sensor feeds.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="setting-telemetry-mode">
            Telemetry Ingestion Engine
          </label>
          <select
            id="setting-telemetry-mode"
            className="form-select"
            value={telemetryMode}
            onChange={(e) => setTelemetryMode(e.target.value)}
            style={{ maxWidth: '340px' }}
          >
            <option value="simulated">IoT Simulation Engine (Local Multi-Sensor)</option>
            <option value="live">Live MQTT / OPC-UA Gateway Stream</option>
          </select>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            Per design guidelines, non-production test packets are explicitly labeled as Simulated Stream.
          </span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="setting-interval">
            Sensor Telemetry Interval (milliseconds)
          </label>
          <input
            id="setting-interval"
            type="number"
            className="form-input"
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(e.target.value)}
            style={{ maxWidth: '340px' }}
          />
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            Frequency at which simulated vibration, temperature, and GPS telemetry packets are emitted.
          </span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="setting-zscore">
            AI/ML Anomaly Z-Score Sensitivity Threshold
          </label>
          <input
            id="setting-zscore"
            type="number"
            step="0.1"
            className="form-input"
            value={anomalyThreshold}
            onChange={(e) => setAnomalyThreshold(e.target.value)}
            style={{ maxWidth: '340px' }}
          />
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            Standard deviation threshold (Z ≥ 2.5) that triggers automatic equipment anomaly alarms.
          </span>
        </div>
      </div>

      <div className="card-shell" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 650, color: 'var(--color-text)' }}>
            Desktop Application & Notification Preferences
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Control background polling, alerts popups, and desktop OS notifications.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="setting-refresh">
            Automated Background Polling Cadence
          </label>
          <select
            id="setting-refresh"
            className="form-select"
            value={autoRefreshInterval}
            onChange={(e) => setAutoRefreshInterval(e.target.value)}
            style={{ maxWidth: '340px' }}
          >
            <option value="5">Every 5 Seconds (High Density)</option>
            <option value="15">Every 15 Seconds (Balanced)</option>
            <option value="60">Every 60 Seconds (Standard)</option>
            <option value="manual">Manual Refresh Only</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="notifications-toggle"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
          />
          <label htmlFor="notifications-toggle" style={{ fontSize: '13px', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 500 }}>
            Dispatch native desktop OS notifications for Critical machine and safety incidents
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Preferences
          </button>
          {savedNotice && (
            <span style={{ color: 'var(--color-success)', fontSize: '13px', fontWeight: 600 }}>
              Preferences saved successfully
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
