const dataset = {
    selectedModel: "",
    project: "",
    station: "",
    cellType: "",
    fromDate: "",
    toDate: "",
    cft: "RING",
};
const GLOBAL = { currentSelection: null };

const getDateRangeFromCell = (cell) => {
    const cellType = cell.dataset.cellType;
    let from = cell.dataset.from || "";
    let to = cell.dataset.to || "";

    if (from && to) return { from, to };

    if (cellType === "week") {
        const weekNum = parseInt(cell.dataset.week, 10);
        return utils.getWeekDateRange(weekNum);
    } else if (cellType === "day") {
        const dateStr = cell.dataset.date;
        return {
            from: `${dateStr.replace(/-/g, "/")} 00:00:00`,
            to: `${dateStr.replace(/-/g, "/")} 23:59:59`,
        };
    }
    return { from: null, to: null };
};

const handleTableCellClick = async (cell) => {
    const project = cell.dataset.project;
    const station = cell.dataset.station;
    const cellType = cell.dataset.cellType;
    if (!project || !station || !cellType) return;

    const { from: fromDate, to: toDate } = getDateRangeFromCell(cell);
    if (!fromDate || !toDate) return;

    Object.assign(dataset, { project, station, cellType, fromDate, toDate });

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
        console.error("Error handling table cell click:", error);
    } finally {
        loader.unload();
    }
};

const handleTableClick = () => {
    const table = document.getElementById("table-1");
    if (!table) return;
    table.addEventListener("click", (e) => {
        const cell = e.target.closest("td");
        if (cell && table.contains(cell)) {
            handleTableCellClick(cell);
        }
    });
};
const handleModelChange = () => {
    document.getElementById("model").addEventListener("change", function () {
        dataset.selectedModel = this.value;
    });
};

const handleApplyBtn = () => {
    document.getElementById("apply").addEventListener("click", async () => {
        const mode = document.querySelector("#groupBy").value.toLowerCase();
        const isHour = mode === "hour";

        if (!dataset.fromDate || !dataset.toDate) {
            alert("Vui lòng chọn ngày !");
            return;
        }

        const station = GLOBAL.currentSelection?.station;
        const model = dataset.selectedModel;

        if (!station || !model) {
            alert("Thiếu thông tin station hoặc model");
            return;
        }

        loader.load();
        try {
            const raw = await apiGetOutputDetail(dataset.fromDate, dataset.toDate, station, model, isHour);

            // Kiểm tra dữ liệu rỗng
            if (!Array.isArray(raw) || raw.length === 0) {
                setModalNoData(true);
                clearDetailTable();
                return;
            }

            // Có dữ liệu → render bình thường
            setModalNoData(false);

            if (isHour) {
                const vm = buildHourViewModel(raw, dataset.fromDate, dataset.toDate, station, model);
                renderHourTableVM(vm);
            } else {
                const vm = buildDayViewModel(raw, dataset.fromDate, dataset.toDate, station, model);
                renderDayTableVM(vm);
            }
        } catch (err) {
            console.error("Error in handleApplyBtn:", err);
            setModalNoData(true);
            clearDetailTable();
        } finally {
            loader.unload();
        }
    });
};

const selectGroup = () => {
    document.querySelector("#groupBy").addEventListener("change", function () {
        const mode = this.value.toLowerCase();
        const $dr = $("#dateRange");

        // Lưu giá trị hiện tại trước khi destroy
        const currentStart = $dr.data("daterangepicker")?.startDate;
        const currentEnd = $dr.data("daterangepicker")?.endDate;

        if ($dr.data("daterangepicker")) {
            $dr.data("daterangepicker").remove();
        }

        if (mode === "day") {
            $dr.daterangepicker({
                startDate: currentStart || new Date(Date.now() - 6 * 86400000),
                endDate: currentEnd || new Date(),
                autoApply: true,
                locale: { format: "YYYY/MM/DD" },
            });
            dataset.cellType = "day";

            // Cập nhật dataset với range hiện tại
            if (currentStart && currentEnd) {
                dataset.fromDate = currentStart.format("YYYY/MM/DD") + " 00:00:00";
                dataset.toDate = currentEnd.format("YYYY/MM/DD") + " 23:59:59";
            }
        } else {
            // Hour mode - chỉ lấy ngày đầu
            const singleDate = currentStart || new Date();
            $dr.daterangepicker({
                singleDatePicker: true,
                startDate: singleDate,
                autoApply: true,
                locale: { format: "YYYY/MM/DD" },
            });
            dataset.cellType = "hour";

            // Cập nhật dataset về cùng ngày
            const dateStr = (currentStart || window.moment()).format("YYYY/MM/DD");
            dataset.fromDate = dateStr + " 00:00:00";
            dataset.toDate = dateStr + " 23:59:59";
        }

        // Gắn lại event listener
        $dr.off("apply.daterangepicker").on("apply.daterangepicker", function (ev, picker) {
            const from = picker.startDate.format("YYYY/MM/DD") + " 00:00:00";
            const to = picker.endDate
                ? picker.endDate.format("YYYY/MM/DD") + " 23:59:59"
                : from.replace("00:00:00", "23:59:59");

            dataset.fromDate = from;
            dataset.toDate = to;

            if (GLOBAL.currentSelection) {
                GLOBAL.currentSelection.fromDate = from;
                GLOBAL.currentSelection.toDate = to;
            }
        });
    });
};

function handleUPHcolClick() {
    document.querySelector("#table-2").addEventListener("click", (e) => {
        const cell = e.target.closest(".uph-cell");
        if (!cell) return;

        const machineNo = cell.dataset.machine;
        if (!machineNo) return;

        const currentValue = cell.textContent.trim() || "-";

        const modal = document.getElementById("update-uph");
        if (modal) {
            const label = modal.querySelector("#uphMachineNo");
            const input = modal.querySelector("#uphInput");
            if (label) label.textContent = machineNo;
            if (input) input.value = currentValue !== "-" ? currentValue : "";
            new bootstrap.Modal(modal).show();
        }
    });
}

const handleCustomerSelectChange = () => {
    const customerEl = document.getElementById("customerSelect");
    if (customerEl) {
        customerEl.addEventListener("change", () => {
            dataset.cft = (customerEl.value || "RING").toUpperCase();
            getDataSummary();
        });
    }
};

const loadEvent = () => {
    handleTableClick();
    handleModelChange();
    handleApplyBtn();
    handleCustomerSelectChange();
    handleUPHcolClick();
    selectGroup();
    uphEvent();
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

        return Array.from({ length: numDays }, (_, i) => {
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

        const dateForMonday = new Date(firstDayOfYear);
        dateForMonday.setDate(dateForMonday.getDate() + days - dateForMonday.getDay() + 1);

        const monday = dateForMonday;
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

const prepareRenderData = (apiData) => {
    const grouped = {};
    apiData.forEach((item) => {
        if (!grouped[item.project]) grouped[item.project] = [];
        grouped[item.project].push(item);
    });

    return Object.keys(grouped)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map((project) => {
            const items = grouped[project].sort((a, b) =>
                a.station.toLowerCase().localeCompare(b.station.toLowerCase())
            );
            return { project, items };
        });
};

const createCell = (text, className = "") => {
    const cell = document.createElement("td");
    cell.textContent = text;
    if (className) cell.className = className;
    return cell;
};

const createProjectCell = (project, rowSpan) => {
    const cell = createCell(project, "align-middle fw-bold");
    cell.dataset.project = project;
    cell.rowSpan = rowSpan;
    return cell;
};

const createStationCell = (station) => {
    const cell = createCell(station);
    cell.dataset.station = station;
    return cell;
};

const createWeekCell = (wk, wkData, project, station) => {
    const val = wkData?.targetRate != null ? `${(wkData.targetRate * 100).toFixed(2)}%` : "-";
    const cell = createCell(val, getCellClass(val));
    Object.assign(cell.dataset, { project, station, week: wk, cellType: "week" });
    try {
        const { from, to } = utils.getWeekDateRange(wk);
        Object.assign(cell.dataset, { from, to });
    } catch (_) { }
    return cell;
};

const createDayCell = (dateStr, dayData, project, station) => {
    const val = dayData?.targetRate != null ? `${(dayData.targetRate * 100).toFixed(2)}%` : "-";
    const cell = createCell(val, getCellClass(val));
    Object.assign(cell.dataset, {
        project,
        station,
        date: dateStr,
        cellType: "day",
        from: `${dateStr} 00:00:00`,
        to: `${dateStr} 23:59:59`,
    });
    return cell;
};

function renderTable(apiData) {
    const tbody = document.querySelector("#table-1 tbody");
    tbody.innerHTML = "";

    const weekDates = utils.generateDateRange(10, 14);
    const lastThreeWeeks = utils.extractWeeks(apiData).slice(-3);
    const processedData = prepareRenderData(apiData);

    processedData.forEach(({ project, items }) => {
        items.forEach((item, idx) => {
            const row = document.createElement("tr");

            if (idx === 0) {
                row.appendChild(createProjectCell(project, items.length));
            }
            row.appendChild(createStationCell(item.station));

            const weekMap = new Map(item.data.map((w) => [w.week, w]));
            lastThreeWeeks.forEach((wk) => {
                row.appendChild(createWeekCell(wk, weekMap.get(wk), project, item.station));
            });

            const dayDataMap = new Map(
                item.data
                    .flatMap((w) => w.data || [])
                    .map((d) => [(d.workDate || "").split(" ")[0].replace(/-/g, "/"), d])
            );
            weekDates.forEach((dateStr) => {
                row.appendChild(createDayCell(dateStr, dayDataMap.get(dateStr), project, item.station));
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

const initDateRangePicker = () => {
    const $input = $("#dateRange");

    $input.daterangepicker({
        autoApply: true,
        locale: { format: "YYYY/MM/DD" },
    });

    $input.on("apply.daterangepicker", function (ev, picker) {
        const from = picker.startDate.format("YYYY/MM/DD") + " 00:00:00";
        const to = picker.endDate.format("YYYY/MM/DD") + " 23:59:59";

        dataset.fromDate = from;
        dataset.toDate = to;

        if (GLOBAL.currentSelection) {
            GLOBAL.currentSelection.fromDate = from;
            GLOBAL.currentSelection.toDate = to;
        }
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
        return this.fetchData("output/summary", { fromDate, toDate, cft: customer });
    },

    getModels(station, project) {
        return this.fetchData("model", { station, project });
    },

    getOutputDetail(fromDate, toDate, station, model, isHour) {
        return this.fetchData("output/detail", { fromDate, toDate, station, model, isHour });
    },

    async updateUph(machineNo, model, station, uph) {
        const params = { machineNo, model, station, uph };
        const queryString = new URLSearchParams(params).toString();
        const url = `/production-system/api/cnt-machine-error/uph?${queryString}`;
        const res = await fetch(url, { method: "PUT" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
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

function uphEvent() {
    const saveBtn = document.getElementById("saveUphBtn");
    if (!saveBtn) return;

    saveBtn.addEventListener("click", async () => {
        const machineNo = document.getElementById("uphMachineNo")?.textContent.trim();
        const uphInput = document.getElementById("uphInput")?.value.trim();

        if (!machineNo || uphInput === "") {
            alert("Please enter UPH value");
            return;
        }

        const uph = parseInt(uphInput, 10);
        if (isNaN(uph) || uph < 0) {
            alert("UPH must be a valid number");
            return;
        }

        const model = dataset.selectedModel;
        const station = GLOBAL.currentSelection?.station || "";

        try {
            loader.load();

            await api.updateUph(machineNo, model, station, uph);

            const cell = document.querySelector(`.uph-cell[data-machine="${machineNo}"]`);
            if (cell) cell.textContent = uph;

            const modal = bootstrap.Modal.getInstance(document.getElementById("update-uph"));
            modal?.hide();

            const sel = GLOBAL.currentSelection || {};
            if (sel.fromDate && sel.toDate && sel.station) {
                const fn = sel.cellType === "week" ? getDataByDay : getDataByHour;
                await fn(sel.fromDate, sel.toDate, sel.station, dataset.selectedModel);
            }
        } catch (err) {
            console.error("Error updating UPH:", err);
            alert("Failed to update UPH.");
        } finally {
            loader.unload();
        }
    });
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

        if (data.length === 0) return;

        select.value = data[0].modelName;
        dataset.selectedModel = data[0].modelName;

        const sel = GLOBAL.currentSelection || {};
        const $input = $("#dateRange");

        if ($input.data("daterangepicker")) {
            $input.data("daterangepicker").remove();
        }

        const groupBySelect = document.querySelector("#groupBy");
        const currentMode = groupBySelect?.value.toLowerCase() || "day";
        const isHourMode = currentMode === "hour";

        if (isHourMode) {
            const dateOnly = (sel.fromDate || "").split(" ")[0];
            const startDate = dateOnly ? window.moment(dateOnly, "YYYY/MM/DD") : window.moment();

            $input.daterangepicker({
                singleDatePicker: true,
                startDate: startDate,
                autoApply: true,
                locale: { format: "YYYY/MM/DD" },
            });

            const dateStr = startDate.format("YYYY/MM/DD");
            dataset.fromDate = dateStr + " 00:00:00";
            dataset.toDate = dateStr + " 23:59:59";
            dataset.cellType = "hour";
        } else {
            const startDate = sel.fromDate
                ? window.moment(sel.fromDate.split(" ")[0], "YYYY/MM/DD")
                : window.moment().subtract(6, "days");
            const endDate = sel.toDate ? window.moment(sel.toDate.split(" ")[0], "YYYY/MM/DD") : window.moment();

            $input.daterangepicker({
                startDate: startDate,
                endDate: endDate,
                autoApply: true,
                locale: { format: "YYYY/MM/DD" },
            });

            dataset.fromDate = startDate.format("YYYY/MM/DD") + " 00:00:00";
            dataset.toDate = endDate.format("YYYY/MM/DD") + " 23:59:59";
            dataset.cellType = "day";
        }

        $input.off("apply.daterangepicker").on("apply.daterangepicker", function (ev, picker) {
            const from = picker.startDate.format("YYYY/MM/DD") + " 00:00:00";
            const to = picker.endDate
                ? picker.endDate.format("YYYY/MM/DD") + " 23:59:59"
                : from.replace("00:00:00", "23:59:59");

            dataset.fromDate = from;
            dataset.toDate = to;

            if (!GLOBAL.currentSelection) GLOBAL.currentSelection = {};
            GLOBAL.currentSelection.fromDate = from;
            GLOBAL.currentSelection.toDate = to;
        });

        if (GLOBAL.currentSelection) {
            GLOBAL.currentSelection.fromDate = dataset.fromDate;
            GLOBAL.currentSelection.toDate = dataset.toDate;
        }

        if (sel.station) {
            const loadFn = isHourMode ? getDataByHour : getDataByDay;
            await loadFn(dataset.fromDate, dataset.toDate, sel.station, dataset.selectedModel);
        }
    } catch (err) {
        console.error("Error in getListModel:", err);
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

function processDayData(data, from, to, dateArr) {
    const dateMap = new Map(dateArr.map((date, i) => [date, i]));
    const machineData = new Map();

    data.forEach((m) => {
        if (!machineData.has(m.machineNo)) {
            machineData.set(m.machineNo, {
                machineNo: m.machineNo,
                uph: m.uph,
                totals: Array(dateArr.length).fill(0),
                seen: Array(dateArr.length).fill(false),
            });
        }
        const machine = machineData.get(m.machineNo);

        (m.data || []).forEach((day) => {
            const d = utils.parseYMD(day.workDate);
            if (isNaN(d) || d < from || d > to) return;

            const dateStr = day.workDate.split(" ")[0];
            const idx = dateMap.get(dateStr);
            if (idx === undefined) return;

            const outTotal = Number(day.outputTotal ?? 0);
            machine.totals[idx] += outTotal;
            machine.seen[idx] = true;
        });
    });

    return Array.from(machineData.values());
}

function calculateTargetRate(total, gap) {
    // Target rate = output total / (output total - gap)
    const totalNum = Number(total);
    const gapNum = Number(gap);
    if (!Number.isFinite(totalNum) || !Number.isFinite(gapNum)) return null;
    const denominator = totalNum - gapNum;
    if (!Number.isFinite(denominator) || denominator === 0) return null;
    return totalNum / denominator;
}

function buildDayViewModel(data, fromDate, toDate, station, model) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const filt = utils.filterByDateRange(data, station, model);

    const dateSet = new Set();
    filt.forEach((m) =>
        (m.data || []).forEach((day) => {
            const d = utils.parseYMD(day.workDate);
            if (isNaN(d) || d < from || d > to) return;
            dateSet.add(day.workDate.split(" ")[0]);
        })
    );
    const dateArr = Array.from(dateSet).sort();

    const machines = processDayData(filt, from, to, dateArr);

    const mtTotals = Array(dateArr.length).fill(0);
    const mtTotalsSeen = Array(dateArr.length).fill(false);
    const mtGaps = Array(dateArr.length).fill(0);
    const mtGapsSeen = Array(dateArr.length).fill(false);
    const mtTargetSeen = Array(dateArr.length).fill(false);

    filt.forEach((m) => {
        (m.data || []).forEach((day) => {
            const d = utils.parseYMD(day.workDate);
            if (isNaN(d) || d < from || d > to) return;

            const dateStr = day.workDate.split(" ")[0];
            const idx = dateArr.indexOf(dateStr);
            if (idx === -1) return;

            const outTotal = Number(day.outputTotal ?? 0);
            const gapTotal = Number(day.gapTotal ?? 0);

            mtTotals[idx] += outTotal;
            mtTotalsSeen[idx] = true;

            mtGaps[idx] += gapTotal;
            mtGapsSeen[idx] = true;
        });
    });

    const mtTargetRates = mtTotals.map((total, idx) => {
        if (!mtTotalsSeen[idx]) return null;
        const rate = calculateTargetRate(total, mtGaps[idx]);
        if (rate !== null && !Number.isNaN(rate)) {
            mtTargetSeen[idx] = true;
            return rate;
        }
        return null;
    });

    const first = filt[0];
    return {
        title: first?.model || model || "Model",
        station: first?.station || station || "",
        dates: dateArr,
        machines,
        mtTotals,
        mtGaps,
        mtTargetRates,
        mtTotalsSeen,
        mtTargetSeen,
        mtGapsSeen,
        uphDisplay: "-",
    };
}

function processHourData(data, from, to, hours) {
    const hourMap = new Map(hours.map((h, i) => [h, i]));
    const machineData = new Map();

    data.forEach((m) => {
        if (!machineData.has(m.machineNo)) {
            machineData.set(m.machineNo, {
                machineNo: m.machineNo,
                uph: m.uph,
                totals: Array(hours.length).fill(0),
                seen: Array(hours.length).fill(false),
                gaps: Array(hours.length).fill(0),
                gapsSeen: Array(hours.length).fill(false),
            });
        }
        const machine = machineData.get(m.machineNo);

        (m.data || []).forEach((day) => {
            const d = utils.parseYMD(day.workDate);
            if (isNaN(d) || d < from || d > to) return;

            (day.data || []).forEach((h) => {
                const hourIdx = parseInt(h.workHour, 10) % 24;
                if (isNaN(hourIdx)) return;

                const i = hourMap.get(hourIdx);
                if (i === undefined) return;

                machine.totals[i] += Number(h.outputTotal ?? 0);
                machine.seen[i] = true;
                machine.gaps[i] += Number(h.gapTotal ?? 0);
                machine.gapsSeen[i] = true;
            });
        });
    });

    return Array.from(machineData.values());
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
                const hourIdx = parseInt(h.workHour, 10) % 24;
                if (isNaN(hourIdx)) return;

                hourSet.add(hourIdx);
                if (!hourLabelMap.has(hourIdx)) {
                    const label =
                        typeof h.workHour === "string" && h.workHour
                            ? h.workHour
                            : `${String(hourIdx).padStart(2, "0")}:00`;
                    hourLabelMap.set(hourIdx, label);
                }
            });
        })
    );

    const hours = Array.from(hourSet).sort((a, b) => a - b);
    if (hours.length === 0) {
        for (let i = 0; i < 24; i++) hours.push(i);
    }
    const hourLabels = hours.map((hr) => hourLabelMap.get(hr) || `${String(hr).padStart(2, "0")}:00`);

    const machines = processHourData(filt, from, to, hours);

    const mtTotals = Array(hours.length).fill(0);
    const mtGaps = Array(hours.length).fill(0);
    const mtTotalsSeen = Array(hours.length).fill(false);
    const mtGapsSeen = Array(hours.length).fill(false);
    const mtTargetSeen = Array(hours.length).fill(false);

    filt.forEach((m) => {
        (m.data || []).forEach((day) => {
            const d = utils.parseYMD(day.workDate);
            if (isNaN(d) || d < from || d > to) return;

            (day.data || []).forEach((h) => {
                const hourIdx = parseInt(h.workHour, 10) % 24;
                if (isNaN(hourIdx)) return;

                const i = hours.indexOf(hourIdx);
                if (i === -1) return;

                mtTotals[i] += Number(h.outputTotal ?? 0);
                mtGaps[i] += Number(h.gapTotal ?? 0);
                mtTotalsSeen[i] = true;
                mtGapsSeen[i] = true;
            });
        });
    });

    const mtTargetRates = mtTotals.map((total, idx) => {
        if (!mtTotalsSeen[idx]) return null;
        const rate = calculateTargetRate(total, mtGaps[idx]);
        if (rate !== null && !Number.isNaN(rate)) {
            mtTargetSeen[idx] = true;
            return rate;
        }
        return null;
    });

    const first = filt[0];
    return {
        title: first?.model || model || "Model",
        station: first?.station || station || "",
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

function createTableStructure(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return null;
    table.style.tableLayout = "fixed";
    table.style.wordBreak = "break-word";
    table.style.whiteSpace = "normal";
    table.style.width = "100%";

    let thead = table.querySelector("thead");
    if (thead) thead.innerHTML = "";
    else thead = document.createElement("thead");

    let tbody = table.querySelector("tbody");
    if (tbody) tbody.innerHTML = "";
    else tbody = document.createElement("tbody");

    table.innerHTML = "";
    table.appendChild(thead);
    table.appendChild(tbody);

    return { table, thead, tbody };
}

const addRow = (tbody, label, vals, seenArr, options = {}) => {
    const { rowClass = "", formatter = (v) => v, cellClassResolver = () => "", extraCells = [] } = options;

    const tr = document.createElement("tr");
    if (rowClass) tr.className = rowClass;

    const th = document.createElement("th");
    th.className = "bg-transparent text-white text-start";
    th.textContent = label;
    tr.appendChild(th);

    extraCells.forEach((cell) => tr.appendChild(cell));

    vals.forEach((v, idx) => {
        const seen = !!seenArr[idx];
        const displayValue = seen ? formatter(v, idx) : "-";
        const td = document.createElement("td");
        td.textContent = displayValue;
        td.className = cellClassResolver(v, seen);
        tr.appendChild(td);
    });

    tbody.appendChild(tr);
};

function renderDayTableVM(vm) {
    const tableElements = createTableStructure("table-2");
    if (!tableElements) return;
    const { thead, tbody } = tableElements;

    const { dates, title } = vm;

    const topRow = document.createElement("tr");
    const titleTh = document.createElement("th");
    titleTh.rowSpan = dates.length ? 2 : 1;
    titleTh.textContent = title;
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
            const [, m, d] = dateStr.split("/");
            th.textContent = `${m}/${d}`;
            th.classList.add("text-center", "small");
            dateRow.appendChild(th);
        });
        thead.appendChild(dateRow);
    }

    const { machines, mtTotals, mtTargetRates, mtTotalsSeen, mtTargetSeen, uphDisplay } = vm;

    const createUphCell = (uphValue, machineNo) => {
        const uphTd = document.createElement("td");
        uphTd.textContent = uphValue === null || uphValue === undefined ? "-" : uphValue;
        uphTd.classList.add("text-center", "align-middle", "uph-cell");
        if (machineNo) uphTd.dataset.machine = machineNo;
        return uphTd;
    };

    addRow(tbody, "MT-Total", mtTotals, mtTotalsSeen, {
        rowClass: "table-secondary",
        cellClassResolver: getDayCellClass,
        extraCells: [createUphCell(uphDisplay)],
    });

    addRow(tbody, "Gap", vm.mtGaps, vm.mtGapsSeen, {
        cellClassResolver: getDayCellClass,
        extraCells: [createUphCell("-")],
    });

    addRow(tbody, "Target Rate", mtTargetRates, mtTargetSeen, {
        formatter: (v) => (v == null || Number.isNaN(v) ? "-" : `${(v * 100).toFixed(2)}%`),
        cellClassResolver: getTargetCellClass,
        extraCells: [createUphCell(uphDisplay)],
    });

    machines.forEach((m) => {
        const uph = m.uph ?? "-";
        addRow(tbody, m.machineNo, m.totals, m.seen, {
            cellClassResolver: getDayCellClass,
            extraCells: [createUphCell(uph, m.machineNo)],
        });
    });

    GLOBAL.machines = vm.machines.map((m) => m.machineNo);
}

function renderHourTableVM(vm) {
    const tableElements = createTableStructure("table-2");
    if (!tableElements) return;
    const { thead, tbody } = tableElements;

    const { hours, hourLabels, title } = vm;
    const labels = hourLabels || hours.map((hr) => `${String(hr).padStart(2, "0")}:00`);

    const topRow = document.createElement("tr");
    const titleTh = document.createElement("th");
    titleTh.rowSpan = hours.length ? 2 : 1;
    titleTh.textContent = title;
    titleTh.classList.add("text-center", "align-middle");
    topRow.appendChild(titleTh);

    const uphTh = document.createElement("th");
    uphTh.rowSpan = hours.length ? 2 : 1;
    uphTh.textContent = "UPH";
    uphTh.classList.add("text-center", "align-middle");
    topRow.appendChild(uphTh);

    thead.appendChild(topRow);

    if (hours.length) {
        const hourRow = document.createElement("tr");
        hours.forEach((x, idx) => {
            const th = document.createElement("th");
            const start = labels[idx] || `${String(x).padStart(2, "0")}:00`;
            const end = `${String((x + 1) % 24).padStart(2, "0")}:00`;
            th.textContent = `${start} ${end}`;
            th.classList.add("text-center", "small");
            hourRow.appendChild(th);
        });
        thead.appendChild(hourRow);
    }

    const { machines, mtTotals, mtGaps, mtTargetRates, mtTotalsSeen, mtGapsSeen, mtTargetSeen, uphDisplay } = vm;

    const createUphCell = (uphValue, machineNo) => {
        const uphTd = document.createElement("td");
        uphTd.textContent = uphValue === null || uphValue === undefined ? "-" : uphValue;
        uphTd.classList.add("text-center", "align-middle", "uph-cell");
        if (machineNo) uphTd.dataset.machine = machineNo;
        return uphTd;
    };

    const modelText = (vm.title || "").split("-").pop();
    const dynamicLabel = modelText + "-Total";

    addRow(tbody, dynamicLabel, mtTotals, mtTotalsSeen, {
        rowClass: "table-secondary",
        cellClassResolver: getHourCellClass,
        extraCells: [createUphCell(uphDisplay)],
    });

    addRow(tbody, "Gap", mtGaps, mtGapsSeen, {
        cellClassResolver: getHourCellClass,
        extraCells: [createUphCell("-")],
    });

    addRow(tbody, "Target Rate", mtTargetRates, mtTargetSeen, {
        formatter: (v) => (v == null || Number.isNaN(v) ? "-" : `${(v * 100).toFixed(2)}%`),
        cellClassResolver: getTargetCellClass,
        extraCells: [createUphCell("-")],
    });

    machines.forEach((m) => {
        const uph = m.uph ?? "-";
        addRow(tbody, m.machineNo, m.totals, m.seen, {
            cellClassResolver: getDayCellClass,
            extraCells: [createUphCell(uph, m.machineNo)],
        });
    });

    GLOBAL.machines = vm.machines.map((m) => m.machineNo);
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

ready(function () {
    loadEvent();
    loadData();
});
