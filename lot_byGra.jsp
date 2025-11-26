<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <link rel="stylesheet" href="/production-system/assets/plugins/daterangepicker/daterangepicker.css" />
    <link rel="stylesheet" href="/production-system/assets/plugins/bootstrap-icons/bootstrap-icons.css" />
    <script src="/production-system/assets/plugins/jquery/jquery.min.js"></script>
    <script src="/production-system/assets/plugins/daterangepicker/moment.min.js"></script>
    <script src="/production-system/assets/plugins/daterangepicker/daterangepicker.js"></script>
    <script src="/production-system/assets/plugins/highcharts/highcharts.js"></script>

    <style>
        #sl-time-chart,
        #daterangepicker-chart {
            background-color: #2a2d3a !important;
            color: #ffc107 !important;
            border: 1px solid #5264b6;
        }

        .component-wrapper {
            /* border: 1px solid green; */
            padding: 0.35rem 0.35rem;
        }

        .component-item {
            height: 100%;
            padding: 0.5rem 0.75rem;
            background-color: rgba(73, 146, 255, 0.15);
            box-shadow: 0 3px 17px #030616;
            border-radius: 0.3rem;
            overflow: hidden;
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            -webkit-border-radius: 0.3rem;
            -moz-border-radius: 0.3rem;
            -ms-border-radius: 0.3rem;
            -o-border-radius: 0.3rem;
        }

        .component-item .chart-box {
            height: 30vh;
        }

        .component-item .table-box {
            height: 30vh;
            overflow: auto;
        }

        .component-item .info-box {
            height: 6vh;
            background-color: rgba(73, 146, 255, 0.15);
        }

        .component-title {
            font-size: 1rem;
            margin: 0;
            padding-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .filter-badge {
            display: inline-block;
            background-color: #e74c3c;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.8rem;
            font-weight: bold;
            white-space: nowrap;
        }

        .text-span {
            font-size: 1.12rem;
        }

        .table-responsive::-webkit-scrollbar,
        .component-item .table-box::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        .table-responsive::-webkit-scrollbar-thumb,
        .component-item .table-box::-webkit-scrollbar-thumb {
            background-color: #264b8b;
            border-radius: 3px;
        }

        .table-responsive::-webkit-scrollbar-track,
        .component-item .table-box::-webkit-scrollbar-track {
            background-color: rgba(73, 146, 255, 0.1);
            border-radius: 3px;
        }

        .table-responsive::-webkit-scrollbar-corner,
        .component-item .table-box::-webkit-scrollbar-corner {
            background-color: rgba(73, 146, 255, 0.1);
        }

        .table {
            --border-color: #6290b5;
            margin-bottom: 0;
            border-right: 1px solid #37567f;
            /* border-top: 1px solid #37567f; */
        }

        .table th,
        .table td {
            text-align: center;
            vertical-align: middle;
            color: #fff;
            border: none;
            box-shadow: inset 0.5px -0.5px 0px var(--border-color);
            font-weight: normal;
            line-height: 1.2;
        }

        .table thead,
        .table thead th {
            position: sticky;
            top: 0;
            z-index: 20;
            background-color: #264b8b;
            font-size: 0.7rem;
            /* border-top: 1px solid var(--border-color); */
        }

        .table tbody td {
            font-size: 0.7rem;
            background-color: transparent;
        }

        .table-striped>tbody>tr.odd {
            background-color: #264e9256;
        }

        .table tbody td.grand-value {
            /* color: #5e9fff; */
            color: #03a9f4;
        }

        select {
            background-color: #cfe2ff !important;
            cursor: pointer;
        }

        select:focus,
        select:focus-visible {
            outline: 0;
            box-shadow: none;
        }

        select option {
            background: #0c1b40;
            color: #fff;
        }

        [id^="pagination-table"] {
            display: flex;
            justify-content: end;
            align-items: center;
            gap: 5px;
        }

        [id^="pagination-table"] button {
            border: 1px solid #0a58ca;
            background-color: transparent;
            color: #0a58ca;
            border-radius: 5px;
            min-width: 2rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            height: 2rem;
            font-size: 1rem;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        [id^="pagination-table"] button:hover {
            background-color: #0a58ca;
            color: #fff;
        }

        [id^="pagination-table"] button.active {
            background-color: #4982d8;
            color: #fff;
        }

        [id^="pagination-table"] button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            color: #888;
            border-color: #444;
        }

        ::-webkit-scrollbar {
            width: 0.3rem;
            height: 0.3rem;
        }

        /* Ná»n cá»§a scrollbar */
        ::-webkit-scrollbar-track {
            background: #acacac;
            border-radius: 0px;
        }

        /* Thanh cuá»™n */
        ::-webkit-scrollbar-thumb {
            background: #264b8b;
            border-radius: 0px;
            /* background-color: rgba(255, 235, 59, 0.637); */
        }

        .filter-badge {
            background-color: rgb(8, 58, 143);
            font-size: 0.7rem;
            padding: 0rem 0.3rem;
        }

        .filter-badge .bi-x:hover {
            color: #ffc107;
        }

        .form-select,
        .form-control {
            background: transparent;
            border: 1px solid #5264b6;
            color: #000 !important;
            border-radius: 6px;
            font-size: 1rem;
            border-radius: 10px;
        }

        .form-select:focus,
        .form-control:focus {
            background: #2a2d3a;
            border-color: #5a5d6a;
            color: #fff;
            box-shadow: none;
        }

        .no-data {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #fff;
            font-weight: 700;
            font-size: 1rem;
            background: transparent;
        }

        .cpnCustom {
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .cpnCustom>.row {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
        }

        .cpnCustom .component-wrapper {
            display: flex;
        }

        .cpnCustom .component-wrapper>.component-item {
            flex: 1;
        }

        .daterangepicker {
            background-color: #1e293b !important;
            color: #e2e8f0 !important;
            border: 1px solid #334155 !important;
        }

        .daterangepicker .drp-calendar.left,
        .daterangepicker .drp-calendar.right {
            background-color: #1e293b !important;
            color: #e2e8f0 !important;
        }

        .daterangepicker .calendar-table {
            background-color: #1e293b !important;
            color: #e2e8f0 !important;
            border: none !important;
        }

        .daterangepicker .calendar-table th,
        .daterangepicker .calendar-table td {
            color: #e2e8f0 !important;
        }

        .daterangepicker td.off,
        .daterangepicker td.disabled {
            color: #64748b !important;
            background-color: transparent !important;
        }

        .daterangepicker td.active,
        .daterangepicker td.active:hover {
            background-color: #125d9b !important;
            color: #ffffff !important;
        }

        .daterangepicker td.in-range {
            background-color: #19875433 !important;
        }

        .daterangepicker .calendar-time {
            background-color: #1e293b !important;
            color: #e2e8f0 !important;
            border-top: 1px solid #334155 !important;
        }

        .daterangepicker .calendar-time select {
            background-color: #334155 !important;
            color: #e2e8f0 !important;
            border: none !important;
        }

        .daterangepicker td.available:hover,
        .daterangepicker td.in-range:hover {
            background-color: #125d9b !important;
            color: #fff !important;
        }

        .daterangepicker td.in-range {
            background-color: #125d9b33 !important;
            color: #fff !important;
        }

        .daterangepicker .applyBtn {
            background-color: #0d6efd !important;
            border: none !important;
        }

        .daterangepicker .cancelBtn {
            background-color: #475569 !important;
            color: #fff !important;
            border: none !important;
        }
    </style>

    <div class="container-fluid">
        <spring:message code="vietnamese" var="vietnamese" />
        <spring:message code="chinese" var="chinese" />
        <spring:message code="english" var="english" />
        <spring:message code="profile" var="profile" />
        <spring:message code="logout" var="logout" />

        <jsp:include page="/WEB-INF/jsp/common/header-dashboard.jsp">
            <jsp:param name="titlePage" value="IQC Inspection Report" />
            <jsp:param name="subTitlePage" value="" />
            <jsp:param name="vietnamese" value="<%=pageContext.getAttribute(\" vietnamese\") %>" /> <jsp:param
                    name="chinese" value="<%=pageContext.getAttribute(\" chinese\") %>" /> <jsp:param name="english"
                        value="<%=pageContext.getAttribute(\" english\") %>" /> <jsp:param name="profile"
                            value="<%=pageContext.getAttribute(\" profile\") %>" /> <jsp:param name="logout"
                                value="<%=pageContext.getAttribute(\" logout\") %>" />
        </jsp:include>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem">
            <select name="" id="sl-time-chart" class="form-select form-select-sm w-auto">
                <option value="today">Time: Today</option>
                <option value="7">Time: Last 7 Days</option>
                <option value="30" selected>Time: Last 30 Days</option>
                <option value="custom">Time: Custom</option>
            </select>
            <input type="text" id="daterangepicker-chart" class="form-control form-control-sm w-auto"
                style="display: none; margin-left: 0.5rem" />
        </div>
        <div class="container-fluid p-0 content-wrapper">
            <div class="row">
                <div class="col-md-3 component-wrapper">
                    <div class="component-item">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="component-title mb-0">
                                Lot Rejected Rate <span style="font-size: 0.9rem">(Today)</span>
                            </h5>
                            <select name="" id="sl-time" class="form-select form-select-sm w-auto d-none">
                                <option value="today" selected>Time: Today</option>
                                <option value="7">Time: 7 Days Ago</option>
                                <option value="30">Time: 30 Days Ago</option>
                                <option value="custom">Time: Custom</option>
                            </select>
                            <div id="daterangepicker-container" style="display: none; position: absolute">
                                <input type="text" id="daterangepicker" />
                            </div>
                        </div>

                        <div class="row d-flex flex-column">
                            <div class="col-md-12 component-wrapper">
                                <div
                                    class="component-item d-flex flex-column justify-content-center align-items-center text-center">
                                    <div class="component-title">Inspected</div>
                                    <span id="inspected" class="fw-bold text-warning text-span"></span>
                                </div>
                            </div>

                            <div class="col-md-12 component-wrapper">
                                <div
                                    class="component-item d-flex flex-column justify-content-center align-items-center text-center">
                                    <div class="component-title">Lot Rejected</div>
                                    <span id="lot-rejected" class="fw-bold text-warning text-span"></span>
                                </div>
                            </div>

                            <div class="col-md-12 component-wrapper">
                                <div
                                    class="component-item d-flex flex-column justify-content-center align-items-center text-center">
                                    <div class="component-title">LRR</div>
                                    <span id="lrr" class="fw-bold text-warning text-span"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-9">
                    <div class="row" style="height: 100%">
                        <div class="col-md-6 component-wrapper">
                            <div class="component-item" style="height: 100%">
                                <h5 class="component-title">LLR Last 7 Days</h5>
                                <div class="component-body chart-box flex-grow-1" id="col-chart-2"></div>
                            </div>
                        </div>

                        <div class="col-md-6 component-wrapper">
                            <div class="component-item" style="height: 100%">
                                <h5 class="component-title">LLR By Weeks</h5>
                                <div class="component-body chart-box flex-grow-1" id="col-chart-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-3 component-wrapper">
                    <div class="component-item">
                        <h5 class="component-title">CPN Status</h5>
                        <div class="component-body cpnCustom" id="">
                            <div class="row">
                                <div class="col-md-6 component-wrapper">
                                    <div
                                        class="component-item d-flex flex-column justify-content-center align-items-center text-center">
                                        <div class="component-title">To Be Inspected</div>
                                        <span id="be-inspected" class="fw-bold text-warning text-span"></span>
                                    </div>
                                </div>

                                <div class="col-md-6 component-wrapper">
                                    <div
                                        class="component-item d-flex flex-column justify-content-center align-items-center text-center">
                                        <div class="component-title">Timeout Inspected</div>
                                        <span id="timeout_inspect" class="fw-bold text-warning text-span"></span>
                                    </div>
                                </div>

                                <div class="col-md-6 component-wrapper">
                                    <div
                                        class="component-item d-flex flex-column justify-content-center align-items-center text-center">
                                        <div class="component-title">To Be Scanned</div>
                                        <span id="scanned" class="fw-bold text-warning text-span"></span>
                                    </div>
                                </div>

                                <div class="col-md-6 component-wrapper">
                                    <div
                                        class="component-item d-flex flex-column justify-content-center align-items-center text-center">
                                        <div class="component-title">Timeout Scanned</div>
                                        <span id="timeout_scan" class="fw-bold text-warning text-span"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-9">
                    <div class="row">
                        <div class="col-md-4 component-wrapper">
                            <div class="component-item">
                                <h5 class="component-title">Lot Rejected By Material Type</h5>
                                <div class="component-body chart-box" id="col-chart-3"></div>
                            </div>
                        </div>

                        <div class="col-md-4 component-wrapper">
                            <div class="component-item">
                                <h5 class="component-title">Top Lot Rejected By MFR</h5>
                                <div class="component-body chart-box" id="col-chart-4"></div>
                            </div>
                        </div>

                        <div class="col-md-4 component-wrapper">
                            <div class="component-item">
                                <h5 class="component-title">Top Lot Rejected By Models</h5>
                                <div class="component-body chart-box" id="col-chart-5"></div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-4 component-wrapper d-none">
                            <div class="component-item">
                                <h5 class="component-title">Lot Rejected By Material Type Details</h5>
                                <div class="component-body table-box">
                                    <table class="table table-sm table-striped" id="table-1">
                                        <thead></thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 component-wrapper d-none">
                            <div class="component-item">
                                <h5 class="component-title">Top Lot Rejected By MFR Details</h5>
                                <div class="component-body table-box">
                                    <table class="table table-sm table-striped" id="table-2">
                                        <thead></thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 component-wrapper d-none">
                            <div class="component-item">
                                <h5 class="component-title">Top Lot Rejected By Models Details</h5>
                                <div class="component-body table-box">
                                    <table class="table table-sm table-striped" id="table-3">
                                        <thead></thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-3 component-wrapper">
                    <div class="component-item">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="component-title mb-0">To be Inspected Distribution by Material Type</h5>

                            <div id="daterangepicker-container" style="display: none; position: absolute">
                                <input type="text" id="daterangepicker" />
                            </div>
                        </div>
                        <div class="component-body chart-box flex-grow-1" id="donut-chart-1"></div>
                    </div>
                </div>

                <div class="col-md-9 component-wrapper">
                    <div class="component-item">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h5 class="component-title mb-0">Inspection List</h5>
                            <button type="button" class="btn btn-sm btn-primary" id="export-table5-btn"
                                title="Download Excel">
                                <i class="bi bi-download"></i> Export
                            </button>
                        </div>
                        <div class="component-body table-box">
                            <table class="table table-sm table-striped" id="table-5">
                                <thead></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                        <div id="pagination-table-5" style="margin-top: 0.4rem"></div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-3 component-wrapper">
                    <div class="component-item">
                        <h5 class="component-title mt-1">NCMR Status</h5>
                        <div class="component-body chart-box flex-grow-1" id="donut-chart-2"></div>
                    </div>
                </div>
                <div class="col-md-9 component-wrapper">
                    <div class="component-item">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h5 class="component-title mb-0">NCMR List</h5>
                            <button type="button" class="btn btn-sm btn-primary" id="export-table4-btn"
                                title="Download Excel">
                                <i class="bi bi-download"></i> Export
                            </button>
                        </div>
                        <div class="component-body table-box">
                            <table class="table table-sm table-striped" id="table-4">
                                <thead></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="module" src="/production-system/js/modules/applib.js"></script>
    <script type="module">
import { DataTableLib } from "/production-system/js/modules/applib.js";

// --- CONSTANTS ---
const CONSTANTS = {
    API: {
        IQC_MATERIAL: "/production-system/api/iqc/iqc-material-type",
        NCMR_MATERIAL: "/production-system/api/iqc/ncmr-material-type",
        TOP_REJECT: "/production-system/api/iqc/top-reject",
        EVENT: "/production-system/api/iqc/event",
        LOT_REJECT: "/production-system/api/iqc/lot-reject",
        NCMR: "/production-system/api/iqc/ncmr",
        IQC_LOT: "/production-system/api/iqc/iqc-lot",
        EXPORT_IQC: "/production-system/api/iqc/iqc-lot/export",
        EXPORT_NCMR: "/production-system/api/iqc/ncmr/export"
    },
    IQC_STATUS_MAP: {
        0: "TO BE INSPECTED",
        1: "ALL",
        2: "REJECTED"
    },
    TABLE_COLUMNS: {
        TABLE1: [
            { key: "materialType", label: "Material Type" },
            { key: "mfrcode", label: "MFR Code" },
            { key: "mfrname", label: "MFR Name" },
            { key: "numberRecord", label: "Reject Qty" }
        ],
        TABLE2: [
            { key: "mfrcode", label: "MFR Code" },
            { key: "mfrname", label: "MFR Name" },
            { key: "numberRecord", label: "Reject Qty" }
        ],
        TABLE3: [
            { key: "model", label: "Model" },
            { key: "mfrcode", label: "MFR Code" },
            { key: "mfrname", label: "MFR Name" },
            { key: "numberRecord", label: "Reject Qty" }
        ],
        TABLE4: [
            { key: "stt", label: "#" },
            { key: "ncmrNo", label: "NCMR No" },
            { key: "docNo", label: "Doc No" },
            { key: "caseOwner", label: "Case Owner" },
            { key: "department", label: "Department" },
            { key: "custKpNo", label: "KpNo" },
            { key: "priorityFlag", label: "Priority" },
            { key: "mfrName", label: "MFR Name" },
            { key: "editEmp", label: "Edit Emp" },
            { key: "inspectionDate", label: "Inspection Date" },
            { key: "rejectReason", label: "Reject Reason" },
            { key: "improvementAction", label: "Improvement Action" },
            { key: "judgement", label: "Judgement" },
            { key: "nextStep", label: "Next-Step" },
            { key: "status", label: "Status" },
            { key: "agingDay", label: "Aging Day" }
        ],
        TABLE5: [
            { key: "stt", label: "#" },
            { key: "docNo", label: "Doc No" },
            { key: "custKpNo", label: "KpNo" },
            { key: "poNo", label: "Po No" },
            { key: "poItem", label: "Item" },
            { key: "mfrCode", label: "MFR Code" },
            { key: "mfrName", label: "MFR Name" },
            { key: "materialType", label: "Type" },
            { key: "floor", label: "Floor" },
            { key: "receiveTime", label: "Receive Time" },
            { key: "iqcEmp", label: "IQC Emp" },
            { key: "iqcStatus", label: "IQC Status" },
            { key: "iqcRemark", label: "IQC Remark" },
            { key: "iqcQty", label: "IQC Quantity" },
            { key: "iqcTime", label: "IQC Time" }
        ]
    }
};

// --- STATE ---
const State = {
    fromDate: null,
    toDate: null,
    charts: [],
    tables: {
        table1: null,
        table2: null,
        table3: null,
        table4: null,
        table5: null
    },
    filters: {
        donut: {
            materialTypeIQC: null,
            materialTypeNCMR: null,
            iqcStatus: 1
        },
        tables: {
            "table-1": null,
            "table-2": null,
            "table-3": null
        }
    }
};

// --- UTILS ---
const Utils = {
    formatDate: (date, time) => date.format(`YYYY/MM/DD \${time}`),

    showNoData: (containerId, message = "NO DATA") => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        const el = document.createElement("div");
        el.className = "no-data";
        el.textContent = message;
        container.appendChild(el);
    },

    createBadge: (text, onClose, isStatusBadge = false, onStatusChange = null) => {
        const badge = document.createElement("span");
        badge.className = "filter-badge";
        Object.assign(badge.style, {
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            cursor: "default"
        });

        if (isStatusBadge && onStatusChange) {
            const select = document.createElement("select");
            Object.assign(select.style, {
                backgroundColor: "transparent",
                color: "white",
                border: "none",
                outline: "none",
                cursor: "pointer",
                fontSize: "0.7rem",
                fontWeight: "bold",
                padding: "0"
            });

            Object.entries(CONSTANTS.IQC_STATUS_MAP).forEach(([value, label]) => {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = label;
                if (parseInt(value) === State.filters.donut.iqcStatus) {
                    option.selected = true;
                }
                select.appendChild(option);
            });

            select.onchange = (e) => {
                e.stopPropagation();
                onStatusChange(parseInt(e.target.value));
            };
            badge.appendChild(select);
        } else {
            const textSpan = document.createElement("span");
            textSpan.textContent = text;
            badge.appendChild(textSpan);
        }

        const closeBtn = document.createElement("span");
        closeBtn.innerHTML = "<i class='bi bi-x'></i>";
        Object.assign(closeBtn.style, {
            fontSize: "1rem",
            fontWeight: "normal",
            lineHeight: "1.1",
            cursor: "pointer"
        });
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            onClose();
        };

        badge.appendChild(closeBtn);
        return badge;
    },

    updateTableTitleBadge: (tableId, filterValue) => {
        const tableElement = document.getElementById(tableId);
        if (!tableElement) return;

        const titleElement = tableElement.closest(".component-item")?.querySelector(".component-title");
        if (!titleElement) return;

        titleElement.querySelectorAll(".filter-badge").forEach(b => b.remove());

        if (tableId === "table-5") {
            if (State.filters.donut.materialTypeIQC) {
                const badge = Utils.createBadge(State.filters.donut.materialTypeIQC, () => {
                    State.filters.donut.materialTypeIQC = null;
                    State.filters.donut.iqcStatus = 1;
                    Tables.renderTable5();
                    Utils.updateTableTitleBadge("table-5");
                });
                titleElement.appendChild(badge);
            }

            if (State.filters.donut.iqcStatus !== null) {
                const badge = Utils.createBadge(null, () => {
                    State.filters.donut.iqcStatus = 1;
                    State.filters.donut.materialTypeIQC = null;
                    Tables.renderTable5();
                    Utils.updateTableTitleBadge("table-5");
                }, true, (newStatus) => {
                    State.filters.donut.iqcStatus = newStatus;
                    Tables.renderTable5();
                    Utils.updateTableTitleBadge("table-5");
                });
                titleElement.appendChild(badge);
            }
            App.updateExportButtonState();
        } else {
            const filter = filterValue !== undefined ? filterValue : State.filters.tables[tableId];
            if (filter) {
                const badge = Utils.createBadge(filter, () => {
                    if (tableId === "table-4") {
                        State.filters.donut.materialTypeNCMR = null;
                        Tables.renderTable4();
                    } else {
                        State.filters.tables[tableId] = null;
                        if (tableId === "table-1") Tables.renderTable1();
                        else if (tableId === "table-2") Tables.renderTable2();
                        else if (tableId === "table-3") Tables.renderTable3();
                    }
                    Utils.updateTableTitleBadge(tableId);
                });
                titleElement.appendChild(badge);
            }
        }
    }
};

// --- API ---
const Api = {
    fetchData: async (url) => {
        loader.load();
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP \${res.status}`);
            return await res.json();
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        } finally {
            loader.unload();
        }
    },

    getDonutData: async (type) => {
        const endpoint = type === 'IQC' ? CONSTANTS.API.IQC_MATERIAL : CONSTANTS.API.NCMR_MATERIAL;
        const json = await Api.fetchData(`\${endpoint}?fromDate=\${State.fromDate}&toDate=\${State.toDate}`);
        const data = json?.data || [];
        return data.map(i => ({
            name: i.materialType == null ? "Others" : i.materialType,
            y: i.totalRecord
        }));
    },

    getTopReject: async (fieldName) => {
        const params = new URLSearchParams({ fieldName, fromDate: State.fromDate, toDate: State.toDate, page: 0, size: 20 });
        const json = await Api.fetchData(`\${CONSTANTS.API.TOP_REJECT}?\${params}`);
        return json?.data || [];
    },

    getCPNStats: async () => {
        const json = await Api.fetchData(`\${CONSTANTS.API.EVENT}?fromDate=\${State.fromDate}&toDate=\${State.toDate}`);
        return json?.result || null;
    },

    getLotRejectStats: async (from, to) => {
        const json = await Api.fetchData(`\${CONSTANTS.API.LOT_REJECT}?fromDate=\${from}&toDate=\${to}`);
        return json?.result || null;
    },

    exportFile: async (tableNum, filename) => {
        const apiUrl = tableNum === 5 ? CONSTANTS.API.EXPORT_IQC : CONSTANTS.API.EXPORT_NCMR;
        const params = new URLSearchParams({
            page: 0, size: 40000, fromDate: State.fromDate, toDate: State.toDate
        });

        if (tableNum === 5) {
            if (State.filters.donut.materialTypeIQC) params.append("materialType", State.filters.donut.materialTypeIQC);
            if (State.filters.donut.iqcStatus !== null) params.append("iqcStatus", State.filters.donut.iqcStatus);
        } else if (tableNum === 4 && State.filters.donut.materialTypeNCMR) {
            params.append("materialType", State.filters.donut.materialTypeNCMR);
        }

        const btnId = tableNum === 5 ? "export-table5-btn" : "export-table4-btn";
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Exporting...';
        }

        loader.load();
        try {
            const response = await fetch(`\${apiUrl}?\${params}`, {
                headers: { Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
            });
            if (!response.ok) throw new Error(`HTTP \${response.status}`);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `\${filename}_\${new Date().getTime()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { window.URL.revokeObjectURL(url); document.body.removeChild(a); }, 100);
        } catch (error) {
            console.error("Export failed:", error);
            alert(`Failed to export: \${error.message}`);
        } finally {
            loader.unload();
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="bi bi-download"></i> Export';
            }
        }
    }
};

// --- CHARTS ---
const Charts = {
    init: () => {
        Highcharts.setOptions({
            chart: { backgroundColor: "transparent", spacing: [10, 5, 5, 5] },
            xAxis: {
                gridLineWidth: 1, gridLineColor: "#313f62", gridLineDashStyle: "Dash",
                lineWidth: 1, lineColor: "#313f62", lineDashStyle: "ShortDash",
                labels: { style: { fontSize: "1rem", fontWeight: "600", color: "#7a95c3" } }
            },
            yAxis: {
                gridLineWidth: 1, gridLineColor: "#313f62", gridLineDashStyle: "Dash",
                labels: { style: { fontSize: "1rem", fontWeight: "600", color: "#7a95c3" } }
            },
            tooltip: { outside: true, style: { fontSize: "1rem" } },
            credits: { enabled: false },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: { enabled: true, style: { color: "#fff", textOutline: 0, fontWeight: "normal", fontSize: "0.7rem" } }
                }
            }
        });
    },

    drawPie: (containerId, data, onClick) => {
        if (!document.getElementById(containerId)) return;
        const chart = Highcharts.chart(containerId, {
            chart: {
                type: "pie", custom: {},
                events: {
                    render() {
                        const chart = this;
                        const series = chart.series[0];
                        if (!series) return;
                        const total = series.data.reduce((sum, p) => sum + (p.y || 0), 0);
                        const labelText = `Total<br/><strong>\${Highcharts.numberFormat(total, 0, ".", " ")}</strong>`;

                        let lbl = chart.options.chart.custom.label;
                        if (!lbl) {
                            lbl = chart.options.chart.custom.label = chart.renderer.label(labelText)
                                .css({ color: "#fff", textAlign: "center" }).add();
                        } else {
                            lbl.attr({ text: labelText });
                        }
                        const bbox = lbl.getBBox();
                        lbl.attr({
                            x: series.center[0] + chart.plotLeft - bbox.width / 2,
                            y: series.center[1] + chart.plotTop - bbox.height / 2
                        }).css({ fontSize: series.center[2] ? `\${series.center[2] / 12}px` : "1.2rem" });
                        chart.reflow();
                    }
                }
            },
            title: { text: "" },
            tooltip: { pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>" },
            legend: { enabled: true, itemStyle: { color: "#fff", fontSize: "0.55rem" } },
            plotOptions: {
                pie: {
                    allowPointSelect: true, cursor: "pointer",
                    point: { events: { click: function () { onClick(this.name); } } },
                    dataLabels: {
                        enabled: true, distance: 20, format: "{point.name}<br/>{point.y} ({point.percentage:.2f}%)",
                        style: { fontSize: "0.65rem", color: "#fff", textOutline: "none" }
                    },
                    showInLegend: true,
                    innerSize: "70%"
                }
            },
            series: [{ name: "Count", colorByPoint: true, data }]
        });
        State.charts.push(chart);
    },

    drawColumn: (containerId, categories, values, onClick) => {
        if (!document.getElementById(containerId)) return;
        const maxVal = Math.max(...values, 1);
        const yMax = Math.ceil((maxVal * 1.2) / 5) * 5;

        const chart = Highcharts.chart(containerId, {
            chart: {
                type: "column", spacing: [10, 10, 10, 10], marginBottom: 80,
                events: { render() { this.reflow(); } }
            },
            title: { text: "" },
            legend: { enabled: false },
            xAxis: {
                categories, crosshair: true,
                labels: {
                    useHTML: true, rotation: 75, align: "left",
                    style: { fontSize: "9px", fontWeight: "700", whiteSpace: "nowrap", width: "50px", overflow: "hidden", textOverflow: "ellipsis" }
                },
                tickLength: 0
            },
            yAxis: { min: 0, max: yMax, tickInterval: Math.ceil(yMax / 5), title: { text: "" } },
            tooltip: { enabled: true, pointFormat: "<b>{point.y}</b>" },
            plotOptions: {
                column: {
                    cursor: "pointer",
                    point: { events: { click: function () { onClick(this.category); } } }
                }
            },
            series: [{ name: "Value", data: values, color: "rgba(128, 99, 255, 0.65)" }]
        });
        State.charts.push(chart);
    },

    drawMirror: (containerId, xLabels, checkIn, checkOut) => {
        if (!document.getElementById(containerId)) return;
        const maxCheckOut = Math.max(...checkOut, 0);
        const yMaxBottom = Math.ceil(maxCheckOut * 1.5);
        const lineData = checkIn.map((ins, i) => ins > 0 ? parseFloat(((checkOut[i] || 0) / ins * 100).toFixed(2)) : 0);
        const yMaxLine = Math.ceil(Math.max(...lineData) * 4);

        const chart = Highcharts.chart(containerId, {
            chart: {
                type: "column",
                events: {
                    render() { this.reflow(); },
                    load() {
                        const legendContainer = document.getElementById(`legend-\${containerId}`);
                    }
                }
            },
            title: null,
            xAxis: {
                categories: xLabels, lineWidth: 0, tickLength: 5, offset: -110,
                labels: { align: "center", y: 0, style: { fontSize: "0.75rem" } }
            },
            yAxis: [
                { title: null, height: "43%", offset: 0, softMax: 600 },
                { title: null, top: "57%", height: "43%", offset: 0, reversed: true, softMax: yMaxBottom },
                { title: null, top: 0, height: "43%", offset: 0, opposite: true, max: yMaxLine, labels: { enabled: false }, gridLineWidth: 0 }
            ],
            tooltip: { enabled: false },
            legend: { enabled: true, itemStyle: { color: "#fff" } },
            plotOptions: {
                column: { grouping: false, maxPointWidth: 30, dataLabels: { allowOverlap: true, rotation: 0 } }
            },
            series: [
                { name: "Inspected", color: "#fddd60", data: checkIn, yAxis: 0 },
                {
                    name: "Rejected", color: "#7cffb2", data: checkOut, yAxis: 1,
                    dataLabels: { enabled: true, formatter: function () { return this.y < 0.1 ? 0 : this.y; } }
                },
                {
                    name: "Ratio (Rejected/Inspected)", type: "line", color: "#38C3FE", data: lineData, yAxis: 2,
                    dataLabels: { enabled: true, formatter: function () { return this.y + "%"; } },
                    marker: { enabled: true, radius: 3 }
                }
            ]
        });
        State.charts.push(chart);
    }
};

// --- TABLES ---
const Tables = {
    renderTable1: async () => {
        if (State.tables.table1) State.tables.table1.destroy();
        State.tables.table1 = new DataTableLib({
            tableId: "table-1", serverSide: true, rows: 9999, pagination: false, emptyMessage: "NO DATA", sort: false,
            buildUrl: () => {
                const params = new URLSearchParams({ fieldName: "MaterialTypeAndMFR", fromDate: State.fromDate, toDate: State.toDate, page: 0, size: 9999 });
                return `\${CONSTANTS.API.TOP_REJECT}?\${params}`;
            },
            formatData: (res) => {
                let data = res?.data || [];
                const filter = State.filters.tables["table-1"];
                if (filter) data = data.filter(r => (r.materialType || "N/A").trim() === filter);
                res.total = data.length;
                return data;
            },
            columnsConfig: CONSTANTS.TABLE_COLUMNS.TABLE1.map(c => ({ label: c.label })),
            rowRenderer: (item) => Tables.commonRowRenderer(item, CONSTANTS.TABLE_COLUMNS.TABLE1)
        });
        await State.tables.table1.init();
    },

    renderTable2: async () => {
        if (State.tables.table2) State.tables.table2.destroy();
        State.tables.table2 = new DataTableLib({
            tableId: "table-2", serverSide: true, rows: 9999, pagination: false, emptyMessage: "NO DATA", sort: false,
            buildUrl: () => {
                const params = new URLSearchParams({ fieldName: "MFR", fromDate: State.fromDate, toDate: State.toDate, page: 0, size: 9999 });
                return `\${CONSTANTS.API.TOP_REJECT}?\${params}`;
            },
            formatData: (res) => {
                let data = res?.data || [];
                const filter = State.filters.tables["table-2"];
                if (filter) data = data.filter(r => (r.mfrcode || "N/A").trim() === filter);
                res.total = data.length;
                return data;
            },
            columnsConfig: CONSTANTS.TABLE_COLUMNS.TABLE2.map(c => ({ label: c.label })),
            rowRenderer: (item) => Tables.commonRowRenderer(item, CONSTANTS.TABLE_COLUMNS.TABLE2)
        });
        await State.tables.table2.init();
    },

    renderTable3: async () => {
        if (State.tables.table3) State.tables.table3.destroy();
        State.tables.table3 = new DataTableLib({
            tableId: "table-3", serverSide: true, rows: 9999, pagination: false, emptyMessage: "NO DATA", sort: false,
            buildUrl: () => {
                const params = new URLSearchParams({ fieldName: "ModelAndMFR", fromDate: State.fromDate, toDate: State.toDate, page: 0, size: 9999 });
                return `\${CONSTANTS.API.TOP_REJECT}?\${params}`;
            },
            formatData: (res) => {
                let data = res?.data || [];
                const filter = State.filters.tables["table-3"];
                if (filter) data = data.filter(r => (r.model || "N/A").trim() === filter);
                res.total = data.length;
                return data;
            },
            columnsConfig: CONSTANTS.TABLE_COLUMNS.TABLE3.map(c => ({ label: c.label })),
            rowRenderer: (item) => Tables.commonRowRenderer(item, CONSTANTS.TABLE_COLUMNS.TABLE3)
        });
        await State.tables.table3.init();
    },

    renderTable4: async () => {
        if (State.tables.table4) State.tables.table4.destroy();

        // Ensure pagination container exists
        let pag = document.getElementById("pagination-table-4");
        if (!pag) {
            pag = document.createElement("div");
            pag.id = "pagination-table-4";
            pag.style.marginTop = "0.4rem";
            document.getElementById("table-4")?.closest(".component-item")?.appendChild(pag);
        }

        State.tables.table4 = new DataTableLib({
            tableId: "table-4", serverSide: true, rows: 10, paginationId: "pagination-table-4", emptyMessage: "NO DATA", sort: false,
            buildUrl: (page) => {
                const params = new URLSearchParams({ page: page - 1, size: 10, fromDate: State.fromDate, toDate: State.toDate });
                if (State.filters.donut.materialTypeNCMR) params.append("materialType", State.filters.donut.materialTypeNCMR);
                return `\${CONSTANTS.API.NCMR}?\${params}`;
            },
            formatData: (res) => { res.total = res?.size || 0; return res?.data || []; },
            columnsConfig: CONSTANTS.TABLE_COLUMNS.TABLE4.map(c => ({ label: c.label })),
            rowRenderer: (item, index, meta) => {
                if (!item) return `<td colspan="\${CONSTANTS.TABLE_COLUMNS.TABLE4.length}" class="text-center">NO DATA</td>`;
                const stt = ((meta?.currentPage ?? 1) - 1) * (meta?.rows ?? 10) + index + 1;
                return CONSTANTS.TABLE_COLUMNS.TABLE4.map(col => {
                    if (col.key === "stt") return `<td>\${stt}</td>`;
                    const val = item[col.key] ?? "-";
                    if (["rejectReason", "improvementAction"].includes(col.key)) {
                        return `<td style="max-width: 200px; word-wrap: break-word; white-space: normal;">\${val}</td>`;
                    }
                    return `<td>\${val}</td>`;
                }).join("");
            }
        });
        await State.tables.table4.init();
    },

    renderTable5: async () => {
        if (State.tables.table5) State.tables.table5.destroy();
        State.tables.table5 = new DataTableLib({
            tableId: "table-5", serverSide: true, rows: 50, paginationId: "pagination-table-5", emptyMessage: "NO DATA", sort: false,
            buildUrl: (page) => {
                const params = new URLSearchParams({ page: page - 1, size: 50, fromDate: State.fromDate, toDate: State.toDate });
                if (State.filters.donut.materialTypeIQC) params.append("materialType", State.filters.donut.materialTypeIQC);
                if (State.filters.donut.iqcStatus !== null) params.append("iqcStatus", State.filters.donut.iqcStatus);
                return `\${CONSTANTS.API.IQC_LOT}?\${params}`;
            },
            formatData: (res) => { res.total = res?.size || 0; return res?.data || []; },
            columnsConfig: CONSTANTS.TABLE_COLUMNS.TABLE5.map(c => ({ label: c.label })),
            rowRenderer: (item, index, meta) => {
                if (!item) return `<td colspan="\${CONSTANTS.TABLE_COLUMNS.TABLE5.length}" class="text-center">NO DATA</td>`;
                const stt = ((meta?.currentPage ?? 1) - 1) * (meta?.rows ?? 10) + index + 1;
                return CONSTANTS.TABLE_COLUMNS.TABLE5.map(col => {
                    if (col.key === "stt") return `<td>\${stt}</td>`;
                    return `<td>\${item[col.key] ?? "-"}</td>`;
                }).join("");
            }
        });
        await State.tables.table5.init();
    },

    commonRowRenderer: (item, columns) => {
        if (!item) return `<td colspan="\${columns.length}" class="text-center">NO DATA</td>`;
        return columns.map(col => `<td>\${item[col.key] ?? "-"}</td>`).join("");
    }
};

// --- APP ---
const App = {
    init: () => {
        Charts.init();
        App.bindEvents();

        // Initial Date Setup
        const selectElement = document.getElementById("sl-time-chart");
        if (!selectElement.value) selectElement.selectedIndex = 2;
        App.updateDates(selectElement.value || "30");

        App.loadAll();
    },

    bindEvents: () => {
        window.addEventListener("resize", () => State.charts.forEach(c => c.reflow()));

        // Main Date Picker
        const selectElement = document.getElementById("sl-time-chart");
        const daterangepickerChart = $("#daterangepicker-chart");

        daterangepickerChart.daterangepicker({
            opens: "left", autoUpdateInput: false,
            locale: { cancelLabel: "Clear", applyLabel: "Apply", format: "YYYY/MM/DD" },
            startDate: moment().subtract(29, "days"), endDate: moment()
        });

        daterangepickerChart.on("apply.daterangepicker", (ev, picker) => {
            State.fromDate = picker.startDate.format("YYYY/MM/DD 00:00:00");
            State.toDate = picker.endDate.format("YYYY/MM/DD 23:59:59");
            daterangepickerChart.val(`\${picker.startDate.format("YYYY/MM/DD")} - \${picker.endDate.format("YYYY/MM/DD")}`);
            App.loadAll();
        });

        daterangepickerChart.on("cancel.daterangepicker", () => {
            daterangepickerChart.val("").hide();
            selectElement.value = "30";
            App.updateDates("30");
            App.loadAll();
        });

        selectElement.addEventListener("change", function () {
            if (this.value === "custom") {
                document.getElementById("daterangepicker-chart").style.display = "inline-block";
                $("#daterangepicker-chart").data("daterangepicker").show();
            } else {
                document.getElementById("daterangepicker-chart").style.display = "none";
                App.updateDates(this.value);
                App.loadAll();
            }
        });

        // Secondary Date Picker (Lot Rejected Rate)
        const slTime = document.getElementById("sl-time");
        if (slTime) {
            if (!slTime.value) slTime.selectedIndex = 0;
            slTime.addEventListener("change", () => App.loadLotInject());
        }

        // Export Buttons
        document.getElementById("export-table5-btn")?.addEventListener("click", () => {
            if (State.filters.donut.iqcStatus === 1) {
                alert("Cannot export when status is ALL. Please select a specific status.");
                return;
            }
            Api.exportFile(5, "IqcReport");
        });
        document.getElementById("export-table4-btn")?.addEventListener("click", () => Api.exportFile(4, "NcmrReport"));
    },

    updateDates: (option) => {
        if (option === "today") {
            State.fromDate = Utils.formatDate(moment(), "00:00:00");
            State.toDate = Utils.formatDate(moment(), "23:59:59");
        } else if (option === "7") {
            State.fromDate = Utils.formatDate(moment().subtract(6, "days"), "00:00:00");
            State.toDate = Utils.formatDate(moment(), "23:59:59");
        } else if (option === "30") {
            State.fromDate = Utils.formatDate(moment().subtract(29, "days"), "00:00:00");
            State.toDate = Utils.formatDate(moment(), "23:59:59");
        }
    },

    loadAll: () => {
        App.loadDonuts();
        App.loadTopRejects();
        App.loadCPN();
        App.loadLotInject();
        App.loadWeeklyChart();
        App.loadDailyChart();
        Tables.renderTable4();
        Tables.renderTable5();
        Utils.updateTableTitleBadge("table-5");
        App.updateExportButtonState();
    },

    loadDonuts: async () => {
        const iqcData = await Api.getDonutData('IQC');
        if (iqcData.length) Charts.drawPie("donut-chart-1", iqcData, App.handleDonutIQC_Click);

        const ncmrData = await Api.getDonutData('NCMR');
        if (ncmrData.length) Charts.drawPie("donut-chart-2", ncmrData, App.handleDonutNCMR_Click);
    },

    loadTopRejects: async () => {
        const [matData, mfrData, modelData] = await Promise.all([
            Api.getTopReject("MaterialType"),
            Api.getTopReject("MFR"),
            Api.getTopReject("Model")
        ]);

        if (matData.length) {
            const top = matData.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
            Charts.drawColumn("col-chart-3", top.map(i => i.materialType || "N/A"), top.map(i => i.numberRecord || 0), (cat) => App.handleColumnClick("table-1", cat));
        } else Utils.showNoData("col-chart-3");

        if (mfrData.length) {
            const top = mfrData.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
            Charts.drawColumn("col-chart-4", top.map(i => `\${i.mfrcode || "N/A"}-\${i.mfrname || "N/A"}`), top.map(i => i.numberRecord || 0), (cat) => App.handleColumnClick("table-2", cat));
        } else Utils.showNoData("col-chart-4");

        if (modelData.length) {
            const top = modelData.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
            Charts.drawColumn("col-chart-5", top.map(i => i.model || "N/A"), top.map(i => i.numberRecord || 0), (cat) => App.handleColumnClick("table-3", cat));
        } else Utils.showNoData("col-chart-5");

        Tables.renderTable1();
        Tables.renderTable2();
        Tables.renderTable3();
    },

    loadCPN: async () => {
        const res = await Api.getCPNStats();
        if (res) {
            document.querySelector("#be-inspected").textContent = res.toBeInspected;
            document.querySelector("#timeout_inspect").textContent = res.timeOutToBeInspected;
            document.querySelector("#scanned").textContent = res.toBeScanned;
            document.querySelector("#timeout_scan").textContent = res.timeOutTobeScanned;
        }
    },

    loadLotInject: async () => {
        const slTime = document.getElementById("sl-time");
        const val = slTime?.value || "today";
        let from, to;

        if (val === "today") { from = moment(); to = moment(); }
        else if (val === "7") { from = moment().subtract(6, "days"); to = moment(); }
        else { from = moment().subtract(29, "days"); to = moment(); }

        const res = await Api.getLotRejectStats(Utils.formatDate(from, "00:00:00"), Utils.formatDate(to, "23:59:59"));
        if (res) {
            document.querySelector("#inspected").textContent = res.inspectedTotal;
            document.querySelector("#lot-rejected").textContent = res.lotRejectedTotal;
            document.querySelector("#lrr").textContent = `\${res.lotRejectedRate}%`;
        }
    },

    loadWeeklyChart: async () => {
        const start = moment().subtract(7, "weeks").startOf("isoWeek");
        const end = moment().endOf("isoWeek");
        const res = await Api.getLotRejectStats(Utils.formatDate(start, "00:00:00"), Utils.formatDate(end, "23:59:59"));
        if (!res) return;

        const xLabels = [], inspected = [], rejected = [];
        res.data.forEach(w => {
            xLabels.push(`W\${w.weekNumber}`);
            inspected.push(w.inspectedTotal || 0);
            rejected.push(w.lotRejectedTotal || 0);
        });
        Charts.drawMirror("col-chart-1", xLabels, inspected, rejected);
    },

    loadDailyChart: async () => {
        const start = moment().subtract(6, "days");
        const end = moment();
        const res = await Api.getLotRejectStats(Utils.formatDate(start, "00:00:00"), Utils.formatDate(end, "23:59:59"));
        if (!res) return;

        const xLabels = [], inspected = [], rejected = [];
        res.data.forEach(w => w.data.forEach(d => {
            xLabels.push(d.workDate.split("-").slice(1).join("-"));
            inspected.push(d.inspectedTotal || 0);
            rejected.push(d.lotRejectedTotal || 0);
        }));
        Charts.drawMirror("col-chart-2", xLabels, inspected, rejected);
    },

    handleDonutIQC_Click: (name) => {
        State.filters.donut.materialTypeIQC = State.filters.donut.materialTypeIQC === name ? null : name;
        State.filters.donut.iqcStatus = State.filters.donut.materialTypeIQC ? 0 : 1;
        Utils.updateTableTitleBadge("table-5");
        Tables.renderTable5();
    },

    handleDonutNCMR_Click: (name) => {
        State.filters.donut.materialTypeNCMR = State.filters.donut.materialTypeNCMR === name ? null : name;
        Utils.updateTableTitleBadge("table-4", State.filters.donut.materialTypeNCMR);
        Tables.renderTable4();
    },

    handleColumnClick: (tableId, category) => {
        const clean = typeof category === "string" ? category.replace(/<[^>]*>/g, "").trim() : String(category || "N/A");
        State.filters.tables[tableId] = State.filters.tables[tableId] === clean ? null : clean;
        Utils.updateTableTitleBadge(tableId);
        if (tableId === "table-1") Tables.renderTable1();
        else if (tableId === "table-2") Tables.renderTable2();
        else if (tableId === "table-3") Tables.renderTable3();
    },

    updateExportButtonState: () => {
        const btn = document.getElementById("export-table5-btn");
        if (!btn) return;
        if (State.filters.donut.iqcStatus === 1) {
            btn.disabled = true;
            btn.title = "Cannot export when status is ALL. Please select a specific status.";
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
        } else {
            btn.disabled = false;
            btn.title = "Download Excel";
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        }
    }
};

ready(() => App.init());
</script>
