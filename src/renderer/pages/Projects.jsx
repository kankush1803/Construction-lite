import React, { useState, useEffect } from 'react';
import { projectService } from '../services/project.service';
import { equipmentService } from '../services/equipment.service';
import { manpowerService } from '../services/manpower.service';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { useDashboard } from '../hooks/useDashboard';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Multi-step resource allocation state
  const [modalStep, setModalStep] = useState(1);
  const [createdProject, setCreatedProject] = useState(null);
  const [allEquipment, setAllEquipment] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState([]);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState([]);
  const [eqSearch, setEqSearch] = useState('');
  const [workerSearch, setWorkerSearch] = useState('');
  const [isAllocating, setIsAllocating] = useState(false);
  const [showAddEquipmentForm, setShowAddEquipmentForm] = useState(false);
  const [showAddWorkerForm, setShowAddWorkerForm] = useState(false);
  const [newEqData, setNewEqData] = useState({ name: '', type: 'Excavator', serial_number: '', health_score: 95.0, status: 'Active', location: 'Site Core' });
  const [newWorkerData, setNewWorkerData] = useState({ full_name: '', role: 'Site Foreman', trade: 'Civil', shift: 'Day', status: 'On Site' });

  const { setSelectedProjectId, setActiveTab } = useDashboard();

  // Initial form state with default progress 0%
  const initialForm = {
    code: '',
    name: '',
    client: '',
    location: '',
    budget: '',
    progress: 0,
    status: 'Planned',
  };

  const [formData, setFormData] = useState(initialForm);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showToast = (message) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData(initialForm);
    setValidationErrors({});
    setFormError(null);
    setModalStep(1);
    setCreatedProject(null);
    setSelectedEquipmentIds([]);
    setSelectedWorkerIds([]);
    setShowAddEquipmentForm(false);
    setShowAddWorkerForm(false);
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (project, e) => {
    e?.stopPropagation();
    setEditingProject(project);
    setFormData({
      code: project.code || project.project_code || '',
      name: project.name || '',
      client: project.client || '',
      location: project.location || '',
      budget: project.budget !== undefined ? project.budget : '',
      progress: project.progress !== undefined ? project.progress : 0,
      status: project.status || 'Planned',
    });
    setValidationErrors({});
    setFormError(null);
    setModalStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting || isAllocating) return;
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(initialForm);
    setValidationErrors({});
    setFormError(null);
    setModalStep(1);
    setCreatedProject(null);
    setSelectedEquipmentIds([]);
    setSelectedWorkerIds([]);
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.code || !formData.code.trim()) {
      errors.code = 'Project Code is required (e.g. PRJ-2026-005)';
    }
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Project Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Project Name must be at least 2 characters';
    }
    if (!formData.client || !formData.client.trim()) {
      errors.client = 'Client or Organization is required';
    }
    if (!formData.location || !formData.location.trim()) {
      errors.location = 'Site Location is required';
    }
    if (formData.budget === '' || formData.budget === null || isNaN(formData.budget)) {
      errors.budget = 'Valid positive budget amount is required';
    } else if (Number(formData.budget) <= 0) {
      errors.budget = 'Budget must be greater than zero';
    }
    if (formData.progress === '' || isNaN(formData.progress)) {
      errors.progress = 'Progress percentage must be between 0 and 100';
    } else if (Number(formData.progress) < 0 || Number(formData.progress) > 100) {
      errors.progress = 'Progress must be between 0 and 100%';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear inline error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e, proceedToAllocation = true) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormError(null);

    const todayStr = new Date().toISOString().split('T')[0];
    const nextYearStr = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const payload = {
      code: formData.code.trim().toUpperCase(),
      project_code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      client: formData.client.trim(),
      location: formData.location.trim(),
      budget: Number(formData.budget),
      progress: Number(formData.progress),
      status: formData.status,
      start_date: todayStr,
      end_date: nextYearStr,
    };

    try {
      if (editingProject) {
        await projectService.update(editingProject.id, payload);
        showToast(`Project "${payload.name}" updated successfully.`);
        await fetchProjects();
        handleCloseModal();
      } else {
        const created = await projectService.create(payload);
        const resolved = created || { ...payload, id: Date.now() };
        setCreatedProject(resolved);
        await fetchProjects();

        if (proceedToAllocation) {
          try {
            const [eqList, workerList] = await Promise.all([
              equipmentService.getAll(),
              manpowerService.getAll(),
            ]);
            setAllEquipment(eqList || []);
            setAllWorkers(workerList || []);
          } catch (resErr) {
            console.error('Failed to load available fleet/workers:', resErr);
          }
          setModalStep(2);
          showToast(`Project "${payload.name}" created! Proceed to allocate equipment & personnel.`);
        } else {
          showToast(`Project "${payload.name}" created successfully.`);
          handleCloseModal();
        }
      }
    } catch (err) {
      console.error('Project submission error:', err);
      // Preserve entered values and show error banner
      setFormError(err.message || 'Failed to save project. Please check the details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle selection helper
  const toggleEquipmentSelection = (id) => {
    setSelectedEquipmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleWorkerSelection = (id) => {
    setSelectedWorkerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Save allocations in Step 2
  const handleSaveAllocations = async (andNavigateToDetails = false) => {
    if (!createdProject?.id) return;
    setIsAllocating(true);
    try {
      if (selectedEquipmentIds.length > 0) {
        await projectService.allocateEquipment(createdProject.id, selectedEquipmentIds);
      }
      if (selectedWorkerIds.length > 0) {
        await projectService.assignWorkers(createdProject.id, selectedWorkerIds);
      }
      showToast(`Allocated ${selectedEquipmentIds.length} equipment and ${selectedWorkerIds.length} personnel to "${createdProject.name}".`);
      await fetchProjects();
      handleCloseModal();

      if (andNavigateToDetails) {
        setSelectedProjectId(createdProject.id);
        setActiveTab('project_details');
      }
    } catch (err) {
      console.error('Allocation error:', err);
      alert(err.message || 'Failed to complete resource allocation.');
    } finally {
      setIsAllocating(false);
    }
  };

  // Inline Quick Add Equipment
  const handleQuickAddEquipment = async () => {
    if (!newEqData.name.trim() || !newEqData.serial_number.trim()) {
      alert('Machinery Name and Serial Number are required.');
      return;
    }
    try {
      const created = await projectService.createEquipmentForProject(createdProject.id, newEqData);
      setAllEquipment((prev) => [...prev, created]);
      setSelectedEquipmentIds((prev) => [...prev, created.id]);
      setShowAddEquipmentForm(false);
      setNewEqData({ name: '', type: 'Excavator', serial_number: '', health_score: 95.0, status: 'Active', location: 'Site Core' });
      showToast(`Machinery "${created.name}" created and allocated.`);
    } catch (err) {
      console.error('Create equipment error:', err);
      alert(err.message || 'Failed to create machinery.');
    }
  };

  // Inline Quick Add Worker
  const handleQuickAddWorker = async () => {
    if (!newWorkerData.full_name.trim() || !newWorkerData.role.trim()) {
      alert('Crew Member Full Name and Role are required.');
      return;
    }
    try {
      const created = await projectService.createWorkerForProject(createdProject.id, newWorkerData);
      setAllWorkers((prev) => [...prev, created]);
      setSelectedWorkerIds((prev) => [...prev, created.id]);
      setShowAddWorkerForm(false);
      setNewWorkerData({ full_name: '', role: 'Site Foreman', trade: 'Civil', shift: 'Day', status: 'On Site' });
      showToast(`Personnel "${created.full_name}" created and assigned.`);
    } catch (err) {
      console.error('Create worker error:', err);
      alert(err.message || 'Failed to create personnel.');
    }
  };

  // Delete project handler
  const handleDelete = async (id, name, e) => {
    e?.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete project "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await projectService.delete(id);
      showToast(`Project "${name}" was removed.`);
      await fetchProjects();
    } catch (err) {
      console.error('Delete project error:', err);
      alert(err.message || 'Failed to delete project.');
    }
  };

  // Currency formatter
  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  // Dynamic Portfolio KPI Calculations
  const totalBudget = projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (Number(p.spent) || 0), 0);
  const inProgressCount = projects.filter((p) => p.status === 'In Progress').length;
  const avgProgress = projects.length
    ? Math.round(projects.reduce((acc, p) => acc + (Number(p.progress) || 0), 0) / projects.length)
    : 0;

  // Filtered projects list based on search and status
  const filtered = projects.filter((p) => {
    const pCode = (p.code || p.project_code || '').toLowerCase();
    const pName = (p.name || '').toLowerCase();
    const pClient = (p.client || '').toLowerCase();
    const pLocation = (p.location || '').toLowerCase();
    const q = search.toLowerCase().trim();

    const matchesSearch = !q || pName.includes(q) || pCode.includes(q) || pClient.includes(q) || pLocation.includes(q);

    let matchesStatus = true;
    if (statusFilter !== 'All') {
      if (statusFilter === 'Planned' && (p.status === 'Planned' || p.status === 'Planning')) {
        matchesStatus = true;
      } else {
        matchesStatus = p.status === statusFilter;
      }
    }

    return matchesSearch && matchesStatus;
  });

  // Table Columns
  const columns = [
    {
      key: 'code',
      header: 'Project Code',
      render: (val, row) => {
        const codeDisplay = val || row.project_code || `PRJ-${row.id}`;
        return (
          <span
            style={{
              fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
              fontWeight: 600,
              fontSize: '12px',
              color: 'var(--color-primary-dark)',
              backgroundColor: 'rgba(75, 168, 204, 0.08)',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(75, 168, 204, 0.2)',
            }}
          >
            {codeDisplay}
          </span>
        );
      },
    },
    {
      key: 'name',
      header: 'Project Name',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong style={{ color: 'var(--color-text)', fontSize: '13px' }}>{val}</strong>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>ID #{row.id}</span>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      render: (val) => <span style={{ color: 'var(--color-text)', fontSize: '13px' }}>{val || '—'}</span>,
    },
    {
      key: 'location',
      header: 'Location',
      render: (val) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-secondary)', fontSize: '12.5px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{val || 'Site Area'}</span>
        </span>
      ),
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (val) => (
        <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '13px' }}>
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (val) => {
        const pct = Math.min(100, Math.max(0, Number(val) || 0));
        const isNearDone = pct >= 90;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '130px' }}>
            <span style={{ minWidth: '40px', fontWeight: 600, fontSize: '12px', color: 'var(--color-text)' }}>
              {pct}%
            </span>
            <div
              style={{
                flex: 1,
                height: '7px',
                background: '#E8ECEF',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: isNearDone
                    ? 'linear-gradient(90deg, #5CB5A4, #2F8A68)'
                    : 'linear-gradient(90deg, #4BA8CC, #286F8D)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
          {/* View Details */}
          <button
            className="table-action-btn"
            title="View Project Details"
            onClick={() => {
              setSelectedProjectId(row.id);
              setActiveTab('project_details');
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {/* Edit Project */}
          <button
            className="table-action-btn"
            title="Edit Project"
            onClick={(e) => handleOpenEdit(row, e)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* Delete Project */}
          <button
            className="table-action-btn delete"
            title="Delete Project"
            onClick={(e) => handleDelete(row.id, row.name, e)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <Loading message="Loading project management directory..." />;

  const budgetPreviewFormatted =
    formData.budget && !isNaN(formData.budget) && Number(formData.budget) > 0
      ? `$${Number(formData.budget).toLocaleString()} (${(Number(formData.budget) / 1000000).toFixed(2)}M)`
      : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Success Notification Toast */}
      {successToast && (
        <div
          className="card-shell"
          style={{
            padding: '12px 18px',
            backgroundColor: '#E8F5F2',
            border: '1px solid #5CB5A4',
            color: '#1F5E52',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            style={{ background: 'transparent', border: 'none', color: '#1F5E52', cursor: 'pointer', fontSize: '13px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header Strip with Prominent "+ Add New Project" Button */}
      <div
        className="card-shell"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Construction Projects Portfolio
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
            Active civil works, commercial complexes, and industrial infrastructure developments
          </p>
        </div>

        {/* Prominent + Add New Project Button */}
        <button
          id="btn-add-project"
          className="btn btn-primary"
          onClick={handleOpenAdd}
          style={{
            height: '38px',
            padding: '0 18px',
            fontSize: '13px',
            fontWeight: 600,
            gap: '8px',
            boxShadow: '0 2px 6px rgba(75, 168, 204, 0.3)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add New Project</span>
        </button>
      </div>

      {/* Top Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="kpi-card">
          <span className="kpi-label">Total Projects</span>
          <div className="kpi-value">{projects.length}</div>
          <span className="kpi-subtext">{inProgressCount} currently in progress</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Cumulative Budget</span>
          <div className="kpi-value">${(totalBudget / 1000000).toFixed(1)}M</div>
          <span className="kpi-subtext">Across {projects.length} contracts</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Total Expenditure</span>
          <div className="kpi-value">${(totalSpent / 1000000).toFixed(1)}M</div>
          <span className="kpi-subtext">
            {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% capital utilized
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Average Milestone</span>
          <div className="kpi-value">{avgProgress}%</div>
          <span className="kpi-subtext">Portfolio cumulative progress</span>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div
        className="card-shell"
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, code, client, or site..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Status:</span>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '160px', height: '36px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Near Completion">Near Completion</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          Showing <strong>{filtered.length}</strong> of {projects.length} projects
        </span>
      </div>

      {/* Projects Table */}
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => {
          setSelectedProjectId(row.id);
          setActiveTab('project_details');
        }}
        emptyMessage="No construction projects matched your filter. Click '+ Add New Project' to create one."
      />

      {/* Professional Add / Edit Project Modal with Multi-Step Resource Allocation */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        maxWidth={modalStep === 2 ? '940px' : '620px'}
        title={
          editingProject
            ? `Edit Project: ${editingProject.name}`
            : modalStep === 2
            ? `Resource Allocation: ${createdProject?.name || 'New Project'}`
            : 'Add New Construction Project'
        }
      >
        {/* Step Indicator Header (shown during project creation) */}
        {!editingProject && (
          <div className="step-indicator">
            <div className={`step-item ${modalStep === 1 ? 'active' : ''}`}>
              <span className={`step-badge ${modalStep > 1 ? 'completed' : 'active'}`}>
                {modalStep > 1 ? '✓' : '1'}
              </span>
              <span>1. Project Information</span>
            </div>
            <div style={{ flex: 1, height: '2px', backgroundColor: modalStep === 2 ? 'var(--color-primary)' : 'var(--color-border)' }} />
            <div className={`step-item ${modalStep === 2 ? 'active' : ''}`}>
              <span className={`step-badge ${modalStep === 2 ? 'active' : ''}`}>2</span>
              <span>2. Allocated Equipment & Personnel</span>
            </div>
          </div>
        )}

        {/* STEP 1: Basic Project Details */}
        {modalStep === 1 && (
          <form onSubmit={(e) => handleSubmit(e, !editingProject)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Error Banner inside modal */}
            {formError && (
              <div
                style={{
                  backgroundColor: 'rgba(198, 83, 83, 0.1)',
                  border: '1px solid rgba(198, 83, 83, 0.3)',
                  color: 'var(--color-danger)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-button)',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{formError}</span>
              </div>
            )}

            {/* Row 1: Project Code + Project Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="input-project-code">
                  Project Code <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  id="input-project-code"
                  name="code"
                  type="text"
                  className="form-input"
                  placeholder="e.g. PRJ-2026-005"
                  value={formData.code}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  style={{
                    fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                    borderColor: validationErrors.code ? 'var(--color-danger)' : undefined,
                  }}
                />
                {validationErrors.code && (
                  <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '2px' }}>
                    {validationErrors.code}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-project-name">
                  Project Name <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  id="input-project-name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Harbor Point Logistics Terminal"
                  value={formData.name}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  style={{ borderColor: validationErrors.name ? 'var(--color-danger)' : undefined }}
                />
                {validationErrors.name && (
                  <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '2px' }}>
                    {validationErrors.name}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2: Client + Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="input-client">
                  Client / Organization <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  id="input-client"
                  name="client"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Global Port Holdings"
                  value={formData.client}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  style={{ borderColor: validationErrors.client ? 'var(--color-danger)' : undefined }}
                />
                {validationErrors.client && (
                  <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '2px' }}>
                    {validationErrors.client}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-location">
                  Project Site Location <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  id="input-location"
                  name="location"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Pier 14, South Terminal"
                  value={formData.location}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  style={{ borderColor: validationErrors.location ? 'var(--color-danger)' : undefined }}
                />
                {validationErrors.location && (
                  <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '2px' }}>
                    {validationErrors.location}
                  </span>
                )}
              </div>
            </div>

            {/* Row 3: Budget + Progress + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.2fr', gap: '14px' }}>
              {/* Budget */}
              <div className="form-group">
                <label className="form-label" htmlFor="input-budget">
                  Total Budget (USD) <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  id="input-budget"
                  name="budget"
                  type="number"
                  min="0"
                  step="1000"
                  className="form-input"
                  placeholder="e.g. 25000000"
                  value={formData.budget}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  style={{ borderColor: validationErrors.budget ? 'var(--color-danger)' : undefined }}
                />
                {budgetPreviewFormatted && (
                  <span style={{ fontSize: '11px', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                    {budgetPreviewFormatted}
                  </span>
                )}
                {validationErrors.budget && (
                  <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '2px' }}>
                    {validationErrors.budget}
                  </span>
                )}
              </div>

              {/* Progress */}
              <div className="form-group">
                <label className="form-label" htmlFor="input-progress">
                  Progress (%) <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    id="input-progress"
                    name="progress"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    className="form-input"
                    placeholder="0"
                    value={formData.progress}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                    style={{
                      borderColor: validationErrors.progress ? 'var(--color-danger)' : undefined,
                      width: '90px',
                    }}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>%</span>
                </div>
                {validationErrors.progress && (
                  <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '2px' }}>
                    {validationErrors.progress}
                  </span>
                )}
              </div>

              {/* Status Dropdown */}
              <div className="form-group">
                <label className="form-label" htmlFor="select-status">
                  Status <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <select
                  id="select-status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  style={{ borderColor: validationErrors.status ? 'var(--color-danger)' : undefined }}
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
                {validationErrors.status && (
                  <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '2px' }}>
                    {validationErrors.status}
                  </span>
                )}
              </div>
            </div>

            {/* Form Modal Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                style={{ minWidth: '90px' }}
              >
                Cancel
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!editingProject && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={isSubmitting}
                    title="Save project without allocating resources now"
                    style={{ fontSize: '12.5px' }}
                  >
                    Quick Create (Skip Allocation)
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ minWidth: '150px', gap: '6px' }}
                >
                  {isSubmitting ? (
                    <>
                      <div
                        className="spinner"
                        style={{ width: '14px', height: '14px', borderWidth: '2px', borderColor: '#ffffff', borderTopColor: 'transparent' }}
                      />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingProject ? 'Save Changes' : 'Continue to Allocation →'}</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: Resource Allocation (Allocated Equipment & Assigned Personnel) */}
        {modalStep === 2 && createdProject && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Project Created Banner */}
            <div
              style={{
                backgroundColor: 'rgba(92, 181, 164, 0.1)',
                border: '1px solid rgba(92, 181, 164, 0.3)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-secondary-dark)' }}>
                  Project Created Successfully
                </span>
                <div style={{ fontSize: '14px', fontWeight: 650, color: 'var(--color-text)', marginTop: '1px' }}>
                  {createdProject.name} <span style={{ color: 'var(--color-primary-dark)', fontFamily: 'var(--font-mono)' }}>({createdProject.code || createdProject.project_code})</span>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Client: <strong>{createdProject.client}</strong> • Budget: <strong>{formatCurrency(createdProject.budget)}</strong>
              </div>
            </div>

            {/* Split Two-Column Allocation Layout (Matching User Screenshot) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* LEFT CARD: Allocated Equipment */}
              <div
                className="card-shell"
                style={{
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '480px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 650, color: 'var(--color-text)' }}>
                      Allocated Equipment ({selectedEquipmentIds.length})
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      Select heavy machinery to assign to this project
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => setShowAddEquipmentForm((prev) => !prev)}
                  >
                    {showAddEquipmentForm ? 'Cancel' : '+ New Machine'}
                  </button>
                </div>

                {/* Inline Quick Add Equipment Form */}
                {showAddEquipmentForm && (
                  <div
                    style={{
                      padding: '10px',
                      backgroundColor: 'var(--color-surface-subtle)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-button)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '12px',
                    }}
                  >
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Machinery Name (e.g. CAT 336 Hydraulic Excavator)"
                      value={newEqData.name}
                      onChange={(e) => setNewEqData({ ...newEqData, name: e.target.value })}
                      style={{ fontSize: '12px', padding: '6px 10px' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Serial No. (e.g. EQ-CAT-336-01)"
                        value={newEqData.serial_number}
                        onChange={(e) => setNewEqData({ ...newEqData, serial_number: e.target.value })}
                        style={{ fontSize: '12px', padding: '6px 10px' }}
                      />
                      <select
                        className="form-select"
                        value={newEqData.type}
                        onChange={(e) => setNewEqData({ ...newEqData, type: e.target.value })}
                        style={{ fontSize: '12px', padding: '6px 10px' }}
                      >
                        <option value="Excavator">Excavator</option>
                        <option value="Tower Crane">Tower Crane</option>
                        <option value="Bulldozer">Bulldozer</option>
                        <option value="Concrete Pump">Concrete Pump</option>
                        <option value="Dump Truck">Dump Truck</option>
                        <option value="Loader">Loader</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleQuickAddEquipment}
                      style={{ fontSize: '12px', padding: '6px' }}
                    >
                      Save & Allocate Machinery
                    </button>
                  </div>
                )}

                {/* Search */}
                <input
                  type="text"
                  className="form-input"
                  placeholder="Filter machinery by name, serial no., or type..."
                  value={eqSearch}
                  onChange={(e) => setEqSearch(e.target.value)}
                  style={{ fontSize: '12px', padding: '6px 10px' }}
                />

                {/* Selectable Equipment List */}
                <div style={{ overflowY: 'auto', flex: 1, maxHeight: '320px', paddingRight: '4px' }}>
                  {allEquipment
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
                      const isSelected = selectedEquipmentIds.includes(eq.id);
                      return (
                        <div
                          key={eq.id}
                          className={`allocation-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleEquipmentSelection(eq.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleEquipmentSelection(eq.id)}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'pointer' }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                                  {eq.serial_number}
                                </span>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>• {eq.type}</span>
                              </div>
                              <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text)' }}>
                                {eq.name}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-success)' }}>
                              {eq.health_score || 95}/100
                            </span>
                            <StatusBadge status={eq.status || 'Active'} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* RIGHT CARD: Assigned Personnel */}
              <div
                className="card-shell"
                style={{
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '480px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 650, color: 'var(--color-text)' }}>
                      Assigned Personnel ({selectedWorkerIds.length})
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      Assign workforce crew members to this project
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => setShowAddWorkerForm((prev) => !prev)}
                  >
                    {showAddWorkerForm ? 'Cancel' : '+ New Worker'}
                  </button>
                </div>

                {/* Inline Quick Add Worker Form */}
                {showAddWorkerForm && (
                  <div
                    style={{
                      padding: '10px',
                      backgroundColor: 'var(--color-surface-subtle)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-button)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '12px',
                    }}
                  >
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Full Name (e.g. Marcus Vance)"
                      value={newWorkerData.full_name}
                      onChange={(e) => setNewWorkerData({ ...newWorkerData, full_name: e.target.value })}
                      style={{ fontSize: '12px', padding: '6px 10px' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Role (e.g. Site Foreman)"
                        value={newWorkerData.role}
                        onChange={(e) => setNewWorkerData({ ...newWorkerData, role: e.target.value })}
                        style={{ fontSize: '12px', padding: '6px 10px' }}
                      />
                      <select
                        className="form-select"
                        value={newWorkerData.trade}
                        onChange={(e) => setNewWorkerData({ ...newWorkerData, trade: e.target.value })}
                        style={{ fontSize: '12px', padding: '6px 10px' }}
                      >
                        <option value="Civil">Civil</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Safety">Safety</option>
                        <option value="Structural">Structural</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleQuickAddWorker}
                      style={{ fontSize: '12px', padding: '6px' }}
                    >
                      Save & Assign Personnel
                    </button>
                  </div>
                )}

                {/* Search */}
                <input
                  type="text"
                  className="form-input"
                  placeholder="Filter personnel by name, role, or trade..."
                  value={workerSearch}
                  onChange={(e) => setWorkerSearch(e.target.value)}
                  style={{ fontSize: '12px', padding: '6px 10px' }}
                />

                {/* Selectable Personnel List */}
                <div style={{ overflowY: 'auto', flex: 1, maxHeight: '320px', paddingRight: '4px' }}>
                  {allWorkers
                    .filter((w) => {
                      if (!workerSearch) return true;
                      const q = workerSearch.toLowerCase();
                      return (
                        (w.full_name || '').toLowerCase().includes(q) ||
                        (w.role || '').toLowerCase().includes(q) ||
                        (w.trade || '').toLowerCase().includes(q)
                      );
                    })
                    .map((w) => {
                      const isSelected = selectedWorkerIds.includes(w.id);
                      return (
                        <div
                          key={w.id}
                          className={`allocation-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleWorkerSelection(w.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleWorkerSelection(w.id)}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: 'pointer' }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '12.5px', fontWeight: 650, color: 'var(--color-text)' }}>
                                  {w.full_name}
                                </span>
                                <span
                                  style={{
                                    backgroundColor: 'var(--color-surface-subtle)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '3px',
                                    padding: '1px 5px',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                  }}
                                >
                                  {w.trade}
                                </span>
                              </div>
                              <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
                                {w.role} • {w.shift || 'Day'} Shift
                              </div>
                            </div>
                          </div>

                          <StatusBadge status={w.status || 'On Site'} />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
                disabled={isAllocating}
              >
                Skip Allocation for Now
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleSaveAllocations(false)}
                  disabled={isAllocating}
                >
                  {isAllocating ? 'Saving Allocations...' : 'Save Allocations & Finish'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSaveAllocations(true)}
                  disabled={isAllocating}
                  style={{ gap: '6px' }}
                >
                  <span>Save & Open Project Details →</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
