import React, { useState, useMemo } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import Loading from '../components/common/Loading';
import BudgetVarianceChart from '../components/charts/BudgetVarianceChart';
import CostBreakdownChart from '../components/charts/CostBreakdownChart';
import WorkloadChart from '../components/charts/WorkloadChart';
import PlannedVsActualResourcesChart from '../components/charts/PlannedVsActualResourcesChart';
import ProjectProgress from '../components/dashboard/ProjectProgress';
import EquipmentStatus from '../components/dashboard/EquipmentStatus';
import ManpowerSummary from '../components/dashboard/ManpowerSummary';
import SafetyOverview from '../components/dashboard/SafetyOverview';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import { alertService } from '../services/alert.service';

export default function Dashboard() {
  const { data, loading, error, setSelectedProjectId, setActiveTab, refresh } = useDashboard();
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [showOperationsDeck, setShowOperationsDeck] = useState(false);

  const rawProjects = data?.projects || [];
  const stats = data?.stats || {};

  // Comprehensive project catalog definitions
  const projectProfiles = {
    1: {
      key: 'skyline',
      shortName: 'Skyline',
      fullName: 'Skyline Heights Tower A',
      scheduleVariance: '+$142.0K',
      costVariance: '+$1.8M',
      spi: '1.05',
      duration: '282 days',
      completion: 68.5,
      cpi: '1.12',
      eac: '$43.2M',
      manpowerUtil: '108.5%',
      spent: 28500000,
      budget: 45000000,
      budgetVarianceData: [
        { name: 'Phase 1', actual: 620, planned: 610 },
        { name: 'Phase 2', actual: 580, planned: 550 },
        { name: 'Phase 3', actual: 560, planned: 575 },
        { name: 'Phase 4', actual: 540, planned: 580 },
        { name: 'Phase 5', actual: 480, planned: 450 },
      ],
      costBreakdownData: [
        { name: 'Material', value: 94, displayValue: '$9.4M', percent: '33.0%', color: '#7774D6' },
        { name: 'Equipment', value: 68, displayValue: '$6.8M', percent: '23.9%', color: '#A8A4E8' },
        { name: 'Labor', value: 62, displayValue: '$6.2M', percent: '21.8%', color: '#D8D5F5' },
        { name: 'Subcontractors', value: 41, displayValue: '$4.1M', percent: '14.4%', color: '#5CB5A4' },
        { name: 'Engineering', value: 20, displayValue: '$2.0M', percent: '7.0%', color: '#286F8D' },
      ],
      workloadData: [
        { name: 'Structural Frame', completed: 230, remaining: 65, overdue: 0 },
        { name: 'Concrete Slabs', completed: 210, remaining: 70, overdue: 15 },
        { name: 'MEP Rough-in', completed: 185, remaining: 80, overdue: 0 },
        { name: 'Facade Glass', completed: 140, remaining: 75, overdue: 0 },
        { name: 'Interior Fitout', completed: 95, remaining: 110, overdue: 0 },
      ],
      resourcesData: [
        { name: 'Civil', planned: 190, actual: 215 },
        { name: 'Structural', planned: 240, actual: 270 },
        { name: 'Mechanical', planned: 180, actual: 195 },
        { name: 'Electrical', planned: 140, actual: 165 },
        { name: 'Heavy Fleet', planned: 220, actual: 245 },
      ],
    },
    2: {
      key: 'riverfront',
      shortName: 'Riverfront',
      fullName: 'Riverfront Commercial Plaza',
      scheduleVariance: '-$165.0K',
      costVariance: '+$2.4M',
      spi: '0.93',
      duration: '237 days',
      completion: 43.0,
      cpi: '1.08',
      eac: '$69.6M',
      manpowerUtil: '94.0%',
      spent: 31000000,
      budget: 72000000,
      budgetVarianceData: [
        { name: 'Phase 1', actual: 710, planned: 680 },
        { name: 'Phase 2', actual: 660, planned: 620 },
        { name: 'Phase 3', actual: 590, planned: 610 },
        { name: 'Phase 4', actual: 530, planned: 570 },
        { name: 'Phase 5', actual: 470, planned: 430 },
      ],
      costBreakdownData: [
        { name: 'Material', value: 112, displayValue: '$11.2M', percent: '36.1%', color: '#7774D6' },
        { name: 'Equipment', value: 75, displayValue: '$7.5M', percent: '24.2%', color: '#A8A4E8' },
        { name: 'Labor', value: 65, displayValue: '$6.5M', percent: '21.0%', color: '#D8D5F5' },
        { name: 'Subcontractors', value: 38, displayValue: '$3.8M', percent: '12.3%', color: '#5CB5A4' },
        { name: 'Engineering', value: 20, displayValue: '$2.0M', percent: '6.5%', color: '#286F8D' },
      ],
      workloadData: [
        { name: 'Deep Piling', completed: 210, remaining: 40, overdue: 0 },
        { name: 'Basement Deck', completed: 185, remaining: 65, overdue: 25 },
        { name: 'Podium Core', completed: 150, remaining: 90, overdue: 10 },
        { name: 'Cranes Support', completed: 135, remaining: 80, overdue: 0 },
        { name: 'Retaining Wall', completed: 120, remaining: 60, overdue: 0 },
      ],
      resourcesData: [
        { name: 'Foundation', planned: 230, actual: 280 },
        { name: 'Concrete Crew', planned: 210, actual: 240 },
        { name: 'Tower Cranes', planned: 260, actual: 290 },
        { name: 'Steel Fixing', planned: 175, actual: 210 },
        { name: 'Site Logistics', planned: 200, actual: 235 },
      ],
    },
    3: {
      key: 'greenwood',
      shortName: 'Greenwood',
      fullName: 'Greenwood Logistics Hub',
      scheduleVariance: '+$285.0K',
      costVariance: '+$820.0K',
      spi: '1.12',
      duration: '388 days',
      completion: 91.2,
      cpi: '1.18',
      eac: '$17.7M',
      manpowerUtil: '115.0%',
      spent: 16800000,
      budget: 18500000,
      budgetVarianceData: [
        { name: 'Phase 1', actual: 590, planned: 580 },
        { name: 'Phase 2', actual: 560, planned: 530 },
        { name: 'Phase 3', actual: 540, planned: 520 },
        { name: 'Phase 4', actual: 510, planned: 490 },
        { name: 'Phase 5', actual: 460, planned: 420 },
      ],
      costBreakdownData: [
        { name: 'Material', value: 58, displayValue: '$5.8M', percent: '34.5%', color: '#7774D6' },
        { name: 'Equipment', value: 42, displayValue: '$4.2M', percent: '25.0%', color: '#A8A4E8' },
        { name: 'Labor', value: 37, displayValue: '$3.7M', percent: '22.0%', color: '#D8D5F5' },
        { name: 'Subcontractors', value: 21, displayValue: '$2.1M', percent: '12.5%', color: '#5CB5A4' },
        { name: 'Engineering', value: 10, displayValue: '$1.0M', percent: '6.0%', color: '#286F8D' },
      ],
      workloadData: [
        { name: 'High-bay Steel', completed: 280, remaining: 20, overdue: 0 },
        { name: 'Laser Flooring', completed: 250, remaining: 15, overdue: 0 },
        { name: 'Loading Docks', completed: 210, remaining: 25, overdue: 0 },
        { name: 'Solar Arrays', completed: 180, remaining: 30, overdue: 0 },
        { name: 'Automated Sort', completed: 160, remaining: 40, overdue: 0 },
      ],
      resourcesData: [
        { name: 'Pavement Crew', planned: 205, actual: 245 },
        { name: 'Steel Erectors', planned: 215, actual: 260 },
        { name: 'Industrial Elec', planned: 250, actual: 310 },
        { name: 'Dock Installers', planned: 150, actual: 195 },
        { name: 'Safety / QA', planned: 220, actual: 255 },
      ],
    },
    4: {
      key: 'oakwood',
      shortName: 'Oakwood',
      fullName: 'Oakwood Medical Center',
      scheduleVariance: '+$45.0K',
      costVariance: '+$310.0K',
      spi: '1.01',
      duration: '84 days',
      completion: 14.0,
      cpi: '1.06',
      eac: '$37.2M',
      manpowerUtil: '88.5%',
      spent: 5200000,
      budget: 38000000,
      budgetVarianceData: [
        { name: 'Phase 1', actual: 490, planned: 480 },
        { name: 'Phase 2', actual: 460, planned: 450 },
        { name: 'Phase 3', actual: 440, planned: 430 },
        { name: 'Phase 4', actual: 410, planned: 420 },
        { name: 'Phase 5', actual: 380, planned: 390 },
      ],
      costBreakdownData: [
        { name: 'Material', value: 18, displayValue: '$1.8M', percent: '34.6%', color: '#7774D6' },
        { name: 'Equipment', value: 12, displayValue: '$1.2M', percent: '23.1%', color: '#A8A4E8' },
        { name: 'Labor', value: 11, displayValue: '$1.1M', percent: '21.2%', color: '#D8D5F5' },
        { name: 'Subcontractors', value: 7, displayValue: '$0.7M', percent: '13.5%', color: '#5CB5A4' },
        { name: 'Engineering', value: 4, displayValue: '$0.4M', percent: '7.7%', color: '#286F8D' },
      ],
      workloadData: [
        { name: 'Environmental', completed: 140, remaining: 25, overdue: 0 },
        { name: 'Utility Relocate', completed: 110, remaining: 60, overdue: 0 },
        { name: 'Shoring Piles', completed: 80, remaining: 120, overdue: 0 },
        { name: 'Mass Excavate', completed: 45, remaining: 165, overdue: 0 },
        { name: 'Base Footings', completed: 10, remaining: 220, overdue: 0 },
      ],
      resourcesData: [
        { name: 'Survey & Civil', planned: 180, actual: 195 },
        { name: 'Earthmoving', planned: 170, actual: 185 },
        { name: 'Geotechnical', planned: 210, actual: 230 },
        { name: 'Utility Teams', planned: 135, actual: 150 },
        { name: 'Site Clearing', planned: 160, actual: 175 },
      ],
    },
  };

  // Filter projects by status first
  const statusFilteredProjects = useMemo(() => {
    if (selectedStatusFilter === 'All') return rawProjects;
    return rawProjects.filter((p) => p.status === selectedStatusFilter);
  }, [rawProjects, selectedStatusFilter]);

  // Find selected active project profile
  const activeProfile = useMemo(() => {
    if (selectedProjectFilter === 'All') return null;
    const directMatch = projectProfiles[selectedProjectFilter];
    if (directMatch) return directMatch;

    // Search by name match (Skyline, Riverfront, Greenwood, Oakwood)
    const lower = String(selectedProjectFilter).toLowerCase();
    const entry = Object.values(projectProfiles).find(
      (p) => p.key === lower || p.shortName.toLowerCase() === lower || p.fullName.toLowerCase().includes(lower)
    );
    return entry || null;
  }, [selectedProjectFilter]);

  // Calculate dynamic metrics
  const displayMetrics = useMemo(() => {
    if (activeProfile) {
      const budget = activeProfile.budget;
      const spent = activeProfile.spent;
      const utilizedPercent = ((spent / budget) * 100).toFixed(1);

      return {
        scheduleVariance: activeProfile.scheduleVariance,
        costVariance: activeProfile.costVariance,
        spi: activeProfile.spi,
        duration: activeProfile.duration,
        completion: activeProfile.completion,
        cpi: activeProfile.cpi,
        eac: activeProfile.eac,
        manpowerUtil: activeProfile.manpowerUtil,
        totalBudget: budget,
        totalSpent: spent,
        utilizedPercent: utilizedPercent,
        spentFormatted: `$${(spent / 1000000).toFixed(1)}M`,
        budgetFormatted: `$${(budget / 1000000).toFixed(1)}M`,
        budgetVarianceTitle: `Budget Variance - ${activeProfile.shortName} ($K)`,
        budgetVarianceData: activeProfile.budgetVarianceData,
        costBreakdownTitle: `Cost Breakdown - ${activeProfile.shortName}`,
        costBreakdownData: activeProfile.costBreakdownData,
        workloadTitle: `Workload - ${activeProfile.shortName} Work Packages`,
        workloadData: activeProfile.workloadData,
        resourcesTitle: `Actual vs. Planned Resources - ${activeProfile.shortName}`,
        resourcesData: activeProfile.resourcesData,
      };
    }

    // Filter by selectedStatusFilter ('In Progress', 'Near Completion', 'Planning', 'All')
    if (selectedStatusFilter === 'In Progress') {
      return {
        scheduleVariance: '-$23.0K',
        costVariance: '+$4.2M',
        spi: '0.99',
        duration: '519 days',
        completion: 55.8,
        cpi: '1.10',
        eac: '$112.8M',
        manpowerUtil: '101.3%',
        totalBudget: 117000000,
        totalSpent: 59500000,
        utilizedPercent: '50.9',
        spentFormatted: '$59.5M',
        budgetFormatted: '$117.0M',
        budgetVarianceTitle: 'Budget Variance - In Progress Projects ($K)',
        budgetVarianceData: [
          { name: 'Skyline', actual: 620, planned: 610 },
          { name: 'Riverfront', actual: 710, planned: 680 },
          { name: 'Structural', actual: 580, planned: 550 },
          { name: 'Piling Deck', actual: 660, planned: 620 },
          { name: 'MEP Systems', actual: 540, planned: 570 },
        ],
        costBreakdownTitle: 'Cost Breakdown - In Progress ($59.5M)',
        costBreakdownData: [
          { name: 'Material', value: 206, percent: '34.6%', displayValue: '$20.6M', color: '#7774D6' },
          { name: 'Equipment', value: 143, percent: '24.0%', displayValue: '$14.3M', color: '#A8A4E8' },
          { name: 'Labor', value: 127, percent: '21.3%', displayValue: '$12.7M', color: '#D8D5F5' },
          { name: 'Subcontractors', value: 79, percent: '13.3%', displayValue: '$7.9M', color: '#5CB5A4' },
          { name: 'Engineering', value: 40, percent: '6.7%', displayValue: '$4.0M', color: '#286F8D' },
        ],
        workloadTitle: 'Workload - In Progress Packages',
        workloadData: [
          { name: 'Structural Frame', completed: 230, remaining: 65, overdue: 0 },
          { name: 'Deep Piling', completed: 210, remaining: 40, overdue: 0 },
          { name: 'Concrete Slabs', completed: 210, remaining: 70, overdue: 15 },
          { name: 'Basement Deck', completed: 185, remaining: 65, overdue: 25 },
          { name: 'Facade Glass', completed: 140, remaining: 75, overdue: 0 },
        ],
        resourcesTitle: 'Actual vs. Planned Resources - In Progress Sites',
        resourcesData: [
          { name: 'Civil & Piling', planned: 230, actual: 280 },
          { name: 'Structural Steel', planned: 240, actual: 270 },
          { name: 'Tower Cranes', planned: 260, actual: 290 },
          { name: 'Concrete Crew', planned: 210, actual: 240 },
          { name: 'MEP Teams', planned: 180, actual: 195 },
        ],
      };
    }

    if (selectedStatusFilter === 'Near Completion') {
      const p3 = projectProfiles[3];
      return {
        scheduleVariance: p3.scheduleVariance,
        costVariance: p3.costVariance,
        spi: p3.spi,
        duration: p3.duration,
        completion: p3.completion,
        cpi: p3.cpi,
        eac: p3.eac,
        manpowerUtil: p3.manpowerUtil,
        totalBudget: p3.budget,
        totalSpent: p3.spent,
        utilizedPercent: ((p3.spent / p3.budget) * 100).toFixed(1),
        spentFormatted: `$${(p3.spent / 1000000).toFixed(1)}M`,
        budgetFormatted: `$${(p3.budget / 1000000).toFixed(1)}M`,
        budgetVarianceTitle: `Budget Variance - Near Completion (${p3.shortName}) ($K)`,
        budgetVarianceData: p3.budgetVarianceData,
        costBreakdownTitle: `Cost Breakdown - Near Completion (${p3.shortName})`,
        costBreakdownData: p3.costBreakdownData,
        workloadTitle: `Workload - Near Completion Packages (${p3.shortName})`,
        workloadData: p3.workloadData,
        resourcesTitle: `Actual vs. Planned Resources - Near Completion (${p3.shortName})`,
        resourcesData: p3.resourcesData,
      };
    }

    if (selectedStatusFilter === 'Planning') {
      const p4 = projectProfiles[4];
      return {
        scheduleVariance: p4.scheduleVariance,
        costVariance: p4.costVariance,
        spi: p4.spi,
        duration: p4.duration,
        completion: p4.completion,
        cpi: p4.cpi,
        eac: p4.eac,
        manpowerUtil: p4.manpowerUtil,
        totalBudget: p4.budget,
        totalSpent: p4.spent,
        utilizedPercent: ((p4.spent / p4.budget) * 100).toFixed(1),
        spentFormatted: `$${(p4.spent / 1000000).toFixed(1)}M`,
        budgetFormatted: `$${(p4.budget / 1000000).toFixed(1)}M`,
        budgetVarianceTitle: `Budget Variance - Planning Phase (${p4.shortName}) ($K)`,
        budgetVarianceData: p4.budgetVarianceData,
        costBreakdownTitle: `Cost Breakdown - Planning Phase (${p4.shortName})`,
        costBreakdownData: p4.costBreakdownData,
        workloadTitle: `Workload - Planning & Mobilization (${p4.shortName})`,
        workloadData: p4.workloadData,
        resourcesTitle: `Actual vs. Planned Resources - Planning Phase (${p4.shortName})`,
        resourcesData: p4.resourcesData,
      };
    }

    // Default Portfolio "All" View across all statuses
    return {
      scheduleVariance: '+$307.0K',
      costVariance: '+$5.3M',
      spi: '1.03',
      duration: '991 days',
      completion: 54.2,
      cpi: '1.11',
      eac: '$167.7M',
      manpowerUtil: '101.5%',
      totalBudget: 173500000,
      totalSpent: 81500000,
      utilizedPercent: '47.0',
      spentFormatted: '$81.5M',
      budgetFormatted: '$173.5M',
      budgetVarianceTitle: 'Budget Variance - All Projects ($K)',
      budgetVarianceData: [
        { name: 'Skyline', actual: 620, planned: 610 },
        { name: 'Riverfront', actual: 710, planned: 680 },
        { name: 'Greenwood', actual: 590, planned: 580 },
        { name: 'Oakwood', actual: 490, planned: 480 },
        { name: 'Portfolio', actual: 602, planned: 588 },
      ],
      costBreakdownTitle: 'Cost Breakdown - All Projects ($81.5M)',
      costBreakdownData: [
        { name: 'Material', value: 282, percent: '34.6%', displayValue: '$28.2M', color: '#7774D6' },
        { name: 'Equipment', value: 197, percent: '24.2%', displayValue: '$19.7M', color: '#A8A4E8' },
        { name: 'Labor', value: 175, percent: '21.5%', displayValue: '$17.5M', color: '#D8D5F5' },
        { name: 'Subcontractors', value: 107, percent: '13.1%', displayValue: '$10.7M', color: '#5CB5A4' },
        { name: 'Engineering', value: 54, percent: '6.6%', displayValue: '$5.4M', color: '#286F8D' },
      ],
      workloadTitle: 'Workload - All Project Packages',
      workloadData: [
        { name: 'Skyline Tower', completed: 230, remaining: 65, overdue: 0 },
        { name: 'Riverfront Plaza', completed: 200, remaining: 75, overdue: 30 },
        { name: 'Greenwood Hub', completed: 280, remaining: 20, overdue: 0 },
        { name: 'Oakwood Medical', completed: 80, remaining: 120, overdue: 0 },
        { name: 'Site Logistics', completed: 160, remaining: 40, overdue: 0 },
      ],
      resourcesTitle: 'Actual vs. Planned Resources - All Projects',
      resourcesData: [
        { name: 'Civil & Foundation', planned: 245, actual: 285 },
        { name: 'Structural Steel', planned: 230, actual: 265 },
        { name: 'Heavy Fleet', planned: 260, actual: 295 },
        { name: 'Mechanical & MEP', planned: 215, actual: 245 },
        { name: 'Site Operations', planned: 200, actual: 230 },
      ],
    };
  }, [activeProfile, statusFilteredProjects, selectedStatusFilter, stats]);

  if (loading && !data) {
    return <Loading message="Loading site operations and project telemetry..." />;
  }

  if (error && !data) {
    return (
      <div className="card-shell" style={{ padding: '32px', textAlign: 'center', maxWidth: '480px', margin: '40px auto' }}>
        <h3 style={{ color: 'var(--color-danger)', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
          Unable to Load Dashboard Data
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
        <button className="btn btn-secondary" onClick={refresh}>
          Retry Connection
        </button>
      </div>
    );
  }

  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    setActiveTab('project_details');
  };

  const handleAcknowledgeAlert = async (id) => {
    await alertService.acknowledge(id);
    refresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 3-Zone Composition directly matching the reference screenshot and design.md */}
      <div className="dashboard-grid-3zone">
        {/* ================= ZONE 1: LEFT REGION (~37%) ================= */}
        <div className="dashboard-column">
          {/* Row 1: Project Filter + Schedule Variance + Cost Variance */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 1fr) 1fr 1fr', gap: '12px' }}>
            <div className="filter-card">
              <label htmlFor="filter-project" className="filter-label">Projects</label>
              <select
                id="filter-project"
                className="filter-select"
                value={selectedProjectFilter}
                onChange={(e) => setSelectedProjectFilter(e.target.value)}
              >
                <option value="All">{selectedStatusFilter !== 'All' ? `All (${selectedStatusFilter})` : 'All'}</option>
                {statusFilteredProjects.map((p) => {
                  const shortName = p.name.split(' ')[0];
                  return (
                    <option key={p.id} value={p.id}>
                      {shortName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Schedule Variance</span>
              <div className="kpi-value">{displayMetrics.scheduleVariance}</div>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Cost Variance</span>
              <div className="kpi-value">{displayMetrics.costVariance}</div>
            </div>
          </div>

          {/* Row 2: Status Filter + Schedule Performance Index + Utilized Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 1fr) 1fr 1fr', gap: '12px' }}>
            <div className="filter-card">
              <label htmlFor="filter-status" className="filter-label">Project Status</label>
              <select
                id="filter-status"
                className="filter-select"
                value={selectedStatusFilter}
                onChange={(e) => {
                  setSelectedStatusFilter(e.target.value);
                  setSelectedProjectFilter('All');
                }}
              >
                <option value="All">All</option>
                <option value="In Progress">In Progress</option>
                <option value="Planning">Planning</option>
                <option value="Near Completion">Near Completion</option>
              </select>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Schedule Performance Index</span>
              <div className="kpi-value">{displayMetrics.spi}</div>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Utilized Duration</span>
              <div className="kpi-value">{displayMetrics.duration}</div>
            </div>
          </div>

          {/* Row 3: Project Completion Rate + Cost Performance Index */}
          <div className="kpi-grid-2col">
            <div className="kpi-card">
              <span className="kpi-label">Project Completion Rate</span>
              <div className="kpi-value">{displayMetrics.completion}%</div>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Cost Performance Index</span>
              <div className="kpi-value">{displayMetrics.cpi}</div>
            </div>
          </div>

          {/* Row 4: Estimate at Completion + Manpower Utilization */}
          <div className="kpi-grid-2col">
            <div className="kpi-card">
              <span className="kpi-label">Estimate at Completion</span>
              <div className="kpi-value">{displayMetrics.eac}</div>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Manpower Utilization</span>
              <div className="kpi-value">{displayMetrics.manpowerUtil}</div>
            </div>
          </div>

          {/* Budget Variance Line Chart */}
          <BudgetVarianceChart
            title={displayMetrics.budgetVarianceTitle}
            data={displayMetrics.budgetVarianceData}
          />
        </div>

        {/* ================= ZONE 2: CENTER REGION (~29%) ================= */}
        <div className="dashboard-column">
          {/* Utilized Budget Card */}
          <div className="utilized-budget-card">
            <div className="utilized-budget-percent">{displayMetrics.utilizedPercent}%</div>
            <div className="utilized-budget-label">Utilized Budget</div>

            <div className="utilized-budget-subgrid">
              <div className="budget-submetric-item">
                <div className="budget-submetric-value">
                  {displayMetrics.spentFormatted}
                </div>
                <div className="budget-submetric-label">Amount Spent</div>
              </div>
              <div className="budget-submetric-item">
                <div className="budget-submetric-value">
                  {displayMetrics.budgetFormatted}
                </div>
                <div className="budget-submetric-label">Total Budget</div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Donut + Category Table */}
          <CostBreakdownChart
            title={displayMetrics.costBreakdownTitle}
            data={displayMetrics.costBreakdownData}
          />
        </div>

        {/* ================= ZONE 3: RIGHT REGION (~34%) ================= */}
        <div className="dashboard-column">
          {/* Workload Horizontal Stacked Bar */}
          <WorkloadChart
            title={displayMetrics.workloadTitle}
            data={displayMetrics.workloadData}
          />

          {/* Actual vs. Planned Resources Combo Chart */}
          <PlannedVsActualResourcesChart
            title={displayMetrics.resourcesTitle}
            data={displayMetrics.resourcesData}
          />
        </div>
      </div>

      {/* Operations Deck Expander */}
      <div style={{ marginTop: '8px' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setShowOperationsDeck(!showOperationsDeck)}
          style={{ width: '100%', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 'var(--radius-card)' }}
        >
          <span style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span>Live Field Telemetry & Site Operations ({data?.recentAlerts?.length || 0} active alerts • {stats.equipmentActive || 0} units active)</span>
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
            {showOperationsDeck ? '▲ Hide Operations Deck' : '▼ View Operations Deck'}
          </span>
        </button>

        {showOperationsDeck && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '16px',
              marginTop: '16px',
            }}
          >
            <ProjectProgress projects={statusFilteredProjects} onSelectProject={handleSelectProject} />
            <EquipmentStatus summary={data?.equipmentSummary} />
            <ManpowerSummary summary={data?.manpowerSummary} />
            <SafetyOverview safety={data?.safetyOverview} />
            <RecentAlerts alerts={data?.recentAlerts} onAcknowledge={handleAcknowledgeAlert} />
          </div>
        )}
      </div>
    </div>
  );
}
