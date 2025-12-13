<%@ page contentType="text/html;charset=UTF-8" language="java" %> <%@ taglib uri="http://www.springframework.org/tags"
prefix="spring" %>
<div class="component-wrapper fit">
    <div class="projects-header">
        <div class="projects-title">
            <span><i class="bi bi-folder2-open"></i></span>
            <span><spring:message code="documentLibrary" /></span>
        </div>
    </div>

    <div class="ppap-section">
        <div class="section-header">
            <span><i class="bi bi-search"></i></span>
            <span class="component-title"><spring:message code="documentFilter" /></span>
        </div>
        <div class="row">
            <div class="col-md-2 d-flex flex-column mb-2">
                <label class="filter-label"><spring:message code="projectCustomer" /></label>
                <select class="filter-select" id="sl-customer"></select>
            </div>
            <div class="col-md-2 d-flex flex-column mb-2">
                <label class="filter-label"><spring:message code="projectModel" /></label>
                <select class="filter-select" id="sl-model"></select>
            </div>
            <div class="col-md-2 d-flex flex-column mb-2">
                <label class="filter-label"><spring:message code="projectNumber" /></label>
                <input type="text" class="filter-select" id="pjNum" />
            </div>
            <div class="col-md-2 d-flex flex-column mb-2">
                <label class="filter-label"><spring:message code="documentType" /></label>
                <select class="filter-select" id="sl-doc-type"></select>
            </div>

            <div class="col-md-2 d-flex flex-column mb-2">
                <label class="filter-label">xVT Stage</label>
                <select class="filter-select" id="sl-stage"></select>
            </div>
            <div class="col-md-2 d-flex flex-column mb-2">
                <label class="filter-label"><spring:message code="department" /></label>
                <select class="filter-select" id="sl-department"></select>
            </div>
            <div class="col-md-2 d-flex flex-column mb-2">
                <label class="filter-label"><spring:message code="process" /></label>
                <select class="filter-select" id="sl-process"></select>
            </div>
            <div class="col-md-2 d-flex flex-column mb-2">
                <label class="filter-label">Uploaded Date</label>
                <input type="text" id="uploaded-date" class="filter-input" />
            </div>
            <div class="col-md-2 d-flex flex-column mb-2 d-none">
                <label class="filter-label"><spring:message code="uploader" /></label>
                <select class="filter-select" id="sl-uploader"></select>
            </div>

            <div class="col-md-2 d-flex flex-column mb-2">
                <label class="filter-label"><spring:message code="searchDocument" /></label>
                <input type="text" id="search-document" class="filter-input" placeholder="Search..." />
            </div>
        </div>
        <div class="action-buttons-row d-flex justify-content-end mt-2">
            <button class="action-btn" id="upload">
                <span><i class="bi bi-box-arrow-up"></i></span>
                <span><spring:message code="uploadNewDocument" /></span>
            </button>
            <button class="secondary-btn" id="reset">
                <span><i class="bi bi-arrow-repeat"></i></span>
                <span><spring:message code="reset" /></span>
            </button>
            <button class="primary-btn" id="search">
                <span><i class="bi bi-search"></i></span>
                <span>Search</span>
            </button>
        </div>
    </div>

    <div class="ppap-section mb-0" style="height: 53vh;">
        <div class="component-title mb-3"><i class="bi bi-file-earmark"></i> Documents List</div>
        <div class="table-responsive table-box">
            <table class="table" id="document-list">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Document Name</th>
                        <th>Document Type</th>
                        <th>Stage</th>
                        <th>Process</th>
                        <th>Department</th>
                        <th>Uploader</th>
                        <th>Upload At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="uploadModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="bi bi-cloud-upload"></i> Upload Documents</h5>
                <button type="button" class="close-btn" data-bs-dismiss="modal">
                    <i class="bi bi-x"></i>
                </button>
            </div>
            <div class="modal-body">
                <div id="uploadBlocksContainer"></div>
                <div class="d-flex justify-content-center mt-3">
                    <button type="button" class="secondary-btn" id="addMoreBlock">
                        <i class="bi bi-plus-circle"></i>
                        <span>Add More</span>
                    </button>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="secondary-btn" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle"></i>
                    <span>Cancel</span>
                </button>
                <button type="button" class="primary-btn" id="submitUpload">
                    <i class="bi bi-check-circle"></i>
                    <span>Upload All</span>
                </button>
            </div>
        </div>
    </div>
</div>

<script src="/sample-system/js/modules/document.js"></script>
