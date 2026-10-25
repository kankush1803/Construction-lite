import React, { useState, useEffect } from 'react';
import { projectService } from '../services/project.service';
import { equipmentService } from '../services/equipment.service';
import { manpowerService } from '../services/manpower.service';
import StatusBadge from '../components/common/StatusBadge';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import ProjectProgressChart from '../components/charts/ProjectProgressChart';
import DataTable from '../components/common/DataTable';
import { useDashboard } from '../hooks/useDashboard';

export default function ProjectDetails() {
  const { selectedProjectId, setActiveTab } = useDashboard();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Allocation Modals State
  const [isAllocateEqOpen, setIsAllocateEqOpen] = useState(false);
  const [isAssignWorkerOpen, setIsAssignWorkerOpen] = useState(false);
  const [fleetEquipment, setFleetEquipment] = useState([]);
  const [workforce, setWorkforce] = useState([]);
  const [selectedEqIds, setSelectedEqIds] = useState([]);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState([]);
  const [eqSearch, setEqSearch] = useState('');
  const [workerSearch, setWorkerSearch] = useState('');
  const [eqModalTab, setEqModalTab] = useState('fleet'); // 'fleet' | 'new'
  const [workerModalTab, setWorkerModalTab] = useState('workforce'); // 'workforce' | 'new'
  const [isSavingResource, setIsSavingResource] = useState(false);

  // New Equipment Form State
  const [newEqData, setNewEqData] = useState({
    name: '',
    type: 'Excavator',
    serial_number: '',
    health_score: 95.0,
    status: 'Active',
    fuel_level: 85.0,
    hours_operated: 100.0,
    location: '',
  });

  // New Worker Form State
  const [newWorkerData, setNewWorkerData] = useState({
    full_name: '',
    role: 'Site Foreman',
    trade: 'Civil',
    shift: 'Day',
    status: 'On Site',
    safety_certified: true,
  });

  const refreshProject = async () => {
    const id = selectedProjectId || 1;
    const data = await projectService.getById(id);
    setProject(data);
  };

  useEffect(() => {
    const id = selectedProjectId || 1;
    projectService.getById(id).then((data) => {
      setProject(data);
      setLoading(false);
    });
  }, [selectedProjectId]);

  // Open Allocate Equipment Modal
  const handleOpenAllocateEquipment = async () => {
    try {
      const allEq = await equipmentService.getAll();
      setFleetEquipment(allEq || []);
      // Pre-select currently allocated
      const currentlyAllocated = (project?.equipment || []).map((e) => e.id);
      setSelectedEqIds(currentlyAllocated);
      setEqSearch('');
      setEqModalTab('fleet');
      setNewEqData({
        name: '',
        type: 'Excavator',
        serial_number: '',
        health_score: 95.0,
        status: 'Active',
        fuel_level: 85.0,
        hours_operated: 100.0,
        location: project?.location || 'Site Core',
      });
      setIsAllocateEqOpen(true);
    } catch (err) {
      console.error('Failed to load fleet equipment:', err);
    }
  };

  // Open Assign Personnel Modal
  const handleOpenAssignPersonnel = async () => {
    try {
      const allWorkers = await manpowerService.getAll();
      setWorkforce(allWorkers || []);
      // Pre-select currently assigned
      const currentlyAssigned = (project?.workers || []).map((w) => w.id);
      setSelectedWorkerIds(currentlyAssigned);
      setWorkerSearch('');
      setWorkerModalTab('workforce');
      setNewWorkerData({
        full_name: '',
        role: 'Site Foreman',
        trade: 'Civil',
        shift: 'Day',
        status: 'On Site',
        safety_certified: true,
      });
      setIsAssignWorkerOpen(true);
    } catch (err) {
      console.error('Failed to load workforce:', err);
    }
  };

  // Release/Deallocate single equipment
  const handleDeallocateEquipment = async (equipmentId, eqName, e) => {
    e?.stopPropagation();
    if (!window.confirm(`Are you sure you want to release "${eqName}" from ${project.name}?`)) {
      return;
    }
    try {
      await projectService.deallocateEquipment(project.id, equipmentId);
      await refreshProject();
    } catch (err) {
      console.error('Failed to deallocate machinery:', err);
      alert(err.message || 'Failed to release machinery');
    }
  };

  // Unassign single worker
  const handleUnassignWorker = async (workerId, workerName, e) => {
    e?.stopPropagation();
    if (!window.confirm(`Are you sure you want to unassign "${workerName}" from ${project.name}?`)) {
      return;
    }
    try {
      await projectService.unassignWorker(project.id, workerId);
      await refreshProject();
    } catch (err) {
      console.error('Failed to unassign personnel:', err);
      alert(err.message || 'Failed to unassign personnel');
    }
  };

  // Save Equipment Allocation Modal
  const handleSaveEquipmentAllocation = async () => {
    setIsSavingResource(true);
    try {
      if (eqModalTab === 'new') {
        if (!newEqData.name.trim() || !newEqData.serial_number.trim()) {
          alert('Machinery Name and Serial Number are required.');
          setIsSavingResource(false);
          return;
        }
        await projectService.createEquipmentForProject(project.id, newEqData);
      } else {
        await projectService.allocateEquipment(project.id, selectedEqIds);
      }
      await refreshProject();
      setIsAllocateEqOpen(false);
    } catch (err) {
      console.error('Failed to save equipment allocation:', err);
      alert(err.message || 'Failed to update equipment allocation');
    } finally {
      setIsSavingResource(false);
    }
  };

  // Save Personnel Assignment Modal
  const handleSavePersonnelAssignment = async () => {
    setIsSavingResource(true);
    try {
      if (workerModalTab === 'new') {
        if (!newWorkerData.full_name.trim() || !newWorkerData.role.trim()) {
          alert('Crew Member Full Name and Role are required.');
          setIsSavingResource(false);
          return;
        }
        await projectService.createWorkerForProject(project.id, newWorkerData);
      } else {
        await projectService.assignWorkers(project.id, selectedWorkerIds);
      }
      await refreshProject();
      setIsAssignWorkerOpen(false);
    } catch (err) {
      console.error('Failed to save personnel assignment:', err);
      alert(err.message || 'Failed to update personnel assignment');
    } finally {
      setIsSavingResource(false);
    }
  };

  if (loading) return <Loading message="Loading detailed project telemetry & allocation..." />;
  if (!project) {
    return (
      <div className="card-shell" style={{ padding: '32px', textAlign: 'center' }}>
        <h3>Project not found</h3>
        <button className="btn btn-secondary" style={{ marginTop: '12px' }} onClick={() => setActiveTab('projects')}>
          Back to Projects Directory
        </button>
      </div>
    );
  }

  // Equipment table columns matching user screenshot
  const equipmentColumns = [
    { key: 'serial_number', header: 'Serial No.', render: (val) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-primary-dark)' }}>{val}</span> },
    { key: 'name', header: 'Machinery Name', render: (val) => <strong style={{ color: 'var(--color-text)' }}>{val}</strong> },
    { key: 'type', header: 'Type' },
    {
      key: 'health_score',
      header: 'Health Score',
      render: (val) => (
        <span style={{ color: 'var(--color-success)', fontWeight: 650 }}>
          {val}/100
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          className="table-action-btn delete"
          onClick={(e) => handleDeallocateEquipment(row.id, row.name, e)}
          title="Release equipment from this project"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      ),
    },
  ];

  // Worker table columns matching user screenshot
  const workerColumns = [
    { key: 'full_name', header: 'Crew Member', render: (val) => <strong style={{ color: 'var(--color-text)' }}>{val}</strong> },
    { key: 'role', header: 'Role' },
    {
      key: 'trade',
      header: 'Trade',
      render: (val) => (
        <span
          style={{
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-input)',
            fontSize: '11.5px',
            fontWeight: 500,
          }}
        >
          {val}
        </span>
      ),
    },
    { key: 'shift', header: 'Shift' },
    { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          className="table-action-btn delete"
          onClick={(e) => handleUnassignWorker(row.id, row.full_name, e)}
          title="Unassign personnel from this project"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Navigation & Project Metadata Header */}
      <div className="card-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="btn btn-secondary" onClick={() => setActiveTab('projects')} title="Back to Projects">
            ← Back
          </button>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 650, color: 'var(--color-text)' }}>{project.name}</h2>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Code: <strong style={{ color: 'var(--color-primary-dark)' }}>{project.code || project.project_code}</strong> • Client: {project.client} • Location: {project.location}
            </div>
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="kpi-card">
          <span className="kpi-label">Contract Budget</span>
          <div className="kpi-value">${Number(project.budget).toLocaleString()}</div>
          <span className="kpi-subtext">Spent: ${Number(project.spent || 0).toLocaleString()}</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Project Completion</span>
          <div className="kpi-value">{project.progress}%</div>
          <span className="kpi-subtext">Target Date: {project.end_date || 'N/A'}</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Assigned Fleet</span>
          <div className="kpi-value">{project.equipment?.length || 0} Units</div>
          <span className="kpi-subtext">Active heavy machinery</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Deployed Crew</span>
          <div className="kpi-value">{project.workers?.length || 0} Workers</div>
          <span className="kpi-subtext">Certified on-site crew</span>
        </div>
      </div>

      {/* S-Curve Chart */}
      <ProjectProgressChart />

      {/* Split Cards: Machinery & Workforce assigned (Matching User Screenshot) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
        {/* Allocated Equipment Card */}
        <div className="card-shell">
          <div className="widget-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="widget-title">Allocated Equipment ({project.equipment?.length || 0})</h3>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '5px 12px' }}
              onClick={handleOpenAllocateEquipment}
            >
              + Allocate Equipment
            </button>
          </div>
          <DataTable
            columns={equipmentColumns}
            data={project.equipment || []}
            emptyMessage="No equipment allocated to this project yet. Click '+ Allocate Equipment' above."
          />
        </div>

        {/* Assigned Personnel Card */}
        <div className="card-shell">
          <div className="widget-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="widget-title">Assigned Personnel ({project.workers?.length || 0})</h3>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '5px 12px' }}
              onClick={handleOpenAssignPersonnel}
            >
              + Assign Personnel
            </button>
          </div>
          <DataTable
            columns={workerColumns}
            data={project.workers || []}
            emptyMessage="No personnel assigned to this project yet. Click '+ Assign Personnel' above."
          />
        </div>
      </div>

      {/* MODAL: Allocate Equipment */}
      <Modal
        isOpen={isAllocateEqOpen}
        onClose={() => setIsAllocateEqOpen(false)}
        title={`Allocate Equipment to ${project.name}`}
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Tabs: Select Existing vs Register New */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            <button
              className={`tab-pill ${eqModalTab === 'fleet' ? 'active' : ''}`}
              onClick={() => setEqModalTab('fleet')}
            >
              Select from Company Fleet ({fleetEquipment.length})
            </button>
            <button
              className={`tab-pill ${eqModalTab === 'new' ? 'active' : ''}`}
              onClick={() => setEqModalTab('new')}
            >
              + Register New Machine
            </button>
          </div>

          {eqModalTab === 'fleet' ? (
            <>
              <input
                type="text"
                className="form-input"
                placeholder="Search fleet machinery by name, serial no., or type..."
                value={eqSearch}
                onChange={(e) => setEqSearch(e.target.value)}
                style={{ fontSize: '12.5px' }}
              />

              <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {fleetEquipment
                  .filter((e) => {
                    if (!eqSearch) return true;
                    const q = eqSearch.toLowerCase();
                    return (
                      (e.name || '').toLowerCase().includes(q) ||
                      (e.serial_number || '').toLowerCase().includes(q) ||
                      (e.type || '').toLowerCase().includes(q)
                    );
                  })
                  .map((eq) => {
                    const isSelected = selectedEqIds.includes(eq.id);
                    const isCurrentProject = eq.project_id === project.id;
                    return (
                      <div
                        key={eq.id}
                        className={`allocation-item ${isSelected ? 'selected' : ''}`}
                        onClick={() =>
                          setSelectedEqIds((prev) =>
                            prev.includes(eq.id) ? prev.filter((id) => id !== eq.id) : [...prev, eq.id]
                          )
                        }
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                            style={{ cursor: 'pointer' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                                {eq.serial_number}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>• {eq.type}</span>
                              {isCurrentProject && (
                                <span style={{ fontSize: '10px', backgroundColor: 'rgba(92, 181, 164, 0.15)', color: 'var(--color-secondary-dark)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                  Currently Allocated
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                              {eq.name}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: 'var(--color-success)', fontWeight: 650, fontSize: '12px' }}>
                            {eq.health_score || 95}/100
                          </span>
                          <StatusBadge status={eq.status || 'Active'} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            /* Register New Machine Tab */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Machinery Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. CAT 336 Hydraulic Excavator"
                  value={newEqData.name}
                  onChange={(e) => setNewEqData({ ...newEqData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Serial Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. EQ-CAT-336-01"
                    value={newEqData.serial_number}
                    onChange={(e) => setNewEqData({ ...newEqData, serial_number: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Machinery Type</label>
                  <select
                    className="form-select"
                    value={newEqData.type}
                    onChange={(e) => setNewEqData({ ...newEqData, type: e.target.value })}
                  >
                    <option value="Excavator">Excavator</option>
                    <option value="Tower Crane">Tower Crane</option>
                    <option value="Bulldozer">Bulldozer</option>
                    <option value="Concrete Pump">Concrete Pump</option>
                    <option value="Dump Truck">Dump Truck</option>
                    <option value="Loader">Loader</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Health Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    className="form-input"
                    value={newEqData.health_score}
                    onChange={(e) => setNewEqData({ ...newEqData, health_score: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newEqData.status}
                    onChange={(e) => setNewEqData({ ...newEqData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Idle">Idle</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setIsAllocateEqOpen(false)} disabled={isSavingResource}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveEquipmentAllocation} disabled={isSavingResource}>
              {isSavingResource ? 'Saving...' : eqModalTab === 'new' ? 'Register & Allocate Machinery' : `Save Allocation (${selectedEqIds.length})`}
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL: Assign Personnel */}
      <Modal
        isOpen={isAssignWorkerOpen}
        onClose={() => setIsAssignWorkerOpen(false)}
        title={`Assign Personnel to ${project.name}`}
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            <button
              className={`tab-pill ${workerModalTab === 'workforce' ? 'active' : ''}`}
              onClick={() => setWorkerModalTab('workforce')}
            >
              Select from Workforce ({workforce.length})
            </button>
            <button
              className={`tab-pill ${workerModalTab === 'new' ? 'active' : ''}`}
              onClick={() => setWorkerModalTab('new')}
            >
              + Register New Worker
            </button>
          </div>

          {workerModalTab === 'workforce' ? (
            <>
              <input
                type="text"
                className="form-input"
                placeholder="Search crew members by name, role, or trade..."
                value={workerSearch}
                onChange={(e) => setWorkerSearch(e.target.value)}
                style={{ fontSize: '12.5px' }}
              />

              <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {workforce
                  .filter((w) => {
                    if (!workerSearch) return true;
                    const q = workerSearch.toLowerCase();
                    return (
                      (w.full_name || '').toLowerCase().includes(q) ||
                      (w.role || '').toLowerCase().includes(q) ||
                      (w.trade || '').toLowerCase().includes(q)
                    );
                  })
                  .map((worker) => {
                    const isSelected = selectedWorkerIds.includes(worker.id);
                    const isCurrentProject = worker.project_id === project.id;
                    return (
                      <div
                        key={worker.id}
                        className={`allocation-item ${isSelected ? 'selected' : ''}`}
                        onClick={() =>
                          setSelectedWorkerIds((prev) =>
                            prev.includes(worker.id) ? prev.filter((id) => id !== worker.id) : [...prev, worker.id]
                          )
                        }
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                            style={{ cursor: 'pointer' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 650, color: 'var(--color-text)' }}>
                                {worker.full_name}
                              </span>
                              <span
                                style={{
                                  backgroundColor: 'var(--color-surface-subtle)',
                                  border: '1px solid var(--color-border)',
                                  borderRadius: '3px',
                                  padding: '1px 6px',
                                  fontSize: '10.5px',
                                  fontWeight: 500,
                                }}
                              >
                                {worker.trade}
                              </span>
                              {isCurrentProject && (
                                <span style={{ fontSize: '10px', backgroundColor: 'rgba(92, 181, 164, 0.15)', color: 'var(--color-secondary-dark)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                  Currently Assigned
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                              {worker.role} • {worker.shift || 'Day'} Shift
                            </div>
                          </div>
                        </div>

                        <StatusBadge status={worker.status || 'On Site'} />
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            /* Register New Worker Tab */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Marcus Vance"
                  value={newWorkerData.full_name}
                  onChange={(e) => setNewWorkerData({ ...newWorkerData, full_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Role / Job Function *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Site Foreman"
                    value={newWorkerData.role}
                    onChange={(e) => setNewWorkerData({ ...newWorkerData, role: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Trade Specialty</label>
                  <select
                    className="form-select"
                    value={newWorkerData.trade}
                    onChange={(e) => setNewWorkerData({ ...newWorkerData, trade: e.target.value })}
                  >
                    <option value="Civil">Civil</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Safety">Safety</option>
                    <option value="Structural">Structural</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Shift</label>
                  <select
                    className="form-select"
                    value={newWorkerData.shift}
                    onChange={(e) => setNewWorkerData({ ...newWorkerData, shift: e.target.value })}
                  >
                    <option value="Day">Day Shift</option>
                    <option value="Morning">Morning Shift</option>
                    <option value="Night">Night Shift</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newWorkerData.status}
                    onChange={(e) => setNewWorkerData({ ...newWorkerData, status: e.target.value })}
                  >
                    <option value="On Site">On Site</option>
                    <option value="On Break">On Break</option>
                    <option value="Off Site">Off Site</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setIsAssignWorkerOpen(false)} disabled={isSavingResource}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSavePersonnelAssignment} disabled={isSavingResource}>
              {isSavingResource ? 'Saving...' : workerModalTab === 'new' ? 'Register & Assign Personnel' : `Save Assignment (${selectedWorkerIds.length})`}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
