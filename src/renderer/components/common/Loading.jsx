import React from 'react';

export default function Loading({ message = 'Loading system telemetry...' }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
}
