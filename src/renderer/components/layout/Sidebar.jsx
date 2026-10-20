import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useDashboard();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '🏗️' },
    { id: 'equipment', label: 'Equipment & Fleet', icon: '🚜' },
    { id: 'manpower', label: 'Workforce', icon: '👷' },
    { id: 'safety', label: 'Safety & Risk', icon: '🦺' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">CM</div>
        <div className="brand-text">
          <h1>Construction</h1>
          <span>Monitor OS</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
