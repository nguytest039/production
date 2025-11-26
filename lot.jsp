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
        const dataset = {};
        const chartsList = [];
        const donutFilters = {
            materialTypeIQC: null,
            materialTypeNCMR: null,
            iqcStatus: 1,
        };
        const IQC_STATUS_MAP = {
            0: "TO BE INSPECTED",
            1: "ALL",
            2: "REJECTED",
            // 3: "PASS",
            // 4: "PASS OR FAIL",
        };
        const lotTableFilters = {
            "table-1": null,
            "table-2": null,
            "table-3": null,
        };
        const API_TOP_REJECT = "/production-system/api/iqc/top-reject";
        let table1Instance = null;
        let table2Instance = null;
        let table3Instance = null;
        let table4Instance = null;
        let table5Instance = null;

        function applyScaleToChart(chart) {
            if (!chart) return;
            chart.reflow();
        }

        window.addEventListener("resize", () => {
            chartsList.forEach((chart) => applyScaleToChart(chart));
        });

        let fromDate = null;
        let toDate = null;

        const selectElement = document.getElementById("sl-time-chart");

        function getFormattedDate(date, time) {
            return date.format(`YYYY/MM/DD \${time}`);
        }

        function updateDates(selectedOption) {
            if (selectedOption === "today") {
                fromDate = getFormattedDate(moment(), "00:00:00");
                toDate = getFormattedDate(moment(), "23:59:59");
            } else if (selectedOption === "7") {
                fromDate = getFormattedDate(moment().subtract(6, "days"), "00:00:00");
                toDate = getFormattedDate(moment(), "23:59:59");
            } else if (selectedOption === "30") {
                fromDate = getFormattedDate(moment().subtract(29, "days"), "00:00:00");
                toDate = getFormattedDate(moment(), "23:59:59");
            } else if (selectedOption === "custom") {
            }
        }

        async function getDataDonutIQC() {
            try {
                const res = await fetch(
                    `/production-system/api/iqc/iqc-material-type?fromDate=\${fromDate}&toDate=\${toDate}`
                );
                if (!res.ok) throw new Error(`HTTP status \${res.status}`);

                const json = await res.json();

                const data = json.data;
                if (!data || !data.length) return [];

                return data.map((i) => ({
                    name: i.materialType == null ? "Others" : i.materialType,
                    y: i.totalRecord,
                }));
            } catch (error) {
                console.error("Fetch error:", error);
                return [];
            }
        }

        async function getDataDonutNCMR() {
            try {
                const res = await fetch(
                    `/production-system/api/iqc/ncmr-material-type?fromDate=\${fromDate}&toDate=\${toDate}`
                );
                if (!res.ok) throw new Error(`HTTP status \${res.status}`);

                const json = await res.json();

                const data = json.data;
                if (!data || !data.length) return [];

                return data.map((i) => ({
                    name: i.materialType == null ? "Others" : i.materialType,
                    y: i.totalRecord,
                }));
            } catch (error) {
                console.error("Fetch error:", error);
                return [];
            }
        }

        const highchartsInit = () => {
            Highcharts.setOptions({
                chart: {
                    backgroundColor: "transparent",
                    spacing: [10, 5, 5, 5],
                },

                xAxis: {
                    gridLineWidth: 1,
                    gridLineColor: "#313f62",
                    gridLineDashStyle: "Dash",
                    lineWidth: 1,
                    lineColor: "#313f62",
                    lineDashStyle: "ShortDash",
                    labels: {
                        style: {
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#7a95c3",
                        },
                    },
                },

                yAxis: {
                    gridLineWidth: 1,
                    gridLineColor: "#313f62",
                    gridLineDashStyle: "Dash",
                    labels: {
                        style: {
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#7a95c3",
                        },
                    },
                },

                tooltip: {
                    outside: true,
                    style: {
                        fontSize: "1rem",
                    },
                },

                credits: {
                    enabled: false,
                },

                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                color: "#fff",
                                textOutline: 0,
                                fontWeight: "normal",
                                fontSize: "0.7rem",
                            },
                        },
                    },
                },
            });
        };

        function drawDonutChart(containerId, chartData) {
            const container = document.getElementById(containerId);
            if (!container) {
                return null;
            }

            const chart = Highcharts.chart(containerId, {
                chart: {
                    type: "pie",
                    custom: {},
                    events: {
                        render() {
                            const chart = this;
                            const series = chart.series[0];
                            if (!series) return;

                            const total = series.data.reduce(
                                (sum, point) => sum + (typeof point.y === "number" ? point.y : 0),
                                0
                            );

                            let customLabel = chart.options.chart.custom.label;
                            const labelText =
                                "Total<br/><strong>" + Highcharts.numberFormat(total, 0, ".", " ") + "</strong>";

                            if (!customLabel) {
                                customLabel = chart.options.chart.custom.label = chart.renderer
                                    .label(labelText)
                                    .css({
                                        color: "#fff",
                                        textAlign: "center",
                                    })
                                    .add();
                            } else {
                                customLabel.attr({
                                    text: labelText,
                                });
                            }

                            const bbox = customLabel.getBBox();
                            const x = series.center[0] + chart.plotLeft - bbox.width / 2;
                            const y = series.center[1] + chart.plotTop - bbox.height / 2;

                            customLabel.attr({ x, y });
                            customLabel.css({
                                fontSize: series.center && series.center[2] ? series.center[2] / 12 + "px" : "1.2rem",
                            });

                            applyScaleToChart(chart);
                        },
                    },
                },
                title: { text: "" },
                tooltip: { pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>" },
                legend: { enabled: true, itemStyle: { color: "#fff", fontSize: "0.55rem" } },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: "pointer",
                        point: {
                            events: {
                                click: function () {
                                    handleDonutClick(containerId, this.name);
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
                series: [
                    {
                        name: "Count",
                        colorByPoint: true,
                        innerSize: "70%",
                        data: chartData,
                    },
                ],
            });

            chartsList.push(chart);
            return chart;
        }

        async function loadDonutIQC() {
            const chartData = await getDataDonutIQC();
            if (!chartData.length) return;

            drawDonutChart("donut-chart-1", chartData);
        }

        async function loadDonutNCMR() {
            const chartData = await getDataDonutNCMR();
            if (!chartData.length) return;

            drawDonutChart("donut-chart-2", chartData);
        }

        async function fetchTopReject(fieldName) {
            try {
                const params = new URLSearchParams({
                    fieldName,
                    fromDate,
                    toDate,
                    page: 0,
                    size: 20,
                });
                const res = await fetch(`\${API_TOP_REJECT}?\${params}`);
                if (!res.ok) throw new Error(`HTTP \${res.status}`);

                const json = await res.json();
                return json.data || [];
            } catch (err) {
                console.error(`fetchTopReject \${fieldName}:`, err);
                return [];
            }
        }

        function drawColumnChart(containerId, categories, values) {
            const container = document.getElementById(containerId);
            if (!container) {
                return null;
            }

            container.innerHTML = "";

            const maxVal = Math.max(...values, 1);
            const yMax = Math.ceil((maxVal * 1.2) / 5) * 5;

            const chart = Highcharts.chart(containerId, {
                chart: {
                    type: "column",
                    spacing: [10, 10, 10, 10],
                    marginBottom: 80,
                    events: {
                        render() {
                            applyScaleToChart(this);
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
                            // lineHeight: "1rem",
                        },
                        rotation: 75,
                        align: "left",
                    },
                    lineWidth: 1,
                    tickLength: 0,
                },
                yAxis: {
                    min: 0,
                    max: yMax,
                    tickInterval: Math.ceil(yMax / 5),
                    title: { text: "" },
                },
                tooltip: { enabled: true, pointFormat: "<b>{point.y}</b>" },
                plotOptions: {
                    column: {
                        cursor: "pointer",
                        point: {
                            events: {
                                click: function () {
                                    handleColumnClick(containerId, this.category);
                                },
                            },
                        },
                    },
                },
                series: [
                    {
                        name: "Value",
                        data: values,
                        color: "rgba(128, 99, 255, 0.65)",
                    },
                ],
            });

            chartsList.push(chart);
            return chart;
        }

        function showNoData(containerId, message = "NO DATA") {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = "";
            const el = document.createElement("div");
            el.className = "no-data";
            el.textContent = message;
            container.appendChild(el);
        }

        const TABLE1_COLUMNS = [
            { key: "materialType", label: "Material Type" },
            { key: "mfrcode", label: "MFR Code" },
            { key: "mfrname", label: "MFR Name" },
            { key: "numberRecord", label: "Reject Qty" },
            // { key: "model", label: "Model" },
        ];

        const TABLE2_COLUMNS = [
            { key: "mfrcode", label: "MFR Code" },
            { key: "mfrname", label: "MFR Name" },
            { key: "numberRecord", label: "Reject Qty" },
            // { key: "model", label: "Model" },
            // { key: "materialType", label: "Material Type" },
        ];

        const TABLE3_COLUMNS = [
            { key: "model", label: "Model" },
            { key: "mfrcode", label: "MFR Code" },
            { key: "mfrname", label: "MFR Name" },
            { key: "numberRecord", label: "Reject Qty" },
            // { key: "materialType", label: "Material Type" },
        ];

        const TABLE4_COLUMNS = [
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
        ];

        const TABLE5_COLUMNS = [
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
        ];

        function handleDonutClick(containerId, materialType) {
            if (containerId === "donut-chart-1") {
                donutFilters.materialTypeIQC = donutFilters.materialTypeIQC === materialType ? null : materialType;

                if (donutFilters.materialTypeIQC !== null) {
                    donutFilters.iqcStatus = 0;
                } else {
                    donutFilters.iqcStatus = 1;
                }

                updateTableTitleBadge("table-5");
                renderTable5();

                // const table5 = document.getElementById("table-5");
                // if (table5) {
                //     setTimeout(() => {
                //         table5.closest(".component-item").scrollIntoView({
                //             behavior: "smooth",
                //             block: "start",
                //         });
                //     }, 100);
                // }
            } else if (containerId === "donut-chart-2") {
                donutFilters.materialTypeNCMR = donutFilters.materialTypeNCMR === materialType ? null : materialType;
                updateTableTitleBadge("table-4", donutFilters.materialTypeNCMR);
                renderTable4();
            }
        }

        function handleColumnClick(containerId, category) {
            const cleanCategory =
                typeof category === "string" ? category.replace(/<[^>]*>/g, "").trim() : String(category || "N/A");

            if (containerId === "col-chart-3") {
                const tableId = "table-1";
                const filterKey = TABLE1_COLUMNS[0].key; // "materialType"

                if (lotTableFilters[tableId] === cleanCategory) {
                    lotTableFilters[tableId] = null;
                } else {
                    lotTableFilters[tableId] = cleanCategory;
                }
                updateTableTitleBadge(tableId);
                renderTable1();
            } else if (containerId === "col-chart-4") {
                const tableId = "table-2";
                const filterKey = TABLE2_COLUMNS[0].key; // "mfrcode"

                if (lotTableFilters[tableId] === cleanCategory) {
                    lotTableFilters[tableId] = null;
                } else {
                    lotTableFilters[tableId] = cleanCategory;
                }
                updateTableTitleBadge(tableId);
                renderTable2();
            } else if (containerId === "col-chart-5") {
                const tableId = "table-3";
                const filterKey = TABLE3_COLUMNS[0].key; // "model"

                if (lotTableFilters[tableId] === cleanCategory) {
                    lotTableFilters[tableId] = null;
                } else {
                    lotTableFilters[tableId] = cleanCategory;
                }
                updateTableTitleBadge(tableId);
                renderTable3();
            }
        }

        function createFilterBadge(text, onClose, isStatusBadge = false, onStatusChange = null) {
            const badge = document.createElement("span");
            badge.className = "filter-badge";
            badge.style.display = "inline-flex";
            badge.style.alignItems = "center";
            badge.style.gap = "0.3rem";
            badge.style.cursor = "default";

            // If it's a status badge, create a select dropdown
            if (isStatusBadge && onStatusChange) {
                const select = document.createElement("select");
                select.style.backgroundColor = "transparent";
                select.style.color = "white";
                select.style.border = "none";
                select.style.outline = "none";
                select.style.cursor = "pointer";
                select.style.fontSize = "0.7rem";
                select.style.fontWeight = "bold";
                select.style.padding = "0";

                // Add options
                Object.entries(IQC_STATUS_MAP).forEach(([value, label]) => {
                    const option = document.createElement("option");
                    option.value = value;
                    option.textContent = label;
                    if (parseInt(value) === donutFilters.iqcStatus) {
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
            closeBtn.style.fontSize = "1rem";
            closeBtn.style.fontWeight = "normal";
            closeBtn.style.lineHeight = "1.1";
            closeBtn.style.cursor = "pointer";

            closeBtn.onclick = (e) => {
                e.stopPropagation();
                onClose();
            };

            badge.appendChild(closeBtn);

            return badge;
        }

        function updateTableTitleBadge(tableId, filterValue) {
            const tableElement = document.getElementById(tableId);
            if (!tableElement) return;

            const titleElement = tableElement.closest(".component-item").querySelector(".component-title");
            if (!titleElement) return;

            const existingBadges = titleElement.querySelectorAll(".filter-badge");
            existingBadges.forEach((badge) => badge.remove());

            if (tableId === "table-5") {
                // Material Type Badge
                if (donutFilters.materialTypeIQC) {
                    const materialBadge = createFilterBadge(donutFilters.materialTypeIQC, () => {
                        donutFilters.materialTypeIQC = null;
                        donutFilters.iqcStatus = 1;
                        renderTable5();
                        updateTableTitleBadge("table-5");
                    });
                    titleElement.appendChild(materialBadge);
                }

                // ✓ LUÔN hiển thị IQC Status Badge (kể cả ALL)
                if (donutFilters.iqcStatus !== null && donutFilters.iqcStatus !== undefined) {
                    const statusBadge = createFilterBadge(
                        null,
                        () => {
                            // ✓ Khi nhấn X, reset về ALL
                            donutFilters.iqcStatus = 1;
                            donutFilters.materialTypeIQC = null;
                            renderTable5();
                            updateTableTitleBadge("table-5");
                        },
                        true, // isStatusBadge
                        (newStatus) => {
                            // When status changes from select
                            donutFilters.iqcStatus = newStatus;
                            renderTable5();
                            updateTableTitleBadge("table-5");
                        }
                    );
                    titleElement.appendChild(statusBadge);
                }

                // ✓ Update export button state
                updateExportButtonState();
            } else {
                const filter = filterValue !== undefined ? filterValue : lotTableFilters[tableId];

                if (filter) {
                    const badge = createFilterBadge(filter, () => {
                        if (tableId === "table-4") {
                            donutFilters.materialTypeNCMR = null;
                            renderTable4();
                        } else {
                            lotTableFilters[tableId] = null;
                            if (tableId === "table-1") renderTable1();
                            else if (tableId === "table-2") renderTable2();
                            else if (tableId === "table-3") renderTable3();
                        }
                        updateTableTitleBadge(tableId);
                    });
                    titleElement.appendChild(badge);
                }
            }
        }

        function updateExportButtonState() {
            const exportBtn5 = document.getElementById("export-table5-btn");
            if (!exportBtn5) return;

            // ✓ Disable khi status = ALL (1)
            if (donutFilters.iqcStatus === 1) {
                exportBtn5.disabled = true;
                exportBtn5.title = "Cannot export when status is ALL. Please select a specific status.";
                exportBtn5.style.opacity = "0.5";
                exportBtn5.style.cursor = "not-allowed";
            } else {
                exportBtn5.disabled = false;
                exportBtn5.title = "Download Excel";
                exportBtn5.style.opacity = "1";
                exportBtn5.style.cursor = "pointer";
            }
        }

        async function loadMaterialTypeChart() {
            const data = await fetchTopReject("MaterialType");
            if (!data.length) {
                showNoData("col-chart-3", "NO DATA");
                return;
            }

            const top10 = data.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
            const categories = top10.map((i) => i.materialType || "N/A");
            const values = top10.map((i) => i.numberRecord || 0);

            drawColumnChart("col-chart-3", categories, values);
        }

        async function loadMFRChart() {
            const data = await fetchTopReject("MFR");
            if (!data.length) {
                showNoData("col-chart-4", "NO DATA");
                return;
            }

            const top10 = data.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
            const categories = top10.map((i) => {
                const mfrcode = i.mfrcode || "N/A";
                const mfrname = i.mfrname || "N/A";
                return `${mfrcode}-${mfrname}`;
            });
            const values = top10.map((i) => i.numberRecord || 0);

            drawColumnChart("col-chart-4", categories, values);
        }

        async function loadModelChart() {
            const data = await fetchTopReject("Model");
            if (!data.length) {
                showNoData("col-chart-5", "NO DATA");
                return;
            }

            const top10 = data.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
            const categories = top10.map((i) => i.model || "N/A");
            const values = top10.map((i) => i.numberRecord || 0);

            drawColumnChart("col-chart-5", categories, values);
        }

        async function renderTable1() {
            const table = document.getElementById("table-1");
            if (!table) return;

            const thead = table.querySelector("thead");
            const tbody = table.querySelector("tbody");
            thead.innerHTML = "";
            tbody.innerHTML = "";

            if (table1Instance) {
                table1Instance.destroy();
            }

            table1Instance = new DataTableLib({
                tableId: "table-1",
                serverSide: true,
                rows: 9999,
                pagination: false,
                paginationId: null,
                emptyMessage: "NO DATA",
                sort: false,

                buildUrl: (page) => {
                    const params = new URLSearchParams({
                        fieldName: "MaterialTypeAndMFR",
                        fromDate: fromDate,
                        toDate: toDate,
                        page: 0,
                        size: 9999,
                    });
                    return `/production-system/api/iqc/top-reject?\${params}`;
                },

                formatData: (result) => {
                    let data = result?.data || [];
                    dataset.table1Data = data;

                    const filter = lotTableFilters["table-1"];
                    const firstColKey = TABLE1_COLUMNS[0].key; // "materialType"

                    if (filter) {
                        data = data.filter((row) => {
                            const cellValue = row[firstColKey] != null ? String(row[firstColKey]).trim() : "N/A";
                            return cellValue === filter;
                        });
                    }

                    result.total = data.length;
                    return data;
                },

                columnsConfig: TABLE1_COLUMNS.map((col) => ({ label: col.label })),

                rowRenderer: (item, index, meta) => {
                    const page = meta?.currentPage ?? 1;
                    const size = meta?.rows ?? 10;
                    const stt = (page - 1) * size + index + 1;

                    if (!item || Object.keys(item).length === 0) {
                        return `<td colspan="\${TABLE1_COLUMNS.length}" style="text-align:center">NO DATA</td>`;
                    }

                    return TABLE1_COLUMNS.map((col) => `<td>\${item[col.key] != null ? item[col.key] : "-"}</td>`).join("");
                },
            });

            await table1Instance.init();
        }

        async function renderTable2() {
            const table = document.getElementById("table-2");
            if (!table) return;

            const thead = table.querySelector("thead");
            const tbody = table.querySelector("tbody");
            thead.innerHTML = "";
            tbody.innerHTML = "";

            if (table2Instance) {
                table2Instance.destroy();
            }

            table2Instance = new DataTableLib({
                tableId: "table-2",
                serverSide: true,
                rows: 9999,
                pagination: false,
                paginationId: null,
                emptyMessage: "NO DATA",
                sort: false,

                buildUrl: (page) => {
                    const params = new URLSearchParams({
                        fieldName: "MFR",
                        fromDate: fromDate,
                        toDate: toDate,
                        page: 0,
                        size: 9999,
                    });
                    return `/production-system/api/iqc/top-reject?\${params}`;
                },

                formatData: (result) => {
                    let data = result?.data || [];
                    dataset.table2Data = data;

                    const filter = lotTableFilters["table-2"];
                    const firstColKey = TABLE2_COLUMNS[0].key; // "mfrcode"

                    if (filter) {
                        data = data.filter((row) => {
                            const cellValue = row[firstColKey] != null ? String(row[firstColKey]).trim() : "N/A";
                            return cellValue === filter;
                        });
                    }

                    result.total = data.length;
                    return data;
                },

                columnsConfig: TABLE2_COLUMNS.map((col) => ({ label: col.label })),

                rowRenderer: (item, index, meta) => {
                    const page = meta?.currentPage ?? 1;
                    const size = meta?.rows ?? 10;
                    const stt = (page - 1) * size + index + 1;

                    if (!item || Object.keys(item).length === 0) {
                        return `<td colspan="\${TABLE2_COLUMNS.length}" style="text-align:center">NO DATA</td>`;
                    }

                    return TABLE2_COLUMNS.map((col) => `<td>\${item[col.key] != null ? item[col.key] : "-"}</td>`).join("");
                },
            });

            await table2Instance.init();
        }

        async function renderTable3() {
            const table = document.getElementById("table-3");
            if (!table) return;

            const thead = table.querySelector("thead");
            const tbody = table.querySelector("tbody");
            thead.innerHTML = "";
            tbody.innerHTML = "";

            if (table3Instance) {
                table3Instance.destroy();
            }

            table3Instance = new DataTableLib({
                tableId: "table-3",
                serverSide: true,
                rows: 9999,
                pagination: false,
                paginationId: null,
                emptyMessage: "NO DATA",
                sort: false,

                buildUrl: (page) => {
                    const params = new URLSearchParams({
                        fieldName: "ModelAndMFR",
                        fromDate: fromDate,
                        toDate: toDate,
                        page: 0,
                        size: 9999,
                    });
                    return `/production-system/api/iqc/top-reject?\${params}`;
                },

                formatData: (result) => {
                    let data = result?.data || [];
                    dataset.table3Data = data;

                    const filter = lotTableFilters["table-3"];
                    const firstColKey = TABLE3_COLUMNS[0].key; // "model"

                    if (filter) {
                        data = data.filter((row) => {
                            const cellValue = row[firstColKey] != null ? String(row[firstColKey]).trim() : "N/A";
                            return cellValue === filter;
                        });
                    }

                    result.total = data.length;
                    return data;
                },

                columnsConfig: TABLE3_COLUMNS.map((col) => ({ label: col.label })),

                rowRenderer: (item, index, meta) => {
                    const page = meta?.currentPage ?? 1;
                    const size = meta?.rows ?? 10;
                    const stt = (page - 1) * size + index + 1;

                    if (!item || Object.keys(item).length === 0) {
                        return `<td colspan="\${TABLE3_COLUMNS.length}" style="text-align:center">NO DATA</td>`;
                    }

                    return TABLE3_COLUMNS.map((col) => `<td>\${item[col.key] != null ? item[col.key] : "-"}</td>`).join("");
                },
            });

            await table3Instance.init();
        }

        async function renderTable4() {
            const table = document.getElementById("table-4");
            if (!table) return;

            const thead = table.querySelector("thead");
            const tbody = table.querySelector("tbody");

            thead.innerHTML = "";
            tbody.innerHTML = "";

            if (table4Instance) {
                table4Instance.destroy();
            }

            let paginationContainer = document.getElementById("pagination-table-4");
            if (!paginationContainer) {
                paginationContainer = document.createElement("div");
                paginationContainer.id = "pagination-table-4";
                paginationContainer.style.marginTop = "0.4rem";

                const componentItem = table.closest(".component-item");
                if (componentItem) {
                    componentItem.appendChild(paginationContainer);
                }
            }

            table4Instance = new DataTableLib({
                tableId: "table-4",
                serverSide: true,
                rows: 10,
                paginationId: "pagination-table-4",
                emptyMessage: "NO DATA",
                sort: false,

                buildUrl: (page) => {
                    const params = new URLSearchParams({
                        page: page - 1,
                        size: 10,
                        fromDate: fromDate,
                        toDate: toDate,
                    });

                    if (donutFilters.materialTypeNCMR) {
                        params.append("materialType", donutFilters.materialTypeNCMR);
                    }

                    return `/production-system/api/iqc/ncmr?\${params}`;
                },

                formatData: (result) => {
                    result.total = result?.size || 0;
                    return result?.data || [];
                },

                columnsConfig: TABLE4_COLUMNS.map((col) => ({ label: col.label })),

                rowRenderer: (item, index, meta) => {
                    const page = meta?.currentPage ?? 1;
                    const size = meta?.rows ?? 10;
                    const stt = (page - 1) * size + index + 1;

                    if (!item || Object.keys(item).length === 0) {
                        return `<td colspan="\${TABLE4_COLUMNS.length}" style="text-align:center">NO DATA</td>`;
                    }

                    const cells = [`<td>\${stt}</td>`];
                    TABLE4_COLUMNS.forEach((col) => {
                        if (col.key === "stt") return;
                        const value = item?.[col.key] != null ? item[col.key] : "-";
                        if (col.key === "rejectReason" || col.key === "improvementAction") {
                            cells.push(
                                `<td style="max-width: 200px; word-wrap: break-word; white-space: normal;">\${value}</td>`
                            );
                        } else {
                            cells.push(`<td>\${value}</td>`);
                        }
                    });
                    return cells.join("");
                },
            });

            await table4Instance.init();
        }

        async function renderTable5() {
            const table = document.getElementById("table-5");
            if (!table) return;

            const thead = table.querySelector("thead");
            const tbody = table.querySelector("tbody");
            thead.innerHTML = "";
            tbody.innerHTML = "";

            if (table5Instance) {
                table5Instance.destroy();
            }

            table5Instance = new DataTableLib({
                tableId: "table-5",
                serverSide: true,
                rows: 50,
                paginationId: "pagination-table-5",
                emptyMessage: "NO DATA",
                sort: false,

                buildUrl: (page) => {
                    const params = new URLSearchParams({
                        page: page - 1,
                        size: 50,
                        fromDate: fromDate,
                        toDate: toDate,
                    });

                    if (donutFilters.materialTypeIQC) {
                        params.append("materialType", donutFilters.materialTypeIQC);
                    }

                    if (donutFilters.iqcStatus !== undefined && donutFilters.iqcStatus !== null) {
                        params.append("iqcStatus", donutFilters.iqcStatus);
                    }

                    return `/production-system/api/iqc/iqc-lot?\${params}`;
                },

                formatData: (result) => {
                    result.total = result?.size || 0;
                    dataset.table5Data = result?.data || [];
                    return result?.data || [];
                },

                columnsConfig: TABLE5_COLUMNS.map((col) => ({ label: col.label })),

                rowRenderer: (item, index, meta) => {
                    const page = meta?.currentPage ?? 1;
                    const size = meta?.rows ?? 10;
                    const stt = (page - 1) * size + index + 1;

                    if (!item || Object.keys(item).length === 0) {
                        return `<td colspan="\${TABLE5_COLUMNS.length}" style="text-align:center">NO DATA</td>`;
                    }

                    const cells = [`<td>\${stt}</td>`];
                    TABLE5_COLUMNS.forEach((col) => {
                        if (col.key === "stt") return;
                        cells.push(`<td>\${item[col.key] != null ? item[col.key] : "-"}</td>`);
                    });
                    return cells.join("");
                },
            });

            await table5Instance.init();
        }

        async function loadAllTopReject() {
            await Promise.all([
                loadMaterialTypeChart(),
                loadMFRChart(),
                loadModelChart(),
                renderTable1(),
                renderTable2(),
                renderTable3(),
            ]);
        }

        async function getDataCPN() {
            try {
                const res = await fetch(`/production-system/api/iqc/event?fromDate=\${fromDate}&toDate=\${toDate}`);
                if (!res.ok) throw new Error(`\${res.status}`);
                const json = await res.json();
                const result = json.result;
                if (!result) return [];
                document.querySelector("#be-inspected").textContent = result.toBeInspected;
                document.querySelector("#timeout_inspect").textContent = result.timeOutToBeInspected;
                document.querySelector("#scanned").textContent = result.toBeScanned;
                document.querySelector("#timeout_scan").textContent = result.timeOutTobeScanned;
            } catch (error) {
                console.error(error);
            }
        }

        async function getDataLotInject() {
            try {
                const slTime = document.getElementById("sl-time");
                const selected = slTime && slTime.value ? slTime.value : "today";

                let fromMoment = moment();
                let toMoment = moment();

                if (selected === "today") {
                    fromMoment = moment();
                    toMoment = moment();
                } else if (selected === "7") {
                    fromMoment = moment().subtract(6, "days");
                    toMoment = moment();
                } else if (selected === "30") {
                    fromMoment = moment().subtract(29, "days");
                    toMoment = moment();
                }

                const lotFromDate = getFormattedDate(fromMoment, "00:00:00");
                const lotToDate = getFormattedDate(toMoment, "23:59:59");

                const res = await fetch(
                    `/production-system/api/iqc/lot-reject?fromDate=\${lotFromDate}&toDate=\${lotToDate}`
                );
                if (!res.ok) throw new Error(`\${res.status}`);
                const json = await res.json();
                const result = json.result;
                if (!result) return [];
                document.querySelector("#inspected").textContent = result.inspectedTotal;
                document.querySelector("#lot-rejected").textContent = result.lotRejectedTotal;
                document.querySelector("#lrr").textContent = `\${result.lotRejectedRate}%`;
                return result;
            } catch (error) {
                console.error(error);
            }
        }

        function getDateRangeLastWeeks(weeks) {
            const start = moment()
                .subtract(weeks - 1, "weeks")
                .startOf("isoWeek");
            const end = moment().endOf("isoWeek");
            return {
                from: getFormattedDate(start, "00:00:00"),
                to: getFormattedDate(end, "23:59:59"),
            };
        }

        function getDateRangeLastDays(days) {
            const start = moment().subtract(days - 1, "days");
            const end = moment();
            return {
                from: getFormattedDate(start, "00:00:00"),
                to: getFormattedDate(end, "23:59:59"),
            };
        }

        async function getLotRejectDataWithRange(from, to) {
            try {
                const res = await fetch(`/production-system/api/iqc/lot-reject?fromDate=\${from}&toDate=\${to}`);
                if (!res.ok) throw new Error(`\${res.status}`);
                const json = await res.json();
                return json.result || null;
            } catch (error) {
                console.error(error);
                return null;
            }
        }

        async function loadLotRejectWeeklyChart() {
            const range = getDateRangeLastWeeks(8);
            const result = await getLotRejectDataWithRange(range.from, range.to);
            if (!result) return;

            const weeklyData = processWeekData(result);
            renderMirrorChart("col-chart-1", weeklyData.xLabels, weeklyData.inspected, weeklyData.rejected);
        }

        async function loadLotRejectDailyChart() {
            const range = getDateRangeLastDays(7);
            const result = await getLotRejectDataWithRange(range.from, range.to);
            if (!result) return;

            const dailyData = processDayData(result);
            renderMirrorChart("col-chart-2", dailyData.xLabels, dailyData.inspected, dailyData.rejected);
        }

        const processWeekData = (result) => {
            const xLabels = [];
            const inspected = [];
            const rejected = [];

            result.data.forEach((week) => {
                xLabels.push(`W\${week.weekNumber}`);
                inspected.push(week.inspectedTotal || 0);
                rejected.push(week.lotRejectedTotal || 0);
            });

            return { xLabels, inspected, rejected };
        };

        const processDayData = (result) => {
            const xLabels = [];
            const inspected = [];
            const rejected = [];

            result.data.forEach((week) => {
                week.data.forEach((day) => {
                    const formattedDate = day.workDate.split("-").slice(1).join("-");
                    xLabels.push(formattedDate);
                    inspected.push(day.inspectedTotal || 0);
                    rejected.push(day.lotRejectedTotal || 0);
                });
            });

            return { xLabels, inspected, rejected };
        };

        const renderMirrorChart = (chartId, xLabels, checkIn, checkOut) => {
            const container = document.getElementById(chartId);
            if (!container) {
                return null;
            }
            const maxCheckOut = checkOut.reduce((a, b) => Math.max(a, b), 0);
            const yMaxBottom = Math.ceil(maxCheckOut * 1.5);
            const lineData = checkIn.map((inspected, i) => {
                const rejected = checkOut[i] || 0;
                return inspected > 0 ? parseFloat(((rejected / inspected) * 100).toFixed(2)) : 0;
            });
            const yMaxLine = Math.ceil(Math.max(...lineData) * 4);
            const chart = Highcharts.chart(chartId, {
                chart: {
                    type: "column",
                    events: {
                        load: function () {
                            const chart = this;
                            const legendContainer = document.getElementById(`legend-\${chartId}`);
                            if (!legendContainer) return;
                            legendContainer.innerHTML = "";

                            chart.series.forEach((series) => {
                                const btn = document.createElement("span");
                                btn.textContent = series.name;
                                btn.style.display = "flex";
                                btn.style.alignItems = "center";
                                btn.style.columnGap = "5px";
                                btn.style.margin = "5px";
                                btn.style.fontSize = "1rem";
                                // btn.style.color = series.visible ? series.color : "#fff";
                                btn.style.color = "#fff";
                                btn.style.textDecoration = series.visible ? "unset" : "line-through";
                                btn.onclick = () => {
                                    series.setVisible(!series.visible);
                                    btn.style.color = "#fff";
                                    // btn.style.color = series.visible ? series.color : "#fff";
                                    btn.style.textDecoration = series.visible ? "unset" : "line-through";
                                };

                                const circle = document.createElement("span");
                                circle.style.display = "inline-block";
                                circle.style.width = "10px";
                                circle.style.height = "10px";
                                circle.style.backgroundColor = series.visible ? series.color : "#fff";
                                btn.prepend(circle);

                                legendContainer.appendChild(btn);
                            });
                        },
                        render: function () {
                            applyScaleToChart(this);
                        },
                    },
                },
                title: null,
                xAxis: {
                    categories: xLabels,
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
                legend: {
                    enabled: true,
                    itemStyle: { color: "#fff" },
                },
                plotOptions: {
                    column: {
                        grouping: false,
                        maxPointWidth: 30,
                        dataLabels: {
                            allowOverlap: true,
                            style: { textOutline: "1px contrast" },
                            // rotation: -90,
                            rotation: 0,
                        },
                    },
                },
                series: [
                    { name: "Inspected", color: "#fddd60", data: checkIn, yAxis: 0 },
                    {
                        name: "Rejected",
                        color: "#7cffb2",
                        data: checkOut,
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
                        data: checkIn.map((inspected, i) =>
                            inspected > 0 ? parseFloat(((checkOut[i] / inspected) * 100).toFixed(2)) : 0
                        ),
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
            chartsList.push(chart);
            return chart;
        };

        function setupExportButtons() {
            const exportBtn5 = document.getElementById("export-table5-btn");
            const exportBtn4 = document.getElementById("export-table4-btn");

            if (exportBtn5) {
                exportBtn5.addEventListener("click", () => {
                    // ✓ Double check khi click
                    if (donutFilters.iqcStatus === 1) {
                        alert(
                            "Cannot export when status is ALL. Please select a specific status (TO BE INSPECTED or FAIL)."
                        );
                        return;
                    }
                    exportTable(5, "IqcReport");
                });
            }

            if (exportBtn4) {
                exportBtn4.addEventListener("click", () => {
                    exportTable(4, "NcmrReport");
                });
            }
        }

        async function exportTable(tableNum, filename) {
            const apiUrl =
                tableNum === 5 ? "/production-system/api/iqc/iqc-lot/export" : "/production-system/api/iqc/ncmr/export";

            const params = new URLSearchParams();
            params.append("page", 0);
            params.append("size", 40000);
            params.append("fromDate", fromDate);
            params.append("toDate", toDate);

            if (tableNum === 5) {
                if (donutFilters.materialTypeIQC) {
                    params.append("materialType", donutFilters.materialTypeIQC);
                }
                if (donutFilters.iqcStatus !== undefined && donutFilters.iqcStatus !== null) {
                    params.append("iqcStatus", donutFilters.iqcStatus);
                }
            } else if (tableNum === 4) {
                if (donutFilters.materialTypeNCMR) {
                    params.append("materialType", donutFilters.materialTypeNCMR);
                }
            }

            // Show loading
            const btnId = tableNum === 5 ? "export-table5-btn" : "export-table4-btn";
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Exporting...';
            }

            try {
                const response = await fetch(`\${apiUrl}?\${params.toString()}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP \${response.status}: \${response.statusText}`);
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `\${filename}_\${new Date().getTime()}.xlsx`;
                document.body.appendChild(a);
                a.click();

                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 100);
            } catch (error) {
                console.error("Export failed:", error);
                alert(`Failed to export file: \${error.message}`);
            } finally {
                // Restore button
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="bi bi-download"></i> Export';
                }
            }
        }

        const loadData = async () => {
            getDataCPN();
            getDataLotInject();
            loadLotRejectWeeklyChart();
            loadLotRejectDailyChart();
        };

        const loadEvent = () => {
            highchartsInit();
            if (!selectElement.value) {
                selectElement.selectedIndex = 2;
            }
            const initVal = selectElement.value || "30";
            updateDates(initVal);
            loadDonutIQC();
            loadDonutNCMR();
            loadAllTopReject();
            getDataCPN();
            renderTable4();
            renderTable5();
            updateTableTitleBadge("table-5");
            setupExportButtons();
            updateExportButtonState();

            const daterangepickerChart = $("#daterangepicker-chart");
            daterangepickerChart.daterangepicker({
                opens: "left",
                autoUpdateInput: false,
                locale: {
                    cancelLabel: "Clear",
                    applyLabel: "Apply",
                    format: "YYYY/MM/DD",
                },
                startDate: moment().subtract(29, "days"),
                endDate: moment(),
            });

            daterangepickerChart.on("apply.daterangepicker", function (ev, picker) {
                fromDate = picker.startDate.format("YYYY/MM/DD 00:00:00");
                toDate = picker.endDate.format("YYYY/MM/DD 23:59:59");

                $(this).val(picker.startDate.format("YYYY/MM/DD") + " - " + picker.endDate.format("YYYY/MM/DD"));

                // Reload all data
                loadDonutIQC();
                loadDonutNCMR();
                loadAllTopReject();
                getDataCPN();
                renderTable4();
                renderTable5();
            });

            daterangepickerChart.on("cancel.daterangepicker", function (ev, picker) {
                $(this).val("");
                $(this).hide();
                selectElement.value = "30";
                updateDates("30");

                // Reload with default dates
                loadDonutIQC();
                loadDonutNCMR();
                loadAllTopReject();
                getDataCPN();
                renderTable4();
                renderTable5();
            });

            selectElement.addEventListener("change", function () {
                const selectedOption = this.value;
                const daterangepickerChartEl = document.getElementById("daterangepicker-chart");

                if (selectedOption === "custom") {
                    daterangepickerChartEl.style.display = "inline-block";
                    $(daterangepickerChartEl).data("daterangepicker").show();
                } else {
                    daterangepickerChartEl.style.display = "none";
                    daterangepickerChartEl.value = "";

                    updateDates(selectedOption);
                    loadDonutIQC();
                    loadDonutNCMR();
                    loadAllTopReject();
                    getDataCPN();
                    renderTable4();
                    renderTable5();
                }
            });

            const slTime = document.getElementById("sl-time");
            if (slTime) {
                if (!slTime.value) {
                    slTime.selectedIndex = 0;
                }
                slTime.addEventListener("change", function () {
                    getDataLotInject();
                });
            }
        };

        ready(() => {
            loadEvent();
            loadData();
        });
    </script>
