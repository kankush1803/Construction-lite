import React from 'react';

export default function StatusBadge({ status = 'Normal' }) {
  const normalized = String(status).toLowerCase().replace(/\s+/g, '-');
  return <span className={`status-badge ${normalized}`}>{status}</span>;
}
