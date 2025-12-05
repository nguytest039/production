const SELECT_CONFIGS = [
    { id: 'ppapFilterStatus', endpoint: '/api/tasks/status' },
    { id: 'ppapFilterPriority', endpoint: '/api/tasks/priorities' },
    { id: 'ppapFilterCustomer', endpoint: '/api/customers' },
    { id: 'ppapFilterModel', endpoint: '/api/models' },
    { id: 'ppapFilterStage', endpoint: '/api/stages' },
    { id: 'ppapFilterDepartment', endpoint: '/api/departments' },
    { id: 'ppapFilterProcess', endpoint: '/api/processes' }
];

// Cache for results fetched on page load so other modals can reuse without refetching
const SELECT_CACHE = {};

async function fetchOptions(endpoint) {
    try {
        const res = await fetch(`/sample-system${endpoint}`);
        if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error(`Error calling API ${endpoint}:`, error);
        return [];
    }
}

function renderOptions(selectId, items) {
    const select = document.getElementById(selectId);
    if (!select) return;

    let optionsHtml = items.map(item => {
        if (typeof item === 'string' || typeof item === 'number') {
            return `<option value="${item}">${item}</option>`;
        } else if (item && typeof item === 'object' && item.id && item.name) {
            return `<option value="${item.id}">${item.name}</option>`;
        }
        return '';
    }).join('');

    select.innerHTML = '<option value="">-- Select --</option>' + optionsHtml;
}

async function loadAllSelects() {
    const results = await Promise.all(
        SELECT_CONFIGS.map(cfg => fetchOptions(cfg.endpoint))
    );

    SELECT_CONFIGS.forEach((cfg, idx) => {
        const items = results[idx] || [];
        renderOptions(cfg.id, items);
        SELECT_CACHE[cfg.endpoint] = items;
    });

    try {
        const stageCfgIndex = SELECT_CONFIGS.findIndex(c => c.endpoint === '/api/stages' || c.id === 'ppapFilterStage');
        if (stageCfgIndex !== -1) {
            const stages = results[stageCfgIndex] || [];
            renderOptions('sl-xvt', stages);
            SELECT_CACHE['/api/stages'] = stages;
        } else {
            const stages = await fetchOptions('/api/stages');
            renderOptions('sl-xvt', stages);
            SELECT_CACHE['/api/stages'] = stages;
        }
    } catch (e) {
        console.warn('Failed to load stages for sl-xvt:', e);
    }

    try {
        const statusIndex = SELECT_CONFIGS.findIndex(c => c.endpoint === '/api/tasks/status' || c.id === 'ppapFilterStatus');
        const priorityIndex = SELECT_CONFIGS.findIndex(c => c.endpoint === '/api/tasks/priorities' || c.id === 'ppapFilterPriority');
        

        if (statusIndex !== -1) {
            const statuses = results[statusIndex] || [];
            renderOptions('sl-status', statuses);
            SELECT_CACHE['/api/tasks/status'] = statuses;
        } else {
            const statuses = await fetchOptions('/api/tasks/status');
            renderOptions('sl-status', statuses);
            SELECT_CACHE['/api/tasks/status'] = statuses;
        }

        if (priorityIndex !== -1) {
            const priorities = results[priorityIndex] || [];
            renderOptions('sl-priority', priorities);
            SELECT_CACHE['/api/tasks/priorities'] = priorities;
        } else {
            const priorities = await fetchOptions('/api/tasks/priorities');
            renderOptions('sl-priority', priorities);
            SELECT_CACHE['/api/tasks/priorities'] = priorities;
        }
    } catch (e) {
        console.warn('Failed to load status/priority for selects:', e);
    }
}

async function createProject(customerId, name) {
    const c = customerId || (document.getElementById('newProjectCustomer') && document.getElementById('newProjectCustomer').value);
    const n = name || (document.getElementById('newProjectName') && document.getElementById('newProjectName').value);

    if (!c || !n) return null;

    const payload = { customerId: mapCustomerToId(c), name: n };

    try {
        const res = await fetch('/sample-system/api/projects/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(res.statusText || 'API error');

        try {
            const json = await res.json();
            const returned = (json && json.data) ? json.data : (json || {});

            return {
                id: returned.id || returned.projectId || ('TEMP-' + Date.now()),
                customer: returned.customerId || c,
                name: returned.name || n,
                createdDate: returned.createdAt ? returned.createdAt.split(' ')[0] : new Date().toISOString().split('T')[0],
                status: returned.status || 'N/A',
                taskCount: returned.taskCount || 0,
                tasks: []
            };
        } catch (parseErr) {
            console.warn('createProject: response had no JSON body', parseErr);
            return {
                id: 'TEMP-' + Date.now(),
                customer: c,
                name: n,
                createdDate: new Date().toISOString().split('T')[0],
                status: 'waiting',
                taskCount: 0,
                tasks: []
            };
        }
    } catch (e) {
        console.error('createProject failed:', e);
        return null;
    }
}

async function saveTasksForProject(tasks, customerId, name) {
    if (!Array.isArray(tasks) || tasks.length === 0) return true;
    try {
        const url = `/sample-system/api/projects/update?customerId=${encodeURIComponent(customerId)}&name=${encodeURIComponent(name)}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tasks)
        });
        if (!res.ok) {
            console.warn('saveTasksForProject: server returned', res.status, res.statusText);
            return false;
        }
        return true;
    } catch (e) {
        console.error('saveTasksForProject failed', e);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', loadAllSelects);

let currentProject = null;
let projectList = [];
let selectedPPAPItems = [];
let createModalOriginalTitleHTML = null;
let currentTaskDetailObj = null;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Customer mapping configuration
const CUSTOMERS = {
    1: { id: 1, name: 'Apollo' },
    2: { id: 2, name: 'Rhea' },
    3: { id: 3, name: 'Kronos' }
};

// Normalize customer input to numeric ID
function mapCustomerToId(input) {
    if (!input) return '';
    const str = String(input).trim().toLowerCase();
    for (const [id, data] of Object.entries(CUSTOMERS)) {
        if (str === String(id) || str === data.name.toLowerCase()) return Number(id);
    }
    const num = Number(str);
    return !isNaN(num) && num > 0 ? num : input;
}

// Get customer display name from ID or name
function getCustomerDisplay(input) {
    if (!input || String(input).toLowerCase() === 'n/a') return 'N/A';
    const id = mapCustomerToId(input);
    return CUSTOMERS[id]?.name || String(input);
}

// Normalize value (convert empty/N/A/- to null)
function normalizeValue(val) {
    if (!val || val === 'N/A' || val === '-' || String(val).trim() === '') return null;
    return val;
}

// Format date string to API format (YYYY/MM/DD HH:mm:ss)
function formatDateToAPI(dateStr) {
    if (!dateStr) return null;
    try {
        const parts = String(dateStr).trim().split(' ');
        const datePart = parts[0].replace(/-/g, '/');
        const timePart = parts[1] || '00:00:00';
        const formattedTime = timePart.split(':').length === 2 ? `${timePart}:00` : timePart;
        return `${datePart} ${formattedTime}`;
    } catch (e) {
        console.warn('Failed to format date:', e);
        return null;
    }
}

// Normalize task payload for API
function normalizeTaskPayload(task) {
    return {
        name: task.name || task.taskName || '',
        description: task.description || '',
        taskCode: task.taskCode || task.id || '',
        processId: task.processId || null,
        typeId: task.typeId || null,
        departmentId: task.departmentId || null,
        priority: task.priority || null,
        dri: task.dri || null,
        dueDate: task.dueDate || task.deadline || null
    };
}

// DOM helper functions
function getEl(id) { 
    return document.getElementById(id); 
}

function safeSetDisplay(id, value) { 
    const el = getEl(id); 
    if (el?.style) el.style.display = value; 
}

function safeSetText(id, text) { 
    const el = getEl(id); 
    if (el) el.textContent = text; 
}

function getElValue(el) {
    if (!el) return '';
    const tag = el.tagName?.toLowerCase();
    if (['input', 'select', 'textarea'].includes(tag)) return el.value || '';
    return el.textContent || '';
}

function setElValue(el, value) {
    if (!el) return;
    const tag = el.tagName?.toLowerCase();
    if (['input', 'select', 'textarea'].includes(tag)) el.value = value || '';
    else el.textContent = value || '';
}

// Modal management helpers
function showModal(modalId) {
    const el = typeof modalId === 'string' ? getEl(modalId) : modalId;
    if (!el) return null;
    try {
        const modal = new bootstrap.Modal(el);
        modal.show();
        return modal;
    } catch (e) {
        el?.classList.add('active');
        return null;
    }
}

function hideModal(modalId) {
    const el = typeof modalId === 'string' ? getEl(modalId) : modalId;
    if (!el) return;
    try {
        const inst = bootstrap.Modal.getInstance(el);
        if (inst) inst.hide();
        else el.classList.remove('active');
    } catch (e) {
        el?.classList.remove('active');
    }
}

// Open modal with proper z-index stacking
function openModalWithStacking(modalEl) {
    if (!modalEl) return null;
    
    const shown = Array.from(document.querySelectorAll('.modal.show'));
    let topZ = 1040;
    shown.forEach(m => {
        const z = parseInt(window.getComputedStyle(m).zIndex, 10);
        if (!isNaN(z) && z > topZ) topZ = z;
    });

    const modalZ = topZ + 20;
    const backdropZ = modalZ - 10;
    modalEl.style.zIndex = modalZ;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        if (backdrops.length) backdrops[backdrops.length - 1].style.zIndex = backdropZ;
    }, 50);

    return modal;
}

// Error handling helper
function handleAPIError(context, error, showAlert = true) {
    console.error(`[${context}]`, error);
    if (showAlert) alert(`Error: ${context}. Please try again.`);
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadProjectList();
});

async function loadProjectList() {
    const waitingBody = getEl('waitingApprovalBody') || (getEl('waitingApprovalSection') && getEl('waitingApprovalSection').querySelector('tbody')) || null;
    const otherBody = getEl('otherProjectsBody') || (getEl('otherProjectsSection') && getEl('otherProjectsSection').querySelector('tbody')) || null;

    if (!waitingBody && !otherBody) {
        return;
    }

    try {
        const res = await fetch('/sample-system/api/projects');
        if (res.ok) {
            const json = await res.json();
            if (json.status === 'OK' && Array.isArray(json.data)) {
                projectList = json.data.map(p => ({
                    id: p.id,
                    customer: p.customerId || 'N/A',
                    name: p.name,
                    createdDate: p.createdAt ? p.createdAt.split(' ')[0] : '',
                    status: p.status || 'N/A',
                    taskCount: p.taskCount || 0,
                    tasks: []
                }));
            }
        }
    } catch (e) {
        console.warn('Failed to load projects:', e);
    }
    renderProjectListUI();
}

function renderProjectListUI() {
    const waitingBody = getEl('waitingApprovalBody') || (getEl('waitingApprovalSection') && getEl('waitingApprovalSection').querySelector('tbody')) || null;
    const otherBody = getEl('otherProjectsBody') || (getEl('otherProjectsSection') && getEl('otherProjectsSection').querySelector('tbody')) || null;

    const waitingProjects = projectList.filter(p => p.status === 'waiting');
    const otherProjects = projectList.slice();

    if (waitingBody) {
        if (waitingProjects.length === 0) {
            waitingBody.innerHTML = `
                <tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 20px;">
                    目前沒有等待審核的專案
                </td></tr>
            `;
        } else {
            waitingBody.innerHTML = waitingProjects.map(project => {
                const custName = getCustomerDisplay(project.customer);
                return `
                <tr data-project-id="${project.id}" data-section="waiting" onclick="showProjectTasksModal('${project.id}')" style="cursor:pointer">
                    <td class="drag-handle"><i class="bi bi-grip-vertical"></i></td>
                    <td>${project.id}</td>
                    <td>${custName}</td>
                    <td><strong>${project.name}</strong></td>
                    <td>${project.createdDate}</td>
                    <td><span class="badge badge-warning">Waiting Approval</span></td>
                    <td>
                        <button class="action-btn-sm btn-success" onclick="event.stopPropagation(); approveProject('${project.id}')">
                            <i class="bi bi-check-circle"></i> Approve
                        </button>
                        <button class="action-btn-sm btn-danger" onclick="event.stopPropagation(); rejectProject('${project.id}')">
                            <i class="bi bi-x-circle"></i> Reject
                        </button>
                        <button class="action-btn-sm" onclick="event.stopPropagation(); showProjectTasksModal('${project.id}')">
                            <i class="bi bi-eye"></i> View
                        </button>
                    </td>
                </tr>
            `}).join('');
        }
    }

    if (otherBody) {
        if (otherProjects.length === 0) {
            otherBody.innerHTML = `
                <tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 20px;">
                    No Data!
                </td></tr>
            `;
        } else {
            otherBody.innerHTML = otherProjects.map(project => {
                const statusBadge = getStatusBadge(project.status);
                const custName = getCustomerDisplay(project.customer);
                return `
                    <tr data-project-id="${project.id}" data-section="other" onclick="showProjectTasksModal('${project.id}')" style="cursor:pointer">
                        <td class="drag-handle"><i class="bi bi-grip-vertical"></i></td>
                        <td>${custName}</td>
                        <td><strong>${project.name}</strong></td>
                        <td>${project.createdDate}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="action-btn-sm" onclick="event.stopPropagation(); showProjectTasksModal('${project.id}')" title="View tasks">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="action-btn-sm btn-danger" onclick="event.stopPropagation(); deleteProject('${project.id}')" title="Delete project">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    initDragAndDrop();
}

function getStatusBadge(status) {
    const badges = {
        'approved': '<span class="badge badge-success">已核准</span>',
        'rejected': '<span class="badge badge-danger">已拒絕</span>',
        'in-progress': '<span class="badge badge-info">進行中</span>',
        'completed': '<span class="badge badge-primary">已完成</span>',
        'on-hold': '<span class="badge badge-secondary">暫停</span>'
    };
    return badges[status] || `<span class="badge">${status}</span>`;
}

let draggedElement = null;

function initDragAndDrop() {
    const rows = document.querySelectorAll('tr[draggable="true"]');

    rows.forEach(row => {
        row.addEventListener('dragstart', handleDragStart);
        row.addEventListener('dragover', handleDragOver);
        row.addEventListener('drop', handleDrop);
        row.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();

    const draggedSection = draggedElement.dataset.section;
    const targetSection = this.dataset.section;

    if (draggedSection === targetSection) {
        e.dataTransfer.dropEffect = 'move';

        const rect = this.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;

        if (e.clientY < midpoint) {
            this.style.borderTop = '2px solid #2196F3';
            this.style.borderBottom = '';
        } else {
            this.style.borderBottom = '2px solid #2196F3';
            this.style.borderTop = '';
        }
    }

    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();

    const draggedSection = draggedElement.dataset.section;
    const targetSection = this.dataset.section;

    if (draggedSection === targetSection && draggedElement !== this) {
        const rect = this.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;

        if (e.clientY < midpoint) {
            this.parentNode.insertBefore(draggedElement, this);
        } else {
            this.parentNode.insertBefore(draggedElement, this.nextSibling);
        }

        updateProjectOrder(draggedSection);
    }

    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';

    document.querySelectorAll('tr[draggable="true"]').forEach(row => {
        row.style.borderTop = '';
        row.style.borderBottom = '';
    });
}

function updateProjectOrder(section) {
    const tbody = section === 'waiting'
        ? document.getElementById('waitingApprovalBody')
        : document.getElementById('otherProjectsBody');

    if (!tbody) return;

    const newOrder = Array.from(tbody.querySelectorAll('tr')).map(tr =>
        tr.dataset.projectId
    );

}


function viewProjectDetails(projectId) {
    showProjectTasksModal(projectId);
}


async function showProjectTasksModal(projectId) {
    const project = projectList.find(p => String(p.id) === String(projectId));

    try {
        const pidEl = getEl('pt_detail_projectId');
        const setAndDisable = (id, val) => {
            const el = getEl(id);
            if (el) { el.value = val || ''; el.disabled = true; }
        };

        if (project) {
            const customerName = getCustomerDisplay(project.customer);
            if (pidEl) pidEl.value = project.id;
            setAndDisable('pt_detail_customer', customerName);
            setAndDisable('pt_detail_projectName', project.name || '');
            setAndDisable('pt_detail_createdDate', project.createdDate || '');
            setAndDisable('pt_detail_status', project.status || '');
        } else {
            const ids = ['pt_detail_projectId', 'pt_detail_customer', 'pt_detail_projectName', 'pt_detail_createdDate', 'pt_detail_status'];
            ids.forEach(id => { const el = getEl(id); if (el) { el.value = ''; el.disabled = true; } });
        }
    } catch (e) {
        console.warn('Failed to populate project detail pane:', e);
    }

    const container = document.getElementById('projectTasksContent');
    if (container) container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-secondary)"><i class="bi bi-hourglass-split"></i> Loading tasks...</div>`;

    openProjectTasksModal();

    try {
        const res = await fetch(`/sample-system/api/tasks/get-by-project-id?projectId=${parseInt(projectId, 10)}`);

        if (!res.ok) throw new Error(`Status ${res.status} ${res.statusText}`);

        const json = await res.json();
        const tasks = Array.isArray(json.data) ? json.data : [];

        if (project) {
            project.tasks = tasks.slice();
            project.taskCount = tasks.length;
        }

        if (currentProject && String(currentProject.id) === String(projectId)) {
            selectedPPAPItems = tasks.slice();
        }

        renderProjectTasksContent(tasks, projectId);

    } catch (e) {
        console.error('Failed to load tasks:', e);
        if (container) {
            container.innerHTML = `<div style="color:var(--danger);text-align:center;padding:20px"><i class="bi bi-exclamation-triangle"></i> Failed to load tasks. Please try again.</div>`;
        }
    }
}


function renderProjectTasksContent(tasks, projectId) {
    const container = document.getElementById('projectTasksContent');
    if (!container) return;

    if (tasks.length === 0) {
        container.innerHTML = `<div style="color:var(--text-secondary)">This project has no tasks.</div>`;
    } else {
        const rows = tasks.map(t => `
            <tr data-task-id="${t.id}" style="cursor:pointer" onclick="showTaskDetailModal(${projectId}, '${t.id}')">
                <td>${t.id}</td>
                <td>${t.name || ''}</td>
                <td>${t.taskCode || ''}</td>
                <td>${t.processId || ''}</td>
                <td>${t.status || ''}</td>
                <td>${t.priority || ''}</td>
                <td>${t.dri || ''}</td>
                <td>${t.dueDate || ''}</td>
                <td style="text-align:center">
                    <button class="action-btn-sm" onclick="event.stopPropagation(); removeTaskFromProject('${projectId}', '${t.id}')" title="Remove">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        container.innerHTML = `
            <table class="task-list-table" style="margin-top:12px">
                <thead>
                    <tr>
                        <th>ID</th><th>Name</th><th>Task Code</th><th>Process</th>
                        <th>Status</th><th>Priority</th><th>DRI</th><th>Deadline</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }
}

function openProjectTasksModal() {
    try {
        const modal = new bootstrap.Modal(document.getElementById('projectTasksModal'));
        modal.show();
    } catch (e) {
        const el = document.getElementById('projectTasksModal');
        if (el) el.classList.add('active');
    }
}

function showEditTaskModal(projectId, taskId) {
    const project = projectList.find(p => String(p.id) === String(projectId));
    if (!project) { alert('Project not found'); return; }
    const task = (project.tasks || []).find(t => String(t.id) === String(taskId));
    if (!task) { alert('Task not found'); return; }

    getEl('editTaskProjectId').value = projectId;
    getEl('editTaskId').value = taskId;
    getEl('editTaskCode').value = task.taskCode || '';
    getEl('editTaskName').value = task.name || '';
    getEl('editTaskDesc').value = task.description || '';
    getEl('editTaskStatus').value = task.status || '';
    getEl('editTaskPriority').value = task.priority || '';

    showModal('editTaskModal');
}

async function showTaskDetailModal(projectId, taskId) {
    let task = null;
    try {
        const project = projectList.find(p => String(p.id) === String(projectId));

        try {
            const res = await fetch(`/sample-system/api/tasks/get-by-id?id=${encodeURIComponent(taskId)}`);
            if (res.ok) {
                const json = await res.json();
                task = json.data || json.result || null;
            } else {
                console.warn('showTaskDetailModal: server returned', res.status, res.statusText);
            }
        } catch (fetchErr) {
            console.warn('showTaskDetailModal: fetch failed, will attempt local fallback', fetchErr);
        }

        if (!task && project && Array.isArray(project.tasks)) {
            task = project.tasks.find(t => String(t.id) === String(taskId));
        }

        if (!task) {
            alert('Task not found');
            return;
        }

        const modalRoot = document.getElementById('taskDetailModal');
        if (!modalRoot) return;

        // store project/task identifiers on modal and keep a copy of full task JSON
        try {
            modalRoot.dataset.projectId = String(projectId || '');
            modalRoot.dataset.taskId = String(taskId || '');
            currentTaskDetailObj = task ? JSON.parse(JSON.stringify(task)) : null;
        } catch (e) {
            console.warn('Failed to attach task metadata to modal', e);
        }

        const setText = (selector, value) => {
            const el = modalRoot.querySelector(selector);
            if (el) el.textContent = value || '';
        };

        setText('.task-detail-id', task.taskCode || String(task.id || ''));
        setText('.task-detail-name', task.name || '');
        const descEl = modalRoot.querySelector('.section-content');
        if (descEl) descEl.textContent = task.description || '';

        setText('.date-display', task.dueDate || task.deadline || '-');
        setText('.assignee-name', task.dri || task.assignee || '-');

        try {
            const driInput = document.getElementById('dri');
            if (driInput) {
                const driVal = task.dri ?? task.assignee ?? null;
                driInput.value = driVal ? driVal : '-';
            }

            const deadLineInput = document.getElementById('deadLine');
            const dueVal = task.dueDate ?? task.deadline ?? null;
            if (deadLineInput) {
                deadLineInput.value = dueVal ? dueVal : '-';
            }
        }
        catch (e) {
            console.warn('Failed to set sidebar inputs (#dri, #deadLine):', e);
        }

        const statusBadge = modalRoot.querySelector('.task-status-badge');
        if (statusBadge) {
            statusBadge.textContent = task.status || '';
            statusBadge.classList.remove('status-in-progress', 'status-completed', 'status-pending', 'status-overdue');
            if (String(task.status).toLowerCase().includes('progress')) statusBadge.classList.add('status-in-progress');
            else if (String(task.status).toLowerCase().includes('complete')) statusBadge.classList.add('status-completed');
            else if (String(task.status).toLowerCase().includes('overdue')) statusBadge.classList.add('status-overdue');
            else statusBadge.classList.add('status-pending');
        }

        const priorityBadge = modalRoot.querySelector('.priority-badge');
        if (priorityBadge) {
            priorityBadge.textContent = (task.priority && String(task.priority)) || (task.priority === 0 ? '0' : (task.priority || ''));
            priorityBadge.classList.remove('priority-high', 'priority-medium', 'priority-low');
            const p = String(task.priority || '').toLowerCase();
            if (p === 'high') priorityBadge.classList.add('priority-high');
            else if (p === 'medium') priorityBadge.classList.add('priority-medium');
            else if (p === 'low') priorityBadge.classList.add('priority-low');
        }

        try {
            const statusSelect = modalRoot.querySelector('#sl-status');
            const prioritySelect = modalRoot.querySelector('#sl-priority');

            const ensureAndSet = (selectEl, value) => {
                if (!selectEl) return;
                const val = (value === null || value === undefined || String(value).trim() === '') ? 'N/A' : String(value);
                // Check if option exists
                const hasOption = Array.from(selectEl.options).some(o => String(o.value) === val);
                if (!hasOption) {
                    const opt = document.createElement('option');
                    opt.value = val;
                    opt.text = val === 'N/A' ? 'N/A' : val;
                    // insert at top after placeholder if present
                    if (selectEl.options.length > 0) selectEl.add(opt, selectEl.options[0]);
                    else selectEl.add(opt);
                }
                selectEl.value = val;
            };

            ensureAndSet(statusSelect, task.status);
            ensureAndSet(prioritySelect, task.priority);
        } catch (e) {
            console.warn('Failed to set status/priority selects in task detail modal', e);
        }

        try {
            const anyOtherModalOpen = document.querySelectorAll('.modal.show').length > 0;

            if (anyOtherModalOpen) {
                if (modalRoot.parentElement !== document.body) document.body.appendChild(modalRoot);

                const elems = Array.from(document.querySelectorAll('.modal, .modal-backdrop')).filter(el => el !== modalRoot);
                let highest = 1040;
                elems.forEach(el => {
                    const z = window.getComputedStyle(el).zIndex;
                    const zi = parseInt(z, 10);
                    if (!isNaN(zi) && zi > highest) highest = zi;
                });

                const backdropZ = highest + 1;
                const modalZ = highest + 2;

                const modal = new bootstrap.Modal(modalRoot);
                modal.show();

                setTimeout(() => {
                    try {
                        modalRoot.style.zIndex = modalZ;
                        const backdrops = document.querySelectorAll('.modal-backdrop');
                        if (backdrops && backdrops.length) {
                            backdrops[backdrops.length - 1].style.zIndex = backdropZ;
                        }
                    } catch (err) {
                        console.warn('Failed to adjust z-index for stacked modal', err);
                    }
                    // Initialize daterangepicker after modal is shown
                    initDeadlinePicker();
                }, 50);
            } else {
                const modal = new bootstrap.Modal(modalRoot);
                modal.show();
                
                // Initialize daterangepicker after modal is shown
                setTimeout(() => {
                    initDeadlinePicker();
                }, 50);
            }
        } catch (e) {
            if (modalRoot) modalRoot.classList.add('active');
            // Try to init daterangepicker anyway
            setTimeout(() => {
                try { initDeadlinePicker(); } catch (err) {}
            }, 50);
        }

    } catch (e) {
        console.error('Error opening task detail modal:', e);
        alert('Failed to load task detail');
    }
}

function saveEditedTask() {
    const projectId = getEl('editTaskProjectId').value;
    const taskId = getEl('editTaskId').value;
    const project = projectList.find(p => String(p.id) === String(projectId));
    if (!project) { alert('Project not found'); return; }

    const code = getEl('editTaskCode').value;
    const name = getEl('editTaskName').value;
    const desc = getEl('editTaskDesc').value;
    const status = getEl('editTaskStatus').value;
    const priority = getEl('editTaskPriority').value;

    if (!taskId) {
        const newId = 'T-' + Date.now();
        const newTask = {
            id: newId,
            taskCode: code,
            name: name,
            description: desc,
            status: status,
            priority: priority
        };
        project.tasks = project.tasks || [];
        project.tasks.push(newTask);
        project.taskCount = project.tasks.length;

        try { bootstrap.Modal.getInstance(getEl('editTaskModal')).hide(); } catch (e) { getEl('editTaskModal').classList.remove('active'); }
        showProjectTasksModal(projectId);
        alert('Task added successfully');
        return;
    }

    const taskIndex = (project.tasks || []).findIndex(t => String(t.id) === String(taskId));
    if (taskIndex === -1) { alert('Task not found'); return; }

    const updated = {
        ...project.tasks[taskIndex],
        taskCode: code,
        name: name,
        description: desc,
        status: status,
        priority: priority
    };

    project.tasks[taskIndex] = updated;

    try { bootstrap.Modal.getInstance(getEl('editTaskModal')).hide(); } catch (e) { getEl('editTaskModal').classList.remove('active'); }
    showProjectTasksModal(projectId);
    alert('Task saved');
}

// Save changes made in the Task Detail modal: send full task JSON to update API
async function saveTaskDetailChanges() {
    const modalRoot = document.getElementById('taskDetailModal');
    if (!modalRoot) { alert('taskDetailModal not found'); return; }

    const projectId = modalRoot.dataset.projectId;
    const taskId = modalRoot.dataset.taskId;

    let taskPayload = null;
    if (currentTaskDetailObj && String(currentTaskDetailObj.id) === String(taskId || currentTaskDetailObj.id)) {
        taskPayload = JSON.parse(JSON.stringify(currentTaskDetailObj));
    } else {
        // try to fetch the full task if we don't have it
        try {
            const res = await fetch(`/sample-system/api/tasks/get-by-id?id=${encodeURIComponent(taskId)}`);
            if (res.ok) {
                const json = await res.json();
                taskPayload = json.data || json.result || null;
            }
        } catch (e) {
            console.warn('Failed to fetch full task payload before update', e);
        }
    }

    if (!taskPayload) { alert('Task data not available for update'); return; }

    // read selects inside modal
    const statusSelect = modalRoot.querySelector('#sl-status');
    const prioritySelect = modalRoot.querySelector('#sl-priority');
    const newStatus = statusSelect ? statusSelect.value : taskPayload.status;
    const newPriority = prioritySelect ? prioritySelect.value : taskPayload.priority;

    // Read DRI and deadline inputs
    const driInput = getEl('dri');
    const deadlineInput = getEl('deadLine');
    
    const newDri = normalizeValue(driInput?.value || taskPayload.dri);
    const newDeadline = formatDateToAPI(deadlineInput?.value || taskPayload.dueDate);

    // Update payload
    taskPayload.status = normalizeValue(newStatus);
    taskPayload.priority = normalizeValue(newPriority);
    taskPayload.dri = newDri;
    taskPayload.dueDate = newDeadline;

    try {
        const res = await fetch('/sample-system/api/tasks/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskPayload)
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            console.warn('Update API returned', res.status, res.statusText, text);
            alert('Failed to update task. Server returned ' + res.status);
            return;
        }

        let json = null;
        try { json = await res.json(); } catch (e) { /* ignore parse */ }
        const updatedTask = (json && (json.data || json.result)) || taskPayload;

        // update local projectList if possible
        if (projectId && projectList && Array.isArray(projectList)) {
            const proj = projectList.find(p => String(p.id) === String(projectId));
            if (proj && Array.isArray(proj.tasks)) {
                const idx = proj.tasks.findIndex(t => String(t.id) === String(taskId));
                if (idx !== -1) {
                    proj.tasks[idx] = { ...proj.tasks[idx], ...updatedTask };
                }
            }
        }

        // update modal UI (badges and selects)
        try {
            const statusBadge = modalRoot.querySelector('.task-status-badge');
            const priorityBadge = modalRoot.querySelector('.priority-badge');
            if (statusBadge) statusBadge.textContent = updatedTask.status || '';
            if (priorityBadge) priorityBadge.textContent = (updatedTask.priority === 0 ? '0' : (updatedTask.priority || ''));
            if (statusSelect) statusSelect.value = updatedTask.status || (updatedTask.status === null ? 'N/A' : '');
            if (prioritySelect) prioritySelect.value = updatedTask.priority || (updatedTask.priority === null ? 'N/A' : '');
        } catch (e) { console.warn('Failed to refresh badges after update', e); }

        try { bootstrap.Modal.getInstance(modalRoot).hide(); } catch (e) { modalRoot.classList.remove('active'); }

        alert('Task updated successfully');

        // refresh project tasks view if open
        try {
            if (projectId) showProjectTasksModal(projectId);
        } catch (e) { /* ignore */ }

    } catch (e) {
        console.error('Failed to call update API', e);
        alert('Failed to update task: ' + e.message);
    }
}

// Export to global scope for button onclicks
window.saveTaskDetailChanges = saveTaskDetailChanges;

async function saveProjectTaskQuantity() {
    const pidEl = getEl('pt_detail_projectId');
    let project = null;
    if (pidEl && pidEl.value) project = projectList.find(p => String(p.id) === String(pidEl.value));
    if (!project) {
        const projName = getEl('pt_detail_projectName') ? getElValue(getEl('pt_detail_projectName')) : null;
        if (!projName) { alert('Project not found'); return; }
        project = projectList.find(p => p.name === projName);
    }
    if (!project) { alert('Project not found'); return; }

    const dCustomer = getEl('pt_detail_customer');
    const dProject = getEl('pt_detail_projectName');
    const dCreated = getEl('pt_detail_createdDate');
    const qtyEl = getEl('pt_detail_taskQty');

    const custVal = getElValue(dCustomer).trim();
    const projVal = getElValue(dProject).trim();
    const createdVal = getElValue(dCreated).trim();

    if (custVal) project.customer = custVal;
    if (projVal) project.name = projVal;
    if (createdVal) project.createdDate = createdVal;

    const v = qtyEl ? Number(qtyEl.value) : null;
    if (v !== null && !isNaN(v) && v >= 0) project.taskCount = v;

    try {
        const tasksToSave = Array.isArray(project.tasks) ? project.tasks.map(normalizeTaskPayload) : [];

        if (tasksToSave.length > 0) {
            const customerIdForSave = mapCustomerToId(project.customer);
            const saveOk = await saveTasksForProject(tasksToSave, customerIdForSave, project.name);
            if (!saveOk) {
            } else {
                alert('Project details and tasks updated successfully');
            }
        } else {
            alert('Project details updated successfully (no tasks to save)');
        }
    } catch (e) {
        console.error('Error while saving project tasks:', e);
        alert('Project details updated locally but saving tasks failed. See console for details.');
    }

    loadProjectList();
}

function showAddTaskModal(projectId) {
    let pid = projectId;
    if (!pid) {
        const pidEl = getEl('pt_detail_projectId');
        if (pidEl && pidEl.value) pid = pidEl.value;
        else {
            const projName = getEl('pt_detail_projectName') ? getElValue(getEl('pt_detail_projectName')) : null;
            const p = projectList.find(pp => pp.name === projName);
            pid = p ? p.id : null;
        }
    }
    if (!pid) { alert('Project not found'); return; }

    getEl('editTaskProjectId').value = pid;
    getEl('editTaskId').value = '';
    getEl('editTaskCode').value = '';
    getEl('editTaskName').value = '';
    getEl('editTaskDesc').value = '';
    getEl('editTaskStatus').value = '';
    getEl('editTaskPriority').value = '';

    try { new bootstrap.Modal(document.getElementById('editTaskModal')).show(); }
    catch (e) { const el = document.getElementById('editTaskModal'); if (el) el.classList.add('active'); }
}

async function removeTaskFromProject(projectId, taskId) {
    const project = projectList.find(p => String(p.id) === String(projectId));
    if (!project) return;

    if (!confirm('Bạn có chắc muốn xóa task này?')) return;

    try {
        const res = await fetch(`/sample-system/api/tasks/delete?id=${encodeURIComponent(taskId)}`, {
            method: 'POST'
        });

        if (!res.ok) {
            console.warn('Failed to delete task on server', res.status, res.statusText);
            try {
                const text = await res.text();
                console.warn('Response body:', text);
            } catch (e) { }
            alert('Failed to delete task on server.');
            return;
        }

        let json = null;
        try { json = await res.json(); } catch (e) { /* not JSON, ignore */ }

        const serverOk = json ? (json.status === 'OK' || json.success === true || json.result === 'OK') : true;
        if (!serverOk) {
            alert('Server reported failure when deleting task.');
            return;
        }

        // Update local data
        project.tasks = (project.tasks || []).filter(t => String(t.id) !== String(taskId));
        project.taskCount = project.tasks.length;
        
        // Refresh the project list in the background
        loadProjectList();
        
        // Refresh only the modal content without closing/reopening the modal
        const container = document.getElementById('projectTasksContent');
        if (container) {
            renderProjectTasksContent(project.tasks, projectId);
        }
    } catch (e) {
        console.error('Error while deleting task:', e);
        alert('Error while deleting task. See console for details.');
    }
}

async function projectTasksSubmit() {
    const pidEl = getEl('pt_detail_projectId');
    if (!pidEl || !pidEl.value) {
        alert('Project ID not found');
        return;
    }

    const projectId = parseInt(pidEl.value, 10);
    if (isNaN(projectId)) {
        alert('Invalid project ID');
        return;
    }

    try {
        const res = await fetch(`/sample-system/api/projects/submit?id=${projectId}`, {
            method: 'POST'
        });

        if (!res.ok) {
            throw new Error(`Submit failed: ${res.status} ${res.statusText}`);
        }

        let json = null;
        try { json = await res.json(); } catch (e) { /* ignore */ }

        const success = json ? (json.status === 'OK' || json.success === true) : true;

        if (!success) {
            alert('Server reported failure when submitting project');
            return;
        }

        const project = projectList.find(p => String(p.id) === String(projectId));
        if (project) {
            project.status = 'submitted';
            loadProjectList();
        }

        try {
            bootstrap.Modal.getInstance(getEl('projectTasksModal')).hide();
        } catch (e) {
            const el = getEl('projectTasksModal');
            if (el) el.classList.remove('active');
        }

        alert('Project submitted successfully');

    } catch (e) {
        console.error('Failed to submit project:', e);
        alert('Failed to submit project. Please try again.');
    }
}

function openTaskDetailFromProject(taskId) {
    const modalEl = document.getElementById('taskDetailModal');
    if (!modalEl) { alert('taskDetailModal not found'); return; }

    if (modalEl.parentElement !== document.body) document.body.appendChild(modalEl);

    const elems = Array.from(document.querySelectorAll('.modal, .modal-backdrop'));
    let highest = 1040;
    elems.forEach(el => {
        const z = window.getComputedStyle(el).zIndex;
        const zi = parseInt(z, 10);
        if (!isNaN(zi) && zi > highest) highest = zi;
    });

    const backdropZ = highest + 1;
    const modalZ = highest + 2;

    function onShown() {
        try {
            modalEl.style.zIndex = modalZ;
            const backdrops = document.querySelectorAll('.modal-backdrop');
            if (backdrops && backdrops.length) {
                const lastBackdrop = backdrops[backdrops.length - 1];
                lastBackdrop.style.zIndex = backdropZ;
            }
        } catch (e) {
            console.warn('Failed to adjust modal stacking', e);
        }
        modalEl.removeEventListener('shown.bs.modal', onShown);
    }
    modalEl.addEventListener('shown.bs.modal', onShown);

    if (typeof window.showTaskDetail === 'function') {
        try { window.showTaskDetail(taskId); } catch (e) { console.warn('showTaskDetail failed', e); }
    } else if (typeof window.openPermissionTask === 'function') {
        try { window.openPermissionTask('', taskId, ''); } catch (e) { console.warn('openPermissionTask failed', e); }
    } else {
        try { new bootstrap.Modal(modalEl).show(); } catch (e) { modalEl.classList.add('active'); }
    }
}

function showCreateProjectForm() {
    const modalEl = getEl('createProjectModal');
    if (!modalEl) {
        safeSetDisplay('projectListSection', 'none');
        safeSetDisplay('createProjectSection', 'block');
        safeSetDisplay('operationOptionsSection', 'none');
        return;
    }

    const customerEl = document.getElementById('newProjectCustomer');
    const nameEl = document.getElementById('newProjectName');
    if (customerEl) customerEl.value = '';
    if (nameEl) nameEl.value = '';
    currentProject = null;
    selectedPPAPItems = [];
    const metaEl = getEl('createProjectModalMeta');
    if (metaEl) { metaEl.textContent = ''; if (metaEl.style) metaEl.style.display = 'none'; }
    renderSelectedTasksInModal();

    safeSetDisplay('createProjectStep1', 'block');
    safeSetDisplay('createProjectStep2', 'none');
    safeSetDisplay('createBackBtn', 'none');
    safeSetDisplay('createNextBtn', 'inline-flex');
    safeSetDisplay('createSaveBtn', 'none');

    try {
        var bs = new bootstrap.Modal(modalEl);
        bs.show();
    } catch (e) {
        modalEl.classList.add('active');
    }
    try {
        const labelEl = getEl('createProjectModalLabel');
        if (labelEl && !createModalOriginalTitleHTML) createModalOriginalTitleHTML = labelEl.innerHTML;
    } catch (e) { }
}

function cancelCreateProject() {
    if (confirm('Cancel ?')) {
        resetToProjectList();
    }
}

function resetToProjectList() {
    safeSetDisplay('projectListSection', 'block');
    safeSetDisplay('createProjectSection', 'none');
    safeSetDisplay('operationOptionsSection', 'none');

    currentProject = null;
    selectedPPAPItems = [];
}

function closeCreateProjectModal() {
    try {
        const modalEl = document.getElementById('createProjectModal');
        const inst = bootstrap.Modal.getInstance(modalEl);
        if (inst) inst.hide();
        else modalEl.classList.remove('active');
    } catch (e) {
        console.error('Failed to close create project modal', e);
    }
    const metaEl = getEl('createProjectModalMeta');
    if (metaEl) { metaEl.textContent = ''; if (metaEl.style) metaEl.style.display = 'none'; }
    resetToProjectList();
}

function saveProjectBasicInfoModal() {
    const customer = document.getElementById('newProjectCustomer').value;
    const name = document.getElementById('newProjectName').value;

    if (!customer || !name) {
        alert('Please fill all required fields (Customer, Project Name)');
        return;
    }

    currentProject = {
        id: generateProjectId(),
        customer: customer,
        name: name,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        taskCount: 0
    };

    safeSetDisplay('createProjectStep1', 'none');
    safeSetDisplay('createProjectStep2', 'block');
    safeSetDisplay('createBackBtn', 'inline-flex');
    safeSetDisplay('createNextBtn', 'none');
    safeSetDisplay('createSaveBtn', 'inline-flex');

    const metaEl = getEl('createProjectModalMeta');
    if (metaEl) { metaEl.textContent = `${customer} - ${name}`; if (metaEl.style) metaEl.style.display = 'inline'; }

    const labelEl = getEl('createProjectModalLabel');
    if (labelEl) {
        labelEl.innerHTML = `<span><i class="bi bi-plus-square"></i></span><span>Create ${customer} - ${name}</span>`;
    }

    alert('Basic info saved');

    renderSelectedTasksInModal();
}

function createModalBackToStep1() {
    safeSetDisplay('createProjectStep1', 'block');
    safeSetDisplay('createProjectStep2', 'none');
    safeSetDisplay('createBackBtn', 'none');
    safeSetDisplay('createNextBtn', 'inline-flex');
    safeSetDisplay('createSaveBtn', 'none');
    const metaEl = getEl('createProjectModalMeta');
    if (metaEl) { metaEl.textContent = ''; if (metaEl.style) metaEl.style.display = 'none'; }
    const labelEl = getEl('createProjectModalLabel');
    if (labelEl && createModalOriginalTitleHTML) labelEl.innerHTML = createModalOriginalTitleHTML;
}

async function submitProjectFromModal() {
    if (!currentProject) { alert('Please save basic project info first'); return; }
    if (!selectedPPAPItems || selectedPPAPItems.length === 0) { alert('Please select at least one PPAP item or add a custom task'); return; }

    currentProject.taskCount = selectedPPAPItems.length;
    currentProject.status = 'waiting';

    const created = await createProject(currentProject.customer, currentProject.name);
    if (created) {
        const finalProject = Object.assign({}, created || {}, {
            tasks: selectedPPAPItems.slice(),
            taskCount: selectedPPAPItems.length,
            status: 'waiting'
        });

        finalProject.tasks = selectedPPAPItems.map(item => ({
            ...item,
            projectId: finalProject.id
        }));

        if (!finalProject.name && currentProject && currentProject.name) finalProject.name = currentProject.name;

        const tasksPayload = selectedPPAPItems.map(normalizeTaskPayload);

        const customerIdForSave = mapCustomerToId(finalProject.customer || currentProject.customer);
        const saveOk = await saveTasksForProject(tasksPayload, customerIdForSave, finalProject.name || currentProject.name);
        if (!saveOk) {
            console.warn('Tasks were not persisted to server. They may be lost after reload.');
        }

        projectList.push(finalProject);

        alert(`Project "${finalProject.name || currentProject.name || 'N/A'}" created successfully, containing ${selectedPPAPItems.length} tasks`);

        const labelEl = getEl('createProjectModalLabel');
        if (labelEl && createModalOriginalTitleHTML) labelEl.innerHTML = createModalOriginalTitleHTML;

        closeCreateProjectModal();
        safeSetDisplay('projectListSection', 'block');
        safeSetDisplay('createProjectSection', 'none');
        renderProjectListUI();
    } else {
        alert('Failed to create project. Please try again.');
    }
}

function renderSelectedTasksInModal() {
    const container = document.getElementById('selectedTasksList');
    if (!container) return;
    if (!selectedPPAPItems || selectedPPAPItems.length === 0) {
        container.innerHTML = `
            <table class="task-list-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Project</th>
                        <th>Stage</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>DRI</th>
                        <th>Deadline</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:18px">No tasks selected. Please add tasks from the Operation Options.</td></tr>
                </tbody>
            </table>
        `;
        return;
    }

    const header = `
        <h5 style="margin-bottom: 12px; color: var(--text-primary);">
            <i class="bi bi-list-task"></i> List Tasks
        </h5>
        <table id="selectedTasksTable" class="task-list-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Project</th>
                    <th>Stage</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>DRI</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    const rows = selectedPPAPItems.map(item => {
        const projectText = currentProject ? (currentProject.customer || '') : '';
        const stage = item.stage || '';
        const dri = item.dri || '';
        const deadline = item.deadline || '';
        return `
            <tr draggable="true" data-task-id="${item.id}">
                <td class="task-id-cell">${item.id}</td>
                <td>${item.name || ''}</td>
                <td>${projectText}</td>
                <td>${stage}</td>
                <td>${item.status || ''}</td>
                <td>${item.priority || ''}</td>
                <td>${dri}</td>
                <td>${deadline}</td>
                <td style="text-align:center"><button class="action-btn-sm" onclick="removeSelectedTask('${item.id}')" title="Remove"><i class="bi bi-trash"></i></button></td>
            </tr>
        `;
    }).join('');

    const footer = `
            </tbody>
        </table>
    `;

    container.innerHTML = header + rows + footer;
    initSelectedTasksDragAndDrop();
}

function removeSelectedTask(taskId) {
    selectedPPAPItems = selectedPPAPItems.filter(t => String(t.id) !== String(taskId));
    renderSelectedTasksInModal();
}

let draggedTaskRow = null;
function initSelectedTasksDragAndDrop() {
    const rows = document.querySelectorAll('#selectedTasksTable tbody tr');
    rows.forEach(row => {
        row.addEventListener('dragstart', handleTaskDragStart);
        row.addEventListener('dragover', handleTaskDragOver);
        row.addEventListener('drop', handleTaskDrop);
        row.addEventListener('dragend', handleTaskDragEnd);
    });
}

function handleTaskDragStart(e) {
    draggedTaskRow = this;
    this.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
}

function handleTaskDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    if (!draggedTaskRow) return;

    const rect = this.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    if (e.clientY < midpoint) {
        this.style.borderTop = '2px solid #2196F3';
        this.style.borderBottom = '';
    } else {
        this.style.borderBottom = '2px solid #2196F3';
        this.style.borderTop = '';
    }
    return false;
}

function handleTaskDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (!draggedTaskRow || draggedTaskRow === this) return false;

    const rect = this.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    if (e.clientY < midpoint) {
        this.parentNode.insertBefore(draggedTaskRow, this);
    } else {
        this.parentNode.insertBefore(draggedTaskRow, this.nextSibling);
    }

    const tbody = document.querySelector('#selectedTasksTable tbody');
    const newOrder = Array.from(tbody.querySelectorAll('tr')).map(tr => tr.dataset.taskId);
    const map = {};
    selectedPPAPItems.forEach(item => { if (item && item.id) map[String(item.id)] = item; });
    selectedPPAPItems = newOrder.map(id => map[String(id)]).filter(Boolean);

    document.querySelectorAll('#selectedTasksTable tbody tr').forEach(r => { r.style.borderTop = ''; r.style.borderBottom = ''; });

    return false;
}

function handleTaskDragEnd(e) {
    this.style.opacity = '1';
    document.querySelectorAll('#selectedTasksTable tbody tr').forEach(r => { r.style.borderTop = ''; r.style.borderBottom = ''; });
    draggedTaskRow = null;
}

function saveProjectBasicInfo() {
    const customer = document.getElementById('newProjectCustomer').value;
    const name = document.getElementById('newProjectName').value;

    if (!customer || !name) {
        alert('Please fill all required fields (Customer, Project Name)');
        return;
    }

    currentProject = {
        id: generateProjectId(), // Temp ID
        customer: customer,
        name: name,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        taskCount: 0
    };


    safeSetDisplay('createProjectSection', 'none');
    safeSetDisplay('operationOptionsSection', 'block');
}


function generateProjectId() {
    return 'TEMP-' + Date.now();
}

function cancelProjectCreation() {
    if (confirm('Are you sure you want to cancel project creation? All selected tasks will be cleared.')) {
        resetToProjectList();
    }
}

async function submitProject() {
    if (!currentProject) { alert('Please save basic project info first'); return; }
    if (selectedPPAPItems.length === 0) { alert('Please select at least one PPAP item or add a custom task'); return; }

    currentProject.taskCount = selectedPPAPItems.length;
    currentProject.status = 'waiting';

    const created = await createProject(currentProject.customer, currentProject.name);
    if (created) {
        currentProject.id = created.id;
        const tasksPayload = selectedPPAPItems.map(normalizeTaskPayload);

        const customerIdForSave = mapCustomerToId(currentProject.customer);
        const saveOk = await saveTasksForProject(tasksPayload, customerIdForSave, currentProject.name);
        if (!saveOk) {
            console.warn('Tasks were not persisted to server. They may be lost after reload.');
            alert('Project created but saving tasks failed. Tasks may be lost after reload.');
        }

        projectList.push(currentProject);
        alert(`Project "${currentProject.name}" created successfully, containing ${currentProject.taskCount} tasks`);
        resetToProjectList();
        loadProjectList();
    } else {
        alert('Failed to create project');
    }
}

async function showStandardPPAP() {
    const modal = document.getElementById("standardPPAPModal");
    const grid = document.getElementById("ppapTasksGrid");

    if (grid) grid.innerHTML = '<div class="ppap-loading">載入中...</div>';

    const preservedIds = new Set();
    try {
        (selectedPPAPItems || []).forEach(i => { if (i && i.id) preservedIds.add(String(i.id)); });
        if (currentProject && Array.isArray(currentProject.tasks)) currentProject.tasks.forEach(i => { if (i && i.id) preservedIds.add(String(i.id)); });
        const pidEl = getEl('pt_detail_projectId');
        if (pidEl && pidEl.value) {
            const project = projectList.find(p => String(p.id) === String(pidEl.value));
            if (project && Array.isArray(project.tasks)) project.tasks.forEach(i => { if (i && i.id) preservedIds.add(String(i.id)); });
        }
    } catch (e) { console.warn('Error while computing preserved PPAP ids', e); }

    let tasks = [];
    try {
        const res = await fetch('/sample-system/api/tasks/templates');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        tasks = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
        tasks = tasks.map(item => ({
            id: item.id,
            taskCode: item.taskCode || '',
            name: item.name || '',
            description: item.description || '',
            status: item.status || '',
            priority: item.priority || ''
        }));
    } catch (e) {
        console.warn('Failed to fetch PPAP templates, falling back to local list:', e);
        tasks = standardPPAPTasks;
    }

    if (grid) {
        grid.innerHTML = tasks.map((task) => {
            const isChecked = preservedIds.has(String(task.id)) ? 'checked' : '';
            const status = task.status || '';
            const priority = task.priority || '';
            return `
                <div class="ppap-task-card">
                    <label>
                        <input type="checkbox" class="ppap-checkbox" value="${task.id}" data-status="${status}" data-priority="${priority}" ${isChecked}>
                        <div class="ppap-task-info">
                            <div class="ppap-task-id">${task.taskCode}</div>
                            <div class="ppap-task-name">${task.name}</div>
                            <div class="ppap-task-desc">${task.description}</div>
                        </div>
                    </label>
                </div>
            `;
        }).join("");

        try {
            const boxes = grid.querySelectorAll('.ppap-checkbox');
            boxes.forEach(cb => cb.addEventListener('change', handlePPAPCheckboxChange));
        } catch (e) {
            console.warn('Failed to attach PPAP checkbox listeners', e);
        }
    }

    try {
        openModalAbove(modal);
    } catch (e) {
        console.error('Bootstrap Modal show error:', e);
        if (modal) modal.classList.add('active');
    }
}

function closeStandardPPAP() {
    var modalEl = document.getElementById("standardPPAPModal");
    var bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();
}

function openModalAbove(modalRef) {
    const modalEl = typeof modalRef === 'string' ? document.getElementById(modalRef) : modalRef;
    if (!modalEl) return null;

    const shown = Array.from(document.querySelectorAll('.modal.show'));
    let topZ = 1040; // bootstrap default backdrop ~ 1040-1050
    shown.forEach(m => {
        const z = parseInt(window.getComputedStyle(m).zIndex, 10);
        if (!isNaN(z) && z > topZ) topZ = z;
    });

    const modalZ = topZ + 20;
    modalEl.style.zIndex = modalZ;

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();

    setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        if (backdrops.length) {
            const last = backdrops[backdrops.length - 1];
            last.style.zIndex = modalZ - 10;
        }
    }, 10);

    return bsModal;
}

function selectAllPPAP() {
    document.querySelectorAll(".ppap-checkbox").forEach((cb) => { cb.checked = true; cb.dispatchEvent(new Event('change')); });
}

function deselectAllPPAP() {
    document.querySelectorAll(".ppap-checkbox").forEach((cb) => { cb.checked = false; cb.dispatchEvent(new Event('change')); });
}

function handlePPAPCheckboxChange(e) {
    const cb = e && e.target ? e.target : null;
    if (!cb) return;
    const card = cb.closest('.ppap-task-card');
    const info = card ? card.querySelector('.ppap-task-info') : null;
    const nameEl = info ? info.querySelector('.ppap-task-name') : null;
    const codeEl = info ? info.querySelector('.ppap-task-id') : null;
    const descEl = info ? info.querySelector('.ppap-task-desc') : null;
    const status = cb.dataset.status || '';
    const priority = cb.dataset.priority || '';

    const item = {
        id: String(cb.value),
        taskCode: codeEl ? codeEl.textContent.trim() : '',
        name: nameEl ? nameEl.textContent.trim() : String(cb.value),
        description: descEl ? descEl.textContent.trim() : '',
        status: status,
        priority: priority
    };

    if (cb.checked) {
        const exists = (selectedPPAPItems || []).some(i => String(i.id) === String(item.id));
        if (!exists) selectedPPAPItems = (selectedPPAPItems || []).concat([item]);
    } else {
        selectedPPAPItems = (selectedPPAPItems || []).filter(i => String(i.id) !== String(item.id));
    }

    try { renderSelectedTasksInModal(); } catch (err) { console.warn('renderSelectedTasksInModal failed', err); }

    try {
        const pidEl = getEl('pt_detail_projectId');
        const projId = pidEl && pidEl.value ? pidEl.value : (currentProject ? currentProject.id : null);
        if (projId) {
            const project = projectList.find(p => String(p.id) === String(projId));
            if (project) {
                project.tasks = (selectedPPAPItems || []).slice();
                project.taskCount = project.tasks.length;
            }

            const container = document.getElementById('projectTasksContent');
            if (container) renderProjectTasksContent(selectedPPAPItems || [], projId);
        } else if (currentProject) {
            currentProject.tasks = (selectedPPAPItems || []).slice();
            currentProject.taskCount = currentProject.tasks.length;
            const container = document.getElementById('projectTasksContent');
            if (container) renderProjectTasksContent(selectedPPAPItems || [], currentProject.id);
        }
    } catch (err) {
        console.warn('Failed to update external project task list after PPAP checkbox change', err);
    }
}

function confirmPPAPSelection() {
    const checked = Array.from(document.querySelectorAll(".ppap-checkbox:checked"));

    if (checked.length === 0) {
        alert("Please select at least one PPAP item");
        return;
    }

    const newlySelected = checked.map(cb => {
        const card = cb.closest('.ppap-task-card');
        const info = card ? card.querySelector('.ppap-task-info') : null;
        const nameEl = info ? info.querySelector('.ppap-task-name') : null;
        const codeEl = info ? info.querySelector('.ppap-task-id') : null;
        const descEl = info ? info.querySelector('.ppap-task-desc') : null;
        const status = cb.dataset.status || '';
        const priority = cb.dataset.priority || '';
        return {
            id: String(cb.value),
            taskCode: codeEl ? codeEl.textContent.trim() : '',
            name: nameEl ? nameEl.textContent.trim() : cb.value,
            description: descEl ? descEl.textContent.trim() : '',
            status: status,
            priority: priority
        };
    });

    const map = {};
    selectedPPAPItems.forEach(i => { if (i && i.id) map[String(i.id)] = i; });
    newlySelected.forEach(i => { if (i && i.id) map[String(i.id)] = i; });
    selectedPPAPItems = Object.values(map);

    alert(`Selected ${newlySelected.length} PPAP items (Total: ${selectedPPAPItems.length})`);

    renderSelectedTasksInModal();

    const projectTasksModal = document.getElementById('projectTasksModal');
    if (projectTasksModal && projectTasksModal.classList.contains('show')) {
        const pidEl = getEl('pt_detail_projectId');
        if (pidEl && pidEl.value) {
            const project = projectList.find(p => String(p.id) === String(pidEl.value));
            if (project) {
                project.tasks = selectedPPAPItems.slice();
                project.taskCount = selectedPPAPItems.length;
                renderProjectTasksContent(selectedPPAPItems, project.id);
            }
        }
    }

    closeStandardPPAP();

    if (currentProject) {
        currentProject.tasks = selectedPPAPItems.slice();
        currentProject.taskCount = selectedPPAPItems.length;
    }
}


async function showCustomTask() {
    var modal = document.getElementById("customTaskModal");
    try {
        await loadCustomTaskSelects();
        openModalAbove(modal);
    } catch (e) {
        console.error(e);
        try { if (modal) { var mm = new bootstrap.Modal(modal); mm.show(); } } catch(err) { /* ignore */ }
    }
}

async function loadCustomTaskSelects() {
    try {
        const departments = SELECT_CACHE['/api/departments'] || await fetchOptions('/api/departments');
        const processes = SELECT_CACHE['/api/processes'] || await fetchOptions('/api/processes');
        const priorities = SELECT_CACHE['/api/tasks/priorities'] || await fetchOptions('/api/tasks/priorities');
        const stages = SELECT_CACHE['/api/stages'] || await fetchOptions('/api/stages');

        // write back to cache in case we had to fetch
        SELECT_CACHE['/api/departments'] = departments;
        SELECT_CACHE['/api/processes'] = processes;
        SELECT_CACHE['/api/tasks/priorities'] = priorities;
        SELECT_CACHE['/api/stages'] = stages;

        renderOptions('custom-sl-department', departments);
        renderOptions('custom-sl-process', processes);
        renderOptions('custom-sl-priority', priorities);
        renderOptions('custom-sl-xvt', stages);
    } catch (e) {
        console.warn('loadCustomTaskSelects failed:', e);
    }
}

function closeCustomTask() {
    var modalEl = document.getElementById("customTaskModal");
    var bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();
}


function showCopyTemplate() {
    var modal = document.getElementById("copyTemplateModal");
    try { openModalAbove(modal); } catch (e) { console.error(e); if (modal) { var mm = new bootstrap.Modal(modal); mm.show(); } }
}

function closeCopyTemplate() {
    var modalEl = document.getElementById("copyTemplateModal");
    var bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();
}


function showRACIMatrix() {
    const modal = document.getElementById("raciMatrixModal");
    const tbody = document.getElementById("raciMatrixBody");

    tbody.innerHTML = raciMatrixData.map((row) => `
        <tr>
            <td>${row.task}</td>
            ${Object.entries(row.departments).map(([dept, role]) => `
                <td><span class="raci-cell raci-badge raci-${role.toLowerCase()}">${role}</span></td>
            `).join("")}
        </tr>
    `).join("");

    try {
        var bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    } catch (e) {
        console.error('Bootstrap Modal show error:', e);
        modal.classList.add("active");
    }
}

function closeRACIMatrix() {
    try {
        var modalEl = document.getElementById("raciMatrixModal");
        var instance = bootstrap.Modal.getInstance(modalEl);
        if (instance) instance.hide();
        else modalEl.classList.remove("active");
    } catch (e) {
        console.error('Bootstrap Modal hide error:', e);
        document.getElementById("raciMatrixModal").classList.remove("active");
    }
}

function approveProject(projectId) {
    if (!confirm('Are you sure you want to approve this project?')) return;

    const project = projectList.find(p => p.id === projectId);
    if (project) {
        project.status = 'approved'; // Đổi thành 'approved'
        project.approvedDate = new Date().toISOString().split('T')[0];



        loadProjectList();
    }
}


function rejectProject(projectId) {
    const reason = prompt('Please enter the rejection reason:');
    if (!reason) return;

    if (!confirm(`Are you sure you want to reject this project?\nReason: ${reason}`)) return;

    const project = projectList.find(p => p.id === projectId);
    if (project) {
        project.status = 'rejected';
        project.rejectedDate = new Date().toISOString().split('T')[0];
        project.rejectReason = reason;


        alert(`Project "${project.name}" has been rejected\nIt will be moved to the All Projects list (rejected status)`);

        loadProjectList();
    }
}



async function deleteProject(projectId) {
    const project = projectList.find(p => String(p.id) === String(projectId));
    if (!project) {
        console.warn('deleteProject: project not found for id', projectId);
        alert('Project not found');
        return;
    }

    if (!confirm(`Are you sure you want to delete project "${project.name}"?\nThis action cannot be undone!`)) {
        return;
    }
    try {
        const bodyId = parseInt(projectId, 10);
        if (isNaN(bodyId)) {
            alert('Cannot delete temporary project. Please save it first.');
            return;
        }

        const url = `/sample-system/api/projects/delete?id=${encodeURIComponent(bodyId)}`;
        const res = await fetch(url, { method: 'POST' });

        console.debug('deleteProject: response status', res.status, res.statusText);

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Delete failed (${res.status}): ${text}`);
        }

        let ok = true;
        try {
            const json = await res.json();
            console.debug('deleteProject: response json', json);
            if (json && (json.status === 'ERROR' || json.success === false)) ok = false;
        } catch (e) { /* ignore parse errors */ }

        if (!ok) {
            return;
        }

        projectList = projectList.filter(p => String(p.id) !== String(projectId));
        console.log('🗑️ Project deleted:', projectId);
        alert(`Project "${project.name}" has been deleted`);
        await loadProjectList();

    } catch (e) {
        console.error('Failed to delete project:', e);
        alert('Failed to delete project. Please try again.');
    }
}

function editProject(projectId) {
    console.log('Edit project:', projectId);
}

// ===================================
// EXPORT TO GLOBAL SCOPE
// ===================================
window.showCreateProjectForm = showCreateProjectForm;
window.cancelCreateProject = cancelCreateProject;
window.saveProjectBasicInfo = saveProjectBasicInfo;
window.cancelProjectCreation = cancelProjectCreation;
window.submitProject = submitProject;
window.showStandardPPAP = showStandardPPAP;
window.closeStandardPPAP = closeStandardPPAP;
window.selectAllPPAP = selectAllPPAP;
window.deselectAllPPAP = deselectAllPPAP;
window.confirmPPAPSelection = confirmPPAPSelection;
window.showCustomTask = showCustomTask;
window.closeCustomTask = closeCustomTask;
window.showCopyTemplate = showCopyTemplate;
window.closeCopyTemplate = closeCopyTemplate;
window.showRACIMatrix = showRACIMatrix;
window.closeRACIMatrix = closeRACIMatrix;
window.approveProject = approveProject;
window.rejectProject = rejectProject;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.createProject = createProject;
window.saveProjectBasicInfoModal = saveProjectBasicInfoModal;
window.createModalBackToStep1 = createModalBackToStep1;
window.closeCreateProjectModal = closeCreateProjectModal;
window.submitProjectFromModal = submitProjectFromModal;
window.renderSelectedTasksInModal = renderSelectedTasksInModal;
window.removeSelectedTask = removeSelectedTask;
window.initSelectedTasksDragAndDrop = initSelectedTasksDragAndDrop;
window.handleTaskDrop = handleTaskDrop;
window.handleTaskDragStart = handleTaskDragStart;
window.showAddTaskModal = showAddTaskModal;
window.saveProjectTaskQuantity = saveProjectTaskQuantity;
window.removeTaskFromProject = removeTaskFromProject;

function initDeadlinePicker() {
    const el = document.getElementById('deadLine');
    if (!el) return;

    if (window.jQuery && typeof window.jQuery.fn.daterangepicker === 'function') {
        try { el.type = 'text'; } catch (e) {}

        $(el).daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            timePicker24Hour: true,
            showDropdowns: true,
            autoUpdateInput: false,
            opens: 'right',
            locale: { format: 'YYYY-MM-DD HH:mm' }
        });

        $(el).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD HH:mm'));
        });

        $(el).on('cancel.daterangepicker', function () {
        });

        return;
    }

    if (typeof flatpickr === 'function') {
        try {
            try { el.type = 'text'; } catch (e) {}
            flatpickr(el, {
                enableTime: true,
                time_24hr: true,
                dateFormat: 'Y-m-d H:i',
                allowInput: true,
                clickOpens: true,
                onClose: function(selectedDates) {
                    if (selectedDates && selectedDates[0]) {
                        // ensure formatted value
                        el.value = flatpickr.formatDate(selectedDates[0], 'Y-m-d H:i');
                    }
                }
            });
            return;
        } catch (e) {
            console.warn('flatpickr init failed for #deadLine', e);
        }
    }

    el.addEventListener('focus', function onFocus() {
        try {
            el.type = 'datetime-local';
        } catch (e) {}
        el.removeEventListener('focus', onFocus);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    try { initDeadlinePicker(); } catch (e) {  }
});
