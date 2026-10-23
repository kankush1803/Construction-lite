import React from 'react';

export default function StatCard({ title, value, icon, change, isPositive = true, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-footer">
        {change && (
          <span className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
        <span>{subtitle || 'vs last week'}</span>
      </div>
    </div>
  );
}
