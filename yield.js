const dataset = {
    selectedModel: "",
    project: "",
    station: "",
    cellType: "",
    fromDate: "",
    toDate: "",
    cft: "RING",
};
const GLOBAL = {currentSelection: null};

const loadEvent = () => {
    document.querySelector("#table-1 tbody").addEventListener("click", async function (e) {
        const cell = e.target.closest("td");
        if (!cell) return;

        const project = cell.dataset.project;
        const station = cell.dataset.station;
        const cellType = cell.dataset.cellType;
        if (!project || !station || !cellType) return;

        dataset.project = project;
        dataset.station = station;
        dataset.cellType = cellType;

        let fromDate = cell.dataset.from || "";
        let toDate = cell.dataset.to || "";

        if ((!fromDate || !toDate) && cellType === "week") {
            const weekNum = parseInt(cell.dataset.week, 10);
            const {from, to} = utils.getWeekDateRange(weekNum);
            fromDate = from;
            toDate = to;
        } else if ((!fromDate || !toDate) && cellType === "day") {
            const dateStr = cell.dataset.date;
            fromDate = dateStr.replace(/-/g, "/") + " 00:00:00";
            toDate = dateStr.replace(/-/g, "/") + " 23:59:59";
        } else if (!fromDate || !toDate) {
            return;
        }

        dataset.fromDate = fromDate;
        dataset.toDate = toDate;
        GLOBAL.currentSelection = {
            project,
            station,
            cellType,
            fromDate,
            toDate,
            workDate: cellType === "day" ? fromDate : "",
        };

        loader.load();

        try {
            await getListModel(station, project);

            const modal = new bootstrap.Modal(document.getElementById("modal-table"));
            modal.show();
        } catch (error) {
            console.error(error);
        } finally {
            loader.unload();
        }
    });

    document.getElementById("model").addEventListener("change", function () {
        dataset.selectedModel = this.value;
    });

    document.getElementById("apply").addEventListener("click", async function () {
        const sel = GLOBAL.currentSelection || {};
        if (!sel.fromDate || !sel.toDate || !sel.station) return;

        loader.load();

        try {
            const fn = sel.cellType === "week" ? getDataByDay : getDataByHour;
            await fn(sel.fromDate, sel.toDate, sel.station, dataset.selectedModel);
        } catch (error) {
            console.error(error);
        } finally {
            loader.unload();
        }
    });

    const customerEl = document.getElementById("customerSelect");
    if (customerEl)
        customerEl.addEventListener("change", () => {
            dataset.cft = (customerEl.value || "RING").toUpperCase();
            getDataSummary();
        });
};

const loadData = () => {
    const customerEl = document.getElementById("customerSelect");
    if (customerEl) {
        if (customerEl.selectedIndex === -1) customerEl.selectedIndex = 0;
        dataset.cft = (customerEl.value || "RING").toUpperCase();
    }
    getDataSummary();
    initDateRangePicker();
};

// ========== UTILITY FUNCTIONS ==========
const utils = {
    getMondayTwoWeeksAgo() {
        const today = new Date();
        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(today.getDate() - 14);
        const day = twoWeeksAgo.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        const monday = new Date(twoWeeksAgo);
        monday.setDate(twoWeeksAgo.getDate() + diff);
        return monday;
    },

    formatDateTime(date, endOfDay = false) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        const time = endOfDay ? "23:59:59" : "00:00:00";
        return `${y}/${m}/${d} ${time}`;
    },

    parseYMD(s) {
        return new Date(s.split(" ")[0].replaceAll("/", "-"));
    },

    generateDateRange(startDaysAgo, numDays) {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - startDaysAgo);

        return Array.from({length: numDays}, (_, i) => {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}/${m}/${day}`;
        });
    },

    extractWeeks(apiData) {
        const weeksSet = new Set();
        apiData.forEach((item) => item.data.forEach((w) => weeksSet.add(w.week)));
        return Array.from(weeksSet).sort((a, b) => a - b);
    },

    getWeekDateRange(weekNum) {
        const year = new Date().getFullYear();
        const firstDayOfYear = new Date(year, 0, 1);
        const days = (weekNum - 1) * 7;
        const monday = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + days - firstDayOfYear.getDay() + 1));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return {
            from: this.formatDateTime(monday),
            to: this.formatDateTime(sunday, true),
        };
    },

    filterByDateRange(data, station, model) {
        return (data || []).filter((d) => (!station || d.station === station) && (!model || d.model === model));
    },
};

function formatDateTime(date) {
    return utils.formatDateTime(date);
}

function getMondayTwoWeeksAgo() {
    return utils.getMondayTwoWeeksAgo();
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

    const weeks = utils.extractWeeks(apiData);
    const lastThree = weeks.slice(-3);

    lastThree.forEach((wk) => {
        const th = document.createElement("th");
        th.textContent = `WK${wk}`;
        th.rowSpan = 2;
        th.classList.add("text-center", "align-middle");
        firstRow.appendChild(th);
    });

    const weekDates = utils.generateDateRange(10, 14);

    const secondRow = document.createElement("tr");
    thead.appendChild(secondRow);
    weekDates.forEach((dateStr) => {
        const [y, m, d] = dateStr.split("/");
        const th = document.createElement("th");
        th.textContent = `${m}/${d}`;
        th.classList.add("text-center");
        secondRow.appendChild(th);
    });
}

function renderTable(apiData) {
    const tbody = document.querySelector("#table-1 tbody");
    tbody.innerHTML = "";

    const weekDates = utils.generateDateRange(10, 14);
    const weeks = utils.extractWeeks(apiData);
    const lastThree = weeks.slice(-3);

    const grouped = {};
    apiData.forEach((item) => {
        if (!grouped[item.project]) grouped[item.project] = [];
        grouped[item.project].push(item);
    });

    const sortedProjects = Object.keys(grouped).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    sortedProjects.forEach((project) => {
        const items = grouped[project];
        items.sort((a, b) => a.station.toLowerCase().localeCompare(b.station.toLowerCase()));

        items.forEach((item, idx) => {
            const row = document.createElement("tr");

            if (idx === 0) {
                const tdProject = document.createElement("td");
                tdProject.textContent = project;
                tdProject.dataset.project = project;
                tdProject.rowSpan = items.length;
                tdProject.classList.add("align-middle", "fw-bold");
                row.appendChild(tdProject);
            }

            const tdStation = document.createElement("td");
            tdStation.textContent = item.station;
            tdStation.dataset.station = item.station;
            row.appendChild(tdStation);

            const weekMap = {};
            item.data.forEach((w) => (weekMap[w.week] = w));

            lastThree.forEach((wk) => {
                const wkData = weekMap[wk];
                const val = wkData?.targetRate != null ? (wkData.targetRate * 100).toFixed(2) + "%" : "-";

                const td = document.createElement("td");
                td.className = getCellClass(val);
                td.textContent = val;
                td.dataset.project = project;
                td.dataset.station = item.station;
                td.dataset.week = wk;
                td.dataset.cellType = "week";

                try {
                    const {from, to} = utils.getWeekDateRange(wk);
                    td.dataset.from = from;
                    td.dataset.to = to;
                } catch (_) {}

                row.appendChild(td);
            });

            weekDates.forEach((dateStr) => {
                const d = item.data
                    .flatMap((w) => w.data || [])
                    .find((x) => (x.workDate || "").split(" ")[0].replace(/-/g, "/") === dateStr);

                const val = d?.targetRate != null ? (d.targetRate * 100).toFixed(2) + "%" : "-";

                const td = document.createElement("td");
                td.className = getCellClass(val);
                td.textContent = val;
                td.dataset.project = project;
                td.dataset.station = item.station;
                td.dataset.date = dateStr;
                td.dataset.cellType = "day";
                td.dataset.from = `${dateStr} 00:00:00`;
                td.dataset.to = `${dateStr} 23:59:59`;
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });
    });
}

function getCellClass(value) {
    if (value === "-") return "bg-transparent";
    const num = parseFloat(value.replace("%", ""));
    if (num > 0) return "bg-warning text-dark cusor-pointer";
    return "bg-transparent";
}

const initDateRangePicker = () => {
    const $input = $("#dateRange");

    $input.daterangepicker({
        autoApply: true,
        locale: {format: "YYYY/MM/DD"},
    });

    $input.on("apply.daterangepicker", function (ev, picker) {
        const from = picker.startDate.format("YYYY/MM/DD") + " 00:00:00";
        const to = picker.endDate.format("YYYY/MM/DD") + " 23:59:59";
        dataset.fromDate = from;
        dataset.toDate = to;
        GLOBAL.currentSelection = Object.assign({}, GLOBAL.currentSelection || {}, {
            fromDate: from,
            toDate: to,
        });
    });
};

function formatPercent(value) {
    if (value == null || isNaN(value)) return "-";
    const val = value * 100;
    const cut = Math.trunc(val * 1000) / 1000;
    const str = cut.toString();
    return str.replace(/(\\.\\d*?[1-9])0+$/, "$1").replace(/\\.0+$/, "");
}

const api = {
    async fetchData(endpoint, params) {
        const queryString = new URLSearchParams(params).toString();
        const url = `/production-system/api/cnt-machine-error/${endpoint}?${queryString}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error:${res.status}`);
        const json = await res.json();
        return json?.data ?? [];
    },

    getSummary(fromDate, toDate, customer) {
        return this.fetchData("output/summary", {fromDate, toDate, cft: customer});
    },

    getModels(station, project) {
        return this.fetchData("model", {station, project});
    },

    getOutputDetail(fromDate, toDate, station, model, isHour) {
        return this.fetchData("output/detail", {fromDate, toDate, station, model, isHour});
    },
};

async function apiGetSummary(fromDate, toDate, customer) {
    return api.getSummary(fromDate, toDate, customer);
}

async function apiGetModels(station, project) {
    return api.getModels(station, project);
}

async function apiGetOutputDetail(fromDate, toDate, station, model, isHour) {
    return api.getOutputDetail(fromDate, toDate, station, model, isHour);
}

async function getDataSummary() {
    const fromDate = formatDateTime(getMondayTwoWeeksAgo());
    const toDate = formatDateTime(new Date()).replace("00:00:00", "23:59:59");
    try {
        const cft = dataset.cft || "RING";
        const data = await apiGetSummary(fromDate, toDate, cft);
        renderTableHeader(data);
        renderTable(data);
    } catch (err) {
        console.error(err);
    }
}

async function getListModel(station, project) {
    try {
        const data = await apiGetModels(station, project);

        const select = document.getElementById("model");
        if (!select) return;

        select.innerHTML = "";

        data.forEach((m) => {
            const opt = document.createElement("option");
            opt.value = m.modelName;
            opt.textContent = m.modelName;
            select.append(opt);
        });

        if (data.length > 0) {
            select.value = data[0].modelName;
            dataset.selectedModel = data[0].modelName;

            const sel = GLOBAL.currentSelection || {};
            const $input = $("#dateRange");
            if (sel.cellType === "week") {
                rangePicker($input, sel.fromDate, sel.toDate);
            } else if (sel.cellType === "day") {
                singlePicker($input, sel.workDate);
            }

            if (sel.fromDate && sel.toDate && sel.station) {
                const fn = sel.cellType === "week" ? getDataByDay : getDataByHour;
                await fn(sel.fromDate, sel.toDate, sel.station, dataset.selectedModel);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function getDataByHour(fromDate, toDate, station, model) {
    try {
        clearOldTable();
        loader.load();
        const fd = fromDate;
        const td = toDate;
        const raw = await apiGetOutputDetail(fd, td, station, model, true);
        if (!Array.isArray(raw) || raw.length === 0) {
            setModalNoData(true);
            clearDetailTable();
            return;
        }
        setModalNoData(false);
        const vm = buildHourViewModel(raw, fd, td, station, model);
        renderHourTableVM(vm);
    } catch (err) {
        console.error(err);
    } finally {
        loader.unload();
    }
}

async function getDataByDay(fromDate, toDate, station, model) {
    try {
        clearOldTable();
        loader.load();
        const fd = fromDate;
        const td = toDate;
        const raw = await apiGetOutputDetail(fd, td, station, model, false);
        if (!Array.isArray(raw) || raw.length === 0) {
            setModalNoData(true);
            clearDetailTable();
            return;
        }
        setModalNoData(false);
        const vm = buildDayViewModel(raw, fd, td, station, model);
        renderDayTableVM(vm);
    } catch (err) {
        console.error(err);
    } finally {
        loader.unload();
    }
}

function buildDayViewModel(data, fromDate, toDate, station, model) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const filt = utils.filterByDateRange(data, station, model);

    const dates = new Set();
    filt.forEach((m) =>
        (m.data || []).forEach((day) => {
            const d = utils.parseYMD(day.workDate);
            if (isNaN(d) || d < from || d > to) return;
            const dateStr = day.workDate.split(" ")[0];
            dates.add(dateStr);
        })
    );
    let dateArr = Array.from(dates).sort();

    const mtTotals = Array(dateArr.length).fill(0);
    const mtTotalsSeen = Array(dateArr.length).fill(false);
    const targetRateSums = Array(dateArr.length).fill(0);
    const targetRateCounts = Array(dateArr.length).fill(0);
    const mtTargetSeen = Array(dateArr.length).fill(false);

    const machines = [];
    filt.forEach((m) => {
        const rowTotals = Array(dateArr.length).fill(0);
        const rowTotalsSeen = Array(dateArr.length).fill(false);

        (m.data || []).forEach((day) => {
            const d = utils.parseYMD(day.workDate);
            if (isNaN(d) || d < from || d > to) return;
            const dateStr = day.workDate.split(" ")[0];
            const idx = dateArr.indexOf(dateStr);
            if (idx > -1) {
                const outTotal = Number(day.outputTotal ?? 0);
                const rateRaw = day.targetRate;
                const rateNum = rateRaw === null || rateRaw === undefined || rateRaw === "" ? null : Number(rateRaw);

                rowTotals[idx] += outTotal;
                rowTotalsSeen[idx] = true;
                mtTotals[idx] += outTotal;
                mtTotalsSeen[idx] = true;

                if (rateNum !== null && !Number.isNaN(rateNum)) {
                    targetRateSums[idx] += rateNum;
                    targetRateCounts[idx] += 1;
                    mtTargetSeen[idx] = true;
                }
            }
        });

        machines.push({
            machineNo: m.machineNo,
            totals: rowTotals,
            totalsSeen: rowTotalsSeen,
            uph: m.uph,
        });
    });

    const mtTargetRates = targetRateSums.map((sum, idx) =>
        targetRateCounts[idx] ? sum / targetRateCounts[idx] : null
    );
    const first = filt[0];
    const derivedModel = first?.model || model || "Model";
    const derivedStation = first?.station || station || "";

    return {
        title: derivedModel,
        station: derivedStation,
        dates: dateArr,
        machines,
        mtTotals,
        mtTargetRates,
        mtTotalsSeen,
        mtTargetSeen,
        uphDisplay: "-",
    };
}

function buildHourViewModel(data, fromDate, toDate, station, model) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const filt = utils.filterByDateRange(data, station, model);

    const hourSet = new Set();
    const hourLabelMap = new Map();
    filt.forEach((m) =>
        (m.data || []).forEach((day) => {
            const d = utils.parseYMD(day.workDate);
            if (isNaN(d) || d < from || d > to) return;
            (day.data || []).forEach((h) => {
                const idx = parseInt(h.workHour, 10);
                if (isNaN(idx)) return;
                const hourIdx = idx % 24;
                hourSet.add(hourIdx);
                const rawLabel =
                    typeof h.workHour === "string" && h.workHour
                        ? h.workHour
                        : `${String(hourIdx).padStart(2, "0")}:00`;
                if (!hourLabelMap.has(hourIdx)) hourLabelMap.set(hourIdx, rawLabel);
            });
        })
    );
    let hours = Array.from(hourSet).sort((a, b) => a - b);
    if (hours.length === 0) hours = Array.from({length: 24}, (_, i) => i);
    const hourLabels = hours.map((hr) => hourLabelMap.get(hr) || `${String(hr).padStart(2, "0")}:00`);

    const mtTotals = Array(hours.length).fill(0);
    const mtGaps = Array(hours.length).fill(0);
    const mtTotalsSeen = Array(hours.length).fill(false);
    const mtGapsSeen = Array(hours.length).fill(false);
    const targetRateSums = Array(hours.length).fill(0);
    const targetRateCounts = Array(hours.length).fill(0);
    const mtTargetSeen = Array(hours.length).fill(false);

    const machines = [];
    filt.forEach((m) => {
        const rowVals = Array(hours.length).fill(0);
        const rowSeen = Array(hours.length).fill(false);
        const rowGaps = Array(hours.length).fill(0);
        const rowGapsSeen = Array(hours.length).fill(false);

        (m.data || []).forEach((day) => {
            const d = utils.parseYMD(day.workDate);
            if (isNaN(d) || d < from || d > to) return;
            (day.data || []).forEach((h) => {
                const idx = parseInt(h.workHour, 10);
                if (isNaN(idx)) return;
                const hourIdx = idx % 24;
                const i = hours.indexOf(hourIdx);
                if (i === -1) return;

                const outTotal = Number(h.outputTotal ?? 0);
                const gap = Number(h.gapTotal ?? 0);
                const rateRaw = h.targetRate;
                const rateNum = rateRaw === null || rateRaw === undefined || rateRaw === "" ? null : Number(rateRaw);

                rowVals[i] += outTotal;
                rowSeen[i] = true;
                rowGaps[i] += gap;
                rowGapsSeen[i] = true;

                mtTotals[i] += outTotal;
                mtGaps[i] += gap;
                mtTotalsSeen[i] = true;
                mtGapsSeen[i] = true;

                if (rateNum !== null && !Number.isNaN(rateNum)) {
                    targetRateSums[i] += rateNum;
                    targetRateCounts[i] += 1;
                    mtTargetSeen[i] = true;
                }
            });
        });

        machines.push({
            machineNo: m.machineNo,
            vals: rowVals,
            seen: rowSeen,
            gaps: rowGaps,
            gapsSeen: rowGapsSeen,
        });
    });

    const mtTargetRates = targetRateSums.map((sum, idx) =>
        targetRateCounts[idx] ? sum / targetRateCounts[idx] : null
    );

    const first = filt[0];
    const derivedModel = first?.model || model || "Model";
    const derivedStation = first?.station || station || "";

    return {
        title: derivedModel,
        station: derivedStation,
        hours,
        hourLabels,
        machines,
        mtTotals,
        mtGaps,
        mtTargetRates,
        mtTotalsSeen,
        mtGapsSeen,
        mtTargetSeen,
    };
}

function renderDayTableVM(vm) {
    const table = document.getElementById("table-2");
    if (!table) return;

    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    thead.innerHTML = "";
    tbody.innerHTML = "";

    const dates = vm.dates;

    const topRow = document.createElement("tr");
    const titleTh = document.createElement("th");
    titleTh.rowSpan = dates.length ? 2 : 1;
    titleTh.textContent = vm.title;
    titleTh.classList.add("text-center", "align-middle");
    topRow.appendChild(titleTh);

    const uphTh = document.createElement("th");
    uphTh.rowSpan = dates.length ? 2 : 1;
    uphTh.textContent = "UPH";
    uphTh.classList.add("text-center", "align-middle");
    topRow.appendChild(uphTh);

    thead.appendChild(topRow);

    if (dates.length) {
        const dateRow = document.createElement("tr");
        dates.forEach((dateStr) => {
            const th = document.createElement("th");
            const [y, m, d] = dateStr.split("/");
            th.textContent = `${m}/${d}`;
            th.classList.add("text-center", "small");
            dateRow.appendChild(th);
        });
        thead.appendChild(dateRow);
    }

    const {machines, mtTotals, mtTargetRates, mtTotalsSeen, mtTargetSeen, uphDisplay} = vm;

    const addRow = (label, vals, seenArr, options = {}) => {
        const {
            rowClass = "",
            formatter = (value) => value,
            cellClassResolver = getDayCellClass,
            uphValue = "-",
        } = options;

        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.classList.add("bg-transparent", "text-white", "text-start");
        th.textContent = label;
        tr.appendChild(th);

        const uphTd = document.createElement("td");
        uphTd.textContent = uphValue ?? "-";
        uphTd.classList.add("text-center", "align-middle");
        tr.appendChild(uphTd);

        vals.forEach((v, idx) => {
            const td = document.createElement("td");
            const seen = !!seenArr[idx];
            let displayValue = "-";
            if (seen) {
                const formatted = formatter(v, idx);
                displayValue = formatted === null || formatted === undefined ? "-" : formatted;
            }
            td.textContent = displayValue;
            td.className = cellClassResolver(v, seen);
            tr.appendChild(td);
        });

        if (rowClass) tr.classList.add(rowClass);
        tbody.appendChild(tr);
    };

    addRow("MT-Total", mtTotals, mtTotalsSeen, {rowClass: "table-secondary", uphValue: uphDisplay});

    addRow("Target Rate", mtTargetRates, mtTargetSeen, {
        uphValue: uphDisplay,
        formatter: (value) => (value == null || Number.isNaN(value) ? "-" : `${(value * 100).toFixed(2)}%`),
        cellClassResolver: getTargetCellClass,
    });

    machines.forEach((m) => {
        const machineUph =
            m.uph == null || m.uph === "" ? "-" : Number(m.uph) || Number(m.uph) === 0 ? Number(m.uph) : m.uph;
        addRow(m.machineNo, m.totals, m.totalsSeen, {
            uphValue: machineUph === 0 ? "0" : machineUph,
        });
    });
}

function renderHourTableVM(vm) {
    const table = document.getElementById("table-2");
    if (!table) return;

    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    thead.innerHTML = "";
    tbody.innerHTML = "";

    const hours = vm.hours;
    const hourLabels = vm.hourLabels || hours.map((hr) => `${String(hr).padStart(2, "0")}:00`);

    const topRow = document.createElement("tr");
    const titleTh = document.createElement("th");
    titleTh.rowSpan = hours.length ? 2 : 1;
    titleTh.textContent = vm.title;
    titleTh.classList.add("text-center", "align-middle");
    topRow.appendChild(titleTh);

    if (hours.length) {
        const spanTh = document.createElement("th");
        spanTh.colSpan = hours.length;
        spanTh.textContent = "Work Hour";
        spanTh.classList.add("text-center", "align-middle");
        topRow.appendChild(spanTh);
    }
    thead.appendChild(topRow);

    if (hours.length) {
        const hourRow = document.createElement("tr");
        hours.forEach((x, idx) => {
            const th = document.createElement("th");
            const start = hourLabels[idx] || `${String(x).padStart(2, "0")}:00`;
            const end = `${String((x + 1) % 24).padStart(2, "0")}:00`;
            th.textContent = `${start} - ${end}`;
            th.classList.add("text-center", "small");
            hourRow.appendChild(th);
        });
        thead.appendChild(hourRow);
    }

    const {machines, mtTotals, mtGaps, mtTargetRates, mtTotalsSeen, mtGapsSeen, mtTargetSeen} = vm;

    const addRow = (label, vals, seenArr, options = {}) => {
        const {rowClass = "", formatter = (value) => value, cellClassResolver = getHourCellClass} = options;

        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.classList.add("bg-transparent", "text-white", "text-start");
        th.textContent = label;
        tr.appendChild(th);

        vals.forEach((value, idx) => {
            const td = document.createElement("td");
            const seen = !!seenArr[idx];
            let displayValue = "-";
            if (seen) {
                const formatted = formatter(value, idx);
                displayValue = formatted === null || formatted === undefined ? "-" : formatted;
            }
            td.textContent = displayValue;
            td.className = cellClassResolver(value, seen);
            tr.appendChild(td);
        });

        if (rowClass) tr.classList.add(rowClass);
        tbody.appendChild(tr);
    };

    addRow("MT-Total", mtTotals, mtTotalsSeen, {rowClass: "table-secondary"});

    addRow("Gap", mtGaps, mtGapsSeen);

    addRow("Target Rate", mtTargetRates, mtTargetSeen, {
        formatter: (value) => (value == null || Number.isNaN(value) ? "-" : `${(value * 100).toFixed(2)}%`),
        cellClassResolver: getTargetCellClass,
    });

    machines.forEach((r) => addRow(r.machineNo, r.vals, r.seen));
}

function getDayCellClass(value, seen) {
    if (!seen || value === "-" || value === "0" || value === 0 || isNaN(Number(value))) {
        return "bg-transparent text-white";
    }

    const num = Number(value);

    if (num < 50) return "bg-warning text-dark";
    if (num < 100) return "bg-success text-dark";
    return "bg-success text-dark";
}

function getHourCellClass(value, seen) {
    if (!seen || value === "-" || value === "0" || value === 0 || isNaN(Number(value))) {
        return "bg-transparent text-white";
    }

    const num = Number(value);

    if (num < 5) return "bg-warning text-dark";
    if (num < 10) return "bg-success text-dark";
    return "bg-success text-dark";
}

function getTargetCellClass(value, seen) {
    if (!seen || value == null || Number.isNaN(value)) {
        return "bg-transparent text-white";
    }

    const percent = Number(value) * 100;
    if (Number.isNaN(percent)) return "bg-transparent text-white";

    if (percent >= 100) return "bg-success text-dark";
    if (percent >= 80) return "bg-warning text-dark";
    return "bg-danger text-white";
}

function setModalNoData(isNoData) {
    const container = document.querySelector("#modal-table .table-responsive");
    const table = document.getElementById("table-2");
    if (!container || !table) return;
    const NO_DATA_ID = "noData";
    let noDataEl = document.getElementById(NO_DATA_ID);
    if (isNoData) {
        const tbody = table.querySelector("tbody");
        if (tbody) tbody.innerHTML = "";
        table.classList.add("d-none");
        container.classList.add("no-data-active");
        if (!noDataEl) {
            noDataEl = document.createElement("div");
            noDataEl.id = NO_DATA_ID;
            noDataEl.className = "no-data-placeholder";
            noDataEl.textContent = "NO DATA !";
            container.appendChild(noDataEl);
        } else {
            noDataEl.classList.remove("d-none");
        }
    } else {
        if (noDataEl) noDataEl.classList.add("d-none");
        table.classList.remove("d-none");
        container.classList.remove("no-data-active");
    }
}

function clearDetailTable() {
    const table = document.getElementById("table-2");
    const thead = table?.querySelector("thead");
    const tbody = table?.querySelector("tbody");
    if (thead) thead.innerHTML = "";
    if (tbody) tbody.innerHTML = "";
}

function clearOldTable() {
    clearDetailTable();
    const table = document.getElementById("table-2");
    if (table) table.classList.add("d-none");
    const noDataEl = document.getElementById("noData");
    if (noDataEl) noDataEl.classList.add("d-none");
}

function rangePicker($input, fromDate, toDate) {
    const start = window.moment ? window.moment((fromDate || "").split(" ")[0], "YYYY/MM/DD") : null;
    const end = window.moment ? window.moment((toDate || "").split(" ")[0], "YYYY/MM/DD") : null;
    $input.daterangepicker({
        startDate: start || new Date(Date.now() - 6 * 86400000),
        endDate: end || new Date(),
        autoApply: false,
        locale: {format: "YYYY/MM/DD"},
    });
}

function singlePicker($input, workDate) {
    const dateOnly = (workDate || "").split(" ")[0];
    const start = window.moment ? window.moment(dateOnly, "YYYY/MM/DD") : null;
    $input.daterangepicker({
        singleDatePicker: true,
        startDate: start || new Date(),
        autoApply: false,
        locale: {format: "YYYY/MM/DD"},
    });
}

ready(function () {
    loadEvent();
    loadData();
});
