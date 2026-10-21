import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import StatCard from '../components/dashboard/StatCard';
import ProjectProgress from '../components/dashboard/ProjectProgress';
import EquipmentStatus from '../components/dashboard/EquipmentStatus';
import ManpowerSummary from '../components/dashboard/ManpowerSummary';
import SafetyOverview from '../components/dashboard/SafetyOverview';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import ProductivityChart from '../components/charts/ProductivityChart';
import EquipmentUsageChart from '../components/charts/EquipmentUsageChart';
import Loading from '../components/common/Loading';
import { alertService } from '../services/alert.service';

export default function Dashboard() {
  const { data, loading, error, setSelectedProjectId, setActiveTab, refresh } = useDashboard();

  if (loading && !data) {
    return <Loading message="Loading site operations dashboard..." />;
  }

  if (error && !data) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-rose)' }}>
        <h3>Error loading dashboard data: {error}</h3>
        <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={refresh}>
          Retry
        </button>
      </div>
    );
  }

  const stats = data?.stats || {};

  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    setActiveTab('project_details');
  };

  const handleAcknowledgeAlert = async (id) => {
    await alertService.acknowledge(id);
    refresh();
  };

  return (
    <div>
      {/* Top Metric Cards */}
      <div className="dashboard-grid">
        <StatCard
          title="Active Projects"
          value={`${stats.activeProjects || 0} / ${stats.totalProjects || 0}`}
          icon="🏗️"
          change="+1"
          isPositive={true}
          subtitle="Projects on track"
        />
        <StatCard
          title="Fleet Utilization"
          value={`${stats.equipmentUtilization || 0}%`}
          icon="🚜"
          change="+4%"
          isPositive={true}
          subtitle={`${stats.equipmentActive || 0} active units`}
        />
        <StatCard
          title="Workforce on Site"
          value={`${stats.manpowerOnSite || 0} / ${stats.manpowerTotal || 0}`}
          icon="👷"
          change="92%"
          isPositive={true}
          subtitle="Shift attendance"
        />
        <StatCard
          title="Incident-Free Days"
          value={`${stats.incidentFreeDays || 0}`}
          icon="🛡️"
          change="Goal: 365"
          isPositive={true}
          subtitle="Zero lost time injury"
        />
      </div>

      {/* Charts Row */}
      <div className="dashboard-row">
        <ProductivityChart data={data?.chartData?.productivityTrends} />
        <EquipmentUsageChart data={data?.chartData?.equipmentUsage} />
      </div>

      {/* Main Grid: Projects, Equipment, Workforce, Safety, Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        <ProjectProgress projects={data?.projects} onSelectProject={handleSelectProject} />
        <EquipmentStatus summary={data?.equipmentSummary} />
        <ManpowerSummary summary={data?.manpowerSummary} />
        <SafetyOverview safety={data?.safetyOverview} />
        <RecentAlerts alerts={data?.recentAlerts} onAcknowledge={handleAcknowledgeAlert} />
      </div>
    </div>
  );
}
