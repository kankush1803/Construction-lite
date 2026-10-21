import React from 'react';
import { DashboardProvider, useDashboardContext } from './context/DashboardContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Equipment from './pages/Equipment';
import Manpower from './pages/Manpower';
import Safety from './pages/Safety';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

import './styles/global.css';
import './styles/layout.css';
import './styles/dashboard.css';
import './styles/tables.css';
import './styles/components.css';

function PageRouter() {
  const { activeTab } = useDashboardContext();

  switch (activeTab) {
    case 'dashboard':
      return <Dashboard />;
    case 'projects':
      return <Projects />;
    case 'project_details':
      return <ProjectDetails />;
    case 'equipment':
      return <Equipment />;
    case 'manpower':
      return <Manpower />;
    case 'safety':
      return <Safety />;
    case 'alerts':
      return <Alerts />;
    case 'analytics':
      return <Analytics />;
    case 'settings':
      return <Settings />;
    default:
      return <Dashboard />;
  }
}

export default function App() {
  return (
    <DashboardProvider>
      <MainLayout>
        <PageRouter />
      </MainLayout>
    </DashboardProvider>
  );
}
