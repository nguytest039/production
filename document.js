let uploadBlockCounter = 0;
let USERS_CACHE = [];
const SELECT_CACHE = {}
const SELECT_CONFIGS = [
    { id: 'sl-customer', endpoint: '/api/customers' },
    { id: 'sl-model', endpoint: '/api/models' },
    { id: 'sl-stage', endpoint: '/api/stages' },
    { id: 'sl-department', endpoint: '/api/departments' },
    { id: 'pjNum', endpoint: '/api/projects', params: ['customerId', 'modelId'] },
    { id: 'sl-process', endpoint: '/api/processes' },
    { id: 'sl-doc-type', endpoint: '/api/documents/types' },
];

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

function updateUploaderSelect() {
    const select = document.querySelector('#sl-uploader');
    if (!select) return;

    select.innerHTML = '<option value="">-- Select Uploader --</option>';

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
        placeholder: 'Search uploader...',
        allowClear: true,
        width: '100%'
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

async function fetchOptions(endpoint, params = {}) {
    try {
        const query = new URLSearchParams(params).toString();
        const url = `/sample-system${endpoint}${query ? `?${query}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch from ${endpoint}: ${res.status} ${res.statusText}`);
        }
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

    let otp = items.map(i => {
        if (typeof i === 'string' || typeof i === 'number') {
            return `<option value="${i}">${i}</option>`
        } else if (i && typeof i === 'object' && i.id && i.name) {
            return `<option value="${i.id}">${i.name}</option>`
        } else return '';
    }).join('')

    sl.innerHTML = otp
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

async function loadAllSelects() {
    const res = await Promise.all(SELECT_CONFIGS.map(cfg => fetchOptions(cfg.endpoint)))

    SELECT_CONFIGS.forEach((cfg, i) => {
        const items = res[i] || [];
        renderOptions(cfg.id, items);
        SELECT_CACHE[cfg.endpoint] = items
    });
}

function createUploadBlock() {
    uploadBlockCounter++;
    const blockId = `upload-block-${uploadBlockCounter}`;

    const block = document.createElement('div');
    block.className = 'info-section';
    block.id = blockId;

    // Header với nút remove
    const header = document.createElement('div');
    header.className = 'd-flex justify-content-end mb-2';

    if (uploadBlockCounter > 1) {
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'secondary-btn';
        removeBtn.onclick = () => removeUploadBlock(blockId);
        removeBtn.innerHTML = '<i class="bi bi-trash"></i> Remove';
        header.append(removeBtn);
    }

    // Section 1: Document Information
    const docInfoSection = document.createElement('div');
    docInfoSection.className = 'section-content p-3 mb-3';
    docInfoSection.style.cssText = 'background: var(--secondary-bg); border: 1px solid var(--border-color); border-radius: 0.5rem;';

    const docInfoLabel = document.createElement('div');
    docInfoLabel.className = 'filter-label mb-2';
    docInfoLabel.style.fontWeight = '600';
    docInfoLabel.textContent = '';

    const row = document.createElement('div');
    row.className = 'row g-3';

    // Tạo các select fields
    const fields = [
        { label: 'Project Number', class: 'block-project-number' },
        { label: 'Document Type', class: 'block-doc-type' },
        { label: 'xVT Stage', class: 'block-stage' },
        { label: 'Department', class: 'block-department' },
        { label: 'Process', class: 'block-process' }
    ];

    fields.forEach(field => {
        const col = document.createElement('div');
        col.className = 'col-md-2 mb-2 d-flex flex-column';

        const label = document.createElement('label');
        label.className = 'filter-label mb-1';
        label.style.fontSize = '0.8rem';
        label.textContent = field.label;

        const select = document.createElement('select');
        select.className = `filter-select ${field.class}`;
        select.dataset.block = blockId;

        col.append(label, select);
        row.append(col);
    });

    docInfoSection.append(docInfoLabel, row);

    // Section 2: File Upload
    const uploadSection = document.createElement('div');
    uploadSection.className = 'section-content p-3';
    uploadSection.style.cssText = 'background: var(--secondary-bg); border: 1px solid var(--border-color); border-radius: 0.5rem;';

    const uploadLabel = document.createElement('div');
    uploadLabel.className = 'filter-label mb-3';
    uploadLabel.style.fontWeight = '600';
    uploadLabel.textContent = 'File Upload';

    const uploadArea = document.createElement('div');
    uploadArea.className = 'upload-file-area';
    uploadArea.dataset.block = blockId;

    const icon = document.createElement('div');
    icon.style.cssText = 'font-size: 3rem; color: var(--accent-blue); margin-bottom: 0.75rem;';
    icon.innerHTML = '<i class="bi bi-cloud-upload"></i>';

    const uploadText = document.createElement('div');
    uploadText.style.cssText = 'color: var(--text-secondary); font-size: 0.875rem;';

    const strong = document.createElement('strong');
    strong.style.color = 'var(--accent-cyan)';
    strong.textContent = 'Click to browse';

    uploadText.append(strong, ' or drag and drop files here');

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.className = 'file-input-hidden';
    fileInput.dataset.block = blockId;
    fileInput.multiple = true;
    fileInput.accept = '*/*';

    uploadArea.append(icon, uploadText, fileInput);

    const fileList = document.createElement('div');
    fileList.className = 'file-list-container mt-3';
    fileList.dataset.block = blockId;
    fileList.style.cssText = 'max-height: 200px; overflow-y: auto;';

    uploadSection.append(uploadLabel, uploadArea, fileList);

    block.append(header, docInfoSection, uploadSection);

    return block;
}

async function populateBlockSelects(blockId) {
    const block = document.getElementById(blockId);
    if (!block) return;

    const projectNumSelect = block.querySelector('.block-project-number');
    const docTypeSelect = block.querySelector('.block-doc-type');
    const stageSelect = block.querySelector('.block-stage');
    const departmentSelect = block.querySelector('.block-department');
    const processSelect = block.querySelector('.block-process');

    const projectNums = await fetchOptions('/api/projects');
    const docTypes = SELECT_CACHE['/api/documents/types'] || await fetchOptions('/api/documents/types');
    const stages = SELECT_CACHE['/api/stages'] || await fetchOptions('/api/stages');
    const departments = SELECT_CACHE['/api/departments'] || await fetchOptions('/api/departments');
    const processes = SELECT_CACHE['/api/processes'] || await fetchOptions('/api/processes');

    renderOptionsToElement(projectNumSelect, projectNums);
    renderOptionsToElement(docTypeSelect, docTypes);
    renderOptionsToElement(stageSelect, stages);
    renderOptionsToElement(departmentSelect, departments);
    renderOptionsToElement(processSelect, processes);
}

function renderOptionsToElement(selectElement, items) {
    if (!selectElement) return;

    const options = items.map(i => {
        if (typeof i === 'string' || typeof i === 'number') {
            return `<option value="${i}">${i}</option>`;
        } else if (i && typeof i === 'object' && i.id && i.name) {
            return `<option value="${i.id}">${i.name}</option>`;
        }
        return '';
    }).join('');

    selectElement.innerHTML = '<option value="">-- Select --</option>' + options;
}

function removeUploadBlock(blockId) {
    const block = document.getElementById(blockId);
    if (block) {
        block.remove();
    }
}

function initUploadModal() {
    const uploadBtn = document.getElementById('upload');
    const uploadModal = new bootstrap.Modal(document.getElementById('uploadModal'));
    const container = document.getElementById('uploadBlocksContainer');
    const addMoreBtn = document.getElementById('addMoreBlock');
    const submitBtn = document.getElementById('submitUpload');

    uploadBtn.addEventListener('click', () => {
        container.innerHTML = '';
        uploadBlockCounter = 0;
        const firstBlock = createUploadBlock();
        container.appendChild(firstBlock);
        populateBlockSelects(firstBlock.id);
        uploadModal.show();
    });

    addMoreBtn.addEventListener('click', () => {
        const newBlock = createUploadBlock();
        container.appendChild(newBlock);
        populateBlockSelects(newBlock.id);
    });

    container.addEventListener('click', (e) => {
        const uploadArea = e.target.closest('.upload-file-area');
        if (uploadArea) {
            const blockId = uploadArea.dataset.block;
            const fileInput = document.querySelector(`.file-input-hidden[data-block="${blockId}"]`);
            if (fileInput) {
                fileInput.click();
            }
        }
    });

    container.addEventListener('change', (e) => {
        if (e.target.classList.contains('file-input-hidden')) {
            const blockId = e.target.dataset.block;
            handleFileSelect(e.target.files, blockId);
        }
    });

    container.addEventListener('dragover', (e) => {
        const uploadArea = e.target.closest('.upload-file-area');
        if (uploadArea) {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        }
    });

    container.addEventListener('dragleave', (e) => {
        const uploadArea = e.target.closest('.upload-file-area');
        if (uploadArea) {
            uploadArea.classList.remove('drag-over');
        }
    });

    container.addEventListener('drop', (e) => {
        const uploadArea = e.target.closest('.upload-file-area');
        if (uploadArea) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const blockId = uploadArea.dataset.block;
            handleFileSelect(e.dataTransfer.files, blockId);
        }
    });

    submitBtn.addEventListener('click', async () => {
        await submitAllUploads();
    });
}

function handleFileSelect(files, blockId) {
    const block = document.getElementById(blockId);
    if (!block) return;

    const filesList = block.querySelector(`div[data-block="${blockId}"].file-list-container`);
    const fileInput = block.querySelector(`.file-input-hidden[data-block="${blockId}"]`);
    if (!filesList || !fileInput) return;

    fileInput.uploadedFiles ??= [];

    const el = (tag, props = {}) => Object.assign(document.createElement(tag), props);

    Array.from(files).forEach(file => {
        fileInput.uploadedFiles.push(file);

        const fileItem = el('div', { className: 'attachment-item' });

        const attachInfo = el('div', { className: 'attachment-info' });
        attachInfo.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; overflow: hidden; flex: 1;';
        attachInfo.append(
            el('span', { className: 'attachment-icon', innerHTML: '<i class="bi bi-file-earmark"></i>' }),
            el('span', { className: 'attachment-name', textContent: file.name, title: file.name })
        );

        const removeBtn = el('button', {
            type: 'button',
            className: 'download-btn',
            innerHTML: '<i class="bi bi-x-circle"></i>',
            onclick: () => {
                const idx = fileInput.uploadedFiles.indexOf(file);
                if (idx > -1) fileInput.uploadedFiles.splice(idx, 1);
                fileItem.remove();
            }
        });
        removeBtn.style.cssText = 'background: var(--accent-red); border-color: var(--accent-red); padding: 0.25rem 0.5rem; font-size: 0.75rem; margin-left: 0.5rem;';

        fileItem.append(attachInfo, removeBtn);
        filesList.append(fileItem);
    });
}

async function submitAllUploads() {
    const blocks = document.querySelectorAll('.info-section');
    const uploads = [];

    blocks.forEach(block => {
        const blockId = block.id;
        const fileInput = block.querySelector(`.file-input-hidden[data-block="${blockId}"]`);
        const projectNum = block.querySelector('.block-project-number').value;
        const typeId = block.querySelector('.block-doc-type').value;
        const stageId = block.querySelector('.block-stage').value;
        const departmentId = block.querySelector('.block-department').value;
        const processId = block.querySelector('.block-process').value;

        if (fileInput && fileInput.uploadedFiles && fileInput.uploadedFiles.length > 0) {
            uploads.push({
                files: fileInput.uploadedFiles,
                projectNum,
                typeId,
                stageId,
                departmentId,
                processId
            });
        }
    });

    if (uploads.length === 0) {
        showAlertWarning('No Files Selected', 'Please select at least one file to upload.');
        return;
    }

    try {
        for (const upload of uploads) {
            const formData = new FormData();
            upload.files.forEach(file => {
                formData.append('files', file);
            });

            if (upload.typeId) formData.append('typeId', upload.typeId);
            if (upload.stageId) formData.append('stageId', upload.stageId);
            if (upload.departmentId) formData.append('departmentId', upload.departmentId);
            if (upload.processId) formData.append('processId', upload.processId);

            const response = await fetch('/sample-system/api/documents/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }
        }

        showAlertSuccess('Upload Successful', 'All files have been uploaded successfully.');
        bootstrap.Modal.getInstance(document.getElementById('uploadModal')).hide();

        await renderDocumentsList();

    } catch (error) {
        console.error('Upload error:', error);
        showAlertError('Upload Failed', error.message || 'An error occurred while uploading files.');
    }
}

function findNameById(list, id) {
    const item = list.find(i => i.id == id);
    return item ? item.name : '';
}

function buildSearchParams() {
    const params = new URLSearchParams();

    const slCustomer = document.querySelector('#sl-customer')?.value;
    const slModel = document.querySelector('#sl-model')?.value;
    const pjNum = document.querySelector('#pjNum')?.value;
    const slDocType = document.querySelector('#sl-doc-type')?.value;
    const slStage = document.querySelector('#sl-stage')?.value;
    const slDepartment = document.querySelector('#sl-department')?.value;
    const slProcess = document.querySelector('#sl-process')?.value;
    const uploadedDate = document.querySelector('#uploaded-date')?.value;
    const slUploader = document.querySelector('#sl-uploader')?.value;
    const searchDocument = document.querySelector('#search-document')?.value;

    if (slDocType) params.append('typeId', slDocType);
    if (slStage) params.append('stageId', slStage);
    if (slDepartment) params.append('departmentId', slDepartment);
    if (slProcess) params.append('processId', slProcess);
    if (slCustomer) params.append('customerId', slCustomer);
    if (slModel) params.append('modelId', slModel);
    if (pjNum) params.append('projectId', pjNum);
    if (slUploader) params.append('createdBy', slUploader);
    if (searchDocument) params.append('name', searchDocument);

    if (uploadedDate) {
        const dates = uploadedDate.split(' - ');
        if (dates.length === 2) {
            const startDate = dates[0].trim() + ' 00:00:00';
            const endDate = dates[1].trim() + ' 23:59:59';
            params.append('startTime', startDate);
            params.append('endTime', endDate);
        }
    }

    params.append('page', '1');
    params.append('size', '20');

    return params;
}

async function fetchDocuments(searchParams = null) {
    try {
        let url = '/sample-system/api/documents';
        if (searchParams && Array.from(searchParams.entries()).length > 2) {
            url += '?' + searchParams.toString();
        }

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch documents: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error('Error fetching documents:', error);
        return [];
    }
}

function renderDocumentsTable(documents) {
    const tbody = document.querySelector('#document-list tbody');
    if (!tbody) return;

    const typeMap = {};
    const stageMap = {};
    const departmentMap = {};
    const processMap = {};

    (SELECT_CACHE['/api/documents/types'] || []).forEach(item => {
        typeMap[item.id] = item.name;
    });
    (SELECT_CACHE['/api/stages'] || []).forEach(item => {
        stageMap[item.id] = item.name;
    });
    (SELECT_CACHE['/api/departments'] || []).forEach(item => {
        departmentMap[item.id] = item.name;
    });
    (SELECT_CACHE['/api/processes'] || []).forEach(item => {
        processMap[item.id] = item.name;
    });

    tbody.innerHTML = documents.map((doc, index) => `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${doc.name}</td>
            <td>${typeMap[doc.typeId] || ''}</td>
            <td>${stageMap[doc.stageId] || ''}</td>
            <td>${departmentMap[doc.departmentId] || ''}</td>
            <td>${processMap[doc.processId] || ''}</td>
            <td>${doc.createdBy}</td>
            <td>${doc.createdAt}</td>
            <td>
                <button class="action-icon-btn" onclick="downloadDocument('${doc.url}', '${doc.name}')" title="Download">
                    <i class="bi bi-download" style="color: #fff;"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function renderDocumentsList(searchParams = null) {
    const documents = await fetchDocuments(searchParams);
    renderDocumentsTable(documents);
}

function resetFilters() {
    const filterInputs = [
        '#sl-customer', '#sl-model', '#pjNum', '#sl-doc-type',
        '#sl-stage', '#sl-department', '#sl-process', '#uploaded-date',
        '#sl-uploader', '#search-document'
    ];

    filterInputs.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            if (element.tagName === 'SELECT') {
                element.selectedIndex = 0;
                if ($(element).data('select2')) {
                    $(element).val(null).trigger('change');
                }
            } else {
                element.value = '';
            }
        }
    });

    renderDocumentsList();
}

async function handleSearch() {
    const searchParams = buildSearchParams();
    await renderDocumentsList(searchParams);
}

function downloadDocument(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function loadData() {
    showDatePicker('uploaded-date');
    loadAllSelects();
    initUploadModal();
    loadUsersData();
    renderDocumentsList();
}

async function loadUsersData() {
    USERS_CACHE = await fetchUsers();
    updateUploaderSelect();
}

function loadEvent() {
    initScrollBars();
    const slCustomer = document.querySelector('#sl-customer');
    const slModel = document.querySelector('#sl-model');
    const btnReset = document.querySelector('#reset');
    const btnSearch = document.querySelector('#search');

    if (slCustomer) {
        slCustomer.addEventListener('change', loadProjectNumbers);
    }

    if (slModel) {
        slModel.addEventListener('change', loadProjectNumbers);
    }

    if (btnReset) {
        btnReset.addEventListener('click', resetFilters);
    }

    if (btnSearch) {
        btnSearch.addEventListener('click', handleSearch);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadData();
    loadEvent();
})

function initScrollBars() {
    const target = document.querySelector(".table-box");
    if (target) {
        OverlayScrollbarsGlobal.OverlayScrollbars(target, {
            className: ".os-scrollbar",
            scrollbars: {
                autoHide: "scroll",
            }
        });
    }
}
