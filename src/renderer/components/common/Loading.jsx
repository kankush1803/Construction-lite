import React from 'react';

export default function Loading({ message = 'Loading system telemetry...' }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}
