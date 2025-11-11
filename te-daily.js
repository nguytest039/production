const GLOBAL = { cft: "RING", modalView: "top5", errorInfoCache: {}, editingError: null };
GLOBAL.getCft = () => GLOBAL.cft || "RING";
const chartsList = [];
const loadEvent = () => {
    window.addEventListener("resize", () => applyScaleToCharts());

    const table2Body = document.querySelector("#table-2 tbody");
    if (table2Body) {
        table2Body.addEventListener("click", function (e) {
            const cell = e.target.closest("td");
            if (!cell || !cell.classList.contains("editable-cell")) return;
            const row = cell.closest("tr");
            openUpdateModal(row);
        });
    }

    const modalTop5 = document.getElementById("modal-top5");
    if (modalTop5) {
        modalTop5.addEventListener("shown.bs.modal", () => {
            try {
                setupModalViewToggle();
                setModalView(GLOBAL.modalView || "top5");
                modalControl();
            } catch (_) { }
        });
    }

    const saveBtn = document.getElementById("save-update");
    if (saveBtn) {
        saveBtn.addEventListener("click", handleSaveErrorInfo);
    }

    const customerSelect = document.getElementById("customerSelect");
    if (customerSelect) {
        if (customerSelect.selectedIndex === -1) customerSelect.selectedIndex = 0;
        GLOBAL.cft = (customerSelect.value || "RING").toUpperCase();
        customerSelect.addEventListener("change", () => {
            try {
                GLOBAL.cft = (customerSelect.value || "RING").toUpperCase();
                fetchMachineErrorSummary();
            } catch (_) { }
        });
    }
};

const loadData = () => {
    highchartsInit();
};

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
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "#7a95c3",
                    whiteSpace: "normal",
                    width: 60,
                },
                useHTML: true,
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
                        fontSize: "1rem",
                    },
                },
            },
        },
    });
};

function applyScaleToCharts(baseWidth = 1920, baseMarker = 4, baseLineWidth = 2) {
    const scale = window.innerWidth / baseWidth;

    chartsList.forEach((chart) => {
        if (chart.series) {
            chart.series.forEach((series) => {
                if (series.type === "line" || series.type === "spline") {
                    series.update(
                        {
                            marker: { radius: baseMarker * scale },
                            lineWidth: baseLineWidth * scale,
                        },
                        false
                    );
                }
            });
            chart.redraw(false);
        }
    });
}

function destroyChartById(chartId) {
    if (!GLOBAL.chartsById) GLOBAL.chartsById = {};
    const existing = GLOBAL.chartsById[chartId];
    if (existing) {
        try {
            existing.destroy && existing.destroy();
        } catch (_) { }
        const idx = chartsList.indexOf(existing);
        if (idx > -1) chartsList.splice(idx, 1);
        delete GLOBAL.chartsById[chartId];
    }
}

function clearTop5Table() {
    const table = document.getElementById("table-2");
    const tbody = table?.querySelector("tbody");
    if (!table || !tbody) return;

    tbody.innerHTML = "";
}

const getErrorInfoKey = (code = "") => (code || "").toUpperCase();

async function fetchErrorInfoByCodes(errorCodes = []) {
    const codes = Array.from(new Set((errorCodes || []).map(getErrorInfoKey))).filter(Boolean);
    if (!codes.length) return {};

    GLOBAL.errorInfoCache = GLOBAL.errorInfoCache || {};
    const missing = codes.filter((code) => !GLOBAL.errorInfoCache[code]);

    if (missing.length) {
        try {
            const url = `/production-system/api/error-info?errorCodeString=${encodeURIComponent(missing.join(","))}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const json = await res.json();
            const list = Array.isArray(json?.data)
                ? json.data
                : Array.isArray(json?.data?.content)
                    ? json.data.content
                    : [];
            list.forEach((item) => {
                const key = getErrorInfoKey(item?.errorCode || item?.error_code || item?.code);
                if (!key) return;
                GLOBAL.errorInfoCache[key] = {
                    rootCause: item?.rootCause ?? item?.rootcause ?? "",
                    action: item?.action ?? item?.correctiveAction ?? "",
                    owner: item?.owner ?? "",
                    status: item?.status ?? "",
                };
            });
        } catch (error) {
            console.error(error);
        }
    }

    return codes.reduce((acc, code) => {
        const cached = GLOBAL.errorInfoCache[code];
        acc[code] = cached
            ? { ...cached }
            : { rootCause: "", action: "", owner: "", status: "" };
        return acc;
    }, {});
}

function setupModalViewToggle() {
    const toggle = document.getElementById("modal-view-toggle");
    if (!toggle || toggle.dataset.bound === "true") return;
    toggle.dataset.bound = "true";
    toggle.addEventListener("click", (event) => {
        const btn = event.target.closest("button[data-view]");
        if (!btn) return;
        setModalView(btn.dataset.view);
    });
}

function setModalView(view) {
    const top5Wrapper = document.getElementById("top5-table-wrapper");
    const summaryWrapper = document.getElementById("summary-table-wrapper");
    if (!top5Wrapper || !summaryWrapper) return;

    let targetView = view === "summary" ? "summary" : "top5";
    if (targetView === "summary") {
        top5Wrapper.classList.add("d-none");
        summaryWrapper.classList.remove("d-none");
        resetSummaryTable();
    } else {
        top5Wrapper.classList.remove("d-none");
        summaryWrapper.classList.add("d-none");
    }

    const toggle = document.getElementById("modal-view-toggle");
    if (toggle) {
        toggle.querySelectorAll("button").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.view === targetView);
        });
    }

    GLOBAL.modalView = targetView;
}

function resetSummaryTable() {
    const tbody = document.querySelector("#summary-table tbody");
    if (tbody) tbody.innerHTML = "";
}

function openUpdateModal(row) {
    if (!row) return;
    const rootInput = document.getElementById("root-cause");
    const actionInput = document.getElementById("corrective-action");
    const modalEl = document.getElementById("modal-update");
    if (!rootInput || !actionInput || !modalEl) return;

    const errorCode = row.dataset.errorCode || "";
    if (!errorCode) return;

    rootInput.value = row.dataset.rootCause || "";
    actionInput.value = row.dataset.action || "";

    GLOBAL.editingError = {
        errorCode,
        machineNo: row.dataset.machine || "",
        row,
    };

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

async function handleSaveErrorInfo() {
    const rootInput = document.getElementById("root-cause");
    const actionInput = document.getElementById("corrective-action");
    if (!rootInput || !actionInput) return;

    const editing = GLOBAL.editingError;
    if (!editing || !editing.errorCode) return;

    const payload = {
        machineNo: editing.machineNo || "",
        rootCause: rootInput.value.trim(),
        action: actionInput.value.trim(),
    };

    const hasLoader = typeof loader !== "undefined";
    if (hasLoader && typeof loader.load === "function") loader.load();

    try {
        const res = await fetch(
            `/production-system/api/error-info/${encodeURIComponent(editing.errorCode)}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        updateRowErrorInfo(editing.row, payload);
        const modal = bootstrap.Modal.getInstance(document.getElementById("modal-update"));
        if (modal) modal.hide();
    } catch (error) {
        console.error(error);
    } finally {
        if (hasLoader && typeof loader.unload === "function") loader.unload();
        GLOBAL.editingError = null;
    }
}

function updateRowErrorInfo(row, { rootCause, action }) {
    if (!row) return;

    const rootCell = row.querySelector('td[data-field="rootCause"]');
    const actionCell = row.querySelector('td[data-field="action"]');
    const rootText = rootCause || "";
    const actionText = action || "";

    if (rootCell) rootCell.textContent = rootText || "-";
    if (actionCell) actionCell.textContent = actionText || "-";

    row.dataset.rootCause = rootText;
    row.dataset.action = actionText;

    const key = getErrorInfoKey(row.dataset.errorCode || "");
    if (!key) return;

    GLOBAL.errorInfoCache = GLOBAL.errorInfoCache || {};
    GLOBAL.errorInfoCache[key] = {
        ...(GLOBAL.errorInfoCache[key] || {}),
        rootCause: rootText,
        action: actionText,
        owner: GLOBAL.errorInfoCache[key]?.owner || "",
        status: GLOBAL.errorInfoCache[key]?.status || "",
    };
}


async function drawDailyChart(data, chartId) {
    const xLabels = data.map((d) => d?.updatedAt ?? "-");
    destroyChartById(chartId);

    const container = document.getElementById(chartId);

    Highcharts.chart(chartId, {
        chart: {
            type: "spline",
            backgroundColor: "transparent",
            // zoomType: "x",
            panning: { enabled: false, type: "x" },
            events: {
                load() {
                    GLOBAL.chartsById = GLOBAL.chartsById || {};
                    GLOBAL.chartsById[chartId] = this;
                    chartsList.push(this);
                    applyScaleToCharts();
                    addWheelZoomEvent(container, this);
                    addDragPanEvent(container, this);
                },
            },
        },
        title: null,
        xAxis: {
            categories: xLabels,
            labels: {
                style: { fontSize: "0.75rem", fontWeight: "600", color: "#7a95c3" },
                useHTML: true,
            },
            tickLength: 5,
            tickPositioner() {
                return this.categories.map((_, i) => i);
            },
        },
        yAxis: {
            title: null,
            labels: {
                style: { fontSize: "1rem", fontWeight: "600", color: "#7a95c3" },
                formatter: function () {
                    return this.value * 100 + "%";
                },
            },
        },
        legend: { enabled: false },
        tooltip: {
            enabled: true,
            useHTML: true,
            style: { zIndex: 9999 },
            formatter: function () {
                const p = this.point;
                return `<small style="opacity:0.8">${p.fullDate || p.updatedAt}</small><br/>
                        <div><b>Input:</b> ${p.inputTotal?.toLocaleString() || 0}</div>
                        <div><b>NTF:</b> ${p.ntfTotal?.toLocaleString() || 0}</div>
                        <div><b>Rate:</b> ${(p.ntfRate * 100).toFixed(2)}%</div>`;
            },
        },
        plotOptions: {
            spline: {
                marker: { enabled: true },
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return `${formatPercent(this.point.y)}%`;
                    },
                    style: { color: "#fff", textOutline: "none" },
                },
                cursor: "pointer",
            },
        },
        series: [
            {
                name: "Total",
                data: data,
                color: "#ffda09ff",
            },
        ],
    });
}

function addDragPanEvent(container, chart) {
    let isDragging = false;
    let startX = 0;
    let startMin = 0;
    let startMax = 0;

    container.addEventListener("mousedown", (e) => {
        if (!chart.xAxis?.[0]) return;
        if (e.button === 0 && !e.target.closest(".highcharts-point")) {
            isDragging = true;
            startX = e.clientX;
            const { min, max } = chart.xAxis[0].getExtremes();
            startMin = min;
            startMax = max;
            container.style.cursor = "grabbing";
            e.preventDefault();
            document.body.style.userSelect = "none";
        }
    });

    container.addEventListener("mousemove", (e) => {
        if (!isDragging || !chart.xAxis?.[0]) return;
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const range = startMax - startMin;
        const plotWidth = chart.plotWidth;
        const shift = -(dx / plotWidth) * range;

        let newMin = startMin + shift;
        let newMax = startMax + shift;

        const dataMin = 0;
        const dataMax = chart.xAxis[0].dataMax ?? (chart.xAxis[0].categories || []).length - 1;

        if (newMin < dataMin) {
            newMin = dataMin;
            newMax = dataMin + range;
        }
        if (newMax > dataMax) {
            newMax = dataMax;
            newMin = dataMax - range;
        }

        chart.xAxis[0].setExtremes(newMin, newMax, true, false);
        e.preventDefault();
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = "grab";
            document.body.style.userSelect = "";
        }
    });

    container.addEventListener("mouseleave", () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = "grab";
            document.body.style.userSelect = "";
        }
    });

    container.addEventListener("dragstart", (e) => e.preventDefault());

    container.style.cursor = "grab";
}

function addWheelZoomEvent(container, chart) {
    container.addEventListener("wheel", (e) => {
        e.preventDefault();

        const { min, max } = chart.xAxis[0].getExtremes();
        const range = max - min;
        let zoomFactor = e.deltaY < 0 ? 1.2 : 0.8;
        const center = (min + max) / 2;
        const newMin = Math.max(Math.floor(center - range / (2 * zoomFactor)), 0);
        const newMax = Math.min(
            Math.ceil(center + range / (2 * zoomFactor)),
            chart.xAxis[0].dataMax || Number.MAX_VALUE
        );

        chart.xAxis[0].setExtremes(newMin, newMax, true, false);
    });
}

function getMondayTwoWeeksAgo() {
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);

    const day = twoWeeksAgo.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    const monday = new Date(twoWeeksAgo);
    monday.setDate(twoWeeksAgo.getDate() + diff);

    return monday;
}

function formatDateTime(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}/${m}/${d} 00:00:00`;
}

async function fetchMachineErrorSummary() {
    const fromDate = formatDateTime(getMondayTwoWeeksAgo());
    const toDate = formatDateTime(new Date()).replace("00:00:00", "23:59:59");
    const cft = GLOBAL.getCft();
    const apiUrl = `/production-system/api/cnt-machine-error/summary?fromDate=${encodeURIComponent(
        fromDate
    )}&toDate=${encodeURIComponent(toDate)}&cft=${encodeURIComponent(cft)}`;
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        const data = json.data;
        renderTableHeader(data);
        renderTable(data);
    } catch (err) {
        console.error("Lỗi:", err);
    }
}

function renderTableHeader(apiData) {
    const table = document.querySelector("#table-1");
    const oldThead = table.querySelector("thead");
    if (oldThead) oldThead.remove();

    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    table.appendChild(thead);
    table.appendChild(tbody);

    const firstRow = document.createElement("tr");
    thead.appendChild(firstRow);

    ["Project", "Station"].forEach((text) => {
        const th = document.createElement("th");
        th.textContent = text;
        th.rowSpan = 2;
        th.classList.add("text-center", "align-middle");
        firstRow.appendChild(th);
    });

    const weeksSet = new Set();
    apiData.forEach((item) => item.data.forEach((w) => weeksSet.add(w.week)));
    const weeks = Array.from(weeksSet).sort((a, b) => a - b);
    const lastThree = weeks.slice(-3);
    const twoWeeksBefore = lastThree.slice(0, 2);
    const thisWeek = lastThree[lastThree.length - 1];

    [twoWeeksBefore[0], twoWeeksBefore[1], thisWeek].forEach((wk) => {
        const th = document.createElement("th");
        th.textContent = `WK${wk}`;
        th.rowSpan = 2;
        th.classList.add("text-center", "align-middle");
        firstRow.appendChild(th);
    });

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 10);

    const weekDates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        return formatDateTime(d).split(" ")[0];
    });

    const secondRow = document.createElement("tr");
    thead.appendChild(secondRow);
    weekDates.forEach((dateStr) => {
        const th = document.createElement("th");
        const [y, m, d] = dateStr.split("/");
        th.textContent = `${m}/${d}`;
        th.classList.add("text-center");
        secondRow.appendChild(th);
    });
}

function renderTable(apiData) {
    const tbody = document.querySelector("#table-1 tbody");
    tbody.innerHTML = "";

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 10);

    const weekDates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        return formatDateTime(d).split(" ")[0];
    });

    const weeksSet = new Set();
    apiData.forEach((item) => item.data.forEach((w) => weeksSet.add(w.week)));
    const weeks = Array.from(weeksSet).sort((a, b) => a - b);
    const lastThree = weeks.slice(-3);
    const twoWeeksBefore = lastThree.slice(0, 2);
    const thisWeek = lastThree[lastThree.length - 1];

    // Group by project
    const grouped = {};
    apiData.forEach((item) => {
        const proj = item.project;
        if (!grouped[proj]) grouped[proj] = [];
        grouped[proj].push(item);
    });

    // Sort projects
    const sortedProjects = Object.keys(grouped).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    // Render each project
    sortedProjects.forEach((project) => {
        const items = grouped[project];

        // Sort stations
        items.sort((a, b) => a.station.toLowerCase().localeCompare(b.station.toLowerCase()));

        const projectRowspan = items.length;

        items.forEach((item, idx) => {
            const row = document.createElement("tr");

            // Project cell (with rowspan)
            if (idx === 0) {
                const tdProject = document.createElement("td");
                tdProject.textContent = project;
                tdProject.dataset.project = item.project;
                tdProject.rowSpan = projectRowspan;
                tdProject.classList.add("align-middle", "fw-bold");
                row.appendChild(tdProject);
            }

            // Station cell
            const tdStation = document.createElement("td");
            tdStation.textContent = item.station;
            tdStation.dataset.station = item.station;
            row.appendChild(tdStation);

            // Week columns
            const weekMap = {};
            item.data.forEach((w) => (weekMap[w.week] = w));

            [twoWeeksBefore[0], twoWeeksBefore[1], thisWeek].forEach((wk) => {
                const wkData = weekMap[wk];
                const val = wkData?.ntfRate != null ? (wkData.ntfRate * 100).toFixed(2) + "%" : "-";
                const td = document.createElement("td");
                td.className = getCellClass(val);
                td.textContent = val;

                // Store data
                td.dataset.project = project;
                td.dataset.station = item.station;
                td.dataset.week = wk;
                td.dataset.cellType = "week";

                row.appendChild(td);
            });

            // Day columns
            const dayMap = {};
            item.data.forEach((weekData) => {
                if (weekData?.data) {
                    weekData.data.forEach((d) => {
                        const dateKey = d.date.split(" ")[0];
                        dayMap[dateKey] = d;
                    });
                }
            });

            weekDates.forEach((dateStr) => {
                const d = dayMap[dateStr];
                const val = d?.ntfRate != null ? (d.ntfRate * 100).toFixed(2) + "%" : "-";
                const td = document.createElement("td");
                td.className = getCellClass(val);
                td.textContent = val;

                td.dataset.project = project;
                td.dataset.station = item.station;
                td.dataset.date = dateStr;
                td.dataset.cellType = "day";

                row.appendChild(td);
            });

            tbody.appendChild(row);
        });
    });
}

function getCellClass(value) {
    if (value === "-") return "bg-transparent";
    const num = parseFloat(value.replace("%", ""));
    if (num > 0) return "bg-warning text-dark cursor-pointer";
    return "bg-transparent";
}

function getProjectAndStation() {
    document.querySelector("#table-1").addEventListener("click", async (e) => {
        const td = e.target.closest("td");
        if (!td) return;

        const project = td.dataset.project;
        const station = td.dataset.station;
        const cellType = td.dataset.cellType;

        if (!project || !station || !cellType) return;

        let fromDate = "",
            toDate = "",
            workDate = "";

        if (cellType === "week") {
            // Week column
            const weekNum = parseInt(td.dataset.week, 10);
            const year = new Date().getFullYear();
            const firstDayOfYear = new Date(year, 0, 1);
            const days = (weekNum - 1) * 7;
            const monday = new Date(
                firstDayOfYear.setDate(firstDayOfYear.getDate() + days - firstDayOfYear.getDay() + 1)
            );
            fromDate = formatDateTime(monday);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            toDate = formatDateTime(sunday).replace("00:00:00", "23:59:59");
        } else if (cellType === "day") {
            // Day column
            const dateStr = td.dataset.date;
            fromDate = `${dateStr} 00:00:00`;
            toDate = `${dateStr} 23:59:59`;
            workDate = fromDate;
        } else {
            return;
        }

        document.getElementById("loader").classList.remove("d-none");

        try {
            GLOBAL.currentSelection = {
                project,
                station,
                cellType,
                fromDate,
                toDate,
                workDate,
            };

            for (let i = 1; i <= 5; i++) {
                destroyChartById(`chart-${i}`);
            }

            let chartData = [];
            let top5Data = [];

            if (cellType === "week") {
                const result = await fetchChartDataShift({ project, station, fromDate, toDate });
                chartData = Array.isArray(result?.chartDatas) ? result.chartDatas : [];
                top5Data = Array.isArray(result?.top5) ? result.top5 : [];
            } else {
                const result = await fetchChartDataHour({ project, station, workDate });
                chartData = Array.isArray(result?.chartDatas) ? result.chartDatas : [];
                top5Data = Array.isArray(result?.top5) ? result.top5 : [];
            }

            await renderModalTable(top5Data);

            chartData.forEach((data, idx) => {
                const chartId = `chart-${idx + 1}`;
                if (Array.isArray(data) && data.length > 0) {
                    drawDailyChart(data, chartId);
                } else {
                    destroyChartById(chartId);
                }
            });

            const modal = new bootstrap.Modal(document.getElementById("modal-top5"));
            modal.show();
        } catch (error) {
            console.error(error);
        } finally {
            document.getElementById("loader").classList.add("d-none");
        }
    });
}

async function fetchChartDataShift({ project, station, fromDate, toDate }) {
    const apiUrl = `/production-system/api/cnt-machine-error/ntf/shift?fromDate=${encodeURIComponent(
        fromDate
    )}&toDate=${encodeURIComponent(toDate)}&station=${encodeURIComponent(station)}&projectName=${encodeURIComponent(
        project
    )}`;

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        const apiData = json.data;
        if (!Array.isArray(apiData) || apiData.length === 0) return { chartDatas: [], top5: [] };

        const summarized = apiData.map((error) => ({
            errorCode: error.errorCode,
            totalRate: error.totalRate,
            data: error.data,
            totalNtf: error.totalNtf,
            machineNo: error.machineNo || "",
        }));

        const top5 = summarized.sort((a, b) => b.totalRate - a.totalRate).slice(0, 5);

        const chartDatas = top5.map((err) => {
            const shiftMap = {};
            (err.data || []).forEach((item) => {
                const key = `${item.workDate}_${item.shift}`;
                shiftMap[key] = item;
            });

            const startDate = new Date(fromDate.split(" ")[0]);
            const endDate = new Date(toDate.split(" ")[0]);
            const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

            const points = [];
            for (let i = 0; i < daysDiff; i++) {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + i);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const date = String(d.getDate()).padStart(2, "0");
                const dateStr = `${year}-${month}-${date}`;
                const displayDate = `${date}/${month}`;

                ["DAY", "NIGHT"].forEach((shift) => {
                    const key = `${dateStr}_${shift}`;
                    const item = shiftMap[key];
                    const shiftLabel = shift === "DAY" ? "Day" : "Night";

                    points.push({
                        y: item?.ntfRate ?? 0,
                        cft: err.errorCode,
                        updatedAt: `${displayDate}<br/>${shiftLabel}`,
                        fullDate: `${dateStr} ${shiftLabel}`,
                        note: `${err.errorCode}`,
                        editor: "",
                        inputTotal: item?.inputTotal ?? 0,
                        ntfTotal: item?.ntfTotal ?? 0,
                        ntfRate: item?.ntfRate ?? 0,
                    });
                });
            }

            return points;
        });

        while (chartDatas.length < 5) chartDatas.push([]);

        return { chartDatas, top5: summarized.slice(0, 5) };
    } catch (err) {
        console.error("Lỗi:", err);
        return { chartDatas: [], top5: [] };
    }
}

async function fetchChartDataDate({ project, station, fromDate, toDate }) {
    const apiUrl = `/production-system/api/cnt-machine-error/ntf/date?fromDate=${encodeURIComponent(
        fromDate
    )}&toDate=${encodeURIComponent(toDate)}&station=${encodeURIComponent(station)}&projectName=${encodeURIComponent(
        project
    )}`;

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        const apiData = json.data;
        if (!Array.isArray(apiData) || apiData.length === 0) return { chartDatas: [], top5: [] };

        const summarized = apiData.map((error) => ({
            errorCode: error.errorCode,
            totalRate: error.totalRate,
            data: error.data,
            totalNtf: error.totalNtf,
            machineNo: error.machineNo || "",
        }));

        const top5 = summarized.sort((a, b) => b.totalRate - a.totalRate).slice(0, 5);

        const chartDatas = top5.map((err) => {
            const dateMap = {};
            (err.data || []).forEach((item) => {
                const key = `${item.workDate}`;
                dateMap[key] = item;
            });

            const startDate = new Date(fromDate.split(" ")[0]);
            const endDate = new Date(toDate.split(" ")[0]);
            const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

            const points = [];
            for (let i = 0; i < daysDiff; i++) {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + i);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const date = String(d.getDate()).padStart(2, "0");
                const dateStr = `${year}-${month}-${date}`;
                const displayDate = `${date}/${month}`;

                const item = dateMap[dateStr];

                points.push({
                    y: item?.ntfRate ?? 0,
                    cft: err.errorCode,
                    updatedAt: `${displayDate}`,
                    fullDate: `${dateStr}`,
                    note: `${err.errorCode}`,
                    editor: "",
                    inputTotal: item?.inputTotal ?? 0,
                    ntfTotal: item?.ntfTotal ?? 0,
                    ntfRate: item?.ntfRate ?? 0,
                });
            }

            return points;
        });

        while (chartDatas.length < 5) chartDatas.push([]);

        return { chartDatas, top5: summarized.slice(0, 5) };
    } catch (err) {
        console.error("Lỗi:", err);
        return { chartDatas: [], top5: [] };
    }
}

async function fetchChartDataHour({ project, station, workDate }) {
    const apiUrl = `/production-system/api/cnt-machine-error/ntf/hour?station=${encodeURIComponent(
        station
    )}&projectName=${encodeURIComponent(project)}&workDate=${encodeURIComponent(workDate)}`;

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        const apiData = json.data;
        if (!Array.isArray(apiData) || apiData.length === 0) {
            return { chartDatas: [], top5: [] };
        }

        const top5 = apiData.sort((a, b) => (b.totalRate ?? 0) - (a.totalRate ?? 0)).slice(0, 5);

        const chartDatas = top5.map((error) =>
            (error.data || []).map((point) => ({
                y: Math.trunc((point.ntfRate ?? 0) * 1000) / 1000,
                cft: error.errorCode,
                note: `${error.errorCode} - ${point.hour ?? "H"}`,
                editor: "",
                updatedAt: `${(point.hour ?? "H").split(":")[0]}:00`,
                fullDate: `${point.workDate} ${point.hour ?? "H"}:00`,
                inputTotal: point.inputTotal ?? 0,
                ntfTotal: point.ntfTotal ?? 0,
                ntfRate: point.ntfRate ?? 0,
            }))
        );

        while (chartDatas.length < 5) chartDatas.push([]);

        return {
            chartDatas,
            top5: top5.map((error) => ({
                errorCode: error.errorCode,
                totalRate: error.totalRate ?? 0,
                totalNtf: error.totalNtf ?? 0,
                machineNo: error.machineNo || "",
            })),
        };
    } catch (err) {
        console.error("Lỗi:", err);
        return { chartDatas: [], top5: [] };
    }
}

async function renderModalTable(top5Data) {
    const container = document.getElementById("top5-table-wrapper");
    const table = document.getElementById("table-2");
    const tbody = table?.querySelector("tbody");
    if (!container || !table || !tbody) return;

    const NO_DATA_ID = "top5-no-data";
    let noDataEl = document.getElementById(NO_DATA_ID);

    if (!Array.isArray(top5Data) || top5Data.length === 0) {
        tbody.innerHTML = "";
        table.classList.add("d-none");
        if (!noDataEl) {
            noDataEl = document.createElement("div");
            noDataEl.id = NO_DATA_ID;
            noDataEl.className = "w-100 text-center fw-bold py-5 border";
            noDataEl.textContent = "NO DATA !";
            container.appendChild(noDataEl);
        } else {
            noDataEl.classList.remove("d-none");
        }
        return;
    }

    if (noDataEl) noDataEl.classList.add("d-none");
    table.classList.remove("d-none");

    const infoMap = await fetchErrorInfoByCodes(top5Data.map((item) => item?.errorCode));
    tbody.innerHTML = "";

    top5Data.forEach((item, index) => {
        const row = document.createElement("tr");
        const errorCode = item?.errorCode || "";
        const info = infoMap[getErrorInfoKey(errorCode)] || { rootCause: "", action: "", owner: "", status: "" };
        const rootCause = info.rootCause || "";
        const action = info.action || "";
        const owner = info.owner || "N/A";
        const status = info.status || "N/A";

        row.dataset.errorCode = errorCode;
        row.dataset.machine = item?.machineNo || "";
        row.dataset.rootCause = rootCause;
        row.dataset.action = action;
        row.dataset.owner = owner;
        row.dataset.status = status;

        const appendCell = (text, className) => {
            const td = document.createElement("td");
            td.className = className;
            td.textContent = text;
            row.appendChild(td);
            return td;
        };

        appendCell(`${index + 1}`, "text-center align-middle");
        appendCell(errorCode || "-", "text-center align-middle");

        const rate = formatPercent(item?.totalRate);
        appendCell(rate === "-" ? "-" : `${rate}%`, "text-center align-middle");

        const totalErrors =
            typeof item?.totalNtf === "number" ? item.totalNtf.toLocaleString() : item?.totalNtf || "-";
        appendCell(totalErrors, "text-center align-middle");

        const chartTd = document.createElement("td");
        chartTd.className = "chart-container";
        const chartWrapper = document.createElement("div");
        chartWrapper.id = `chart-${index + 1}`;
        chartWrapper.className = "chart-wrapper";
        chartTd.appendChild(chartWrapper);
        row.appendChild(chartTd);

        const rootTd = document.createElement("td");
        rootTd.className = "text-start align-middle editable-cell";
        rootTd.dataset.field = "rootCause";
        rootTd.textContent = rootCause || "-";
        row.appendChild(rootTd);

        const actionTd = document.createElement("td");
        actionTd.className = "text-start align-middle editable-cell";
        actionTd.dataset.field = "action";
        actionTd.textContent = action || "-";
        row.appendChild(actionTd);

        appendCell(owner, "text-center align-middle");
        appendCell(status, "text-center align-middle");

        tbody.append(row);
    });
}

function renderTitleInfo(sel) {
    const titleEl = document.getElementById("title-info");
    if (!titleEl) return;

    const { project, station, cellType, fromDate, toDate, workDate } = sel;

    let timeRange = "";
    if ((cellType === "week" || cellType === "date") && fromDate && toDate) {
        const from = fromDate.split(" ")[0].replace(/\//g, "-");
        const to = toDate.split(" ")[0].replace(/\//g, "-");
        timeRange = `${from} → ${to}`;
    } else if (cellType === "day" && workDate) {
        timeRange = workDate.split(" ")[0].replace(/\//g, "-");
    }

    titleEl.textContent = `Top 5 Error Code - ${project || "-"} - ${station || "-"} - ${timeRange || "-"}`;
}

function modalControl() {
    const sel = GLOBAL.currentSelection || {};
    const groupByEl = document.getElementById("groupBy");
    renderTitleInfo(sel);
    const $dateInput = window.jQuery?.("#dateRange");

    if (!groupByEl || !$dateInput) return;

    resetDatePicker($dateInput);

    groupByEl.value =
        sel.cellType === "week"
            ? "Shift"
            : sel.cellType === "day"
                ? "Hour"
                : sel.cellType === "date"
                    ? "Day"
                    : groupByEl.value;
    sel.cellType === "week" || sel.cellType === "date"
        ? rangePicker($dateInput, sel.fromDate, sel.toDate)
        : singlePicker($dateInput, sel.workDate);

    const updateCharts = async (mode, project, station, picker) => {
        if (!project || !station) return;

        loader.load()
        try {
            chartsList.forEach((_, i) => destroyChartById(`chart-${i + 1}`));
            const [chartData, top5Data] =
                mode === "Shift"
                    ? await fetchShiftData(project, station, picker)
                    : mode === "Day"
                        ? await fetchDateData(project, station, picker)
                        : await fetchHourData(project, station, picker.startDate.format("YYYY/MM/DD"));
            renderTitleInfo(GLOBAL.currentSelection);
            await renderModalTable(top5Data);

            setTimeout(() => {
                renderCharts(chartData);
                adjustCharts();
            }, 200);
        } catch (error) {
            console.error(error);
        } finally {
            loader.unload()
        }
    };

    const applyBtn = document.getElementById("apply");
    if (applyBtn) {
        const newBtn = applyBtn.cloneNode(true);
        applyBtn.replaceWith(newBtn);

        newBtn.addEventListener("click", async () => {
            const picker = $dateInput.data("daterangepicker");
            if (!picker) return;

            loader.load()

            try {
                chartsList.forEach((_, i) => destroyChartById(`chart-${i + 1}`));
                clearTop5Table();

                await updateCharts(groupByEl.value, sel.project, sel.station, picker);
            } catch (err) {
                console.error(err);
            } finally {
                loader.unload()
            }
        });
    }

    groupByEl.onchange = () => {
        resetDatePicker($dateInput);
        if (groupByEl.value === "Shift" || groupByEl.value === "Day") {
            rangePicker($dateInput, sel.fromDate || formatTimePass(6), sel.toDate || formatDateTime(new Date()));
        } else {
            singlePicker(
                $dateInput,
                sel.workDate || sel.fromDate || `${formatDateTime(new Date()).split(" ")[0]} 00:00:00`
            );
        }
    };
}

const resetDatePicker = ($dateInput) => {
    try {
        $dateInput.data("daterangepicker")?.remove();
    } catch (_) { }
};

const renderCharts = (chartData) => {
    chartData.forEach((data, idx) => {
        const chartId = `chart-${idx + 1}`;
        const container = document.getElementById(chartId);
        if (!container) return;

        Object.assign(container.style, { width: "100%", height: "14vh", overflow: "hidden" });
        container.classList.add("no-select");

        Array.isArray(data) && data.length > 0 ? drawDailyChart(data, chartId) : destroyChartById(chartId);
    });
};

const adjustCharts = () => {
    chartsList.forEach((chart) => {
        chart.reflow?.();
        if (chart.scrollablePixelsX) {
            chart.update(
                {
                    chart: {
                        scrollablePlotArea: {
                            minWidth: chart.container.parentElement.offsetWidth,
                            scrollPositionX: 0,
                        },
                    },
                },
                false
            );
            chart.reflow();
        }
    });
};

const fetchShiftData = async (project, station, picker) => {
    const fromDate = `${picker.startDate.format("YYYY/MM/DD")} 00:00:00`;
    const toDate = picker.endDate
        ? `${picker.endDate.format("YYYY/MM/DD")} 23:59:59`
        : `${picker.startDate.format("YYYY/MM/DD")} 23:59:59`;

    const result = await fetchChartDataShift({ project, station, fromDate, toDate });
    GLOBAL.currentSelection = { project, station, cellType: "week", fromDate, toDate };

    return [result?.chartDatas || [], result?.top5 || []];
};

const fetchDateData = async (project, station, picker) => {
    const fromDate = `${picker.startDate.format("YYYY/MM/DD")} 00:00:00`;
    const toDate = picker.endDate
        ? `${picker.endDate.format("YYYY/MM/DD")} 23:59:59`
        : `${picker.startDate.format("YYYY/MM/DD")} 23:59:59`;

    const result = await fetchChartDataDate({ project, station, fromDate, toDate });
    GLOBAL.currentSelection = { project, station, cellType: "date", fromDate, toDate };

    return [result?.chartDatas || [], result?.top5 || []];
};

const fetchHourData = async (project, station, workDate) => {
    const result = await fetchChartDataHour({ project, station, workDate: `${workDate} 00:00:00` });
    GLOBAL.currentSelection = { project, station, cellType: "day", workDate };

    return [result?.chartDatas || [], result?.top5 || []];
};

const formatTimePass = (days) => formatDateTime(new Date(Date.now() - days * 86400000));

function rangePicker($input, fromDate, toDate) {
    const start = window.moment ? window.moment((fromDate || "").split(" ")[0], "YYYY/MM/DD") : null;
    const end = window.moment ? window.moment((toDate || "").split(" ")[0], "YYYY/MM/DD") : null;
    $input.daterangepicker({
        startDate: start || new Date(Date.now() - 6 * 86400000),
        endDate: end || new Date(),
        autoApply: false,
        locale: { format: "YYYY/MM/DD" },
    });
}

function singlePicker($input, workDate) {
    const dateOnly = (workDate || "").split(" ")[0];
    const start = window.moment ? window.moment(dateOnly, "YYYY/MM/DD") : null;
    $input.daterangepicker({
        singleDatePicker: true,
        startDate: start || new Date(),
        autoApply: false,
        locale: { format: "YYYY/MM/DD" },
    });
}

function formatPercent(value) {
    if (value == null || isNaN(value)) return "-";
    const val = value * 100;
    const cut = Math.trunc(val * 1000) / 1000;
    const str = cut.toString();
    return str.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
}

ready(function () {
    loadEvent();
    loadData();
    fetchMachineErrorSummary();
    getProjectAndStation();
});
