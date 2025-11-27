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
        /* background-color: #2a2d3a !important; */
        background-color: transparent !important;
        color: #ffc107 !important;
        font-weight: bold;
        /* border: 1px solid #5264b6; */
        border: none;
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

    .table-striped > tbody > tr.odd {
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

    /* Nền của scrollbar */
    ::-webkit-scrollbar-track {
        background: #acacac;
        border-radius: 0px;
    }

    /* Thanh cuộn */
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
        /* background: transparent; */
        border: 1px solid #5264b6;
        color: #fff !important;
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

    .cpnCustom > .row {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
    }

    .cpnCustom .component-wrapper {
        display: flex;
    }

    .cpnCustom .component-wrapper > .component-item {
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

    .customBadge {
        background-color: rgb(8, 58, 143) !important;
        color: white;
        cursor: pointer;
        border: none;
        font-weight: bold;
    }

    .component-title.title-with-badges {
        flex-wrap: wrap;
        align-items: center;
    }

    .component-title.title-with-badges > span:first-child {
        display: inline;
    }

    .component-title .filter-badge {
        margin-top: 0.3rem;
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
                                class="component-item d-flex flex-column justify-content-center align-items-center text-center"
                            >
                                <div class="component-title">Inspected</div>
                                <span id="inspected" class="fw-bold text-warning text-span"></span>
                            </div>
                        </div>

                        <div class="col-md-12 component-wrapper">
                            <div
                                class="component-item d-flex flex-column justify-content-center align-items-center text-center"
                            >
                                <div class="component-title">Lot Rejected</div>
                                <span id="lot-rejected" class="fw-bold text-warning text-span"></span>
                            </div>
                        </div>

                        <div class="col-md-12 component-wrapper">
                            <div
                                class="component-item d-flex flex-column justify-content-center align-items-center text-center"
                            >
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

        <div style="display: flex; align-items: center; gap: 0.5rem; margin: 0.3rem">
            <label for="sl-time-chart" class="fw-bold">Time: </label>
            <select name="" id="sl-time-chart" class="form-select form-select-sm w-auto">
                <option value="today">Today</option>
                <option value="7">Last 7 Days</option>
                <option value="30" selected>Last 30 Days</option>
                <option value="custom">Custom</option>
            </select>
            <input
                type="text"
                id="daterangepicker-chart"
                class="form-control form-control-sm w-auto"
                style="display: none; margin-left: 0.5rem"
            />
        </div>

        <div class="row">
            <div class="col-md-3 component-wrapper">
                <div class="component-item">
                    <h5 class="component-title">CPN Status</h5>
                    <div class="component-body cpnCustom" id="">
                        <div class="row">
                            <div class="col-md-6 component-wrapper">
                                <div
                                    class="component-item d-flex flex-column justify-content-center align-items-center text-center"
                                >
                                    <div class="component-title">To Be Inspected</div>
                                    <span id="be-inspected" class="fw-bold text-warning text-span"></span>
                                </div>
                            </div>

                            <div class="col-md-6 component-wrapper">
                                <div
                                    class="component-item d-flex flex-column justify-content-center align-items-center text-center"
                                >
                                    <div class="component-title">Timeout Inspected</div>
                                    <span id="timeout_inspect" class="fw-bold text-warning text-span"></span>
                                </div>
                            </div>

                            <div class="col-md-6 component-wrapper">
                                <div
                                    class="component-item d-flex flex-column justify-content-center align-items-center text-center"
                                >
                                    <div class="component-title">To Be Scanned</div>
                                    <span id="scanned" class="fw-bold text-warning text-span"></span>
                                </div>
                            </div>

                            <div class="col-md-6 component-wrapper">
                                <div
                                    class="component-item d-flex flex-column justify-content-center align-items-center text-center"
                                >
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
                        <button
                            type="button"
                            class="btn btn-sm btn-primary"
                            id="export-table5-btn"
                            title="Download Excel"
                        >
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
                        <button
                            type="button"
                            class="btn btn-sm btn-primary"
                            id="export-table4-btn"
                            title="Download Excel"
                        >
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
    // state
    const state = {
        dataset: {},
        chartsList: [],
        filters: {
            donut: {
                materialTypeIQC: null,
                materialTypeNCMR: null,
                iqcStatus: 1,
            },
            lot: {
                "table-1": null,
                "table-2": null,
                "table-3": null,
            },
        },
        tables: {
            table1: null,
            table2: null,
            table3: null,
            table4: null,
            table5: null,
        },
        dates: {
            from: null,
            to: null,
        },
    };

    const IQC_STATUS_MAP = {
        0: "TO BE INSPECTED",
        1: "ALL",
        2: "REJECTED",
    };

    const API = {
        TOP_REJECT: "/production-system/api/iqc/top-reject",
        IQC_MATERIAL: "/production-system/api/iqc/iqc-material-type",
        NCMR_MATERIAL: "/production-system/api/iqc/ncmr-material-type",
        EVENT: "/production-system/api/iqc/event",
        LOT_REJECT: "/production-system/api/iqc/lot-reject",
        IQC_LOT: "/production-system/api/iqc/iqc-lot",
        NCMR: "/production-system/api/iqc/ncmr",
        IQC_EXPORT: "/production-system/api/iqc/iqc-lot/export",
        NCMR_EXPORT: "/production-system/api/iqc/ncmr/export",
    };

    const TABLE_CONFIGS = {
        table1: [
            { key: "materialType", label: "Material Type" },
            { key: "mfrcode", label: "MFR Code" },
            { key: "mfrname", label: "MFR Name" },
            { key: "numberRecord", label: "Reject Qty" },
        ],
        table2: [
            { key: "mfrcode", label: "MFR Code" },
            { key: "mfrname", label: "MFR Name" },
            { key: "numberRecord", label: "Reject Qty" },
        ],
        table3: [
            { key: "model", label: "Model" },
            { key: "mfrcode", label: "MFR Code" },
            { key: "mfrname", label: "MFR Name" },
            { key: "numberRecord", label: "Reject Qty" },
        ],
        table4: [
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
            { key: "agingDay", label: "Aging Day" },
        ],
        table5: [
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
            { key: "iqcTime", label: "IQC Time" },
        ],
    };

    // util
    const fmt = (date, time) => date.format(`YYYY/MM/DD \${time}`);

    const updateDates = (option) => {
        const now = moment();
        const configs = {
            today: { from: now, to: now },
            7: { from: now.clone().subtract(6, "days"), to: now },
            30: { from: now.clone().subtract(29, "days"), to: now },
        };

        const cfg = configs[option];
        if (cfg) {
            state.dates.from = fmt(cfg.from, "00:00:00");
            state.dates.to = fmt(cfg.to, "23:59:59");
        }
    };

    const buildUrl = (path, params) => `\${path}?\${new URLSearchParams(params)}`;

    const fetchData = async (url) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP \${res.status}`);
            return await res.json();
        } catch (err) {
            console.error("Fetch error:", err);
            return null;
        }
    };

    const mapData = (items, mapper) => items?.map(mapper) || [];

    // highchart init
    const initHighcharts = () => {
        Highcharts.setOptions({
            chart: { backgroundColor: "transparent", spacing: [10, 5, 5, 5] },
            xAxis: {
                gridLineWidth: 1,
                gridLineColor: "#313f62",
                gridLineDashStyle: "Dash",
                lineWidth: 1,
                lineColor: "#313f62",
                labels: { style: { fontSize: "1rem", fontWeight: "600", color: "#7a95c3" } },
            },
            yAxis: {
                gridLineWidth: 1,
                gridLineColor: "#313f62",
                gridLineDashStyle: "Dash",
                labels: { style: { fontSize: "1rem", fontWeight: "600", color: "#7a95c3" } },
            },
            tooltip: { outside: true, style: { fontSize: "1rem" } },
            credits: { enabled: false },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        style: { color: "#fff", textOutline: 0, fontWeight: "normal", fontSize: "0.7rem" },
                    },
                },
            },
        });
    };

    const reflowChart = (chart) => chart?.reflow();

    window.addEventListener("resize", () => {
        state.chartsList.forEach(reflowChart);
    });

    // render chart
    const drawDonut = (id, data) => {
        const dataUpper = Array.isArray(data)
            ? data.map((d) => ({ ...d, name: d.name ? d.name.toUpperCase() : d.name }))
            : data;
        const el = document.getElementById(id);
        if (!el) return null;

        const chart = Highcharts.chart(id, {
            chart: {
                // animation: false,
                type: "pie",
                custom: {},
                events: {
                    render() {
                        const series = this.series[0];
                        if (!series) return;

                        const total = series.data.reduce((sum, p) => sum + (p.y || 0), 0);
                        const text = `Total<br/><strong>\${Highcharts.numberFormat(total, 0, ".", " ")}</strong>`;

                        let label = this.options.chart.custom.label;
                        if (!label) {
                            label = this.options.chart.custom.label = this.renderer
                                .label(text)
                                .css({ color: "#fff", textAlign: "center" })
                                .add();
                        } else {
                            label.attr({ text });
                        }

                        const bbox = label.getBBox();
                        label.attr({
                            x: series.center[0] + this.plotLeft - bbox.width / 2,
                            y: series.center[1] + this.plotTop - bbox.height / 2,
                        });
                        label.css({ fontSize: series.center[2] / 12 + "px" });

                        reflowChart(this);
                    },
                },
            },
            title: { text: "" },
            tooltip: { pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>" },
            legend: {
                enabled: true,
                itemStyle: { color: "#fff", fontSize: "0.55rem" },
                labelFormatter: function () {
                    return this.name ? this.name.toUpperCase() : "";
                },
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    point: {
                        events: {
                            click: function () {
                                handleDonutClick(id, this.name);
                            },
                        },
                    },
                    dataLabels: {
                        enabled: true,
                        distance: 20,
                        format: "{point.name}<br/>{point.y} ({point.percentage:.2f}%)",
                        style: { fontSize: "0.65rem", color: "#fff", textOutline: "none" },
                    },
                    showInLegend: true,
                },
            },
            series: [{ name: "Count", colorByPoint: true, innerSize: "70%", data: dataUpper }],
        });

        state.chartsList.push(chart);
        return chart;
    };

    const drawColumn = (id, categories, values) => {
        const el = document.getElementById(id);
        if (!el) return null;

        el.innerHTML = "";
        const max = Math.max(...values, 1);
        const yMax = Math.ceil((max * 1.2) / 5) * 5;

        const chart = Highcharts.chart(id, {
            chart: {
                type: "column",
                spacing: [10, 10, 10, 10],
                marginBottom: 80,
                events: {
                    render() {
                        reflowChart(this);
                    },
                },
            },
            title: { text: "" },
            legend: { enabled: false },
            xAxis: {
                categories,
                crosshair: true,
                labels: {
                    useHTML: true,
                    style: {
                        fontSize: "9px",
                        fontWeight: "700",
                        whiteSpace: "nowrap",
                        width: "50px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    },
                    rotation: 75,
                    align: "left",
                },
                lineWidth: 1,
                tickLength: 0,
            },
            yAxis: { min: 0, max: yMax, tickInterval: Math.ceil(yMax / 5), title: { text: "" } },
            tooltip: { enabled: true, pointFormat: "<b>{point.y}</b>" },
            plotOptions: {
                column: {
                    cursor: "pointer",
                    point: {
                        events: {
                            click: function () {
                                handleColumnClick(id, this.category);
                            },
                        },
                    },
                },
            },
            series: [{ name: "Value", data: values, color: "rgba(128, 99, 255, 0.65)" }],
        });

        state.chartsList.push(chart);
        return chart;
    };

    const drawMirror = (id, labels, inspected, rejected) => {
        const el = document.getElementById(id);
        if (!el) return null;

        const maxRej = Math.max(...rejected, 0);
        const yMaxBottom = Math.ceil(maxRej * 1.5);
        const ratio = inspected.map((ins, i) => (ins > 0 ? parseFloat(((rejected[i] / ins) * 100).toFixed(2)) : 0));
        const yMaxLine = Math.ceil(Math.max(...ratio) * 4);

        const chart = Highcharts.chart(id, {
            chart: {
                type: "column",
                events: {
                    load: function () {
                        const legendEl = document.getElementById(`legend-\${id}`);
                        if (!legendEl) return;

                        legendEl.innerHTML = "";
                        this.series.forEach((s) => {
                            const btn = document.createElement("span");
                            btn.textContent = s.name;
                            btn.style.cssText =
                                "display:flex;align-items:center;column-gap:5px;margin:5px;font-size:1rem;color:#fff;";
                            btn.style.textDecoration = s.visible ? "unset" : "line-through";
                            btn.onclick = () => {
                                s.setVisible(!s.visible);
                                btn.style.textDecoration = s.visible ? "unset" : "line-through";
                            };

                            const circle = document.createElement("span");
                            circle.style.cssText = `display:inline-block;width:10px;height:10px;background-color:\${s.visible ? s.color : '#fff'}`;
                            btn.prepend(circle);
                            legendEl.appendChild(btn);
                        });
                    },
                    render: function () {
                        reflowChart(this);
                    },
                },
            },
            title: null,
            xAxis: {
                categories: labels,
                lineWidth: 0,
                tickLength: 5,
                offset: -110,
                labels: { align: "center", y: 0, style: { fontSize: "0.75rem" } },
            },
            yAxis: [
                { title: null, height: "43%", offset: 0, softMax: 600 },
                { title: null, top: "57%", height: "43%", offset: 0, reversed: true, softMax: yMaxBottom },
                {
                    title: null,
                    top: 0,
                    height: "43%",
                    offset: 0,
                    opposite: true,
                    max: yMaxLine,
                    labels: { enabled: false },
                    gridLineWidth: 0,
                },
            ],
            tooltip: { enabled: false },
            legend: { enabled: true, itemStyle: { color: "#fff" } },
            plotOptions: {
                column: {
                    grouping: false,
                    maxPointWidth: 30,
                    dataLabels: { allowOverlap: true, style: { textOutline: "1px contrast" }, rotation: 0 },
                },
            },
            series: [
                { name: "Inspected", color: "#7cffb2", data: inspected, yAxis: 0 },
                {
                    name: "Rejected",
                    color: "#fddd60",
                    data: rejected,
                    yAxis: 1,
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.y < 0.1 ? 0 : this.y;
                        },
                        align: "center",
                    },
                },
                {
                    name: "Ratio (Rejected/Inspected)",
                    type: "line",
                    color: "#38C3FE",
                    data: ratio,
                    yAxis: 2,
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.y + "%";
                        },
                        align: "center",
                    },
                    marker: { enabled: true, radius: 3 },
                },
            ],
        });

        state.chartsList.push(chart);
        return chart;
    };

    const showNoData = (id, msg = "NO DATA") => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = `<div class="no-data">\${msg}</div>`;
    };

    // get data
    const getDonutIQC = async () => {
        const url = buildUrl(API.IQC_MATERIAL, { fromDate: state.dates.from, toDate: state.dates.to });
        const json = await fetchData(url);
        const data = mapData(json?.data, (i) => ({ name: i.materialType || "OTHERS", y: i.totalRecord }));
        return data.sort((a, b) => b.y - a.y);
    };

    const getDonutNCMR = async () => {
        const url = buildUrl(API.NCMR_MATERIAL, { fromDate: state.dates.from, toDate: state.dates.to });
        const json = await fetchData(url);
        const data = mapData(json?.data, (i) => ({ name: i.materialType || "OTHERS", y: i.totalRecord }));
        return data.sort((a, b) => b.y - a.y);
    };

    const getTopReject = async (field) => {
        const url = buildUrl(API.TOP_REJECT, {
            fieldName: field,
            fromDate: state.dates.from,
            toDate: state.dates.to,
            page: 0,
            size: 20,
        });
        const json = await fetchData(url);
        return json?.data || [];
    };

    const getEvent = async () => {
        loader.load();
        try {
            const url = buildUrl(API.EVENT, { fromDate: state.dates.from, toDate: state.dates.to });
            const json = await fetchData(url);
            const r = json?.result;
            if (r) {
                document.querySelector("#be-inspected").textContent = r.toBeInspected;
                document.querySelector("#timeout_inspect").textContent = r.timeOutToBeInspected;
                document.querySelector("#scanned").textContent = r.toBeScanned;
                document.querySelector("#timeout_scan").textContent = r.timeOutTobeScanned;
            }
        } finally {
            loader.unload();
        }
    };

    const getLotReject = async (from, to) => {
        const url = buildUrl(API.LOT_REJECT, { fromDate: from, toDate: to });
        const json = await fetchData(url);
        return json?.result;
    };

    const getDateRange = (type, val) => {
        const start =
            type === "weeks"
                ? moment()
                      .subtract(val - 1, "weeks")
                      .startOf("isoWeek")
                : moment().subtract(val - 1, "days");
        const end = type === "weeks" ? moment().endOf("isoWeek") : moment();
        return { from: fmt(start, "00:00:00"), to: fmt(end, "23:59:59") };
    };

    // load chart
    const loadDonutIQC = async () => {
        loader.load();
        try {
            const data = await getDonutIQC();
            state.dataset.donutIQCData = data;
            if (data.length) drawDonut("donut-chart-1", data);
        } finally {
            loader.unload();
        }
    };

    const loadDonutNCMR = async () => {
        loader.load();
        try {
            const data = await getDonutNCMR();
            state.dataset.donutNCMRData = data;
            if (data.length) drawDonut("donut-chart-2", data);
        } finally {
            loader.unload();
        }
    };

    const loadMaterialChart = async () => {
        loader.load();
        try {
            const data = await getTopReject("MaterialType");
            if (!data.length) return showNoData("col-chart-3");

            const top = data.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
            drawColumn(
                "col-chart-3",
                top.map((i) => i.materialType || "N/A"),
                top.map((i) => i.numberRecord || 0)
            );
        } finally {
            loader.unload();
        }
    };

    const loadMFRChart = async () => {
        const data = await getTopReject("MFR");
        if (!data.length) return showNoData("col-chart-4");

        const top = data.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
        drawColumn(
            "col-chart-4",
            top.map((i) => `\${i.mfrcode || "N/A"}-\${i.mfrname || "N/A"}`),
            top.map((i) => i.numberRecord || 0)
        );
    };

    const loadModelChart = async () => {
        loader.load();
        try {
            const data = await getTopReject("Model");
            if (!data.length) return showNoData("col-chart-5");

            const top = data.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
            drawColumn(
                "col-chart-5",
                top.map((i) => i.model || "N/A"),
                top.map((i) => i.numberRecord || 0)
            );
        } finally {
            loader.unload();
        }
    };

    const loadLotInject = async () => {
        const sl = document.getElementById("sl-time")?.value || "today";
        const range = getDateRange(sl === "7" || sl === "30" ? "days" : null, sl === "7" ? 7 : sl === "30" ? 30 : 1);
        const r = await getLotReject(range.from, range.to);
        if (r) {
            document.querySelector("#inspected").textContent = r.inspectedTotal;
            document.querySelector("#lot-rejected").textContent = r.lotRejectedTotal;
            document.querySelector("#lrr").textContent = `\${r.lotRejectedRate}%`;
        }
    };

    const loadWeeklyChart = async () => {
        const range = getDateRange("weeks", 8);
        const r = await getLotReject(range.from, range.to);
        if (!r) return;

        const labels = [],
            inspected = [],
            rejected = [];
        r.data.forEach((w) => {
            labels.push(`W\${w.weekNumber}`);
            inspected.push(w.inspectedTotal || 0);
            rejected.push(w.lotRejectedTotal || 0);
        });
        drawMirror("col-chart-1", labels, inspected, rejected);
    };

    const loadDailyChart = async () => {
        loader.load();
        try {
            const range = getDateRange("days", 7);
            const r = await getLotReject(range.from, range.to);
            if (!r) return;

            const labels = [],
                inspected = [],
                rejected = [];
            r.data.forEach((w) => {
                w.data.forEach((d) => {
                    labels.push(d.workDate.split("-").slice(1).join("-"));
                    inspected.push(d.inspectedTotal || 0);
                    rejected.push(d.lotRejectedTotal || 0);
                });
            });
            drawMirror("col-chart-2", labels, inspected, rejected);
        } finally {
            loader.unload();
        }
    };

    const loadAllCharts = () =>
        Promise.all([
            loadMaterialChart(),
            loadMFRChart(),
            loadModelChart(),
            renderTable1(),
            renderTable2(),
            renderTable3(),
        ]);

    // event handler
    const handleDonutClick = (id, name) => {
        if (id === "donut-chart-1") {
            const f = state.filters.donut;
            f.materialTypeIQC = f.materialTypeIQC === name ? null : name;
            f.iqcStatus = f.materialTypeIQC ? 0 : 1;
            updateBadge("table-5");
            renderTable5();
        } else if (id === "donut-chart-2") {
            const f = state.filters.donut;
            f.materialTypeNCMR = f.materialTypeNCMR === name ? null : name;
            updateBadge("table-4", f.materialTypeNCMR);
            renderTable4();
        }
    };

    const handleColumnClick = (id, cat) => {
        const clean = typeof cat === "string" ? cat.replace(/<[^>]*>/g, "").trim() : String(cat || "N/A");
        const map = { "col-chart-3": "table-1", "col-chart-4": "table-2", "col-chart-5": "table-3" };
        const tbl = map[id];
        if (!tbl) return;

        const f = state.filters.lot;
        f[tbl] = f[tbl] === clean ? null : clean;
        updateBadge(tbl);

        if (tbl === "table-1") renderTable1();
        else if (tbl === "table-2") renderTable2();
        else if (tbl === "table-3") renderTable3();
    };

    // badge & title
    const createBadge = (text, onClose, isStatus = false, onChange = null, currentValue = null, isNCMR = false) => {
        const badge = document.createElement("span");
        badge.className = "filter-badge";
        badge.style.cssText = "display:inline-flex;align-items:center;gap:0.3rem;cursor:default;";

        if (Array.isArray(onChange)) {
            const sel = document.createElement("select");
            sel.className = "customBadge";
            onChange.forEach((mat) => {
                const opt = document.createElement("option");
                opt.value = mat;
                opt.textContent = mat;
                if (mat === currentValue) opt.selected = true;
                sel.appendChild(opt);
            });
            sel.onchange = (e) => {
                e.stopPropagation();
                if (isNCMR) {
                    state.filters.donut.materialTypeNCMR = e.target.value;
                    renderTable4();
                    updateBadge("table-4");
                } else {
                    state.filters.donut.materialTypeIQC = e.target.value;
                    renderTable5();
                    updateBadge("table-5");
                }
            };
            badge.appendChild(sel);
        } else if (isStatus && onChange) {
            const sel = document.createElement("select");
            sel.className = "customBadge";

            const allOpt = document.createElement("option");
            allOpt.value = "1";
            allOpt.textContent = IQC_STATUS_MAP[1];
            if (state.filters.donut.iqcStatus === 1) allOpt.selected = true;
            sel.appendChild(allOpt);

            Object.entries(IQC_STATUS_MAP).forEach(([v, l]) => {
                if (v !== "1") {
                    const opt = document.createElement("option");
                    opt.value = v;
                    opt.textContent = l;
                    if (parseInt(v) === state.filters.donut.iqcStatus) opt.selected = true;
                    sel.appendChild(opt);
                }
            });
            sel.onchange = (e) => {
                e.stopPropagation();
                onChange(parseInt(e.target.value));
            };
            badge.appendChild(sel);
        } else {
            const span = document.createElement("span");
            span.textContent = text;
            badge.appendChild(span);
        }

        const close = document.createElement("span");
        close.innerHTML = "<i class='bi bi-x'></i>";
        close.style.cssText = "font-size:1rem;font-weight:normal;line-height:1.1;cursor:pointer;";
        close.onclick = (e) => {
            e.stopPropagation();
            onClose();
        };
        badge.appendChild(close);

        return badge;
    };

    const updateBadge = (tblId, filterVal) => {
        const el = document.getElementById(tblId);
        if (!el) return;

        const title = el.closest(".component-item")?.querySelector(".component-title");
        if (!title) return;

        if (tblId === "table-4" || tblId === "table-5") {
            title.classList.add("title-with-badges");
        }

        if (!title.dataset.originalTitle) {
            const text = title.textContent.trim();
            title.dataset.originalTitle = text.replace(/\s*\(.*?\)\s*$/, "").trim();
        }

        title.querySelectorAll(".filter-badge").forEach((b) => b.remove());

        const timeRange = getTimeRangeText();
        title.innerHTML =
            title.innerHTML = `<span>\${title.dataset.originalTitle} <span style="font-size: 0.85rem; color: #fff; font-weight: 500;">\${timeRange}</span></span>`;

        if (tblId === "table-5") {
            const f = state.filters.donut;
            if (f.materialTypeIQC) {
                const materialTypes = [...new Set(state.dataset.donutIQCData?.map((i) => i.name) || [])];

                const badge = createBadge(
                    null,
                    () => {
                        f.materialTypeIQC = null;
                        f.iqcStatus = 1;
                        renderTable5();
                        updateBadge("table-5");
                    },
                    false,
                    materialTypes,
                    f.materialTypeIQC
                );
                title.appendChild(badge);
            }

            if (f.iqcStatus !== null && f.iqcStatus !== undefined) {
                const badge = createBadge(
                    null,
                    () => {
                        f.iqcStatus = 1;
                        f.materialTypeIQC = null;
                        renderTable5();
                        updateBadge("table-5");
                    },
                    true,
                    (val) => {
                        f.iqcStatus = val;
                        renderTable5();
                        updateBadge("table-5");
                    }
                );
                title.appendChild(badge);
            }

            updateExportBtn();
        } else if (tblId === "table-4") {
            const f = state.filters.donut;
            if (f.materialTypeNCMR) {
                const materialTypes = [...new Set(state.dataset.donutNCMRData?.map((i) => i.name) || [])];

                const badge = createBadge(
                    null,
                    () => {
                        f.materialTypeNCMR = null;
                        renderTable4();
                        updateBadge("table-4");
                    },
                    false,
                    materialTypes,
                    f.materialTypeNCMR,
                    true
                );
                title.appendChild(badge);
            }
        } else {
            const filter = filterVal !== undefined ? filterVal : state.filters.lot[tblId];
            if (filter) {
                const badge = createBadge(filter, () => {
                    state.filters.lot[tblId] = null;
                    if (tblId === "table-1") renderTable1();
                    else if (tblId === "table-2") renderTable2();
                    else if (tblId === "table-3") renderTable3();
                    updateBadge(tblId);
                });
                title.appendChild(badge);
            }
        }
    };

    const updateExportBtn = () => {
        const btn = document.getElementById("export-table5-btn");
        if (!btn) return;

        if (state.filters.donut.iqcStatus === 1) {
            btn.disabled = true;
            btn.title = "Cannot export when status is ALL. Please select a specific status.";
            btn.style.cssText = "opacity:0.5;cursor:not-allowed;";
        } else {
            btn.disabled = false;
            btn.title = "Download Excel";
            btn.style.cssText = "opacity:1;cursor:pointer;";
        }
    };

    const updateAllTitles = () => {
        const timeRange = getTimeRangeText();

        // Update chart titles
        const chartTitles = {
            "col-chart-3": "Lot Rejected By Material Type",
            "col-chart-4": "Top Lot Rejected By MFR",
            "col-chart-5": "Top Lot Rejected By Models",
            "donut-chart-1": "To be Inspected Distribution by Material Type",
            "donut-chart-2": "NCMR Status",
        };

        Object.entries(chartTitles).forEach(([chartId, baseTitle]) => {
            const chartEl = document.getElementById(chartId);
            if (chartEl) {
                const titleEl = chartEl.closest(".component-item")?.querySelector(".component-title");
                if (titleEl) {
                    if (!titleEl.dataset.originalTitle) {
                        titleEl.dataset.originalTitle = baseTitle;
                    }

                    const badges = titleEl.querySelectorAll(".filter-badge");
                    const badgesHTML = Array.from(badges)
                        .map((b) => b.outerHTML)
                        .join("");

                    titleEl.innerHTML = `<span>\${titleEl.dataset.originalTitle} <span style="font-size: 0.85rem; color: #fff; font-weight: 500;">\${timeRange}</span></span>\${badgesHTML}`;
                }
            }
        });

        const tableTitles = {
            "table-4": "NCMR List",
            "table-5": "Inspection List",
        };

        Object.entries(tableTitles).forEach(([tableId, baseTitle]) => {
            const tableEl = document.getElementById(tableId);
            if (tableEl) {
                const titleEl = tableEl.closest(".component-item")?.querySelector(".component-title");
                if (titleEl) {
                    if (!titleEl.dataset.originalTitle) {
                        titleEl.dataset.originalTitle = baseTitle;
                    }

                    const badges = titleEl.querySelectorAll(".filter-badge");
                    const badgesHTML = Array.from(badges)
                        .map((b) => b.outerHTML)
                        .join("");

                    titleEl.innerHTML = `<span>\${titleEl.dataset.originalTitle} <span style="font-size: 0.85rem; color: #fff; font-weight: 500;">\${timeRange}</span></span>\${badgesHTML}`;
                }
            }
        });
    };

    // table render
    const createTable = (id, config, urlBuilder, dataFormatter, rowBuilder) => {
        const el = document.getElementById(id);
        if (!el) return;

        el.querySelector("thead").innerHTML = "";
        el.querySelector("tbody").innerHTML = "";

        const key = id.replace("-", "");
        if (state.tables[key]) state.tables[key].destroy();

        state.tables[key] = new DataTableLib({
            tableId: id,
            serverSide: true,
            rows: config.rows || 9999,
            pagination: config.pagination !== false,
            paginationId: config.paginationId || null,
            emptyMessage: "NO DATA",
            sort: false,
            buildUrl: urlBuilder,
            formatData: dataFormatter,
            columnsConfig: config.columns.map((c) => ({ label: c.label })),
            rowRenderer: rowBuilder,
        });

        return state.tables[key].init();
    };

    const renderTable1 = () =>
        createTable(
            "table-1",
            { columns: TABLE_CONFIGS.table1, pagination: false },
            () =>
                buildUrl(API.TOP_REJECT, {
                    fieldName: "MaterialTypeAndMFR",
                    fromDate: state.dates.from,
                    toDate: state.dates.to,
                    page: 0,
                    size: 9999,
                }),
            (res) => {
                let data = res?.data || [];
                state.dataset.table1Data = data;
                const f = state.filters.lot["table-1"];
                if (f) data = data.filter((r) => (r[TABLE_CONFIGS.table1[0].key] || "N/A").trim() === f);
                res.total = data.length;
                return data;
            },
            (item) =>
                !item
                    ? `<td colspan="\${TABLE_CONFIGS.table1.length}" style="text-align:center">NO DATA</td>`
                    : TABLE_CONFIGS.table1.map((c) => `<td>\${item[c.key] ?? "-"}</td>`).join("")
        );

    const renderTable2 = () =>
        createTable(
            "table-2",
            { columns: TABLE_CONFIGS.table2, pagination: false },
            () =>
                buildUrl(API.TOP_REJECT, {
                    fieldName: "MFR",
                    fromDate: state.dates.from,
                    toDate: state.dates.to,
                    page: 0,
                    size: 9999,
                }),
            (res) => {
                let data = res?.data || [];
                state.dataset.table2Data = data;
                const f = state.filters.lot["table-2"];
                if (f) data = data.filter((r) => (r[TABLE_CONFIGS.table2[0].key] || "N/A").trim() === f);
                res.total = data.length;
                return data;
            },
            (item) =>
                !item
                    ? `<td colspan="\${TABLE_CONFIGS.table2.length}" style="text-align:center">NO DATA</td>`
                    : TABLE_CONFIGS.table2.map((c) => `<td>\${item[c.key] ?? "-"}</td>`).join("")
        );

    const renderTable3 = () =>
        createTable(
            "table-3",
            { columns: TABLE_CONFIGS.table3, pagination: false },
            () =>
                buildUrl(API.TOP_REJECT, {
                    fieldName: "ModelAndMFR",
                    fromDate: state.dates.from,
                    toDate: state.dates.to,
                    page: 0,
                    size: 9999,
                }),
            (res) => {
                let data = res?.data || [];
                state.dataset.table3Data = data;
                const f = state.filters.lot["table-3"];
                if (f) data = data.filter((r) => (r[TABLE_CONFIGS.table3[0].key] || "N/A").trim() === f);
                res.total = data.length;
                return data;
            },
            (item) =>
                !item
                    ? `<td colspan="\${TABLE_CONFIGS.table3.length}" style="text-align:center">NO DATA</td>`
                    : TABLE_CONFIGS.table3.map((c) => `<td>\${item[c.key] ?? "-"}</td>`).join("")
        );

    const renderTable4 = async () => {
        loader.load();
        try {
            const el = document.getElementById("table-4");
            if (!el) return;

            let pag = document.getElementById("pagination-table-4");
            if (!pag) {
                pag = document.createElement("div");
                pag.id = "pagination-table-4";
                pag.style.marginTop = "0.4rem";
                el.closest(".component-item")?.appendChild(pag);
            }

            return createTable(
                "table-4",
                { columns: TABLE_CONFIGS.table4, rows: 10, paginationId: "pagination-table-4" },
                (page) => {
                    const p = { page: page - 1, size: 10, fromDate: state.dates.from, toDate: state.dates.to };
                    if (state.filters.donut.materialTypeNCMR) p.materialType = state.filters.donut.materialTypeNCMR;
                    return buildUrl(API.NCMR, p);
                },
                (res) => {
                    res.total = res?.size || 0;
                    return res?.data || [];
                },
                (item, idx, meta) => {
                    if (!item)
                        return `<td colspan="\${TABLE_CONFIGS.table4.length}" style="text-align:center">NO DATA</td>`;
                    const stt = ((meta?.currentPage || 1) - 1) * 10 + idx + 1;
                    return [
                        `<td>\${stt}</td>`,
                        ...TABLE_CONFIGS.table4.slice(1).map((c) => {
                            const val = item[c.key] ?? "-";
                            return c.key === "rejectReason" || c.key === "improvementAction"
                                ? `<td style="max-width:200px;word-wrap:break-word;white-space:normal;">\${val}</td>`
                                : `<td>\${val}</td>`;
                        }),
                    ].join("");
                }
            );
        } finally {
            updateBadge("table-4");
            loader.unload();
        }
    };

    const renderTable5 = async () => {
        loader.load();
        try {
            const el = document.getElementById("table-5");
            if (!el) return;

            let pag = document.getElementById("pagination-table-5");
            if (!pag) {
                pag = document.createElement("div");
                pag.id = "pagination-table-5";
                pag.style.marginTop = "0.4rem";
                el.closest(".component-item")?.appendChild(pag);
            }

            return createTable(
                "table-5",
                { columns: TABLE_CONFIGS.table5, rows: 50, paginationId: "pagination-table-5" },
                (page) => {
                    const p = { page: page - 1, size: 50, fromDate: state.dates.from, toDate: state.dates.to };
                    const f = state.filters.donut;
                    if (f.materialTypeIQC) p.materialType = f.materialTypeIQC;
                    if (f.iqcStatus !== null && f.iqcStatus !== undefined) p.iqcStatus = f.iqcStatus;
                    return buildUrl(API.IQC_LOT, p);
                },
                (res) => {
                    res.total = res?.size || 0;
                    state.dataset.table5Data = res?.data || [];
                    return res?.data || [];
                },
                (item, idx, meta) => {
                    if (!item)
                        return `<td colspan="\${TABLE_CONFIGS.table5.length}" style="text-align:center">NO DATA</td>`;
                    const stt = ((meta?.currentPage || 1) - 1) * 50 + idx + 1;
                    return [
                        `<td>\${stt}</td>`,
                        ...TABLE_CONFIGS.table5.slice(1).map((c) => `<td>\${item[c.key] ?? "-"}</td>`),
                    ].join("");
                }
            );
        } finally {
            loader.unload();
        }
    };

    // export excel
    const exportTable = async (num, name) => {
        loader.load();
        try {
            const api = num === 5 ? API.IQC_EXPORT : API.NCMR_EXPORT;
            const p = { page: 0, size: 40000, fromDate: state.dates.from, toDate: state.dates.to };

            if (num === 5) {
                const f = state.filters.donut;
                if (f.materialTypeIQC) p.materialType = f.materialTypeIQC;
                if (f.iqcStatus !== null && f.iqcStatus !== undefined) p.iqcStatus = f.iqcStatus;
            } else if (num === 4 && state.filters.donut.materialTypeNCMR) {
                p.materialType = state.filters.donut.materialTypeNCMR;
            }

            const btnId = num === 5 ? "export-table5-btn" : "export-table4-btn";
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Exporting...';
            }

            const res = await fetch(buildUrl(api, p), {
                headers: { Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
            });
            if (!res.ok) throw new Error(`HTTP \${res.status}`);

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `\${name}_\${Date.now()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 100);
        } catch (err) {
            console.error("Export failed:", err);
            alert(`Failed to export: \${err.message}`);
        } finally {
            loader.unload();
            const btnId = num === 5 ? "export-table5-btn" : "export-table4-btn";
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="bi bi-download"></i> Export';
            }
        }
    };

    const setupExport = () => {
        const btn5 = document.getElementById("export-table5-btn");
        const btn4 = document.getElementById("export-table4-btn");
        if (btn5)
            btn5.addEventListener("click", () => {
                if (state.filters.donut.iqcStatus === 1)
                    return alert("Cannot export when status is ALL. Please select a specific status.");
                exportTable(5, "IqcReport");
            });
        if (btn4) btn4.addEventListener("click", () => exportTable(4, "NcmrReport"));
    };

    // daterangepicker
    const setupDatePicker = () => {
        const sel = document.getElementById("sl-time-chart");
        const picker = $("#daterangepicker-chart");

        picker.daterangepicker({
            opens: "left",
            autoUpdateInput: false,
            locale: { cancelLabel: "Clear", applyLabel: "Apply", format: "YYYY/MM/DD" },
            startDate: moment().subtract(29, "days"),
            endDate: moment(),
        });

        picker.on("apply.daterangepicker", async (ev, p) => {
            state.dates.from = fmt(p.startDate, "00:00:00");
            state.dates.to = fmt(p.endDate, "23:59:59");
            picker.val(fmt(p.startDate, "") + " - " + fmt(p.endDate, ""));

            updateAllTitles();

            await loadDonutIQC();
            await loadDonutNCMR();
            await loadAllCharts();
            await getEvent();
            await renderTable4();
            updateBadge("table-4");
            await renderTable5();
            updateBadge("table-5");
        });

        picker.on("cancel.daterangepicker", async () => {
            picker.val("").hide();
            sel.value = "30";
            updateDates("30");

            updateAllTitles();

            await loadDonutIQC();
            await loadDonutNCMR();
            await loadAllCharts();
            await getEvent();
            await renderTable4();
            updateBadge("table-4");
            await renderTable5();
            updateBadge("table-5");
        });

        sel.addEventListener("change", async function () {
            const val = this.value;
            const pickerEl = document.getElementById("daterangepicker-chart");

            if (val === "custom") {
                pickerEl.style.display = "inline-block";
                $(pickerEl).data("daterangepicker").show();
            } else {
                pickerEl.style.display = "none";
                pickerEl.value = "";
                updateDates(val);

                updateAllTitles();

                loadDonutIQC();
                loadDonutNCMR();
                loadAllCharts();
                getEvent();
                renderTable4().then(() => updateBadge("table-4"));
                renderTable5().then(() => updateBadge("table-5"));
            }
        });

        const slTime = document.getElementById("sl-time");
        if (slTime) {
            if (!slTime.value) slTime.selectedIndex = 0;
            slTime.addEventListener("change", loadLotInject);
        }
    };

    const getTimeRangeText = () => {
        if (!state.dates.from || !state.dates.to) return "";

        const from = moment(state.dates.from, "YYYY/MM/DD HH:mm:ss");
        const to = moment(state.dates.to, "YYYY/MM/DD HH:mm:ss");

        if (from.format("YYYY/MM/DD") === to.format("YYYY/MM/DD")) {
            return `(\${from.format("YYYY/MM/DD")})`;
        }

        return `(\${from.format("YYYY/MM/DD")} - \${to.format("YYYY/MM/DD")})`;
    };

    // init
    const init = async () => {
        loader.load();
        try {
            initHighcharts();

            const sel = document.getElementById("sl-time-chart");
            if (!sel.value) sel.selectedIndex = 2;

            updateDates(sel.value || "30");
            updateAllTitles();
            await loadDonutIQC();
            await loadDonutNCMR();
            await loadAllCharts();
            await getEvent();
            await renderTable4();
            await renderTable5();
            updateBadge("table-5");
            setupExport();
            updateExportBtn();
            setupDatePicker();
        } finally {
            loader.unload();
        }
    };

    const loadAll = async () => {
        await getEvent();
        await loadLotInject();
        await loadWeeklyChart();
        await loadDailyChart();
    };

    ready(async () => {
        await init();
        await loadAll();
    });
</script>
