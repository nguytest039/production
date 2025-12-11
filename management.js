const DateFormatter = {
    toAPIFormat(dateStr) {
        if (!dateStr || dateStr === '-' || String(dateStr).toUpperCase() === 'N/A') {
            return null;
        }

        const str = String(dateStr).trim();

        if (window.moment) {
            const m = window.moment(str, [
                'YYYY/MM/DD',
                'YYYY-MM-DD',
                'YYYY/MM/DD HH:mm',
                'YYYY-MM-DD HH:mm',
                'YYYY/MM/DD HH:mm:ss',
                'YYYY-MM-DD HH:mm:ss'
            ], true);

            if (m && typeof m.isValid === 'function' && m.isValid()) {
                return m.format('YYYY/MM/DD HH:mm:ss');
            }
        }

        const parts = str.split(' ');
        let datePart = parts[0] || '';
        let timePart = parts[1] || '00:00:00';

        datePart = datePart.substring(0, 10).replace(/-/g, '/');

        const tPieces = timePart.split(':');
        if (tPieces.length === 1) {
            timePart = `${tPieces[0] || '00'}:00:00`;
        } else if (tPieces.length === 2) {
            timePart = `${tPieces[0] || '00'}:${tPieces[1] || '00'}:00`;
        } else {
            timePart = `${tPieces[0] || '00'}:${tPieces[1] || '00'}:${tPieces[2] || '00'}`;
        }

        return `${datePart} ${timePart}`;
    },

    toDisplayFormat(dateStr) {
        return this.toAPIFormat(dateStr) || '-';
    }
};

function escapeHtml(input) {
    if (input === null || input === undefined) return '';
    return String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function safeCompareIds(id1, id2) {
    if (id1 == null || id2 == null) {
        return id1 === id2;
    }

    const str1 = String(id1);
    const str2 = String(id2);
    if (str1 === 'null' || str1 === 'undefined' || str2 === 'null' || str2 === 'undefined') {
        return false;
    }

    return str1 === str2;
}

function findProjectById(projectId) {
    if (!projectId) return null;
    return projectList.find(p => safeCompareIds(p.id, projectId)) || null;
}

const Validators = {
    required(value, fieldName) {
        const val = value ? String(value).trim() : '';
        if (!val) {
            throw new Error(`${fieldName} is required`);
        }
        return val;
    },

    maxLength(value, max, fieldName) {
        if (String(value).length > max) {
            throw new Error(`${fieldName} must be less than ${max} characters`);
        }
        return value;
    }
};

function openModal(modalId) {
    const modalEl = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    if (!modalEl) {
        return null;
    }

    try {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
        return modal;
    } catch (e) {
        modalEl.classList.add('active');
        return null;
    }
}

function safeHideModal(modalEl) {
    if (!modalEl) return;
    try {
        if (window.bootstrap && bootstrap.Modal) {
            const inst = bootstrap.Modal.getInstance(modalEl);
            if (inst && typeof inst.hide === 'function') {
                inst.hide();
            } else {
                try { new bootstrap.Modal(modalEl).hide(); } catch (e) { modalEl.classList.remove('show', 'active'); }
            }
        } else {
            modalEl.classList.remove('show', 'active');
        }
    } catch (e) {
        try { modalEl.classList.remove('show', 'active'); } catch (e2) { }
    }

    try {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(b => { if (b && b.parentNode) b.parentNode.removeChild(b); });
    } catch (e) { }

    try { document.body.classList.remove('modal-open'); } catch (e) { }
    try { document.body.style.paddingRight = ''; } catch (e) { }
}

function cleanUpModal() {
    try {
        const anyOpen = document.querySelectorAll('.modal.show').length > 0;
        if (!anyOpen) {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(b => { try { b.remove(); } catch (e) { /* ignore */ } });
            try { document.body.classList.remove('modal-open'); } catch (e) { }
            try { document.body.style.paddingRight = ''; } catch (e) { }
        } else {
            try {
                const backdrops = Array.from(document.querySelectorAll('.modal-backdrop'));
                const openCount = document.querySelectorAll('.modal.show').length;
                if (backdrops.length > openCount) {
                    const extras = backdrops.slice(0, backdrops.length - openCount);
                    extras.forEach(b => { try { b.remove(); } catch (e) { } });
                }
            } catch (e) { }
        }
    } catch (e) { /* swallow */ }
}

document.addEventListener('hidden.bs.modal', function (ev) {
    setTimeout(() => {
        cleanUpModal();
    }, 10);
});

function showAlertSuccess(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: "success",
        customClass: "swal-success",
        buttonsStyling: true
    });
}

function showAlertError(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: "error",
        customClass: "swal-error",
        buttonsStyling: true
    });
}

function showAlertWarning(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        customClass: "swal-warning",
        buttonsStyling: true
    });
}

async function handleTaskFileUpload() {
    const modal = document.getElementById('taskDetailModal');
    if (!modal) return;

    const taskId = modal.dataset.taskId;
    if (!taskId || taskId === 'null') {
        return;
    }

    const oldInput = modal.querySelector('input[type="file"][data-task-upload]');
    if (oldInput) oldInput.remove();

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    fileInput.dataset.taskUpload = 'true';
    modal.appendChild(fileInput);

    fileInput.onchange = async function () {
        if (!fileInput.files || fileInput.files.length === 0) return;

        const formData = new FormData();
        formData.append('id', taskId);

        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('files', fileInput.files[i]);
        }

        try {
            const res = await fetch('/sample-system/api/tasks/upload-files', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                Swal.fire({
                    title: "Failed",
                    text: "Upload thất bại: " + res.status + " " + text,
                    icon: "error",
                    background: "var(--alert)",
                    color: "white",
                    confirmButtonColor: "#3949ab",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "text-white"
                    }
                });
                return;
            }

            const json = await res.json();

            showAlertSuccess('Success', 'Success!');

            try {
                await fetchAndRenderAttachments(taskId);
            } catch (e) {
                console.warn('Failed to refresh attachments after upload', e);
            }
        } catch (e) {
        }
    };

    fileInput.click();
}

async function handleTaskComment() {
    const modal = document.getElementById('taskDetailModal');
    if (!modal) return;

    const taskId = modal.dataset.taskId;
    if (!taskId || taskId === 'null') {
        return;
    }

    const input = document.getElementById('input-comment');
    const comment = input ? (input.value || '').trim() : '';
    if (!comment) {
        showAlertWarning('Warning', 'Vui lòng nhập bình luận');
        return;
    }

    try {
        const params = new URLSearchParams();
        params.append('comment', comment);

        const res = await fetch(`/sample-system/api/tasks/${taskId}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        if (!res.ok) {
            const txt = await res.text().catch(() => '');
            showAlertError('Failed', 'Gửi comment thất bại: ' + res.status + ' ' + txt);
            return;
        }

        let json = null;
        try { json = await res.json(); } catch (e) { }

        showAlertSuccess('Success', 'Comment đã gửi');
        if (input) input.value = '';

        try {
            await getComments(taskId);
        } catch (e) {
            console.warn('Failed to refresh comments after posting', e);
        }
    } catch (e) {
        showAlertError('Error', 'Lỗi khi gửi comment: ' + e.message);
    }
}

async function getComments(id) {
    try {
        const container = document.getElementById('comment-container');
        if (!container) return;

        // show loading
        container.innerHTML = '<div class="comment-loading">Loading comments...</div>';

        const res = await fetch(`/sample-system/api/tasks/${id}/comments`);
        if (!res.ok) {
            console.warn('getComments: server returned', res.status, res.statusText);
            container.innerHTML = '<div class="comment-empty">No comments</div>';
            return;
        }

        let json = null;
        try { json = await res.json(); } catch (e) { json = null; }
        const items = (json && Array.isArray(json.data)) ? json.data : [];

        if (!items || items.length === 0) {
            container.innerHTML = '<div class="comment-empty">No comments</div>';
            return;
        }

        const html = items.map(it => {
            const author = it.createdBy || it.author || '-';
            const date = it.createdAt || it.createAt || it.date || '-';
            const content = it.content || it.cnContent || it.vnContent || '';

            const safeAuthor = String(author);
            const safeDate = String(date);
            const safeContent = String(content);

            return `
                <div class="comment-item">
                    <div class="comment-header">
                        <div class="comment-avatar"><i class="bi bi-person"></i></div>
                        <div>
                            <div class="comment-author">${escapeHtml(safeAuthor)}</div>
                            <div class="comment-date">${escapeHtml(safeDate)}</div>
                        </div>
                    </div>
                    <div class="comment-text">${escapeHtml(safeContent)}</div>
                </div>`;
        }).join('');

        container.innerHTML = html;

    }
    catch (error) {
        console.error('Lỗi khi lấy comments: ' + (error && error.message ? error.message : error));
    }
}

async function handleAddCustomTask() {
    try {
        const getVal = (id) => {
            const el = document.getElementById(id);
            if (!el) return null;
            const v = (el.value || '').trim();
            return v === '' ? null : v;
        };

        const name = Validators.required(getVal('custom-task-name'), 'Task name');
        const taskCode = getVal('custom-task-id') || null;

        Validators.maxLength(name, 200, 'Task name');
        if (taskCode !== null) {
            Validators.maxLength(taskCode, 50, 'Task code');
        }

        const processId = getVal('custom-sl-process') ? Number(getVal('custom-sl-process')) : null;
        const departmentId = getVal('custom-sl-department') ? Number(getVal('custom-sl-department')) : null;
        const typeId = getVal('custom-sl-xvt') ? Number(getVal('custom-sl-xvt')) : null;
        const priorityRaw = getVal('custom-sl-priority');
        const priority = priorityRaw ? priorityRaw.toUpperCase() : null;
        const dri = getVal('custom-dri');
        const dueDateRaw = getVal('custom-deadline');
        const description = getVal('custom-task-description');

        let dueDate = null;
        if (dueDateRaw) {
            dueDate = DateFormatter.toAPIFormat(dueDateRaw);
        }

        let projectId = null;
        if (window.currentProject && window.currentProject.id) {
            projectId = window.currentProject.id;
        } else {
            const pidEl = document.getElementById('pt_detail_projectId');
            if (pidEl && pidEl.value) projectId = pidEl.value;
        }
        if (projectId !== null && projectId !== undefined && projectId !== '') {
            projectId = Number(projectId);
            if (isNaN(projectId)) projectId = null;
        }

        const payload = {
            name,
            taskCode,
            processId,
            departmentId,
            typeId,
            priority,
            dri,
            dueDate,
            description,
            isTemplate: false,
            projectId,
            step: null,
            flag: true,
            status: null,
            stageId: null
        };

        const res = await fetch('/sample-system/api/tasks/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            showAlertError('Failed', 'Tạo task thất bại: ' + res.status + ' ' + text);
            return;
        }
        showAlertSuccess('Success', 'Tạo task thành công!');
        try { bootstrap.Modal.getInstance(document.getElementById('customTaskModal')).hide(); } catch (e) { }
        try { await loadProjectList(); } catch (e) { }
    } catch (e) {
        return;
    }
}


const SELECT_CONFIGS = [
    { id: 'ppapFilterStatus', endpoint: '/api/tasks/status' },
    { id: 'ppapFilterPriority', endpoint: '/api/tasks/priorities' },
    { id: 'ppapFilterCustomer', endpoint: '/api/customers' },
    { id: 'ppapFilterModel', endpoint: '/api/models' },
    { id: 'ppapFilterStage', endpoint: '/api/stages' },
    { id: 'ppapFilterDepartment', endpoint: '/api/departments' },
    { id: 'ppapFilterProcess', endpoint: '/api/processes' }
];

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

    select.innerHTML = optionsHtml;
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

        try {
            const processIndex = SELECT_CONFIGS.findIndex(c => c.endpoint === '/api/processes' || c.id === 'ppapFilterProcess');
            if (processIndex !== -1) {
                const processes = results[processIndex] || [];
                renderOptions('sl-type', processes);
                SELECT_CACHE['/api/processes'] = processes;
            } else {
                const processes = await fetchOptions('/api/processes');
                renderOptions('sl-type', processes);
                SELECT_CACHE['/api/processes'] = processes;
            }
        } catch (e) {
            console.warn('Failed to load processes for sl-type:', e);
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
            const returned = json.result || json.data || json;
            if (!returned || !returned.id) {
                console.error('createProject: No ID in response', json);
                return null;
            }

            return {
                id: returned.id,
                customer: returned.customerId || c,
                name: returned.name || n,
                createdDate: returned.createdAt ? returned.createdAt.split(' ')[0] : new Date().toISOString().split('T')[0],
                status: returned.status || 'CREATED',
                taskCount: 0,
                tasks: []
            };

        } catch (parseErr) {
            console.error('createProject: Failed to parse response', parseErr);
            return null;
        }
    } catch (e) {
        console.error('createProject failed:', e);
        return null;
    }
}

async function saveTasksForProject(taskIds, customerId, name, projectId) {
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
        console.warn('saveTasksForProject: taskIds is empty or not an array', taskIds);
        return true;
    }
    if (!projectId || projectId === null || projectId === undefined || String(projectId).trim() === '') {
        console.error('saveTasksForProject: projectId is required');
        return false;
    }

    const projectIdInt = parseInt(projectId, 10);
    if (isNaN(projectIdInt)) {
        console.error('saveTasksForProject: projectId must be a valid integer, got:', projectId);
        return false;
    }

    try {
        const url = `/sample-system/api/projects/${projectIdInt}/update`;
        const taskIdsPayload = taskIds.map(id => Number(id))
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskIdsPayload)
        });
        if (!res.ok) {
            const errorText = await res.text().catch(() => '');
            console.error('saveTasksForProject: server returned', res.status, res.statusText, errorText);
            return false;
        }
        const result = await res.json().catch(() => null);
        console.log('saveTasksForProject: Success response:', result);
        return true;
    } catch (e) {
        console.error('saveTasksForProject failed', e);
        return false;
    }
}

async function ensureProjectPersisted(project) {
    if (!project) return null;
    const pid = project.id || project.projectId || null;
    if (pid && String(pid).trim() !== '' && !String(pid).startsWith('TEMP-')) {
        return pid;
    }

    try {
        const created = await createProject(project.customer, project.name);
        if (created && created.id && !String(created.id).startsWith('TEMP-')) {
            project.id = created.id;
            return project.id;
        }
    } catch (e) {
        console.warn('ensureProjectPersisted: createProject failed', e);
    }

    try {
        const params = new URLSearchParams();
        if (project.name) params.append('projectName', project.name);
        if (project.customer) params.append('customerId', mapCustomerToId(project.customer));

        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                const res = await fetch('/sample-system/api/projects' + (params.toString() ? ('?' + params.toString()) : ''));
                if (res.ok) {
                    const json = await res.json();
                    const list = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
                    if (list && list.length) {
                        const found = list.find(p => String(p.name) === String(project.name) && (String(p.customerId || p.customer || '') === String(mapCustomerToId(project.customer))));
                        if (found && found.id && !String(found.id).startsWith('TEMP-')) {
                            project.id = found.id;
                            return project.id;
                        }
                    }
                }
            } catch (e) {
                console.warn('ensureProjectPersisted: query attempt failed', e);
            }
            await new Promise(r => setTimeout(r, 500));
        }
    } catch (e) {
        console.warn('ensureProjectPersisted: fallback search failed', e);
    }

    return null;
}

let currentProject = null;
let projectList = [];
let selectedPPAPItems = [];
let createModalOriginalTitleHTML = null;
let currentTaskDetailObj = null;

function rangePicker($input, fromDate, toDate) {
    let start = null;
    let end = null;
    if (window.moment) {
        try {
            const mStart = window.moment((fromDate || "").split(" ")[0], "YYYY/MM/DD", true);
            if (mStart && typeof mStart.isValid === 'function' && mStart.isValid()) start = mStart;
        } catch (e) { start = null; }

        try {
            const mEnd = window.moment((toDate || "").split(" ")[0], "YYYY/MM/DD", true);
            if (mEnd && typeof mEnd.isValid === 'function' && mEnd.isValid()) end = mEnd;
        } catch (e) { end = null; }
    }

    $input.daterangepicker({
        startDate: start || new Date(Date.now() - 6 * 86400000),
        endDate: end || new Date(),
        autoApply: false,
        locale: { format: "YYYY/MM/DD" },
    });
}

function singlePicker($input, workDate) {
    const dateOnly = (workDate || "").split(" ")[0];
    let start = null;
    if (window.moment) {
        try {
            const m = window.moment(dateOnly, "YYYY/MM/DD", true);
            if (m && typeof m.isValid === 'function' && m.isValid()) start = m;
        } catch (e) { start = null; }
    }

    $input.daterangepicker({
        singleDatePicker: true,
        startDate: start || new Date(),
        autoApply: false,
        locale: { format: "YYYY/MM/DD" },
    });
}

function mapCustomerToId(cust) {
    if (cust === null || cust === undefined) return '';
    const s = String(cust).trim().toLowerCase();
    if (s === '1' || s === 'apollo') return 1;
    if (s === '2' || s === 'rhea') return 2;
    if (s === '3' || s === 'kronos') return 3;
    const num = Number(s);
    if (!isNaN(num) && num > 0) return num;
    return cust;
}

function getEl(id) { return document.getElementById(id); }
function safeSetDisplay(id, value) { const e = getEl(id); if (e && e.style) e.style.display = value; }
function safeSetText(id, text) { const e = getEl(id); if (e) e.textContent = text; }

function getElValue(el) {
    if (!el) return '';
    const t = el.tagName ? el.tagName.toLowerCase() : '';
    if (t === 'input' || t === 'select' || t === 'textarea') return el.value || '';
    return el.textContent || '';
}

function setElValue(el, value) {
    if (!el) return;
    const t = el.tagName ? el.tagName.toLowerCase() : '';
    if (t === 'input' || t === 'select' || t === 'textarea') el.value = value || '';
    else el.textContent = value || '';
}



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
                    createdBy: p.createdBy || '',
                    createdDate: p.createdAt ? p.createdAt.split(' ')[0] : '',
                    updatedAt: p.updatedAt ? p.updatedAt.split(' ')[0] : '',
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

function buildProjectFilterParams() {
    const params = new URLSearchParams();

    try {
        const projectName = (document.getElementById('ppapFilterProject') && document.getElementById('ppapFilterProject').value) ? document.getElementById('ppapFilterProject').value.trim() : '';
        if (projectName) params.append('projectName', projectName);

        const customerId = (document.getElementById('projectCustomerSelect') && document.getElementById('projectCustomerSelect').value) ? document.getElementById('projectCustomerSelect').value.trim() : '';
        if (customerId) params.append('customerId', customerId);

        const createBy = (document.getElementById('filter-created-by') && document.getElementById('filter-created-by').value) ? document.getElementById('filter-created-by').value.trim() : '';
        if (createBy) params.append('createBy', createBy);

        const createdDate = (document.getElementById('filter-created-date') && document.getElementById('filter-created-date').value) ? document.getElementById('filter-created-date').value.trim() : '';
        if (createdDate) {
            // expected format: "YYYY/MM/DD - YYYY/MM/DD" or similar
            const parts = createdDate.split('-').map(s => s.trim()).filter(Boolean);
            if (parts.length === 2) {
                let start = parts[0];
                let end = parts[1];
                // normalize using moment if available
                try {
                    if (window.moment) {
                        const ms = window.moment(start, 'YYYY/MM/DD', true);
                        const me = window.moment(end, 'YYYY/MM/DD', true);
                        if (ms && ms.isValid && ms.isValid()) start = ms.format('YYYY/MM/DD');
                        if (me && me.isValid && me.isValid()) end = me.format('YYYY/MM/DD');
                    }
                } catch (e) { /* ignore */ }

                // Chuẩn hóa full datetime cho API: YYYY/MM/DD HH:mm:ss
                const startFull = DateFormatter.toAPIFormat(start + ' 00:00:00');
                const endFull = DateFormatter.toAPIFormat(end + ' 23:59:59');

                params.append('startTime', startFull);
                params.append('endTime', endFull);
            }
        }
    } catch (e) {
        console.warn('buildProjectFilterParams error', e);
    }

    return params;
}

async function filterProjects() {
    try {
        const params = buildProjectFilterParams();
        const base = '/sample-system/api/projects';
        const url = params.toString() ? (base + '?' + params.toString()) : base;

        const res = await fetch(url);
        if (!res.ok) {
            console.warn('filterProjects: server returned', res.status, res.statusText);
            showAlertError('Failed', 'Filtering failed: ' + res.status);
            return;
        }

        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);

        projectList = data.map(p => ({
            id: p.id,
            customer: p.customerId || 'N/A',
            name: p.name,
            createdBy: p.createdBy || '',
            createdDate: p.createdAt ? p.createdAt.split(' ')[0] : '',
            updatedAt: p.updatedAt ? p.updatedAt.split(' ')[0] : '',
            status: p.status || 'N/A',
            taskCount: p.taskCount || 0,
            tasks: Array.isArray(p.tasks) ? p.tasks.slice() : []
        }));

        renderProjectListUI();
    } catch (e) {
        console.error('filterProjects failed', e);
        showAlertError('Error', 'Lọc thất bại. Kiểm tra console.');
    }
}

function clearAdvancedFilters() {
    try {
        const clearBtn = document.getElementById('clear_filter_button');
        const section = clearBtn ? clearBtn.closest('.ppap-section') : null;

        if (section) {
            const inputs = section.querySelectorAll('input, select, textarea');
            inputs.forEach(el => {
                try {
                    if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
                    else el.value = '';
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                } catch (e) { }
            });
        }

        const extraIds = [
            'ppapFilterProject', 'projectCustomerSelect',
            'filter-created-by', 'filter-created-date'
        ];

        extraIds.forEach(id => {
            try {
                const el = document.getElementById(id);
                if (!el) return;
                if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
                else el.value = '';
                el.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (e) { }
        });

        try {
            const createdDate = document.getElementById('filter-created-date');
            if (createdDate && window.jQuery && $(createdDate).data('daterangepicker')) {
                $(createdDate).val('');
                $(createdDate).trigger('change');
            }
        } catch (e) { }

        try { loadProjectList(); } catch (e) { console.warn(e); }
    } catch (e) {
        console.warn(e);
    }
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
                    <td>${custName}</td>
                    <td>${project.createdBy || ''}</td>
                    <td><strong>${project.name}</strong></td>
                    <td>${project.createdDate}</td>
                    <td><span class="badge badge-warning">Waiting Approval</span></td>
                    <td>${project.updatedAt || ''}</td>
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
                <tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 20px;">
                    No Data!
                </td></tr>
            `;
        } else {
            otherBody.innerHTML = otherProjects.map(project => {
                const statusBadge = getStatusBadge(project.status);
                const custName = getCustomerDisplay(project.customer);
                return `
                    <tr data-project-id="${project.id}" data-section="other" onclick="showProjectTasksModal('${project.id}')" style="cursor:pointer">
                        <td>${custName}</td>
                        <td>${project.createdBy || ''}</td>
                        <td><strong>${project.name}</strong></td>
                        <td>${project.createdDate}</td>
                        <td>${statusBadge}</td>
                        <td>${project.updatedAt || ''}</td>
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


function getCustomerDisplay(cust) {
    if (cust === null || cust === undefined || cust === '' || String(cust).toLowerCase() === 'n/a') return 'N/A';
    const s = String(cust).trim();
    if (s === '1' || s.toLowerCase() === 'apollo') return 'Apollo';
    if (s === '2' || s.toLowerCase() === 'rhea') return 'Rhea';
    if (s === '3' || s.toLowerCase() === 'kronos') return 'Kronos';
    return s;
}
let draggedElement = null;

function initDragAndDrop() {
    const rows = document.querySelectorAll('tr[draggable="true"]');

    rows.forEach(row => {
        row.removeEventListener('dragstart', handleDragStart);
        row.removeEventListener('dragover', handleDragOver);
        row.removeEventListener('drop', handleDrop);
        row.removeEventListener('dragend', handleDragEnd);

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

async function fetchAndRenderAttachments(taskId) {
    if (!taskId) return;
    try {
        const listEl = document.getElementById('attachments-list');
        if (!listEl) return;
        listEl.innerHTML = '<div class="loading">Loading attachments...</div>';

        const res = await fetch(`/sample-system/api/tasks/${encodeURIComponent(taskId)}/documents`);
        if (!res.ok) {
            listEl.innerHTML = '<div class="text-muted">No attachments</div>';
            return;
        }

        const json = await res.json();
        const items = json && (json.data || json.result) ? (json.data || json.result) : [];
        if (!Array.isArray(items) || items.length === 0) {
            listEl.innerHTML = '<div class="text-muted">No attachments</div>';
            return;
        }

        const rows = items.map(it => {
            const url = it.url || it.downloadUrl || '';
            const name = it.name || it.fileName || it.filename || String(it.id || '');
            const safeName = escapeHtml(name);
            const safeUrl = escapeHtml(url);
            return `
                <div class="attachment-item">
                    <div class="attachment-info">
                        <span class="attachment-icon"><i class="bi bi-file-earmark"></i></span>
                        <span class="attachment-name">${safeName}</span>
                    </div>
                    <button type="button" class="download-btn" data-url="${safeUrl}" data-filename="${safeName}">
                        <span><i class="bi bi-download"></i> Download</span>
                    </button>
                </div>`;
        }).join('');

        listEl.innerHTML = rows;

        listEl.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const url = this.dataset.url;
                const filename = this.dataset.filename;
                if (!url) return;

                try {
                    const a = document.createElement('a');

                    const fullUrl = url.startsWith('http') ? url : `/sample-system${url}`;

                    a.href = fullUrl;
                    a.download = filename || 'download';
                    a.style.display = 'none';

                    document.body.appendChild(a);
                    a.click();

                    // Cleanup
                    setTimeout(() => {
                        document.body.removeChild(a);
                    }, 100);
                } catch (e) {
                    console.warn('Download failed, trying fallback', e);
                    try {
                        const fullUrl = url.startsWith('http') ? url : `/sample-system${url}`;
                        window.open(fullUrl, '_blank');
                    } catch (err) {
                        console.error('Both download methods failed', err);
                    }
                }
            });
        });
    } catch (e) {
        console.warn('Failed to load attachments for task', taskId, e);
    }
}


async function showProjectTasksModal(projectId) {
    if (!projectId || projectId === 'null' || projectId === 'undefined') {
        showAlertWarning('Warning', 'Invalid project ID');
        return;
    }

    const parsedId = parseInt(projectId, 10);
    if (isNaN(parsedId)) {
        showAlertWarning('Warning', 'Invalid project ID');
        return;
    }

    const project = findProjectById(projectId);

    try {
        const pidEl = document.getElementById('pt_detail_projectId');
        const setAndDisable = (id, val) => {
            const el = document.getElementById(id);
            if (el) { el.value = val || ''; el.disabled = true; }
        };

        if (project) {
            const cust = project.customer;
            let customerName = 'N/A';
            if (cust === 1 || cust === '1' || String(cust).toLowerCase() === 'apollo') customerName = 'Apollo';
            else if (cust === 2 || cust === '2' || String(cust).toLowerCase() === 'rhea') customerName = 'Rhea';
            else if (cust === 3 || cust === '3' || String(cust).toLowerCase() === 'kronos') customerName = 'Kronos';
            else if (cust) customerName = String(cust);

            if (pidEl) pidEl.value = project.id;
            setAndDisable('pt_detail_customer', customerName);
            setAndDisable('pt_detail_projectName', project.name || '');
            setAndDisable('pt_detail_createdDate', project.createdDate || '');
            setAndDisable('pt_detail_status', project.status || '');
        } else {
            const ids = ['pt_detail_projectId', 'pt_detail_customer', 'pt_detail_projectName', 'pt_detail_createdDate', 'pt_detail_status'];
            ids.forEach(id => { const el = document.getElementById(id); if (el) { el.value = ''; el.disabled = true; } });
        }
    } catch (e) {
        console.warn('Failed to populate project detail pane:', e);
    }

    try {
        const modalEl = document.getElementById('projectTasksModal');
        if (modalEl) {
            const footer = modalEl.querySelector('.modal-footer');
            const statusVal = project && project.status ? String(project.status).toUpperCase() : '';
            const waiting = (statusVal === 'WAITING_FOR_APPROVAL' || statusVal === 'WAITING' || statusVal.indexOf('WAIT') !== -1 && statusVal.indexOf('APPROVAL') !== -1);

            const saveBtn = footer ? footer.querySelector("button[onclick='saveProjectTaskQuantity()']") : null;
            const submitBtn = footer ? footer.querySelector("button[onclick='projectTasksSubmit()']") : null;

            let approveBtn = footer ? footer.querySelector('#pt_approve_btn') : null;
            let rejectBtn = footer ? footer.querySelector('#pt_reject_btn') : null;
            if (footer && !rejectBtn) {
                rejectBtn = document.createElement('button');
                rejectBtn.id = 'pt_reject_btn';
                rejectBtn.className = 'btn secondary-btn';
                rejectBtn.type = 'button';
                rejectBtn.innerHTML = '<i class="bi bi-x-circle"></i> Reject';
                rejectBtn.style.display = 'none';
                rejectBtn.addEventListener('click', function (ev) { ev.stopPropagation(); if (project && project.id) rejectProject(project.id); });
                footer.appendChild(rejectBtn);
            }

            if (footer && !approveBtn) {
                approveBtn = document.createElement('button');
                approveBtn.id = 'pt_approve_btn';
                approveBtn.className = 'btn action-btn';
                approveBtn.type = 'button';
                approveBtn.innerHTML = '<i class="bi bi-check-circle"></i> Approve';
                approveBtn.style.display = 'none';
                approveBtn.addEventListener('click', function (ev) { ev.stopPropagation(); if (project && project.id) approveProject(project.id); });
                footer.appendChild(approveBtn);
            }

            if (waiting) {
                if (saveBtn) saveBtn.style.display = 'none';
                if (submitBtn) submitBtn.style.display = 'none';
                if (approveBtn) approveBtn.style.display = 'inline-flex';
                if (rejectBtn) rejectBtn.style.display = 'inline-flex';
            } else {
                if (saveBtn) saveBtn.style.display = '';
                if (submitBtn) submitBtn.style.display = '';
                if (approveBtn) approveBtn.style.display = 'none';
                if (rejectBtn) rejectBtn.style.display = 'none';
            }
        }
    } catch (e) {
        console.warn('Failed to adjust project tasks modal footer buttons:', e);
    }

    const container = document.getElementById('projectTasksContent');
    if (container) container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-secondary)"><i class="bi bi-hourglass-split"></i> Loading tasks...</div>`;

    openProjectTasksModal();

    try {
        const url = new URL(window.location.href);
        url.searchParams.set('projectId', String(projectId));
        window.history.pushState(
            { projectId: projectId },
            '',
            url.toString()
        );
    } catch (e) {
        console.warn('Failed to pushState for project deep-link', e);
    }

    try {
        const res = await fetch(`/sample-system/api/project/${projectId}/tasks`);

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
        const rows = tasks.map((t, index) => {
            if (t) t.step = index + 1;
            return `
            <tr draggable="true" 
                data-task-id="${t.id}" 
                data-task-index="${index}"
                onclick="showTaskDetailModal(${projectId}, '${t.id}')">
                <td class="drag-handle" style="width:36px;text-align:center;cursor:grab" onmousedown="event.stopPropagation()">
                    <i class="bi bi-grip-vertical" title="Drag" aria-hidden="true"></i>
                </td>
                <td style="width:48px">${t.step || (index + 1)}</td>
                <td>${t.taskCode || ''}</td>
                <td>${t.name || ''}</td>
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
        `}).join('');

        container.innerHTML = `
            <table id="projectTasksTable" class="table mt-0">
                <thead>
                    <tr>
                        <th></th>
                        <th>#</th>
                        <th>Task Name</th>
                        <th>Name</th>
                        <th>Process</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>DRI</th>
                        <th>Deadline</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;

        try {
            if (!document.getElementById('ppap-drag-handle-style')) {
                const style = document.createElement('style');
                style.id = 'ppap-drag-handle-style';
                style.innerHTML = `.drag-handle { cursor: grab; } .drag-handle:active { cursor: grabbing; }`;
                document.head.appendChild(style);
            }
        } catch (e) { /* ignore */ }

        initProjectTasksDragAndDrop(projectId);
    }
}

let draggedProjectTask = null;

function initProjectTasksDragAndDrop(projectId) {
    const table = document.getElementById('projectTasksTable');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr[draggable="true"]');

    rows.forEach(row => {
        row.removeEventListener('dragstart', handleProjectTaskDragStart);
        row.removeEventListener('dragover', handleProjectTaskDragOver);
        row.removeEventListener('drop', handleProjectTaskDrop);
        row.removeEventListener('dragend', handleProjectTaskDragEnd);

        row.addEventListener('dragstart', handleProjectTaskDragStart);
        row.addEventListener('dragover', handleProjectTaskDragOver);
        row.addEventListener('drop', function (e) { return handleProjectTaskDrop.call(this, e, projectId); });
        row.addEventListener('dragend', handleProjectTaskDragEnd);
    });
}

function handleProjectTaskDragStart(e) {
    draggedProjectTask = this;
    this.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
}

function handleProjectTaskDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    if (!draggedProjectTask) return false;

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

function handleProjectTaskDrop(e, projectId) {
    if (e.stopPropagation) e.stopPropagation();
    if (!draggedProjectTask || draggedProjectTask === this) return false;

    const rect = this.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;

    if (e.clientY < midpoint) {
        this.parentNode.insertBefore(draggedProjectTask, this);
    } else {
        this.parentNode.insertBefore(draggedProjectTask, this.nextSibling);
    }

    updateProjectTaskOrder(projectId);

    try {
        const project = findProjectById(projectId);
        if (project) {
            renderProjectTasksContent(project.tasks || [], projectId);
        }
    } catch (e) {
        console.warn('Failed to re-render project tasks after drop', e);
    }

    document.querySelectorAll('#projectTasksTable tbody tr').forEach(r => {
        r.style.borderTop = '';
        r.style.borderBottom = '';
    });

    return false;
}

function handleProjectTaskDragEnd(e) {
    this.style.opacity = '1';
    document.querySelectorAll('#projectTasksTable tbody tr').forEach(r => {
        r.style.borderTop = '';
        r.style.borderBottom = '';
    });
    draggedProjectTask = null;
}

function updateProjectTaskOrder(projectId) {
    const project = findProjectById(projectId);
    if (!project || !project.tasks) return;

    const tbody = document.querySelector('#projectTasksTable tbody');
    if (!tbody) return;

    const newOrder = Array.from(tbody.querySelectorAll('tr')).map(tr => tr.dataset.taskId);

    const taskMap = {};
    project.tasks.forEach(t => { taskMap[String(t.id)] = t; });
    project.tasks = newOrder.map(id => taskMap[String(id)]).filter(Boolean);

    project.tasks.forEach((t, idx) => {
        try { t.step = idx + 1; } catch (e) { /* ignore */ }
    });
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
    if (!project) { showAlertError('Error', 'Project not found'); return; }
    const task = (project.tasks || []).find(t => String(t.id) === String(taskId));
    if (!task) { showAlertError('Error', 'Task not found'); return; }

    getEl('editTaskProjectId').value = projectId;
    getEl('editTaskId').value = taskId;
    getEl('editTaskCode').value = task.taskCode || '';
    getEl('editTaskName').value = task.name || '';
    getEl('editTaskDesc').value = task.description || '';
    getEl('editTaskStatus').value = task.status || '';
    getEl('editTaskPriority').value = task.priority || '';

    try { new bootstrap.Modal(document.getElementById('editTaskModal')).show(); }
    catch (e) { const el = document.getElementById('editTaskModal'); if (el) el.classList.add('active'); }
}

async function showTaskDetailModal(projectId, taskId) {
    if (!taskId || taskId === 'null' || taskId === 'undefined') {
        showAlertWarning('Warning', 'Invalid task ID');
        return;
    }
    let task = null;
    try {
        const project = findProjectById(projectId);

        try {
            const res = await fetch(`/sample-system/api/tasks/${taskId}`);
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
            showAlertError('Error', 'Task not found');
            return;
        }

        const modalRoot = document.getElementById('taskDetailModal');
        if (!modalRoot) return;

        try {
            modalRoot.dataset.projectId = String(projectId || '');
            modalRoot.dataset.taskId = String(taskId || '');
            currentTaskDetailObj = task ? JSON.parse(JSON.stringify(task)) : null;
        } catch (e) {
            console.warn('Failed to attach task metadata to modal', e);
        }

        try {
            const url = new URL(window.location.href);
            url.searchParams.set('taskId', String(taskId));
            window.history.pushState(
                { taskId: taskId, projectId: projectId || null },
                '',
                url.toString()
            );
        } catch (e) {
            console.warn('Failed to pushState for task deep-link', e);
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
                driInput.value = driVal ? driVal : '';
            }

            const deadLineInput = document.getElementById('deadLine');
            const dueVal = task.dueDate || task.deadline || null;
            if (deadLineInput) {
                if (dueVal) {
                    const normalized = DateFormatter.toDisplayFormat(dueVal);
                    deadLineInput.value = normalized;
                    deadLineInput.dataset.initialValue = normalized;
                } else {
                    deadLineInput.value = '';
                    deadLineInput.dataset.initialValue = '';
                }
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
                const hasOption = Array.from(selectEl.options).some(o => String(o.value) === val);
                if (!hasOption) {
                    const opt = document.createElement('option');
                    opt.value = val;
                    opt.text = val === 'N/A' ? 'N/A' : val;
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
                    initDeadlinePicker();
                }, 50);
            } else {
                const modal = new bootstrap.Modal(modalRoot);
                modal.show();

                setTimeout(() => {
                    initDeadlinePicker();
                }, 50);
            }
        } catch (e) {
            if (modalRoot) modalRoot.classList.add('active');
            setTimeout(() => {
                try { initDeadlinePicker(); } catch (err) { }
            }, 50);
        }

        try {
            try {
                await fetchAndRenderAttachments(taskId);
            } catch (attErr) {
                console.warn('Failed to render attachments', attErr);
            }

            await getComments(taskId);
        } catch (err) {
            console.warn('Failed to load comments for task', taskId, err);
        }

    } catch (e) {
        console.error('Error opening task detail modal:', e);
        showAlertError('Error', 'Failed to load task detail');
    }
}

function saveEditedTask() {
    const projectId = getEl('editTaskProjectId').value;
    const taskId = getEl('editTaskId').value;
    const project = projectList.find(p => String(p.id) === String(projectId));
    if (!project) { showAlertError('Error', 'Project not found'); return; }

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
        showAlertSuccess('Success', 'Task added successfully');
        return;
    }

    const taskIndex = (project.tasks || []).findIndex(t => String(t.id) === String(taskId));
    if (taskIndex === -1) { showAlertError('Error', 'Task not found'); return; }

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
    showAlertSuccess('Success', 'Task saved');
}

async function saveTaskDetailChanges() {
    const modalRoot = document.getElementById('taskDetailModal');
    if (!modalRoot) { showAlertError('Error', 'taskDetailModal not found'); return; }

    const projectId = modalRoot.dataset.projectId;
    const taskId = modalRoot.dataset.taskId;

    let taskPayload = null;
    if (currentTaskDetailObj && String(currentTaskDetailObj.id) === String(taskId || currentTaskDetailObj.id)) {
        taskPayload = JSON.parse(JSON.stringify(currentTaskDetailObj));
    } else {
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

    if (!taskPayload) { showAlertError('Error', 'Task data not available for update'); return; }

    const statusSelect = modalRoot.querySelector('#sl-status');
    const prioritySelect = modalRoot.querySelector('#sl-priority');
    const newStatus = statusSelect ? statusSelect.value : taskPayload.status;
    const newPriority = prioritySelect ? prioritySelect.value : taskPayload.priority;

    const driInput = document.getElementById('dri');
    const deadlineInput = document.getElementById('deadLine');

    let newDri = driInput ? driInput.value : taskPayload.dri;
    let newDeadline = deadlineInput ? deadlineInput.value : taskPayload.dueDate;
    if (newDri === 'N/A' || newDri === '-' || !newDri || newDri.trim() === '') newDri = null;
    if (newDeadline === 'N/A' || newDeadline === '-' || !newDeadline || newDeadline.trim() === '') newDeadline = null;

    if (newDeadline) {
        try {
            newDeadline = DateFormatter.toAPIFormat(newDeadline);
        } catch (e) {
            console.warn('Failed to format deadline:', e);
        }
    }

    taskPayload.status = (newStatus === 'N/A' ? null : newStatus);
    taskPayload.priority = (newPriority === 'N/A' ? null : newPriority);
    taskPayload.dri = newDri;
    taskPayload.dueDate = newDeadline;

    try {
        const stageSelect = modalRoot.querySelector('#sl-xvt');
        const stageVal = stageSelect ? stageSelect.value : (taskPayload.stageId || (taskPayload.stage && taskPayload.stage.id) || null);
        let newStageId = null;
        if (stageVal !== null && stageVal !== undefined && String(stageVal).trim() !== '' && stageVal !== 'N/A' && stageVal !== '-') {
            const parsed = Number(stageVal);
            newStageId = isNaN(parsed) ? null : parsed;
        }
        taskPayload.stageId = newStageId;
    } catch (e) {
        console.warn('Failed to read stage select for task update:', e);
    }

    try {
        const typeSelect = modalRoot.querySelector('#sl-type');
        const typeVal = typeSelect ? typeSelect.value : (taskPayload.processId || (taskPayload.process && taskPayload.process.id) || null);
        let newProcessId = null;
        if (typeVal !== null && typeVal !== undefined && String(typeVal).trim() !== '' && typeVal !== 'N/A' && typeVal !== '-') {
            const parsedType = Number(typeVal);
            newProcessId = isNaN(parsedType) ? null : parsedType;
        }
        taskPayload.processId = newProcessId;
    } catch (e) {
        console.warn('Failed to read type/process select for task update:', e);
    }

    try {
        const res = await fetch('/sample-system/api/tasks/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskPayload)
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            console.warn('Update API returned', res.status, res.statusText, text);
            showAlertError('Failed', 'Failed to update task. Server returned ' + res.status);
            return;
        }

        let json = null;
        try { json = await res.json(); } catch (e) { /* ignore parse */ }
        const updatedTask = (json && (json.data || json.result)) || taskPayload;

        if (projectId && projectList && Array.isArray(projectList)) {
            const proj = projectList.find(p => String(p.id) === String(projectId));
            if (proj && Array.isArray(proj.tasks)) {
                const idx = proj.tasks.findIndex(t => String(t.id) === String(taskId));
                if (idx !== -1) {
                    proj.tasks[idx] = { ...proj.tasks[idx], ...updatedTask };
                }
            }
        }

        try {
            const statusBadge = modalRoot.querySelector('.task-status-badge');
            const priorityBadge = modalRoot.querySelector('.priority-badge');
            if (statusBadge) statusBadge.textContent = updatedTask.status || '';
            if (priorityBadge) priorityBadge.textContent = (updatedTask.priority === 0 ? '0' : (updatedTask.priority || ''));
            if (statusSelect) statusSelect.value = updatedTask.status || (updatedTask.status === null ? 'N/A' : '');
            if (prioritySelect) prioritySelect.value = updatedTask.priority || (updatedTask.priority === null ? 'N/A' : '');
        } catch (e) { console.warn('Failed to refresh badges after update', e); }

        try {
            safeHideModal(modalRoot);
        } catch (e) {
            try { bootstrap.Modal.getInstance(modalRoot).hide(); } catch (err) { modalRoot.classList.remove('active'); }
        }

        showAlertSuccess('Success', 'Task updated successfully');

        try {
            if (projectId) showProjectTasksModal(projectId);
        } catch (e) { /* ignore */ }

    } catch (e) {
        console.error('Failed to call update API', e);
        showAlertError('Failed', 'Failed to update task: ' + e.message);
    }
}

window.saveTaskDetailChanges = saveTaskDetailChanges;

async function saveProjectTaskQuantity() {
    const pidEl = getEl('pt_detail_projectId');
    let project = null;
    if (pidEl && pidEl.value) project = projectList.find(p => String(p.id) === String(pidEl.value));
    if (!project) {
        const projName = getEl('pt_detail_projectName') ? getElValue(getEl('pt_detail_projectName')) : null;
        if (!projName) { showAlertError('Error', 'Project not found'); return; }
        project = projectList.find(p => p.name === projName);
    }
    if (!project) { showAlertError('Error', 'Project not found'); return; }

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
        const taskIds = Array.isArray(project.tasks)
            ? project.tasks.map(item => String(item.id)).filter(id => id && String(id).trim() !== '')
            : [];

        if (taskIds.length > 0) {
            const resolvedId = await ensureProjectPersisted(project);
            if (!resolvedId) {
                showAlertError('Failed', 'Không thể lưu tasks cho project: không tìm được project id trên server');
            } else {
                const customerIdForSave = mapCustomerToId(project.customer);
                const saveOk = await saveTasksForProject(taskIds, customerIdForSave, project.name, resolvedId);
                if (saveOk) {
                    showAlertSuccess('Success', 'Project details and tasks updated successfully');
                    await loadProjectList();
                    try {
                        if (project && project.id) {
                            await showProjectTasksModal(project.id);
                        }
                    } catch (e) {
                        console.warn('Failed to refresh project tasks after save', e);
                    }
                }
            }
        } else {
            showAlertSuccess('Success', 'Project details updated successfully (no tasks to save)');
            await loadProjectList();
            try {
                if (project && project.id) {
                    await showProjectTasksModal(project.id);
                } else {
                    renderProjectTasksContent(project.tasks || [], project.id || '');
                }
            } catch (e) {
                console.warn('Failed to refresh project tasks after save (no tasks case)', e);
            }
        }
    } catch (e) {
        console.error('Error while saving project tasks:', e);
        showAlertError('Error', 'Project details updated locally but saving tasks failed. See console for details.');
    }
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
    if (!pid) { showAlertError('Error', 'Project not found'); return; }

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
            showAlertError('Failed', 'Failed to delete task.');
            return;
        }

        let json = null;
        try { json = await res.json(); } catch (e) { }

        const serverOk = json ? (json.status === 'OK' || json.success === true || json.result === 'OK') : true;
        if (!serverOk) {
            showAlertError('Failed', 'Server reported failure when deleting task.');
            return;
        }

        project.tasks = (project.tasks || []).filter(t => String(t.id) !== String(taskId));
        project.taskCount = project.tasks.length;

        renderProjectTasksContent(project.tasks, projectId);

    } catch (e) {
        console.error('Error', e);
        showAlertError('Error', 'Error while deleting task. See console for details.');
    }
}

async function projectTasksSubmit() {
    const pidEl = getEl('pt_detail_projectId');
    if (!pidEl || !pidEl.value) {
        showAlertWarning('Warning', 'Project ID not found');
        return;
    }

    const projectId = parseInt(pidEl.value, 10);
    if (isNaN(projectId)) {
        showAlertWarning('Warning', 'Invalid project ID');
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
            showAlertError('Failed', 'Server reported failure when submitting project');
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

        showAlertSuccess('Success', 'Project submitted successfully');

    } catch (e) {
        console.error('Failed to submit project:', e);
        showAlertError('Failed', 'Failed to submit project. Please try again.');
    }
}

function openTaskDetailFromProject(taskId) {
    const modalEl = document.getElementById('taskDetailModal');
    if (!modalEl) { showAlertError('Error', 'Modal not found'); return; }

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

async function saveProjectBasicInfoModal() {
    const customer = document.getElementById('newProjectCustomer').value;
    const name = document.getElementById('newProjectName').value;

    if (!customer || !name) {
        showAlertWarning('Warning', 'Please fill all required fields (Customer, Project Name)');
        return;
    }

    const customerName = getCustomerDisplay(customer);

    const created = await createProject(customer, name);

    if (!created) {
        showAlertError('Failed', 'Please try again.');
        return;
    }

    currentProject = {
        id: created.id || created.projectId,
        customer: created.customerId || customer,
        name: created.name || name,
        createdDate: created.createdAt ? created.createdAt.split(' ')[0] : new Date().toISOString().split('T')[0],
        status: created.status || 'draft',
        taskCount: 0,
        tasks: []
    };

    const existingIndex = projectList.findIndex(p => String(p.id) === String(currentProject.id));
    if (existingIndex !== -1) {
        projectList[existingIndex] = currentProject;
    } else {
        projectList.push(currentProject);
    }

    await loadProjectList();

    safeSetDisplay('createProjectStep1', 'none');
    safeSetDisplay('createProjectStep2', 'block');
    safeSetDisplay('createBackBtn', 'inline-flex');
    safeSetDisplay('createNextBtn', 'none');
    safeSetDisplay('createSaveBtn', 'inline-flex');

    const metaEl = getEl('createProjectModalMeta');
    if (metaEl) {
        metaEl.textContent = `${customerName} - ${name}`;
        if (metaEl.style) metaEl.style.display = 'inline';
    }

    const labelEl = getEl('createProjectModalLabel');
    if (labelEl) {
        labelEl.innerHTML = `<span><i class="bi bi-plus-square"></i></span><span>Add Tasks to ${customerName} - ${name}</span>`;
    }

    showAlertSuccess('Success', 'Project created successfully! Now you can add tasks.');

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
    if (!currentProject || !currentProject.id) {
        return;
    }

    if (!selectedPPAPItems || selectedPPAPItems.length === 0) {
        showAlertWarning('Warning', 'Please select at least one task');
        return;
    }

    const taskIds = selectedPPAPItems.map(item => String(item.id)).filter(id => id && String(id).trim() !== '');

    try {
        const resolvedId = await ensureProjectPersisted(currentProject);
        if (!resolvedId) {
            showAlertError('Failed', 'Please try again');
            return;
        }

        const customerIdForSave = mapCustomerToId(currentProject.customer);
        const saveOk = await saveTasksForProject(taskIds, customerIdForSave, currentProject.name, resolvedId);
        if (!saveOk) {
            showAlertError('Failed', 'Failed to add tasks. Please try again.');
            return;
        }

        currentProject.tasks = selectedPPAPItems.slice();
        currentProject.taskCount = selectedPPAPItems.length;

        const existingIndex = projectList.findIndex(p => String(p.id) === String(currentProject.id));
        if (existingIndex !== -1) {
            projectList[existingIndex] = currentProject;
        } else {
            projectList.push(currentProject);
        }

        showAlertSuccess('Success', `Project "${currentProject.name}" saved successfully with ${selectedPPAPItems.length} tasks.`);

        closeCreateProjectModal();
        await loadProjectList();

    } catch (e) {
        console.error('Failed to submit project:', e);
        showAlertError('Failed', 'Failed to submit project. Please try again.');
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

function initSelectedTasksDragAndDrop() {
    const rows = document.querySelectorAll('#selectedTasksTable tbody tr');
    rows.forEach(row => {
        row.removeEventListener('dragstart', handleTaskDragStart);
        row.removeEventListener('dragover', handleTaskDragOver);
        row.removeEventListener('drop', handleTaskDrop);
        row.removeEventListener('dragend', handleTaskDragEnd);

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
        showAlertWarning('Warning', 'Please fill all required fields (Customer, Project Name)');
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
    if (!currentProject) { showAlertWarning('Warning', 'Please save basic project info first'); return; }
    if (selectedPPAPItems.length === 0) { showAlertWarning('Warning', 'Please select at least one PPAP item or add a custom task'); return; }

    currentProject.taskCount = selectedPPAPItems.length;
    currentProject.status = 'waiting';
    const taskIds = selectedPPAPItems.map(item => String(item.id)).filter(id => id && String(id).trim() !== '');

    let resolvedId = null;
    if (currentProject.id && !String(currentProject.id).startsWith('TEMP-')) {
        resolvedId = currentProject.id;
    } else {
        const created = await createProject(currentProject.customer, currentProject.name);
        if (created && created.id) {
            currentProject.id = created.id;
            resolvedId = created.id;
        } else {
            showAlertError('Failed', 'Failed to create project on server. Please try again.');
            return;
        }
    }

    const customerIdForSave = mapCustomerToId(currentProject.customer);
    const saveOk = await saveTasksForProject(taskIds, customerIdForSave, currentProject.name, resolvedId);
    if (!saveOk) {
        console.warn('submitProject: saving tasks failed for project', resolvedId);
        showAlertError('Failed', 'Saving tasks to project failed. Please try again.');
        return;
    }

    const existingIndex = projectList.findIndex(p => String(p.id) === String(currentProject.id));
    if (existingIndex !== -1) {
        projectList[existingIndex] = currentProject;
    } else {
        projectList.push(currentProject);
    }

    showAlertSuccess('Success', `Project "${currentProject.name}" saved successfully, containing ${currentProject.taskCount} tasks`);
    resetToProjectList();
    await loadProjectList();
}

async function showStandardPPAP() {
    const modal = document.getElementById("standardPPAPModal");
    const grid = document.getElementById("ppapTasksGrid");

    if (grid) grid.innerHTML = '<div class="ppap-loading">載入中...</div>';

    const pidEl = getEl('pt_detail_projectId');
    if (pidEl && pidEl.value) {
        const project = projectList.find(p => String(p.id) === String(pidEl.value));
        if (project && Array.isArray(project.tasks) && project.tasks.length > 0) {
            selectedPPAPItems = project.tasks.slice();
        }
    }

    const preservedIds = new Set();
    try {
        (selectedPPAPItems || []).forEach(i => {
            if (!i) return;
            if (i.id != null) preservedIds.add(String(i.id));
            if (i.parentId != null) preservedIds.add(String(i.parentId));
        });

        if (currentProject && Array.isArray(currentProject.tasks)) currentProject.tasks.forEach(i => {
            if (!i) return;
            if (i.id != null) preservedIds.add(String(i.id));
            if (i.parentId != null) preservedIds.add(String(i.parentId));
        });

        if (pidEl && pidEl.value) {
            const project = projectList.find(p => String(p.id) === String(pidEl.value));
            if (project && Array.isArray(project.tasks)) project.tasks.forEach(i => {
                if (!i) return;
                if (i.id != null) preservedIds.add(String(i.id));
                if (i.parentId != null) preservedIds.add(String(i.parentId));
            });
        }
    } catch (e) { console.warn('Error', e); }

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
        const originalTasks = Array.isArray(tasks) ? tasks.slice() : [];

        function renderTaskList(list) {
            grid.innerHTML = (Array.isArray(list) ? list : []).map((task) => {
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

        renderTaskList(originalTasks);

        try {
            const input = document.getElementById('filter-standard-ppap');
            if (input) {
                if (input._ppapFilterListener) {
                    input.removeEventListener('input', input._ppapFilterListener);
                }

                input.value = '';

                const listener = function (ev) {
                    const q = (ev && ev.target && ev.target.value) ? String(ev.target.value).trim().toLowerCase() : '';
                    if (!q) {
                        renderTaskList(originalTasks);
                        return;
                    }

                    const filtered = originalTasks.filter(t => {
                        const n = (t.name || '').toString().toLowerCase();
                        const d = (t.description || '').toString().toLowerCase();
                        return (n.indexOf(q) !== -1) || (d.indexOf(q) !== -1);
                    });
                    renderTaskList(filtered);
                };

                input._ppapFilterListener = listener;
                input.addEventListener('input', listener);
            }
        } catch (e) {
            console.warn('Failed to attach standard PPAP filter listener', e);
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
    let topZ = 1040;
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

    const map = {};
    (selectedPPAPItems || []).forEach(i => {
        if (i && i.id) map[String(i.id)] = i;
    });

    const item = {
        id: String(cb.value),
        taskCode: codeEl ? codeEl.textContent.trim() : '',
        name: nameEl ? nameEl.textContent.trim() : String(cb.value),
        description: descEl ? descEl.textContent.trim() : '',
        status: status,
        priority: priority,
        step: Object.keys(map).length + 1
    };

    if (cb.checked) {
        map[String(item.id)] = item;
    } else {
        delete map[String(item.id)];
    }

    selectedPPAPItems = Object.values(map);

    selectedPPAPItems.forEach((task, idx) => {
        if (task) task.step = idx + 1;
    });

    try {
        renderSelectedTasksInModal();
    } catch (err) {
        console.warn('renderSelectedTasksInModal failed', err);
    }
}

function confirmPPAPSelection() {
    const checked = Array.from(document.querySelectorAll(".ppap-checkbox:checked"));

    if (checked.length === 0) {
        showAlertWarning('Warning', 'Please select at least one PPAP item');
        return;
    }

    selectedPPAPItems = checked.map(cb => {
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

    showAlertSuccess('Success', `Selected ${selectedPPAPItems.length} PPAP items`);

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
        const bs = openModalAbove(modal);
        try { setTimeout(() => initDeadlinePicker(), 60); } catch (e) { }
    } catch (e) {
        console.error(e);
        try { if (modal) { var mm = new bootstrap.Modal(modal); mm.show(); } } catch (err) { /* ignore */ }
    }
}

async function loadCustomTaskSelects() {
    try {
        const departments = SELECT_CACHE['/api/departments'] || await fetchOptions('/api/departments');
        const processes = SELECT_CACHE['/api/processes'] || await fetchOptions('/api/processes');
        const priorities = SELECT_CACHE['/api/tasks/priorities'] || await fetchOptions('/api/tasks/priorities');
        const stages = SELECT_CACHE['/api/stages'] || await fetchOptions('/api/stages');

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

async function approveProject(projectId) {
    if (!confirm('Are you sure you want to approve this project?')) return;

    try {
        const res = await fetch('/sample-system/api/projects/approve?id=' + encodeURIComponent(projectId), {
            method: 'POST'
        });

        if (!res.ok) {
            const txt = await res.text().catch(() => '');
            showAlertError('Failed', 'Approve API returned ' + res.status + '\n' + txt);
            return;
        }

        showAlertSuccess('Approved', 'Project approved successfully');
        const project = projectList.find(p => String(p.id) === String(projectId));
        if (project) project.status = 'approved';
        await loadProjectList();
        try { if (document.getElementById('projectTasksModal') && bootstrap.Modal.getInstance(document.getElementById('projectTasksModal'))) bootstrap.Modal.getInstance(document.getElementById('projectTasksModal')).hide(); } catch (e) { /* ignore */ }
    } catch (e) {
        console.error('Approve API error', e);
        showAlertError('Failed', 'Failed to call approve API: ' + (e && e.message ? e.message : e));
    }
}

async function rejectProject(projectId) {
    if (!confirm('Are you sure you want to reject this project?')) return;

    try {
        const res = await fetch('/sample-system/api/projects/return?id=' + encodeURIComponent(projectId), {
            method: 'POST'
        });

        if (!res.ok) {
            const txt = await res.text().catch(() => '');
            showAlertError('Failed', 'Return API returned ' + res.status + '\n' + txt);
            return;
        }

        showAlertWarning('Rejected', 'Project has been returned/rejected');
        const project = projectList.find(p => String(p.id) === String(projectId));
        if (project) project.status = 'rejected';
        await loadProjectList();
        try { if (document.getElementById('projectTasksModal') && bootstrap.Modal.getInstance(document.getElementById('projectTasksModal'))) bootstrap.Modal.getInstance(document.getElementById('projectTasksModal')).hide(); } catch (e) { /* ignore */ }
    } catch (e) {
        console.error('Return API error', e);
        showAlertError('Failed', 'Failed to call return API: ' + (e && e.message ? e.message : e));
    }
}



async function deleteProject(projectId) {
    const project = projectList.find(p => String(p.id) === String(projectId));
    if (!project) {
        console.warn('deleteProject: project not found for id', projectId);
        return;
    }

    if (!confirm(`Are you sure you want to delete project "${project.name}"?\nThis action cannot be undone!`)) {
        return;
    }
    try {
        const bodyId = parseInt(projectId, 10);
        if (isNaN(bodyId)) {
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
        } catch (e) { }

        if (!ok) {
            return;
        }

        projectList = projectList.filter(p => String(p.id) !== String(projectId));
        showAlertSuccess('Success', `Project "${project.name}" has been deleted`);
        await loadProjectList();

    } catch (e) {
        console.error('Failed to delete project:', e);
        showAlertError('Failed', 'Failed to delete project. Please try again.');
    }
}

function initDeadlinePicker() {
    const ids = ['deadLine', 'custom-deadline'];

    ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        try {
            const raw = String(el.value || '').trim();
            if (raw === '-' || raw.toUpperCase() === 'N/A') el.value = '';
        } catch (e) { /* ignore */ }

        try {
            if (window.jQuery && $(el).data('daterangepicker')) {
                try { $(el).data('daterangepicker').remove(); } catch (err) { }
                try { $(el).off('apply.daterangepicker cancel.daterangepicker'); } catch (err) { }
            }
        } catch (e) { }

        try {
            if (el._flatpickr) {
                try { el._flatpickr.destroy(); } catch (err) { }
            }
        } catch (e) { }

        if (window.jQuery && typeof window.jQuery.fn.daterangepicker === 'function') {
            try { el.type = 'text'; } catch (e) { }

            const currentValue = el.value || '';
            singlePicker($(el), currentValue);

            $(el).on('apply.daterangepicker', function (ev, picker) {
                try {
                    $(this).val(picker.startDate.format('YYYY/MM/DD'));
                } catch (err) {
                    $(this).val('');
                }
            });

            $(el).on('cancel.daterangepicker', function () {
                try { $(this).val(''); } catch (err) { }
            });

            return;
        }

        try { el.type = 'date'; } catch (e) { }

        el.addEventListener('focus', function onFocus() {
            try { el.type = 'datetime-local'; } catch (e) { }
            el.removeEventListener('focus', onFocus);
        });
    });
}

function getProjectIdFromLocation() {
    try {
        const params = new URLSearchParams(window.location.search || '');
        const qProjectId = params.get('projectId');
        if (qProjectId) return qProjectId;
        return null;
    } catch (e) {
        return null;
    }
}

function getTaskIdFromLocation() {
    try {
        const params = new URLSearchParams(window.location.search || '');
        const qTaskId = params.get('taskId');
        if (qTaskId) return qTaskId;

        return null;
    } catch (e) {
        console.warn('getTaskIdFromLocation error', e);
        return null;
    }
}

async function urlProject() {
    const projectId = getProjectIdFromLocation();
    if (!projectId) return;

    try {
        let retries = 0;
        const maxRetries = 20;

        while ((!projectList || projectList.length === 0) && retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }

        const project = findProjectById(projectId);
        if (!project) {
            console.warn('urlProject: project not found for id', projectId);
            return;
        }

        await showProjectTasksModal(projectId);

    } catch (e) {
        console.error('urlProject error:', e);
    }
}

async function urlTask() {
    const taskId = getTaskIdFromLocation();
    if (!taskId) return;

    try {
        let retries = 0;
        const maxRetries = 20;

        while ((!projectList || projectList.length === 0) && retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }

        const res = await fetch(`/sample-system/api/tasks/${encodeURIComponent(taskId)}`);
        if (!res.ok) {
            console.warn('urlTask: task API returned', res.status, res.statusText);
            await showTaskDetailModal(null, taskId);
            return;
        }

        const json = await res.json();
        const task = json.data || json.result || null;

        if (!task) {
            console.warn('urlTask: no task data in response');
            await showTaskDetailModal(null, taskId);
            return;
        }

        const projectId = task.projectId || task.project_id || task.project_id_fk || null;

        await showTaskDetailModal(projectId, taskId);

    } catch (e) {
        console.error('urlTask error:', e);
        try {
            await showTaskDetailModal(null, taskId);
        } catch (err) {
            console.error('Fallback showTaskDetailModal failed', err);
        }
    }
}

function debounce(fn, wait) {
    let timeout = null;
    return function () {
        const args = arguments;
        const later = () => {
            timeout = null;
            fn.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function filterProjectTasksByName(query) {
    try {
        const table = document.getElementById('projectTasksTable');
        if (!table) return;
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const q = (query || '').trim().toLowerCase();
        const rows = Array.from(tbody.querySelectorAll('tr'));

        if (!q) {
            rows.forEach(r => { r.style.display = ''; });
            return;
        }

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const nameCell = cells && cells.length >= 3 ? cells[2] : null;
            const text = nameCell ? (nameCell.textContent || nameCell.innerText || '').trim().toLowerCase() : '';
            if (text.indexOf(q) === -1) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        });
    } catch (e) {
        console.warn('filterProjectTasksByName error', e);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const btn = document.getElementById('upload');
    if (btn) {
        btn.addEventListener('click', handleTaskFileUpload);
    }

    try {
        if (window.jQuery && typeof window.jQuery.fn.daterangepicker === 'function') {
            var input = document.querySelector("#filter-created-date");
            if (input) {
                try {
                    if ($(input).data('daterangepicker')) {
                        try { $(input).data('daterangepicker').remove(); } catch (err) { }
                        try { $(input).off('apply.daterangepicker cancel.daterangepicker'); } catch (err) { }
                    }
                } catch (err) { }

                rangePicker($(input), null, null);

                $(input).on('apply.daterangepicker', function (ev, picker) {
                    try {
                        $(this).val(picker.startDate.format('YYYY/MM/DD') + ' - ' + picker.endDate.format('YYYY/MM/DD'));
                        $(this).trigger('change');
                    } catch (err) { }
                });

                $(input).on('cancel.daterangepicker', function () {
                    try { $(this).val(''); $(this).trigger('change'); } catch (err) { }
                });
            }
        }
    } catch (e) { console.warn('Failed to init created date picker:', e); }

    const btnComment = document.getElementById('comment');
    if (btnComment) {
        btnComment.addEventListener('click', handleTaskComment);
    }

    const btnAddCustom = document.getElementById('add-custom');
    if (btnAddCustom) {
        btnAddCustom.addEventListener('click', handleAddCustomTask);
    }

    try {
        const searchInput = document.getElementById('search-task');
        if (searchInput) {
            if (searchInput._searchHandler) {
                searchInput.removeEventListener('input', searchInput._searchHandler);
            }

            searchInput._searchHandler = debounce(function (ev) {
                try {
                    filterProjectTasksByName(ev.target.value);
                } catch (e) { console.warn('search-task handler error', e); }
            }, 200);

            searchInput.addEventListener('input', searchInput._searchHandler);
        }
    } catch (e) { console.warn('Failed to attach search-task listener', e); }

    await loadAllSelects();
    await loadProjectList();

    try { initDeadlinePicker(); } catch (e) { }

    try {
        await urlTask();
    } catch (e) {
        console.warn('Failed to open task from URL', e);
    }

    try {
        await urlProject();
    } catch (e) {
        console.warn('Failed to open project from URL', e);
    }

    const modalEl = document.getElementById('taskDetailModal');
    if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', function () {
            try {
                const url = new URL(window.location.href);
                url.searchParams.delete('taskId');
                window.history.pushState({}, '', url.toString());
            } catch (e) {
                console.warn('Failed to clean taskId from URL', e);
            }
        });
    }

    const projectModalEl = document.getElementById('projectTasksModal');
    if (projectModalEl) {
        projectModalEl.addEventListener('hidden.bs.modal', function () {
            try {
                const url = new URL(window.location.href);
                url.searchParams.delete('projectId');
                window.history.pushState({}, '', url.toString());
            } catch (e) {
                console.warn('Failed to clean projectId from URL', e);
            }
        });
    }

    try {
        const fb = document.getElementById('filter_button');
        if (fb) fb.addEventListener('click', function (ev) {
            try { filterProjects(); } catch (e) { console.warn('filter_button handler error', e); }
        });

        try {
            const clearBtn = document.getElementById('clear_filter_button');
            if (clearBtn) clearBtn.addEventListener('click', function (ev) {
                try { clearAdvancedFilters(); } catch (e) { console.warn('clear_filter_button handler error', e); }
            });
        } catch (e) { console.warn('Failed to attach clear_filter_button listener', e); }
    } catch (e) { console.warn('Failed to attach filter_button listener', e); }
});
