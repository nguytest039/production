<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<link rel="stylesheet" href="/production-system/css/modules/te-smart/daily-report.css" />
<link rel="stylesheet" href="/production-system/assets/plugins/daterangepicker/daterangepicker.css" />
<script src="/production-system/assets/plugins/jquery/jquery.min.js"></script>
<script src="/production-system/assets/plugins/daterangepicker/moment.min.js"></script>
<script src="/production-system/assets/plugins/daterangepicker/daterangepicker.js"></script>

<div class="container-fluid">
    <spring:message code="vietnamese" var="vietnamese" />
    <spring:message code="chinese" var="chinese" />
    <spring:message code="english" var="english" />
    <spring:message code="profile" var="profile" />
    <spring:message code="logout" var="logout" />

    <jsp:include page="/WEB-INF/jsp/common/header-dashboard.jsp">
        <jsp:param name="titlePage" value="NTF YIELD OVERVIEW" />
        <jsp:param name="subTitlePage" value="" />
        <jsp:param name="vietnamese" value="<%=pageContext.getAttribute(\"vietnamese\") %>" /> <jsp:param name="chinese"
        value="<%= pageContext.getAttribute(\"chinese\") %>" /> <jsp:param name="english" value="<%=
        pageContext.getAttribute(\"english\") %>" /> <jsp:param name="profile"
        value="<%=pageContext.getAttribute(\"profile\") %>" /> <jsp:param name="logout" value="<%=
        pageContext.getAttribute(\"logout\") %>" />
    </jsp:include>

    <div class="row filter" style="height: 4vh">
        <div class="col-md-12 gap-2 d-flex align-items-center flex-wrap">
            <div class="d-flex align-items-center gap-2 filter-group">
                <label for="customerSelect" class="fw-bold mb-0 label-custom">Customer</label>
                <select name="" id="customerSelect" class="form-control form-control-sm text-warning fw-bold">
                    <option value="RING" selected>Rhea</option>
                    <option value="APOLLO">Amazon</option>
                    <option value="KRONOS">Kronos</option>
                </select>
            </div>
        </div>
    </div>

    <div class="container-fluid p-0 content-wrapper fit">
        <div class="row h-100">
            <div class="col-md-12 h-100 component-wrapper">
                <div class="component-item">
                    <h5 class="component-title">Detail</h5>
                    <div class="component-body">
                        <div class="table-responsive h-100 mh-100 overflow-auto overflow-y-auto">
                            <table class="table table-sm h-100" id="table-1">
                                <thead></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div
        class="modal fade no-scroll"
        id="modal-top5"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="title-info">Top 5 Error Code</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-2" style="min-height: 4vh">
                        <div class="col-12 d-flex align-items-center flex-wrap justify-content-start gap-4 mt-2">
                            <div class="d-flex align-items-center gap-2">
                                <div class="btn-group btn-group-sm toggle-view" role="group" id="modal-view-toggle">
                                    <button type="button" class="btn btn-outline-warning active" data-view="top5">
                                        Top 5 Error
                                    </button>
                                    <button type="button" class="btn btn-outline-warning" data-view="summary">
                                        Summary
                                    </button>
                                </div>
                            </div>

                            <div class="d-flex align-items-center gap-2 flex-wrap">
                                <label class="filter-label mb-0 label-custom">Model</label>
                                <select
                                    class="form-select form-select-sm text-warning"
                                    id="model"
                                    style="width: auto; min-width: 100px"
                                ></select>

                                <label class="filter-label mb-0 label-custom">Group By</label>
                                <select
                                    class="form-select form-select-sm text-warning"
                                    id="groupBy"
                                    style="width: auto; min-width: 90px"
                                >
                                    <option>Hour</option>
                                    <option>Day</option>
                                    <option selected>Shift</option>
                                </select>
                            </div>

                            <div class="d-flex align-items-center gap-2 flex-wrap">
                                <label class="filter-label mb-0 label-custom">Date Range</label>
                                <input
                                    type="text"
                                    id="dateRange"
                                    class="form-control form-control-sm text-warning"
                                    style="width: auto; min-width: 210px"
                                />
                                <button type="button" class="btn btn-sm btn-primary" id="apply">Apply</button>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive h-100 mh-100 overflow-auto overflow-y-auto" id="top5-table-wrapper">
                        <table class="table table-sm h-100" id="table-2">
                            <thead>
                                <tr>
                                    <th>TOP</th>
                                    <th>Error Code</th>
                                    <th>Rate</th>
                                    <th style="width: 4%">Number of errors</th>
                                    <th style="width: 55%">Trend Chart</th>
                                    <th>Root Cause</th>
                                    <th>Corrective Action</th>
                                    <th>Owner</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div
                        class="table-responsive h-100 mh-100 overflow-auto overflow-y-auto d-none"
                        id="summary-table-wrapper"
                    >
                        <table class="table table-sm h-100" id="summary-table">
                            <thead>
                                <tr>
                                    <th>Machine</th>
                                    <th>Error Code</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modal-update" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Update Root cause/Corrective action</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="update-form" class="d-flex flex-column gap-3">
                        <div>
                            <label for="root-cause" class="form-label">Root Cause</label>
                            <textarea
                                name="root-cause"
                                id="root-cause"
                                class="form-control"
                                placeholder="Enter root cause"
                                rows="5"
                            ></textarea>
                        </div>

                        <div>
                            <label for="corrective-action" class="form-label">Corrective Action</label>
                            <textarea
                                name="corrective-action"
                                id="corrective-action"
                                class="form-control"
                                placeholder="Enter corrective action"
                                rows="5"
                            ></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="save-update">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="/production-system/js/modules/te-smart/daily-report.js"></script>
