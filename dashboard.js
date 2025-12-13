const t = window.t || ((key) => key);
let USERS_CACHE = [];

async function fetchUsers() {
    try {
        const res = await fetch('/sample-system/api/users');
        if (!res.ok) {
            throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return json.result || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

function filterUsers(keyword) {
    if (!keyword || keyword.length === 0) {
        return USERS_CACHE;
    }

    const lowerKeyword = keyword.toLowerCase();
    return USERS_CACHE.filter(user => {
        const idCard = (user.idCard || '').toLowerCase();
        const fullName = (user.fullName || '').toLowerCase();
        const displayName = (user.displayName || '').toLowerCase();

        return idCard.includes(lowerKeyword) ||
            fullName.includes(lowerKeyword) ||
            displayName.includes(lowerKeyword);
    });
}

function updateDRISelect() {
    const select = document.querySelector('#dashboardFilterDRI');
    if (!select) return;

    select.innerHTML = '<option value="">-- Select DRI --</option>';

    USERS_CACHE.forEach(user => {
        const idCard = user.idCard || '';
        const fullName = user.fullName || '';
        const displayName = user.displayName || '';
        const option = document.createElement('option');
        option.value = idCard;
        option.textContent = `${idCard} - ${fullName} - ${displayName}`;
        select.appendChild(option);
    });

    $(select).select2({
        placeholder: 'Search DRI...',
        allowClear: true,
        width: '100%'
    });
}

async function fetchProjects() {
    try {
        const response = await fetch('/sample-system/api/dashboard/projects');
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        return json.data || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

async function renderProjects() {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const projectsData = await fetchProjects();
    
    projectsData.forEach((project) => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
            <div class="project-header">
                <div class="project-name">${project.projectName}</div>
                <button class="cft-team-btn" data-id="${project.id}" data-action="showCFTTeam">
                    <i class="bi bi-people"></i> <span>查看 CFT Team</span>
                </button>
            </div>
            <div class="project-meta">
                <div class="meta-item">
                    <div class="meta-label">客戶</div>
                    <div class="meta-value">${project.customerName || '-'}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">產品</div>
                    <div class="meta-value">${project.modelName}</div>
                </div>
                <div class="meta-item clickable" data-id="${project.id}" data-filter="in-progress" data-action="showTaskListByFilter">
                    <div class="meta-label">進行中任務</div>
                    <div class="meta-value" style="color: var(--accent-orange);">${project.inProcess}</div>
                </div>
                <div class="meta-item clickable" data-id="${project.id}" data-filter="pending" data-action="showTaskListByFilter">
                    <div class="meta-label">本週待辦</div>
                    <div class="meta-value" style="color: var(--accent-blue);">${project.weeklyPending}</div>
                </div>
                <div class="meta-item clickable" data-id="${project.id}" data-filter="overdue" data-action="showTaskListByFilter">
                    <div class="meta-label">逾期任務</div>
                    <div class="meta-value" style="color: var(--accent-red);">${project.overDueTask}</div>
                </div>
            </div>
            <div class="xvt-stages-grid">
                ${renderStages(project)}
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderStages(project) {
    if (!project.process || !Array.isArray(project.process)) return '';
    
    return project.process.map((process) => {
        const percentage = Math.round(process.doneRate * 100);
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (percentage / 100) * circumference;
        let strokeColor = "#4CAF50";
        if (percentage < 50) strokeColor = "#f44336";
        else if (percentage < 80) strokeColor = "#FF9800";

        return `
            <div class="stage-gauge" data-id="${project.id}" data-stage="${process.processName}" data-action="showTaskListByStage">
                <div class="stage-label">${process.processName}</div>
                <div class="gauge-circle">
                    <svg width="120" height="120">
                        <circle class="gauge-bg" cx="60" cy="60" r="54"></circle>
                        <circle class="gauge-progress" cx="60" cy="60" r="54"
                            stroke="${strokeColor}"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${offset}">
                        </circle>
                    </svg>
                    <div class="gauge-text">
                        <div class="gauge-percentage">${percentage}%</div>
                        <div class="gauge-fraction">${process.taskDone}/${process.taskTotal}</div>
                    </div>
                </div>
                <div class="gauge-date">${process.taskDone}/${process.taskTotal}</div>
            </div>
        `;
    }).join("");
}

async function showCFT(projectId) {
    try {
        // TODO: Replace với API
        // const response = await fetch(`/api/projects/${projectId}/cft-team`);
        // const project = await response.json();
        
        // For now, fetch the project data to get CFT team info
        const projectsData = await fetchProjects();
        const project = projectsData.find((p) => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById("cftTeamModal");
        const title = document.getElementById("cftTeamTitle");
        const tbody = document.getElementById("cftTeamBody");

        title.textContent = `${projectId} - CFT Team`;
        
        // Use mock CFT team data for now
        const mockCFTTeam = [
            { function: "PQE", member: "工程師", role: "PPAP 總負責", responsibility: "PPAP 系統建立與執行", raci: "A" },
            { function: "TPM", member: "經理", role: "專案經理", responsibility: "專案進度管理與協調", raci: "A" },
            { function: "OPM", member: "主管", role: "營運經理", responsibility: "營運策略與資源配置", raci: "C" },
            { function: "MPM", member: "經理", role: "製造經理", responsibility: "生產製造管理", raci: "R" },
            { function: "RD", member: "設計師", role: "研發工程師", responsibility: "產品設計與開發", raci: "R" },
            { function: "SW", member: "工程師", role: "軟體工程師", responsibility: "軟體開發與測試", raci: "R" },
            { function: "PE", member: "製程", role: "製程工程師", responsibility: "製程開發與改善", raci: "R" },
            { function: "ME", member: "工程師", role: "機構工程師", responsibility: "機構設計與驗證", raci: "R" },
            { function: "TE", member: "測試員", role: "測試工程師", responsibility: "產品測試與驗證", raci: "R" },
            { function: "IE", member: "工程師", role: "工業工程師", responsibility: "生產效率與成本提升", raci: "C" },
            { function: "IT", member: "工程師", role: "IT 支援", responsibility: "系統與資訊支援", raci: "I" },
        ];
        
        tbody.innerHTML = mockCFTTeam.map((member) => `
            <tr>
                <td>${member.function}</td>
                <td>${member.member}</td>
                <td>${member.role}</td>
                <td>${member.responsibility}</td>
                <td><span class="raci-badge raci-${member.raci.toLowerCase()}">${member.raci}</span></td>
            </tr>
        `).join("");

        var bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    } catch (error) {
        console.error('Error showing CFT Team:', error);
        showAlertError("Lỗi", "Không thể tải thông tin CFT Team");
    }
}

function closeCFTTeam() {
    document.getElementById("cftTeamModal").classList.remove("active");
}

function showTaskByStage(projectId, stage) {
    const modal = document.getElementById("taskListModal");

    const title = document.getElementById("taskListModalTitle");
    const tbody = document.getElementById("taskListModalBody");
    if (title) {
        title.textContent = `${projectId} - ${stage} ${t("stage")} ${t("taskName")}`;
    }

    // TODO: Replace với API
    const mockTasks = [
        { id: "PPAP-001", name: "設計記錄", project: projectId, stage: stage, status: "in-progress", priority: "high", dri: "張工程師", deadline: "2024-01-20" },
        { id: "PPAP-005", name: "製程流程圖", project: projectId, stage: stage, status: "in-progress", priority: "medium", dri: "林製程", deadline: "2024-01-22" },
        { id: "PPAP-006", name: "製程 FMEA", project: projectId, stage: stage, status: "in-progress", priority: "high", dri: "林製程", deadline: "2024-01-23" },
        { id: "PPAP-008", name: "量測系統分析", project: projectId, stage: stage, status: "in-progress", priority: "medium", dri: "王品質", deadline: "2024-01-24" },
    ];

    tbody.innerHTML = mockTasks.map((task) => `
        <tr data-id="${task.id}" data-action="showTaskDetail">
            <td class="task-id-cell">${task.id}</td>
            <td>${task.name}</td>
            <td>${task.project}</td>
            <td>${task.stage}</td>
            <td><span class="task-status-badge status-${task.status}">${t("inProgress")}</span></td>
            <td><span class="priority-badge priority-${task.priority}">${t(task.priority)}</span></td>
            <td>${task.dri}</td>
            <td>${task.deadline}</td>
            <td class="action-icons">
                <button class="action-icon-btn" data-id="${task.id}" data-action="showTaskDetail"><i class="bi bi-pencil"></i></button>
                <button class="action-icon-btn" data-action="showAttachments"><i class="bi bi-paperclip"></i></button>
            </td>
        </tr>
    `).join("");

    var bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

function showTaskByFilter(filterType, projectId = null) {
    const modal = document.getElementById("taskListModal");
    const title = document.getElementById("taskListModalTitle");
    const tbody = document.getElementById("taskListModalBody");

    let titleText = "";
    if (filterType === "all") {
        titleText = projectId ? `${projectId} - ${t("all")} ${t("taskName")}` : `${t("all")} ${t("taskName")}`;
    } else if (filterType === "in-progress") {
        titleText = projectId ? `${projectId} - ${t("inProgress")} ${t("taskName")}` : `${t("inProgress")} ${t("taskName")}`;
    } else if (filterType === "pending") {
        titleText = projectId ? `${projectId} - ${t("pending")} ${t("taskName")}` : `${t("pending")} ${t("taskName")}`;
    } else if (filterType === "overdue") {
        titleText = projectId ? `${projectId} - ${t("overdue")} ${t("taskName")}` : `${t("overdue")} ${t("taskName")}`;
    }

    if (title) {
        title.textContent = titleText;
    }

    // TODO: Replace với API
    const mockTasks = [
        { id: "PPAP-001", name: "設計記錄", project: "FTV-001", stage: "HVT", status: "in-progress", priority: "high", dri: "張工程師", deadline: "2024-01-20" },
        { id: "PPAP-005", name: "製程流程圖", project: "FTV-001", stage: "HVT", status: "in-progress", priority: "medium", dri: "林製程", deadline: "2024-01-22" },
        { id: "PPAP-006", name: "製程 FMEA", project: "FTV-001", stage: "HVT", status: "in-progress", priority: "high", dri: "林製程", deadline: "2024-01-23" },
        { id: "PPAP-008", name: "量測系統分析", project: "FTV-001", stage: "HVT", status: "in-progress", priority: "medium", dri: "王品質", deadline: "2024-01-24" },
    ];

    let filteredTasks = mockTasks;
    if (filterType !== "all") {
        filteredTasks = mockTasks.filter((task) => task.status === filterType);
    }
    if (projectId) {
        filteredTasks = filteredTasks.filter((task) => task.project === projectId);
    }

    if (tbody) {
        tbody.innerHTML = filteredTasks.map((task) => `
            <tr data-id="${task.id}" data-action="showTaskDetail">
                <td class="task-id-cell">${task.id}</td>
                <td>${task.name}</td>
                <td>${task.project}</td>
                <td>${task.stage}</td>
                <td><span class="task-status-badge status-${task.status}">${t("inProgress")}</span></td>
                <td><span class="priority-badge priority-${task.priority}">${t(task.priority)}</span></td>
                <td>${task.dri}</td>
                <td>${task.deadline}</td>
                <td class="action-icons">
                    <button class="action-icon-btn" data-id="${task.id}" data-action="showTaskDetail"><i class="bi bi-pencil"></i></button>
                    <button class="action-icon-btn" data-action="showAttachments"><i class="bi bi-paperclip"></i></button>
                </td>
            </tr>
        `).join("");
    }

    if (modal) {
        var bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

function showTaskDetail(taskId) {
    // closeTaskListModal();
    // TODO: Fetch task detail từ API
    // GET /api/tasks/{taskId}

    var modal = new bootstrap.Modal(document.getElementById('taskDetailModal'));
    modal.show();
}

function closeTaskDetail() {
    var modal = bootstrap.Modal.getInstance(document.getElementById('taskDetailModal'));
    if (modal) modal.hide();
}

function openTaskPermission(projectId, taskId, userName) {
    const modal = document.getElementById("taskDetailModal");
    if (!modal) return;
    const taskIdElement = modal.querySelector(".task-detail-id");
    if (taskIdElement) taskIdElement.textContent = taskId;
    const taskNameElement = modal.querySelector(".task-detail-name");
    const taskNames = { "PPAP-001": "設計記錄", "PPAP-007": "控制計劃", "PPAP-015": "樣品產品" };
    if (taskNameElement) taskNameElement.textContent = taskNames[taskId] || "任務詳情";
    const descriptionElement = modal.querySelector(".section-content");
    if (descriptionElement) {
        descriptionElement.textContent = `專案 ${projectId} - 任務 ${taskId} 由 ${userName} 負責處理`;
    }
    var bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

function applyDashboardFilters() {
    const projectFilter = document.getElementById("dashboardFilterProject").value;
    const searchFilter = document.getElementById("dashboardFilterSearch").value.toLowerCase();
    const driFilter = document.getElementById("dashboardFilterDRI").value;
    const deadlineFilter = document.getElementById("dashboardFilterDeadline").value;
    const projectCards = document.querySelectorAll(".project-card");
    let visibleCount = 0;

    projectCards.forEach((card) => {
        let shouldShow = true;
        if (projectFilter && !card.querySelector(".project-name").textContent.includes(projectFilter)) {
            shouldShow = false;
        }
        if (searchFilter && !card.textContent.toLowerCase().includes(searchFilter)) {
            shouldShow = false;
        }
        if (driFilter && !card.textContent.includes(driFilter)) {
            shouldShow = false;
        }
        if (deadlineFilter) {
            const dates = deadlineFilter.split(' - ');
            if (dates.length === 2) {
                const startDate = new Date(dates[0].trim());
                const endDate = new Date(dates[1].trim());
                // Check if project has tasks within the deadline range
                // This is a simplified check - you might need to enhance based on actual data structure
                const taskElements = card.querySelectorAll('.task-deadline');
                let hasMatchingDeadline = false;
                taskElements.forEach(taskEl => {
                    const taskDate = new Date(taskEl.textContent);
                    if (taskDate >= startDate && taskDate <= endDate) {
                        hasMatchingDeadline = true;
                    }
                });
                if (!hasMatchingDeadline) {
                    shouldShow = false;
                }
            }
        }
        card.style.display = shouldShow ? "block" : "none";
        if (shouldShow) visibleCount++;
    });
}

function initDashboardFilters() {
    const filterIds = ["dashboardFilterProject", "dashboardFilterStage", "dashboardFilterStatus",
        "dashboardFilterPriority", "dashboardFilterDepartment", "dashboardFilterProcess",
        "dashboardFilterDRI", "dashboardFilterDeadline", "dashboardFilterSearch"];
    filterIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === "SELECT") {
                element.addEventListener("change", applyDashboardFilters);
            } else {
                element.addEventListener("input", applyDashboardFilters);
            }
        }
    });
    
    // Initialize date picker for deadline filter
    showDatePicker('dashboardFilterDeadline');
}

function resetDashboardFilters() {
    document.getElementById("dashboardFilterProject").value = "";
    document.getElementById("dashboardFilterStage").value = "";
    document.getElementById("dashboardFilterStatus").value = "";
    document.getElementById("dashboardFilterPriority").value = "";
    document.getElementById("dashboardFilterDepartment").value = "";
    document.getElementById("dashboardFilterProcess").value = "";
    
    const driSelect = document.getElementById("dashboardFilterDRI");
    if (driSelect) {
        driSelect.value = "";
        if ($(driSelect).data('select2')) {
            $(driSelect).val(null).trigger('change');
        }
    }
    
    document.getElementById("dashboardFilterDeadline").value = "";
    document.getElementById("dashboardFilterSearch").value = "";
    applyDashboardFilters();
}

function moveModalsToBody() {
    try {
        document.querySelectorAll('.modal').forEach(function (modal) {
            if (modal && modal.parentElement && modal.parentElement !== document.body) {
                document.body.appendChild(modal);
            }
        });
    } catch (e) {
        console.error('moveModalsToBody error:', e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveModalsToBody);
} else {
    moveModalsToBody();
}


function initModalRobustness() {
    try {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes && m.addedNodes.forEach(function (node) {
                    if (!(node instanceof HTMLElement)) return;
                    if (node.classList && node.classList.contains('modal')) {
                        if (node.parentElement !== document.body) document.body.appendChild(node);
                    }
                });
            });
        });
        observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    } catch (e) {
        console.error('Modal MutationObserver error:', e);
    }

    document.addEventListener('show.bs.modal', function (ev) {
        try {
            var modalEl = ev.target;
            if (modalEl && modalEl.parentElement !== document.body) document.body.appendChild(modalEl);

            var loader = document.getElementById('loader');
            if (loader && !loader.classList.contains('d-none')) loader.classList.add('d-none');
        } catch (e) {
            console.error('show.bs.modal handler error:', e);
        }
    });

    document.addEventListener('shown.bs.modal', function (ev) {
        try {
            var backdrops = document.querySelectorAll('.modal-backdrop');
            if (backdrops && backdrops.length > 1) {
                backdrops.forEach(function (b, idx) {
                    if (idx < backdrops.length - 1) b.remove();
                });
            }

            var modalEl = ev.target;
            var backdrop = document.querySelector('.modal-backdrop.show');
            if (backdrop && modalEl) {
                var mz = parseInt(window.getComputedStyle(modalEl).zIndex || '1060', 10);
                if (isNaN(mz)) mz = 1060;
                backdrop.style.zIndex = (mz - 5).toString();
                modalEl.style.zIndex = mz.toString();
            }
        } catch (e) {
            console.error('shown.bs.modal handler error:', e);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModalRobustness);
} else {
    initModalRobustness();
}

document.addEventListener("DOMContentLoaded", function () {
    renderProjects();
    initDashboardFilters();
    initEventListeners();
});

const SELECT_CACHE = {};
const SELECT_CONFIGS = [
    { id: 'sl-customer', endpoint: '/api/customers' },
    { id: 'sl-model', endpoint: '/api/models' },
    { id: 'pjNum', endpoint: '/api/projects', params: ['customerId', 'modelId'] },
    { id: 'sl-stage', endpoint: '/api/stages' },
    { id: 'sl-status', endpoint: '/api/projects/status' },
    { id: 'sl-priority', endpoint: '/api/projects/priorities' },
    { id: 'sl-doc-type', endpoint: '/api/documents/types' },
    { id: 'sl-department', endpoint: '/api/departments' },
    { id: 'sl-process', endpoint: '/api/processes' },
]

async function fetchOptions(endpoint, params = {}) {
    try {
        const query = new URLSearchParams(params).toString();
        const url = `/sample-system${endpoint}${query ? `?${query}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error('Error fetching options:', error);
        return [];
    }
}

function renderOptions(selectId, items) {
    const sl = document.querySelector(`#${selectId}`);
    if (!sl) return;
    
    let html = '<option value="">-- Select --</option>';
    
    if (Array.isArray(items)) {
        let otp = items.map(i => {
            if (typeof i === 'string' || typeof i === 'number') {
                return `<option value="${i}">${i}</option>`
            } else if (i && typeof i === 'object' && i.id && i.name) {
                return `<option value="${i.id}">${i.name}</option>`
            } else return '';
        }).join('')
        html += otp;
    }
    
    sl.innerHTML = html;
}

async function loadAllSelects() {
    const simpleConfigs = SELECT_CONFIGS.filter(cfg => !cfg.params);
    const res = await Promise.all(simpleConfigs.map(cfg => fetchOptions(cfg.endpoint)))

    simpleConfigs.forEach((cfg, i) => {
        const items = res[i] || [];
        renderOptions(cfg.id, items);
        SELECT_CACHE[cfg.endpoint] = items
    });
    
    const pjNumSelect = document.querySelector('#pjNum');
    if (pjNumSelect) {
        pjNumSelect.innerHTML = '<option value="">-- Select Project --</option>';
    }
}

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

function rangePicker($input, fromDate, toDate) {
    const start = (fromDate && window.moment) ? window.moment(fromDate.split(" ")[0], "YYYY/MM/DD") : null;
    const end = (toDate && window.moment) ? window.moment(toDate.split(" ")[0], "YYYY/MM/DD") : null;

    $input.daterangepicker({
        startDate: start || window.moment().subtract(6, 'days'),
        endDate: end || window.moment(),
        autoApply: false,
        locale: { format: "YYYY/MM/DD" },
    });
}

function singlePicker($input, workDate) {
    const start = (workDate && window.moment) ? window.moment(workDate.split(" ")[0], "YYYY/MM/DD") : null;

    $input.daterangepicker({
        singleDatePicker: true,
        startDate: start || window.moment(),
        autoApply: false,
        locale: { format: "YYYY/MM/DD" },
    });
}

function showDatePicker(id) {
    rangePicker($(`#${id}`))
}

async function loadSummary() {
    try {
        const endpoint = '/sample-system/api/dashboard/summary';

        function fmtDate(d) {
            const y = d.getFullYear();
            const m = ("0" + (d.getMonth() + 1)).slice(-2);
            const day = ("0" + d.getDate()).slice(-2);
            return `${y}/${m}/${day} 00:00:00`;
        }

        const now = new Date();
        const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endThisMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const q1 = `?startTime=${encodeURIComponent(fmtDate(startThisMonth))}&endTime=${encodeURIComponent(fmtDate(endThisMonth))}`;
        const q2 = `?startTime=${encodeURIComponent(fmtDate(startPrevMonth))}&endTime=${encodeURIComponent(fmtDate(endPrevMonth))}`;

        const [r1, r2] = await Promise.all([fetch(endpoint + q1), fetch(endpoint + q2)]);
        if (!r1.ok || !r2.ok) throw new Error('Error fetching summary');

        const j1 = await r1.json();
        const j2 = await r2.json();

        function metricsFromResponse(res) {
            if (!res) return { totalProject: 0, processTask: 0, overDueTask: 0, weekly: 0 };

            // Support multiple response shapes: direct fields, { data: ... }, { result: ... }
            let payload = res;
            if (res.result && typeof res.result === 'object') payload = res.result;
            else if (res.data && typeof res.data === 'object') payload = res.data;

            if (Array.isArray(payload)) {
                return { totalProject: payload.length, processTask: 0, overDueTask: 0, weekly: 0 };
            }

            const totalProject = typeof payload.totalProject !== 'undefined' ? Number(payload.totalProject)
                : (typeof payload.size !== 'undefined' ? Number(payload.size) : 0);
            const processTask = Number(payload.processTask || 0);
            const overDueTask = Number(payload.overDueTask || 0);
            const weekly = Number(payload.weekly || 0);

            return { totalProject, processTask, overDueTask, weekly };
        }

        const cur = metricsFromResponse(j1);
        const prev = metricsFromResponse(j2);

        const elTotal = document.getElementById('total');
        const elInProgress = document.getElementById('in_progress');
        const elOverdue = document.getElementById('overdue');
        const elPending = document.getElementById('pending');

        if (elTotal) elTotal.textContent = cur.totalProject;
        if (elInProgress) elInProgress.textContent = cur.processTask;
        if (elOverdue) elOverdue.textContent = cur.overDueTask;
        if (elPending) elPending.textContent = cur.weekly;

        const diffs = {
            total: cur.totalProject - prev.totalProject,
            in_progress: cur.processTask - prev.processTask,
            overdue: cur.overDueTask - prev.overDueTask,
            pending: cur.weekly - prev.weekly,
        };

        function renderDiff(elementId, diff) {
            const el = document.getElementById(elementId);
            if (!el) return;
                const arrow = diff > 0 ? '<i class="bi bi-arrow-up"></i>' : (diff < 0 ? '<i class="bi bi-arrow-down"></i>' : '<i class="bi bi-dash-lg"></i>');
                const signedNum = diff > 0 ? `+${diff}` : `${diff}`;
                let suffix = '';
            try {
                const orig = el.innerHTML || '';
                const m = orig.match(/<\/i>\s*[-+]?\d+\s*(.*)/);
                if (m && m[1]) suffix = ' ' + m[1].trim();
                else {
                    const txt = el.textContent || '';
                    const tail = txt.replace(/^\s*[\u2191\u2193\-\d\s]+/, '').trim();
                    if (tail) suffix = ' ' + tail;
                }
            } catch (e) { /* ignore */ }

            el.innerHTML = `${arrow} ${signedNum}${suffix}`;
        }

        renderDiff('last_total', diffs.total);
        renderDiff('last_in_progress', diffs.in_progress);
        renderDiff('last_overdue', diffs.overdue);
        renderDiff('last_pending', diffs.pending);

    } catch (error) {
        console.error('Load summary error:', error);
    }
}

async function loadProjectNumbers() {
    const customerId = document.querySelector('#sl-customer')?.value;
    const modelId = document.querySelector('#sl-model')?.value;

    if (!customerId || !modelId) {
        renderOptions('pjNum', []);
        return;
    }

    const items = await fetchOptions('/api/projects', { customerId, modelId });
    renderOptions('pjNum', items);
    SELECT_CACHE['/api/projects'] = items;
}

function loadEvent() {
    const slCustomer = document.querySelector('#sl-customer');
    const slModel = document.querySelector('#sl-model');

    if (slCustomer) {
        slCustomer.addEventListener('change', loadProjectNumbers);
    }

    if (slModel) {
        slModel.addEventListener('change', loadProjectNumbers);
    }
}

function initEventListeners() {
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.dataset.action;
        const projectId = target.dataset.id;
        const filterType = target.dataset.filter;
        const stage = target.dataset.stage;
        
        switch(action) {
            case 'showCFTTeam':
                showCFT(projectId);
                break;
            case 'showTaskListByFilter':
                showTaskByFilter(filterType, projectId);
                break;
            case 'showTaskListByStage':
                showTaskByStage(projectId, stage);
                break;
            case 'showTaskDetail':
                showTaskDetail(target.dataset.id);
                break;
            case 'showAttachments':
                alert('附件');
                break;
        }
    });
}

function loadData() {
    loadAllSelects();
    loadUsersData();
}

async function loadUsersData() {
    USERS_CACHE = await fetchUsers();
    updateDRISelect();
}

document.addEventListener('DOMContentLoaded', function () {
    loadEvent();
    loadData();
    if (typeof loadSummary === 'function') loadSummary();
});
