<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<link rel="stylesheet" href="/production-system/assets/plugins/daterangepicker/daterangepicker.css" />
<script src="/production-system/assets/plugins/jquery/jquery.min.js"></script>
<script src="/production-system/assets/plugins/daterangepicker/moment.min.js"></script>
<script src="/production-system/assets/plugins/daterangepicker/daterangepicker.js"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>

<style>
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
        height: 25vh;
    }

    .component-item .table-box {
        height: 25vh;
        overflow: auto;
    }

    .component-item .info-box {
        height: 6vh;
        background-color: rgba(73, 146, 255, 0.15);
    }

    .component-title {
        font-size: 1.12rem;
        margin: 0;
        padding-bottom: 0.5rem;
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
        border-top: 1px solid #37567f;
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
    }

    .table tbody td {
        font-size: 0.8rem;
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
</style>

<div class="container-fluid">
    <spring:message code="vietnamese" var="vietnamese" />
    <spring:message code="chinese" var="chinese" />
    <spring:message code="english" var="english" />
    <spring:message code="profile" var="profile" />
    <spring:message code="logout" var="logout" />

    <jsp:include page="/WEB-INF/jsp/common/header-dashboard.jsp">
        <jsp:param name="titlePage" value="Apollo & Rhea IQC Inspection Report" />
        <jsp:param name="subTitlePage" value="" />
        <jsp:param name="vietnamese" value="<%=pageContext.getAttribute(\"vietnamese\") %>" /> <jsp:param name="chinese"
        value="<%= pageContext.getAttribute(\"chinese\") %>" /> <jsp:param name="english" value="<%=
        pageContext.getAttribute(\"english\") %>" /> <jsp:param name="profile"
        value="<%=pageContext.getAttribute(\"profile\") %>" /> <jsp:param name="logout" value="<%=
        pageContext.getAttribute(\"logout\") %>" />
    </jsp:include>
    <select name="" id="sl-time-chart" class="form-select form-select-sm w-auto">
        <option value="today" selected>Time: Today</option>
        <option value="7">Time: Last 7 Days</option>
        <option value="30">Time: Last 30 Days</option>
        <option value="custom">Time: Custom</option>
    </select>
    <div class="container-fluid p-0 content-wrapper">
        <div class="row">
            <div class="col-md-3 component-wrapper">
                <div class="component-item">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="component-title mb-0">Inspected Distribution by Material Type</h5>

                        <div id="daterangepicker-container" style="display: none; position: absolute">
                            <input type="text" id="daterangepicker" />
                        </div>
                    </div>
                    <div class="component-body chart-box flex-grow-1" id="donut-chart-1"></div>
                </div>
            </div>

            <div class="col-md-9">
                <div class="row component-wrapper">
                    <div class="component-item">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="component-title mb-0">Lot Rejected Rate (Today)</h5>
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

                        <div class="row">
                            <div class="col-md-4 component-wrapper">
                                <div
                                    class="component-item d-flex flex-column justify-content-center align-items-center text-center"
                                >
                                    <div class="component-title">Inspected</div>
                                    <span id="inspected" class="fw-bold text-warning text-span"></span>
                                </div>
                            </div>

                            <div class="col-md-4 component-wrapper">
                                <div
                                    class="component-item d-flex flex-column justify-content-center align-items-center text-center"
                                >
                                    <div class="component-title">Lot Rejected</div>
                                    <span id="lot-rejected" class="fw-bold text-warning text-span"></span>
                                </div>
                            </div>

                            <div class="col-md-4 component-wrapper">
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

                <div class="row">
                    <div class="col-md-6 component-wrapper">
                        <div class="component-item">
                            <h5 class="component-title">LLR By Weeks</h5>
                            <div class="component-body chart-box" id="col-chart-1"></div>
                        </div>
                    </div>

                    <div class="col-md-6 component-wrapper">
                        <div class="component-item">
                            <h5 class="component-title">LLR Last 7 Days</h5>
                            <div class="component-body chart-box" id="col-chart-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3 component-wrapper">
                <div class="component-item">
                    <h5 class="component-title">CPN Status</h5>

                    <div class="component-body">
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

                    <h5 class="component-title mt-1">NCMR Status</h5>
                    <div class="component-body chart-box flex-grow-1" id="donut-chart-2"></div>
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
                    <div class="col-md-4 component-wrapper">
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

                    <div class="col-md-4 component-wrapper">
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

                    <div class="col-md-4 component-wrapper">
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
            <div class="col-md-6 component-wrapper">
                <div class="component-item">
                    <h5 class="component-title">NCMR List</h5>
                    <div class="component-body table-box">
                        <table class="table table-sm table-striped" id="table-4">
                            <thead></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-md-6 component-wrapper">
                <div class="component-item">
                    <h5 class="component-title">Inspection List</h5>
                    <div class="component-body table-box">
                        <table class="table table-sm table-striped" id="table-5">
                            <thead></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    const dataset = {};
    const chartsList = [];
    const donutFilters = {
        materialTypeIQC: null,
        materialTypeNCMR: null,
    };
    const lotTableFilters = {
        "table-1": null,
        "table-2": null,
        "table-3": null,
    };
    
    const API_TOP_REJECT = "/production-system/api/iqc/top-reject";

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
            fromDate = getFormattedDate(moment().subtract(7, "days"), "00:00:00");
            toDate = getFormattedDate(moment(), "23:59:59");
        } else if (selectedOption === "30") {
            fromDate = getFormattedDate(moment().subtract(30, "days"), "00:00:00");
            toDate = getFormattedDate(moment(), "23:59:59");
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
                name: i.materialType,
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
                name: i.materialType,
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
            legend: { enabled: true, itemStyle: { color: "#fff" } },
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
                        style: { fontSize: "0.7rem", color: "#fff", textOutline: "none" },
                    },
                    showInLegend: true,
                },
            },
            series: [
                {
                    name: "Count",
                    colorByPoint: true,
                    innerSize: "75%",
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
        const maxVal = Math.max(...values, 1);
        const yMax = Math.ceil((maxVal * 1.2) / 5) * 5;

        const chart = Highcharts.chart(containerId, {
            chart: {
                type: "column",
                spacing: [10, 10, 10, 10],
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
                        whiteSpace: "normal",
                        width: "20px",
                        lineHeight: "0.7rem",
                    },
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

    function renderTable(tableId, data, cols) {
        const table = document.querySelector("#" + tableId);
        if (!table) return;

        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");

        thead.innerHTML =
            "<tr>" +
            cols
                .map(function (c) {
                    return "<th>" + c.label + "</th>";
                })
                .join("") +
            "</tr>";

        if (!data || !data.length) {
            tbody.innerHTML = '<tr><td colspan="' + cols.length + '">No data</td></tr>';
            return;
        }

        tbody.innerHTML = data
            .map(function (row, idx) {
                const cells = cols
                    .map(function (c) {
                        return "<td>" + (row[c.key] != null ? row[c.key] : "-") + "</td>";
                    })
                    .join("");
                return '<tr class="' + (idx % 2 === 1 ? "odd" : "") + '">' + cells + "</tr>";
            })
            .join("");
    }

    async function fetchIQCLot(page = 0, size = 20, materialType = null) {
        try {
            const params = new URLSearchParams({ page, size });

            if (fromDate) params.append("fromDate", fromDate);
            if (toDate) params.append("toDate", toDate);

            if (materialType) params.append("materialType", materialType);

            const res = await fetch(`/production-system/api/iqc/iqc-lot?\${params}`);
            if (!res.ok) throw new Error(`HTTP \${res.status}`);

            const json = await res.json();
            return json.data || [];
        } catch (err) {
            console.error("error:", err);
            return [];
        }
    }

    async function fetchNCMR(page = 0, size = 20, materialType = null) {
        try {
            const params = new URLSearchParams({ page, size });

            if (fromDate) params.append("fromDate", fromDate);
            if (toDate) params.append("toDate", toDate);

            if (materialType) params.append("materialType", materialType);

            const res = await fetch(`/production-system/api/iqc/ncmr?\${params}`);
            if (!res.ok) throw new Error(`HTTP \${res.status}`);

            const json = await res.json();
            return json.data || [];
        } catch (err) {
            console.error("error:", err);
            return [];
        }
    }

    const TABLE1_COLUMNS = [
        { key: "materialType", label: "Material Type" },
        { key: "mfrcode", label: "MFR Code" },
        { key: "mfrname", label: "MFR Name" },
        { key: "numberRecord", label: "Reject Qty" },
        { key: "model", label: "Model" },
    ];

    const TABLE2_COLUMNS = [
        { key: "mfrcode", label: "MFR Code" },
        { key: "mfrname", label: "MFR Name" },
        { key: "numberRecord", label: "Reject Qty" },
        { key: "model", label: "Model" },
        { key: "materialType", label: "Material Type" },
    ];

    const TABLE3_COLUMNS = [
        { key: "model", label: "Model" },
        { key: "mfrcode", label: "MFR Code" },
        { key: "mfrname", label: "MFR Name" },
        { key: "numberRecord", label: "Reject Qty" },
        { key: "materialType", label: "Material Type" },
    ];

    const TABLE4_COLUMNS = [
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
            if (donutFilters.materialTypeNCMR === materialType) {
                donutFilters.materialTypeNCMR = null;
            } else {
                donutFilters.materialTypeNCMR = materialType;
            }
            loadTable5();
        } else if (containerId === "donut-chart-2") {
            if (donutFilters.materialTypeIQC === materialType) {
                donutFilters.materialTypeIQC = null;
            } else {
                donutFilters.materialTypeIQC = materialType;
            }
            loadTable4();
        }
    }

    function handleColumnClick(containerId, category) {
        if (containerId === "col-chart-3") {
            if (!dataset.table1Data) return;
            const key = "materialType";
            const normalizedCategory = category || "N/A";
            const fullData = dataset.table1Data;
            const tableId = "table-1";

            if (lotTableFilters[tableId] === normalizedCategory) {
                lotTableFilters[tableId] = null;
                renderTable(tableId, fullData, TABLE1_COLUMNS);
            } else {
                lotTableFilters[tableId] = normalizedCategory;
                const filtered = fullData.filter((row) => (row[key] != null ? row[key] : "N/A") === normalizedCategory);
                renderTable(tableId, filtered, TABLE1_COLUMNS);
            }
        } else if (containerId === "col-chart-4") {
            if (!dataset.table2Data) return;
            const key = "mfrcode";
            const normalizedCategory = category || "N/A";
            const fullData = dataset.table2Data;
            const tableId = "table-2";

            if (lotTableFilters[tableId] === normalizedCategory) {
                lotTableFilters[tableId] = null;
                renderTable(tableId, fullData, TABLE2_COLUMNS);
            } else {
                lotTableFilters[tableId] = normalizedCategory;
                const filtered = fullData.filter((row) => (row[key] != null ? row[key] : "N/A") === normalizedCategory);
                renderTable(tableId, filtered, TABLE2_COLUMNS);
            }
        } else if (containerId === "col-chart-5") {
            if (!dataset.table3Data) return;
            const key = "model";
            const normalizedCategory = category || "N/A";
            const fullData = dataset.table3Data;
            const tableId = "table-3";

            if (lotTableFilters[tableId] === normalizedCategory) {
                lotTableFilters[tableId] = null;
                renderTable(tableId, fullData, TABLE3_COLUMNS);
            } else {
                lotTableFilters[tableId] = normalizedCategory;
                const filtered = fullData.filter((row) => (row[key] != null ? row[key] : "N/A") === normalizedCategory);
                renderTable(tableId, filtered, TABLE3_COLUMNS);
            }
        }
    }

    async function loadMaterialTypeChart() {
        const data = await fetchTopReject("MaterialType");
        if (!data.length) return;

        const top10 = data.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
        const categories = top10.map((i) => i.materialType || "N/A");
        const values = top10.map((i) => i.numberRecord || 0);

        drawColumnChart("col-chart-3", categories, values);
    }

    async function loadMFRChart() {
        const data = await fetchTopReject("MFR");
        if (!data.length) return;

        const top10 = data.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
        const categories = top10.map((i) => i.mfrcode || "N/A");
        const values = top10.map((i) => i.numberRecord || 0);

        drawColumnChart("col-chart-4", categories, values);
    }

    async function loadModelChart() {
        const data = await fetchTopReject("Model");
        if (!data.length) return;

        const top10 = data.sort((a, b) => (b.numberRecord || 0) - (a.numberRecord || 0)).slice(0, 10);
        const categories = top10.map((i) => i.model || "N/A");
        const values = top10.map((i) => i.numberRecord || 0);

        drawColumnChart("col-chart-5", categories, values);
    }

    async function loadTable1() {
        const data = await fetchTopReject("MaterialTypeAndMFR");
        dataset.table1Data = data || [];
        renderTable("table-1", dataset.table1Data, TABLE1_COLUMNS);
    }

    async function loadTable2() {
        const data = await fetchTopReject("MFR");
        dataset.table2Data = data || [];
        renderTable("table-2", dataset.table2Data, TABLE2_COLUMNS);
    }

    async function loadTable3() {
        const data = await fetchTopReject("ModelAndMFR");
        dataset.table3Data = data || [];
        renderTable("table-3", dataset.table3Data, TABLE3_COLUMNS);
    }

    async function loadTable4() {
        const data = await fetchIQCLot(0, 20, donutFilters.materialTypeIQC);
        dataset.table4Data = data;
        renderTable("table-4", data, TABLE4_COLUMNS);
    }

    async function loadTable5() {
        const data = await fetchNCMR(0, 20, donutFilters.materialTypeNCMR);
        dataset.table5Data = data;
        renderTable("table-5", data, TABLE5_COLUMNS);
    }

    async function loadAllTopReject() {
        await Promise.all([
            loadMaterialTypeChart(),
            loadMFRChart(),
            loadModelChart(),
            loadTable1(),
            loadTable2(),
            loadTable3(),
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
                fromMoment = moment().subtract(7, "days");
                toMoment = moment();
            } else if (selected === "30") {
                fromMoment = moment().subtract(30, "days");
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
        const start = moment().subtract(weeks, "weeks").startOf("week");
        const end = moment().endOf("week");
        return {
            from: getFormattedDate(start, "00:00:00"),
            to: getFormattedDate(end, "23:59:59"),
        };
    }

    function getDateRangeLastDays(days) {
        const start = moment().subtract(days, "days");
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
            xLabels.push(week.weekNumber);
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
                xLabels.push(day.workDate);
                inspected.push(day.inspectedTotal || 0);
                rejected.push(day.lotRejectedTotal || 0);
            });
        });

        return { xLabels, inspected, rejected };
    };

    const renderMirrorChart = (chartId, xLabels, checkIn, checkOut) => {
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
                            btn.style.color = series.visible ? series.color : "#ccc";
                            btn.style.textDecoration = series.visible ? "unset" : "line-through";
                            btn.onclick = () => {
                                series.setVisible(!series.visible);
                                btn.style.color = series.visible ? series.color : "#ccc";
                                btn.style.textDecoration = series.visible ? "unset" : "line-through";
                            };

                            const circle = document.createElement("span");
                            circle.style.display = "inline-block";
                            circle.style.width = "10px";
                            circle.style.height = "10px";
                            circle.style.backgroundColor = series.visible ? series.color : "#ccc";
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
                offset: -105,
                labels: { align: "center", y: 0 },
            },
            yAxis: [
                { title: null, height: "43%", offset: 0, softMax: 600 },
                { title: null, top: "57%", height: "43%", offset: 0, reversed: true, softMax: 600 },
            ],
            tooltip: { enabled: false },
            legend: { enabled: false },
            plotOptions: {
                column: {
                    grouping: false,
                    maxPointWidth: 30,
                    dataLabels: {
                        allowOverlap: true,
                        style: { textOutline: "1px contrast" },
                        rotation: -90,
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
            ],
        });

        chartsList.push(chart);
        return chart;
    };

    async function fetchDataIQC(page, size) {}

    const loadData = async () => {
        getDataCPN();
        getDataLotInject();
        loadLotRejectWeeklyChart();
        loadLotRejectDailyChart();
    };

    const loadEvent = () => {
        highchartsInit();
        if (!selectElement.value) {
            selectElement.selectedIndex = 0;
        }
        const initialValue = selectElement.value || "today";
        updateDates(initialValue);
        loadDonutIQC();
        loadDonutNCMR();
        loadAllTopReject();
        getDataCPN();
        loadTable4();
        loadTable5();

        selectElement.addEventListener("change", function () {
            const selectedOption = this.value;
            updateDates(selectedOption);

            loadDonutIQC();
            loadDonutNCMR();
            loadAllTopReject();
            getDataCPN();
            loadTable4();
            loadTable5();
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
