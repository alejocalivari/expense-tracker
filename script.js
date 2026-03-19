const { getDemoState, getState, setState, updateState } = window.aleclvFinanceState;
const { formatCurrency, formatDate, generateId } = window.aleclvFinanceUtils;

const TOAST_TIMEOUT_MS = 2600;
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;
const STATUS_PILL_CLASSES = ["status-pill--positive", "status-pill--neutral", "status-pill--negative"];
const NAV_SCROLL_OFFSET = 20;
const CATEGORY_SWATCHES = [
  { className: "mint", color: "var(--accent)" },
  { className: "blue", color: "var(--accent-blue)" },
  { className: "amber", color: "var(--accent-amber)" },
  { className: "rose", color: "var(--accent-rose)" },
  { className: "slate", color: "var(--accent-slate)" },
];
const INSIGHT_FLAG_TONES = { rose: "insight__flag--rose", mint: "insight__flag--mint", blue: "insight__flag--blue" };

const body = document.body;
const topbar = document.querySelector(".topbar");
const openIncomeButtons = document.querySelectorAll("[data-open-income]");
const modalRestoreButtons = document.querySelectorAll("[data-modal-restore-demo]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const backdrop = document.querySelector("[data-backdrop]");
const navItems = document.querySelectorAll("[data-nav-item]");
const countupElements = document.querySelectorAll(".countup");
const openFilterButtons = document.querySelectorAll("[data-open-filters]");
const openExportButtons = document.querySelectorAll("[data-open-export]");
const searchInput = document.querySelector("[data-search-input]");
const expenseList = document.querySelector("[data-expense-list]");
const insightList = document.querySelector("[data-insight-list]");
const fab = document.querySelector(".fab");
const modal = document.querySelector("[data-modal]");
const modalPanels = document.querySelectorAll("[data-modal-panel]");
const modalCloseButton = document.querySelector(".app-modal__close");
const modalEyebrow = document.querySelector("[data-modal-eyebrow]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalCopy = document.querySelector("[data-modal-copy]");
const modalCloseTriggers = document.querySelectorAll("[data-modal-close]");
const expenseForm = document.querySelector("[data-expense-form]");
const incomeForm = document.querySelector("[data-income-form]");
const formFeedback = document.querySelector("[data-form-feedback]");
const incomeFeedback = document.querySelector("[data-income-feedback]");
const formSubmit = document.querySelector("[data-form-submit]");
const incomeInput = document.querySelector("[data-income-input]");
const confirmDeleteButton = document.querySelector("[data-confirm-delete]");
const confirmTitle = document.querySelector("[data-confirm-title]");
const confirmDate = document.querySelector("[data-confirm-date]");
const confirmCopy = document.querySelector("[data-confirm-copy]");
const confirmAmount = document.querySelector("[data-confirm-amount]");
const filterForm = document.querySelector("[data-filter-form]");
const filterMonthInput = document.querySelector("[data-filter-month]");
const filterCategoryInput = document.querySelector("[data-filter-category]");
const filterSearchPreview = document.querySelector("[data-filter-search-preview]");
const filterResultsCopy = document.querySelector("[data-filter-results-copy]");
const clearFiltersButton = document.querySelector("[data-clear-filters]");
const exportJsonButton = document.querySelector("[data-export-json]");
const exportCsvButton = document.querySelector("[data-export-csv]");
const exportSummary = document.querySelector("[data-export-summary]");
const exportFilename = document.querySelector("[data-export-filename]");
const exportCopy = document.querySelector("[data-export-copy]");
const confirmRestoreButton = document.querySelector("[data-confirm-restore]");
const toast = document.querySelector("[data-toast]");
const donutChart = document.querySelector("[data-donut-chart]");
const categoryLegend = document.querySelector("[data-category-legend]");
const heroSection = document.querySelector(".hero-grid");
const kpiSection = document.querySelector(".kpi-grid");
const investSection = document.querySelector(".invest-card");
const activitySection = document.querySelector(".expenses-card");
const insightsSection = document.querySelector(".insights-card");
const stackedSegments = document.querySelectorAll(".stacked-bar__segment");
const lineActualPath = document.querySelector("[data-line-actual]");
const lineTargetPath = document.querySelector("[data-line-target]");
const lineAreaPath = document.querySelector("[data-line-area]");
const linePoints = document.querySelector("[data-line-points]");
const lineAxis = document.querySelector("[data-line-axis]");

const kpiElements = {
  income: document.querySelector('[data-kpi="income"]'),
  totalSpent: document.querySelector('[data-kpi="totalSpent"]'),
  remainingBalance: document.querySelector('[data-kpi="remainingBalance"]'),
  savingsAmount: document.querySelector('[data-kpi="investableSurplus"]'),
  dailyAverage: document.querySelector('[data-kpi="dailyAverage"]'),
  savingsRate: document.querySelector('[data-kpi="savingsRate"]'),
};
const summaryElements = {
  sidebarFreeCash: document.querySelector('[data-summary="sidebar-free-cash"]'),
  heroRemaining: document.querySelector('[data-summary="hero-remaining"]'),
  chartTotalSpent: document.querySelector('[data-summary="chart-total-spent"]'),
  incomeHighlight: document.querySelector('[data-summary="investable-amount"]'),
  fixedAmount: document.querySelector('[data-summary="monthly-investable"]'),
  variableAmount: document.querySelector('[data-summary="yearly-investable"]'),
  sidebarSavings: document.querySelector('[data-summary="sidebar-investable"]'),
  miniDailyAverage: document.querySelector('[data-summary="mini-daily-average"]'),
  miniSecondaryValue: document.querySelector('[data-summary="mini-secondary-value"]'),
  plannerRow1Value: document.querySelector('[data-summary="planner-row-1-value"]'),
  plannerRow2Value: document.querySelector('[data-summary="planner-row-2-value"]'),
  plannerRow3Value: document.querySelector('[data-summary="planner-row-3-value"]'),
};
const textElements = {
  periodTitle: document.querySelector("[data-period-title]"),
  periodPill: document.querySelector("[data-period-pill]"),
  sidebarSpendRatio: document.querySelector('[data-summary-text="sidebar-spend-ratio"]'),
  heroCaption: document.querySelector('[data-summary-text="hero-caption"]'),
  heroStat1Value: document.querySelector('[data-summary-text="hero-stat-1-value"]'),
  heroStat2Value: document.querySelector('[data-summary-text="hero-stat-2-value"]'),
  heroRunway: document.querySelector('[data-summary-text="hero-runway"]'),
  miniDailyNote: document.querySelector('[data-summary-text="mini-daily-note"]'),
  miniSecondaryNote: document.querySelector('[data-summary-text="mini-secondary-note"]'),
  miniTertiaryValue: document.querySelector('[data-summary-text="mini-tertiary-value"]'),
  miniTertiaryNote: document.querySelector('[data-summary-text="mini-tertiary-note"]'),
  plannerNote: document.querySelector('[data-summary-text="planner-note"]'),
  plannerSectionLabel: document.querySelector('[data-summary-text="planner-section-label"]'),
  plannerItem1Title: document.querySelector('[data-summary-text="planner-item-1-title"]'),
  plannerItem1Subtitle: document.querySelector('[data-summary-text="planner-item-1-subtitle"]'),
  plannerItem1Value: document.querySelector('[data-summary-text="planner-item-1-value"]'),
  plannerItem2Title: document.querySelector('[data-summary-text="planner-item-2-title"]'),
  plannerItem2Subtitle: document.querySelector('[data-summary-text="planner-item-2-subtitle"]'),
  plannerItem2Value: document.querySelector('[data-summary-text="planner-item-2-value"]'),
  plannerItem3Title: document.querySelector('[data-summary-text="planner-item-3-title"]'),
  plannerItem3Subtitle: document.querySelector('[data-summary-text="planner-item-3-subtitle"]'),
  plannerItem3Value: document.querySelector('[data-summary-text="planner-item-3-value"]'),
  categoryCountPill: document.querySelector('[data-summary-text="category-count-pill"]'),
  savingsAmountText: document.querySelector('[data-summary-text="reserve-runway"]'),
  incomeCaption: document.querySelector('[data-summary-text="invest-caption"]'),
};
const labelElements = {
  heroStat1: document.querySelector('[data-summary-label="hero-stat-1-label"]'),
  heroStat2: document.querySelector('[data-summary-label="hero-stat-2-label"]'),
  miniSecondary: document.querySelector('[data-summary-label="mini-secondary-label"]'),
  miniTertiary: document.querySelector('[data-summary-label="mini-tertiary-label"]'),
  plannerRow1: document.querySelector('[data-summary-label="planner-row-1-label"]'),
  plannerRow2: document.querySelector('[data-summary-label="planner-row-2-label"]'),
  plannerRow3: document.querySelector('[data-summary-label="planner-row-3-label"]'),
};
const barElements = {
  sidebarSpendRatio: document.querySelector('[data-summary-bar="sidebar-spend-ratio"]'),
  heroRunway: document.querySelector('[data-summary-bar="hero-runway"]'),
  plannerRow1: document.querySelector('[data-summary-bar="planner-row-1"]'),
  plannerRow2: document.querySelector('[data-summary-bar="planner-row-2"]'),
  plannerRow3: document.querySelector('[data-summary-bar="planner-row-3"]'),
};
const statusElements = {
  sidebar: document.querySelector('[data-summary-status="sidebar"]'),
  hero: document.querySelector('[data-summary-status="hero"]'),
  line: document.querySelector('[data-summary-status="line"]'),
};
const kpiDeltaElements = {
  income: document.querySelector('[data-kpi-delta="income"]'),
  totalSpent: document.querySelector('[data-kpi-delta="totalSpent"]'),
  remainingBalance: document.querySelector('[data-kpi-delta="remainingBalance"]'),
  savingsAmount: document.querySelector('[data-kpi-delta="investableSurplus"]'),
  dailyAverage: document.querySelector('[data-kpi-delta="dailyAverage"]'),
  savingsRate: document.querySelector('[data-kpi-delta="savingsRate"]'),
};
const kpiCaptionElements = {
  income: document.querySelector('[data-kpi-caption="income"]'),
  totalSpent: document.querySelector('[data-kpi-caption="totalSpent"]'),
  remainingBalance: document.querySelector('[data-kpi-caption="remainingBalance"]'),
  savingsAmount: document.querySelector('[data-kpi-caption="investableSurplus"]'),
  dailyAverage: document.querySelector('[data-kpi-caption="dailyAverage"]'),
  savingsRate: document.querySelector('[data-kpi-caption="savingsRate"]'),
};

const uiState = { modalMode: null, activeExpenseId: null, lastFocusedElement: null, toastTimer: null };
const SECTION_TARGETS = { dashboard: heroSection, cashflow: kpiSection, investing: investSection, activity: activitySection, insights: insightsSection };
let hasAnimatedCountups = false;

const formatValue = (value, decimals = 0) => Number(value || 0).toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const formatMoney = (value, decimals = 2) => formatCurrency(value, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const readDecimals = (element) => Number(element?.dataset.decimals || 0);
const escapeHtml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const normalizeToken = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const roundCurrency = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const isValidMonthKey = (value) => MONTH_KEY_PATTERN.test(String(value || "").trim());
const getExpenseDate = (expense) => { const date = new Date(expense?.date); return Number.isNaN(date.getTime()) ? null : date; };
const getCurrentMonthKey = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; };
const getLatestMonthKey = (expenses = []) => {
  const latest = expenses.reduce((latestDate, expense) => {
    const date = getExpenseDate(expense);
    return !date || (latestDate && latestDate > date) ? latestDate : date;
  }, null);
  return latest ? `${latest.getFullYear()}-${String(latest.getMonth() + 1).padStart(2, "0")}` : getCurrentMonthKey();
};
const normalizeMonthFilterValue = (value, fallback = getCurrentMonthKey()) => isValidMonthKey(value) ? String(value).trim() : fallback;
const normalizeCategoryFilterValue = (value) => String(value || "").trim() || "all";
const normalizeSearchValue = (value) => String(value || "").trim();
const getDefaultFilters = (state = getState()) => ({ month: getLatestMonthKey(state.expenses), category: "all", search: "" });
const getSearchQuery = (state) => normalizeSearchValue(state.filters.search).toLowerCase();
const hasSearchFilter = (state) => Boolean(getSearchQuery(state));
const hasCategoryFilter = (state) => normalizeCategoryFilterValue(state.filters.category) !== "all";
const getFormField = (name) => expenseForm?.elements.namedItem(name);

const setTextValue = (element, value) => { if (element) element.textContent = value; };
const setBarWidth = (element, percent) => { if (element) element.style.width = `${clamp(percent, 0, 100)}%`; };
const applyStatusPill = (element, label, tone = "neutral") => { if (!element) return; element.textContent = label; element.classList.remove(...STATUS_PILL_CLASSES); element.classList.add(`status-pill--${tone}`); };
const formatSignedPercent = (value, decimals = 1) => !Number.isFinite(value) ? "n/a" : `${value > 0 ? "+" : value < 0 ? "-" : ""}${formatValue(Math.abs(value), decimals)}%`;
const formatSignedPoints = (value, decimals = 1) => !Number.isFinite(value) ? "n/a" : `${value > 0 ? "+" : value < 0 ? "-" : ""}${formatValue(Math.abs(value), decimals)} pts`;
const getTrendTone = (change, options = {}) => { const positive = options.lowerIsBetter ? change < 0 : change > 0; return !Number.isFinite(change) || Math.abs(change) < 0.05 ? "neutral" : positive ? "positive" : "negative"; };
const getMonthLabel = (monthKey, options = {}) => { const date = new Date(`${monthKey}-01T12:00:00`); return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", ...options }).format(date); };
const getDaysInMonth = (monthKey) => { const [year, month] = monthKey.split("-").map(Number); return new Date(year, month, 0).getDate(); };
const shiftMonthKey = (monthKey, offset) => { const [year, month] = monthKey.split("-").map(Number); const date = new Date(Date.UTC(year, month - 1 + offset, 1, 12)); return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`; };
const getActiveMonthKey = (state) => normalizeMonthFilterValue(state.filters.month, getLatestMonthKey(state.expenses));
const getExpensesForMonth = (state, monthKey) => state.expenses.filter((expense) => expense.date.slice(0, 7) === monthKey);

const getElapsedDaysForMonth = (monthKey, expenses) => {
  const daysInMonth = getDaysInMonth(monthKey);
  const currentMonth = getCurrentMonthKey();
  if (monthKey === currentMonth) return clamp(new Date().getDate(), 1, daysInMonth);
  if (monthKey < currentMonth) return daysInMonth;
  const latest = expenses.reduce((maxDay, expense) => Math.max(maxDay, getExpenseDate(expense)?.getDate() || 0), 0);
  return clamp(latest || 1, 1, daysInMonth);
};

const buildCategoryBreakdown = (expenses, totalSpent) => {
  const totals = expenses.reduce((acc, expense) => { acc[expense.category] = roundCurrency((acc[expense.category] || 0) + Number(expense.amount || 0)); return acc; }, {});
  return Object.entries(totals).map(([category, total]) => ({ category, total, share: totalSpent > 0 ? (total / totalSpent) * 100 : 0 })).sort((a, b) => b.total - a.total);
};
const buildLegendCategories = (breakdown) => breakdown.length <= 5 ? breakdown : [...breakdown.slice(0, 4), { category: "Otros", total: roundCurrency(breakdown.slice(4).reduce((sum, item) => sum + item.total, 0)), share: breakdown.slice(4).reduce((sum, item) => sum + item.share, 0) }];
const getPercentageChange = (currentValue, previousValue, hasBaseline) => !hasBaseline || !Number.isFinite(previousValue) || previousValue === 0 ? null : ((currentValue - previousValue) / previousValue) * 100;

const summarizeMonth = (expenses, income, monthKey) => {
  const daysInMonth = getDaysInMonth(monthKey);
  const elapsedDays = getElapsedDaysForMonth(monthKey, expenses);
  const totalSpent = roundCurrency(expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0));
  const remainingBalance = roundCurrency(income - totalSpent);
  const savingsAmount = roundCurrency(Math.max(remainingBalance, 0));
  const dailyAverage = roundCurrency(totalSpent / Math.max(elapsedDays, 1));
  const savingsRate = income > 0 ? roundCurrency((savingsAmount / income) * 100) : 0;
  const largestExpense = expenses.reduce((largest, expense) => !largest || Number(expense.amount || 0) > Number(largest.amount || 0) ? expense : largest, null);
  const fixedSpend = roundCurrency(expenses.filter((expense) => expense.isFixed).reduce((sum, expense) => sum + Number(expense.amount || 0), 0));
  const variableSpend = roundCurrency(Math.max(totalSpent - fixedSpend, 0));
  const spentRatio = income > 0 ? (totalSpent / income) * 100 : 0;
  const categoryBreakdown = buildCategoryBreakdown(expenses, totalSpent);
  const projectedMonthlySpend = totalSpent > 0 ? roundCurrency((totalSpent / Math.max(elapsedDays, 1)) * daysInMonth) : 0;
  return {
    monthKey,
    monthLabelLong: getMonthLabel(monthKey),
    monthLabelShort: getMonthLabel(monthKey, { month: "short", year: undefined }),
    monthLabelShortYear: getMonthLabel(monthKey, { month: "short", year: "numeric" }),
    daysInMonth,
    elapsedDays,
    totalSpent,
    remainingBalance,
    savingsAmount,
    dailyAverage,
    savingsRate,
    transactionCount: expenses.length,
    largestExpense,
    topCategory: categoryBreakdown[0] || null,
    categoryBreakdown,
    activeCategoryCount: categoryBreakdown.length,
    fixedSpend,
    variableSpend,
    fixedShare: totalSpent > 0 ? (fixedSpend / totalSpent) * 100 : 0,
    variableShare: totalSpent > 0 ? (variableSpend / totalSpent) * 100 : 0,
    spentRatio,
    projectedMonthlySpend,
    projectedRemainingBalance: roundCurrency(income - projectedMonthlySpend),
  };
};

const computeDashboardMetrics = (state) => {
  const activeMonthKey = getActiveMonthKey(state);
  const previousMonthKey = shiftMonthKey(activeMonthKey, -1);
  const currentMonth = summarizeMonth(getExpensesForMonth(state, activeMonthKey), state.income, activeMonthKey);
  const previousMonth = summarizeMonth(getExpensesForMonth(state, previousMonthKey), state.income, previousMonthKey);
  const hasPreviousBaseline = previousMonth.transactionCount > 0;
  return {
    ...currentMonth,
    activeMonthKey,
    previousMonthKey,
    previousMonthLabelShort: previousMonth.monthLabelShort,
    previousMonth,
    hasPreviousBaseline,
    comparisons: {
      totalSpentChange: getPercentageChange(currentMonth.totalSpent, previousMonth.totalSpent, hasPreviousBaseline),
      remainingBalanceChange: getPercentageChange(currentMonth.remainingBalance, previousMonth.remainingBalance, hasPreviousBaseline),
      savingsAmountChange: getPercentageChange(currentMonth.savingsAmount, previousMonth.savingsAmount, hasPreviousBaseline && previousMonth.savingsAmount > 0),
      dailyAverageChange: getPercentageChange(currentMonth.dailyAverage, previousMonth.dailyAverage, hasPreviousBaseline),
      savingsRateChange: hasPreviousBaseline ? currentMonth.savingsRate - previousMonth.savingsRate : null,
    },
  };
};

const getMonthExpenses = (state) => getExpensesForMonth(state, getActiveMonthKey(state));
const getFilteredExpenses = (state) => {
  const search = getSearchQuery(state);
  return getMonthExpenses(state).filter((expense) => (hasCategoryFilter(state) ? expense.category === state.filters.category : true) && (!search || [expense.title, expense.category, expense.paymentMethod, expense.note].join(" ").toLowerCase().includes(search))).sort((a, b) => (getExpenseDate(b)?.getTime() || 0) - (getExpenseDate(a)?.getTime() || 0));
};
const getVisibleExpensesContext = (state) => { const monthExpenses = getMonthExpenses(state); const filteredExpenses = getFilteredExpenses(state); return { monthExpenses, filteredExpenses, hasMonthExpenses: monthExpenses.length > 0, hasResults: filteredExpenses.length > 0 }; };

const escapeCsvValue = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const serializeExpensesToJson = (expenses) => JSON.stringify(expenses, null, 2);
const serializeExpensesToCsv = (expenses) => {
  const rows = expenses.map((expense) => [expense.id, expense.title, roundCurrency(expense.amount), expense.category, expense.date, expense.paymentMethod, expense.note, expense.isFixed ? "si" : "no", expense.createdAt].map(escapeCsvValue).join(","));
  return [["id", "descripcion", "monto", "categoria", "fecha", "medio_pago", "notas", "es_fijo", "creado_en"].join(","), ...rows].join("\n");
};
const downloadTextFile = (filename, content, mimeType) => { const blob = new Blob([content], { type: mimeType }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 0); };
const getExportBaseFilename = (state) => `aleclv-expense-tracker-${getActiveMonthKey(state)}`;
const getResultsLabel = (count) => count === 1 ? "1 gasto" : `${formatValue(count)} gastos`;

const showToast = (message, tone = "success") => {
  if (!toast) return;
  if (uiState.toastTimer) window.clearTimeout(uiState.toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.toggle("toast--error", tone === "error");
  window.requestAnimationFrame(() => toast.classList.add("is-visible"));
  uiState.toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => { toast.hidden = true; uiState.toastTimer = null; }, 180);
  }, TOAST_TIMEOUT_MS);
};

const setCountupText = (element, value) => {
  const decimals = readDecimals(element);
  const prefix = element.dataset.prefix || "";
  const suffix = element.dataset.suffix || "";
  if (prefix === "$" || prefix === "+$" || prefix === "-$") {
    const sign = prefix === "+$" ? "+" : prefix === "-$" || value < 0 ? "-" : "";
    element.textContent = `${sign}${formatCurrency(Math.abs(value), { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
    return;
  }
  element.textContent = `${prefix}${formatValue(value, decimals)}${suffix}`;
};
const animateCountup = (element, targetValue, options = {}) => {
  if (!element || Number.isNaN(targetValue)) return;
  const startValue = options.from ?? Number(element.dataset.currentValue || 0);
  const duration = options.duration ?? 720;
  const startTime = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = startValue + (targetValue - startValue) * (1 - Math.pow(1 - progress, 3));
    setCountupText(element, value);
    if (progress < 1) return requestAnimationFrame(tick);
    element.dataset.currentValue = String(targetValue);
    setCountupText(element, targetValue);
  };
  requestAnimationFrame(tick);
};
const setMetricValue = (element, value, animate = false) => { if (!element) return; element.dataset.countup = String(value); if (animate && hasAnimatedCountups) return animateCountup(element, value, { from: Number(element.dataset.currentValue || 0) }); element.dataset.currentValue = String(value); setCountupText(element, value); };
const animateInitialCountups = () => { if (hasAnimatedCountups) return; hasAnimatedCountups = true; countupElements.forEach((element, index) => animateCountup(element, Number(element.dataset.countup || 0), { from: 0, duration: 980 + index * 28 })); };

const getBadgeVariant = (category) => {
  switch (normalizeToken(category)) {
    case "Supermercado":
      return "food";
    case "Transporte":
      return "transport";
    case "Casa/Servicios":
      return "housing";
    case "Gimnasio":
      return "lifestyle";
    case "Facultad":
      return "software";
    case "Suscripciones":
      return "subscriptions";
    case "Salidas":
      return "travel";
    case "Salud":
      return "utilities";
    case "Auto/Moto":
      return "travel";
    case "Inversion":
      return "software";
    default:
      return "other";
  }
};
const formatExpenseTimestamp = (value) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? "" : `${new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" }).format(date)} - ${new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(date)}`; };

const renderExpenseRow = (expense) => `
  <article class="expense-row" data-expense-id="${escapeHtml(expense.id)}">
    <div class="expense-row__merchant"><strong>${escapeHtml(expense.title)}</strong><span>${escapeHtml(formatExpenseTimestamp(expense.date))}</span></div>
    <div class="expense-row__meta"><span class="badge badge--${escapeHtml(getBadgeVariant(expense.category))}">${escapeHtml(expense.category)}</span><span class="expense-row__method">${escapeHtml(expense.paymentMethod)}${expense.isFixed ? " - Fijo" : ""}</span></div>
    <div class="expense-row__side"><strong class="expense-row__amount">- ${escapeHtml(formatMoney(expense.amount))}</strong><div class="expense-row__actions"><button class="icon-button icon-button--soft" type="button" aria-label="Editar gasto" data-expense-action="edit" data-expense-id="${escapeHtml(expense.id)}"><svg viewBox="0 0 24 24" fill="none"><path d="m4 16.5 8.6-8.6 2.5 2.5-8.6 8.6H4v-2.5Z"></path><path d="m11.8 8.7 2-2a2 2 0 0 1 2.8 0l.7.7a2 2 0 0 1 0 2.8l-2 2"></path></svg></button><button class="icon-button icon-button--soft" type="button" aria-label="Eliminar gasto" data-expense-action="delete" data-expense-id="${escapeHtml(expense.id)}"><svg viewBox="0 0 24 24" fill="none"><path d="M5.5 7.5h13"></path><path d="M9 7.5V5h6v2.5"></path><path d="M8.5 10.5v6"></path><path d="M12 10.5v6"></path><path d="M15.5 10.5v6"></path></svg></button></div></div>
  </article>`;

const getExpenseEmptyStateMarkup = (state, metrics, context) => !state.expenses.length ? `<article class="expense-list__empty"><strong>Todavía no cargaste gastos</strong><p>Empezá con tu primer movimiento para activar categorias, balance, ahorro e insights del mes.</p><div class="expense-list__actions"><button class="button button--accent button--small" type="button" data-list-action="open-add">Agregar primer gasto</button><button class="button button--ghost button--small" type="button" data-list-action="restore-demo">Restaurar ejemplo</button></div></article>` : !context.hasMonthExpenses ? `<article class="expense-list__empty"><strong>Sin movimientos en ${escapeHtml(metrics.monthLabelLong)}</strong><p>${state.income > 0 ? `Tu ingreso de ${escapeHtml(formatMoney(state.income))} sigue cargado, pero todavía no hay gastos en este mes.` : "Cargá el ingreso mensual y al menos un gasto para ver el resumen completo."}</p><div class="expense-list__actions"><button class="button button--ghost button--small" type="button" data-list-action="open-filters">Cambiar mes</button><button class="button button--accent button--small" type="button" data-list-action="open-add">Agregar gasto</button></div></article>` : `<article class="expense-list__empty"><strong>No hay gastos para estos filtros</strong><p>Probá limpiar la búsqueda o cambiar la categoría seleccionada.</p><div class="expense-list__actions"><button class="button button--ghost button--small" type="button" data-list-action="clear-filters">Limpiar filtros</button><button class="button button--ghost button--small" type="button" data-list-action="open-filters">Ajustar filtros</button></div></article>`;
const renderExpenseList = (state, metrics) => { if (!expenseList) return; const context = getVisibleExpensesContext(state); expenseList.innerHTML = context.filteredExpenses.length ? context.filteredExpenses.map(renderExpenseRow).join("") : getExpenseEmptyStateMarkup(state, metrics, context); };

const renderFilterControls = (state, metrics) => {
  const visible = getVisibleExpensesContext(state);
  if (searchInput && searchInput.value !== state.filters.search) searchInput.value = state.filters.search;
  if (filterMonthInput) filterMonthInput.value = normalizeMonthFilterValue(state.filters.month, getDefaultFilters(state).month);
  if (filterCategoryInput) filterCategoryInput.value = normalizeCategoryFilterValue(state.filters.category);
  setTextValue(filterSearchPreview, hasSearchFilter(state) ? `"${state.filters.search}"` : "Sin busqueda aplicada");
  setTextValue(filterResultsCopy, visible.hasResults ? `${getResultsLabel(visible.filteredExpenses.length)} visibles en ${metrics.monthLabelShortYear}.` : visible.hasMonthExpenses ? `No hay resultados para la busqueda actual en ${metrics.monthLabelShortYear}.` : `Todavía no hay movimientos en ${metrics.monthLabelShortYear}.`);
};
const renderExportState = (state, metrics) => {
  const { filteredExpenses } = getVisibleExpensesContext(state);
  setTextValue(exportSummary, `${getResultsLabel(filteredExpenses.length)} listos`);
  setTextValue(exportFilename, `${getExportBaseFilename(state)}.csv / ${getExportBaseFilename(state)}.json`);
  setTextValue(exportCopy, filteredExpenses.length ? `La exportacion refleja la vista actual de ${metrics.monthLabelShortYear}.` : `No hay gastos visibles para exportar en ${metrics.monthLabelShortYear}.`);
  if (exportJsonButton) exportJsonButton.disabled = filteredExpenses.length === 0;
  if (exportCsvButton) exportCsvButton.disabled = filteredExpenses.length === 0;
};

const renderKpis = (state, metrics, animate = false) => {
  setMetricValue(kpiElements.income, state.income, animate);
  setMetricValue(kpiElements.totalSpent, metrics.totalSpent, animate);
  setMetricValue(kpiElements.remainingBalance, metrics.remainingBalance, animate);
  setMetricValue(kpiElements.savingsAmount, metrics.savingsAmount, animate);
  setMetricValue(kpiElements.dailyAverage, metrics.dailyAverage, animate);
  setMetricValue(kpiElements.savingsRate, metrics.savingsRate, animate);
};
const renderPeriod = (metrics) => { setTextValue(textElements.periodTitle, `${metrics.monthLabelLong} - resumen de gastos`); setTextValue(textElements.periodPill, metrics.monthLabelShortYear); };
const renderKpiMeta = (state, metrics) => {
  const fallback = `Sin base de ${metrics.previousMonthLabelShort}`;
  setTextValue(kpiDeltaElements.income, state.income > 0 ? "Editable" : "Cargar ingreso");
  setTextValue(kpiDeltaElements.totalSpent, metrics.hasPreviousBaseline ? `${formatSignedPercent(metrics.comparisons.totalSpentChange)} vs ${metrics.previousMonthLabelShort}` : fallback);
  setTextValue(kpiDeltaElements.remainingBalance, metrics.hasPreviousBaseline ? `${formatSignedPercent(metrics.comparisons.remainingBalanceChange)} vs ${metrics.previousMonthLabelShort}` : fallback);
  setTextValue(kpiDeltaElements.savingsAmount, metrics.hasPreviousBaseline && Number.isFinite(metrics.comparisons.savingsAmountChange) ? `${formatSignedPercent(metrics.comparisons.savingsAmountChange)} vs ${metrics.previousMonthLabelShort}` : "Disponible hoy");
  setTextValue(kpiDeltaElements.dailyAverage, metrics.hasPreviousBaseline ? `${formatSignedPercent(metrics.comparisons.dailyAverageChange)} vs ${metrics.previousMonthLabelShort}` : "Promedio del mes");
  setTextValue(kpiDeltaElements.savingsRate, metrics.hasPreviousBaseline ? `${formatSignedPoints(metrics.comparisons.savingsRateChange)} vs ${metrics.previousMonthLabelShort}` : `${formatValue(metrics.savingsRate, 1)}%`);
  setTextValue(kpiCaptionElements.income, state.income > 0 ? "Cambiar el ingreso actualiza todos los calculos del dashboard." : "Cargá tu ingreso mensual para activar balance y ahorro.");
  setTextValue(kpiCaptionElements.totalSpent, metrics.transactionCount ? `${metrics.transactionCount} movimientos en ${metrics.activeCategoryCount} categorias.` : `Todavía no hay gastos en ${metrics.monthLabelShort}.`);
  setTextValue(kpiCaptionElements.remainingBalance, state.income > 0 ? `De ${formatMoney(state.income)} te quedan ${formatMoney(metrics.remainingBalance)}.` : "Necesita ingreso mensual para calcularse.");
  setTextValue(kpiCaptionElements.savingsAmount, state.income > 0 ? "Solo cuenta ahorro positivo del mes." : "Aparece cuando definis el ingreso mensual.");
  setTextValue(kpiCaptionElements.dailyAverage, metrics.transactionCount ? `Promedio sobre ${metrics.elapsedDays} dia(s) cargados.` : "Sin movimientos, no hay promedio.");
  setTextValue(kpiCaptionElements.savingsRate, state.income > 0 ? `${formatMoney(metrics.savingsAmount)} libres sobre ${formatMoney(state.income)}.` : "La tasa de ahorro depende del ingreso.");
};
const renderSummaries = (state, metrics, animate = false) => {
  setMetricValue(summaryElements.sidebarFreeCash, metrics.remainingBalance, animate);
  setMetricValue(summaryElements.heroRemaining, metrics.remainingBalance, animate);
  setMetricValue(summaryElements.chartTotalSpent, metrics.totalSpent, animate);
  setMetricValue(summaryElements.sidebarSavings, metrics.savingsAmount, animate);
  setMetricValue(summaryElements.incomeHighlight, state.income, animate);
  setMetricValue(summaryElements.fixedAmount, metrics.fixedSpend, animate);
  setMetricValue(summaryElements.variableAmount, metrics.variableSpend, animate);
};
const renderSidebar = (metrics) => {
  applyStatusPill(statusElements.sidebar, metrics.hasPreviousBaseline ? `${formatSignedPercent(metrics.comparisons.totalSpentChange)} vs ${metrics.previousMonthLabelShort}` : `Sin base de ${metrics.previousMonthLabelShort}`, getTrendTone(metrics.comparisons.totalSpentChange, { lowerIsBetter: true }));
  setTextValue(textElements.sidebarSpendRatio, `${formatValue(metrics.spentRatio, 1)}%`);
  setBarWidth(barElements.sidebarSpendRatio, metrics.spentRatio);
};
const renderHero = (state, metrics, animate = false) => {
  applyStatusPill(statusElements.hero, metrics.hasPreviousBaseline ? `${formatSignedPercent(metrics.comparisons.remainingBalanceChange)} vs ${metrics.previousMonthLabelShort}` : `Sin base de ${metrics.previousMonthLabelShort}`, getTrendTone(metrics.comparisons.remainingBalanceChange));
  setTextValue(textElements.heroCaption, state.income > 0 ? `De ${formatMoney(state.income)} ingresados, llevas ${formatMoney(metrics.totalSpent)} en gastos y te quedan ${formatMoney(metrics.remainingBalance)}.` : `${formatMoney(metrics.totalSpent)} cargados en gastos. Defini tu ingreso para ver el balance real.`);
  setTextValue(labelElements.heroStat1, "Movimientos");
  setTextValue(textElements.heroStat1Value, `${metrics.transactionCount} este mes`);
  setTextValue(labelElements.heroStat2, "Gasto fijo");
  setTextValue(textElements.heroStat2Value, `${formatValue(metrics.fixedShare, 1)}% del total`);
  setTextValue(textElements.heroRunway, `${formatValue(metrics.spentRatio, 1)}%`);
  setBarWidth(barElements.heroRunway, metrics.spentRatio);
  setMetricValue(summaryElements.miniDailyAverage, metrics.dailyAverage, animate);
  setTextValue(textElements.miniDailyNote, metrics.hasPreviousBaseline ? `${formatSignedPercent(metrics.comparisons.dailyAverageChange)} vs ${metrics.previousMonthLabelShort}` : `Sobre ${metrics.elapsedDays} dia(s) cargados`);
  setTextValue(labelElements.miniSecondary, "Gasto mas alto");
  setMetricValue(summaryElements.miniSecondaryValue, metrics.largestExpense ? metrics.largestExpense.amount : 0, animate);
  setTextValue(textElements.miniSecondaryNote, metrics.largestExpense ? `${metrics.largestExpense.title} - ${formatDate(metrics.largestExpense.date, { month: "short", day: "numeric", year: undefined })}` : "Todavía no hay gastos");
  setTextValue(labelElements.miniTertiary, "Categoria principal");
  setTextValue(textElements.miniTertiaryValue, metrics.topCategory ? metrics.topCategory.category : "Sin categoria");
  setTextValue(textElements.miniTertiaryNote, metrics.topCategory ? `${formatMoney(metrics.topCategory.total)} - ${formatValue(metrics.topCategory.share, 1)}% del total` : "Sin mezcla de gastos");
};
const renderPlanner = (state, metrics, animate = false) => {
  setTextValue(textElements.plannerNote, state.income > 0 ? `Separacion sobre ${formatMoney(state.income)} de ingreso mensual.` : "Primero carga el ingreso para saber cuanto espacio real te queda.");
  setTextValue(labelElements.plannerRow1, "Gastos fijos");
  setTextValue(labelElements.plannerRow2, "Gastos variables");
  setTextValue(labelElements.plannerRow3, "Ahorro del mes");
  setMetricValue(summaryElements.plannerRow1Value, metrics.fixedSpend, animate);
  setMetricValue(summaryElements.plannerRow2Value, metrics.variableSpend, animate);
  setMetricValue(summaryElements.plannerRow3Value, metrics.savingsAmount, animate);
  setBarWidth(barElements.plannerRow1, metrics.fixedShare);
  setBarWidth(barElements.plannerRow2, metrics.variableShare);
  setBarWidth(barElements.plannerRow3, metrics.savingsRate);
  setTextValue(textElements.plannerSectionLabel, "Resumen rapido");
  setTextValue(textElements.plannerItem1Title, "Categoria principal");
  setTextValue(textElements.plannerItem1Subtitle, metrics.topCategory ? `${formatValue(metrics.topCategory.share, 1)}% del total` : "Sin datos");
  setTextValue(textElements.plannerItem1Value, metrics.topCategory ? formatMoney(metrics.topCategory.total) : "$0,00");
  setTextValue(textElements.plannerItem2Title, "Gasto mas alto");
  setTextValue(textElements.plannerItem2Subtitle, metrics.largestExpense ? metrics.largestExpense.title : "Sin datos");
  setTextValue(textElements.plannerItem2Value, metrics.largestExpense ? formatMoney(metrics.largestExpense.amount) : "$0,00");
  setTextValue(textElements.plannerItem3Title, "Promedio diario");
  setTextValue(textElements.plannerItem3Subtitle, `${metrics.elapsedDays} dia(s) cargados`);
  setTextValue(textElements.plannerItem3Value, formatMoney(metrics.dailyAverage));
};
const renderCategoryMix = (metrics) => {
  if (!categoryLegend) return;
  const legendItems = buildLegendCategories(metrics.categoryBreakdown);
  setTextValue(textElements.categoryCountPill, `${metrics.activeCategoryCount} categorias activas`);
  if (!legendItems.length) {
    categoryLegend.innerHTML = `<div class="legend-item"><div class="legend-item__title"><span class="legend-swatch legend-swatch--slate"></span><span>Sin categorias</span></div><div class="legend-item__value"><strong>0%</strong><span>$0,00</span></div></div>`;
    if (donutChart) donutChart.style.background = "";
    return;
  }
  categoryLegend.innerHTML = legendItems.map((item, index) => { const swatch = CATEGORY_SWATCHES[index % CATEGORY_SWATCHES.length]; return `<div class="legend-item"><div class="legend-item__title"><span class="legend-swatch legend-swatch--${swatch.className}"></span><span>${escapeHtml(item.category)}</span></div><div class="legend-item__value"><strong>${escapeHtml(`${formatValue(item.share, item.share < 10 ? 1 : 0)}%`)}</strong><span>${escapeHtml(formatMoney(item.total))}</span></div></div>`; }).join("");
  if (donutChart) {
    let cursor = 0;
    const stops = legendItems.map((item, index) => { const swatch = CATEGORY_SWATCHES[index % CATEGORY_SWATCHES.length]; const start = cursor; cursor += item.share; return `${swatch.color} ${start}% ${cursor}%`; });
    if (cursor < 100) stops.push(`rgba(255,255,255,0.05) ${cursor}% 100%`);
    donutChart.style.background = `conic-gradient(${stops.join(", ")})`;
  }
};
const renderLineChart = (metrics) => {
  if (!lineActualPath || !lineTargetPath || !lineAreaPath || !linePoints || !lineAxis) return;
  const daily = new Array(metrics.daysInMonth).fill(0);
  getExpensesForMonth(getState(), metrics.activeMonthKey).forEach((expense) => { const day = getExpenseDate(expense)?.getDate() || 1; daily[day - 1] = roundCurrency(daily[day - 1] + Number(expense.amount || 0)); });
  const cumulative = daily.reduce((acc, amount) => { acc.push(roundCurrency((acc[acc.length - 1] || 0) + amount)); return acc; }, []);
  const ticks = [...new Set(Array.from({ length: 7 }, (_, index) => index === 6 ? metrics.daysInMonth : Math.max(1, Math.round(1 + ((metrics.daysInMonth - 1) * index) / 6))))];
  const actualSeries = ticks.map((day) => cumulative[day - 1] || 0);
  const projectedTotal = Math.max(metrics.projectedMonthlySpend, metrics.totalSpent, 1);
  const targetSeries = ticks.map((day) => roundCurrency((projectedTotal / metrics.daysInMonth) * day));
  const maxValue = Math.max(...actualSeries, ...targetSeries, 1);
  const points = ticks.map((day, index) => ({ x: 40 + (560 * index) / Math.max(ticks.length - 1, 1), y: 260 - ((actualSeries[index] || 0) / maxValue) * 220 }));
  const targetPoints = ticks.map((day, index) => ({ x: 40 + (560 * index) / Math.max(ticks.length - 1, 1), y: 260 - ((targetSeries[index] || 0) / maxValue) * 220 }));
  const path = (set) => set.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join(" ");
  lineActualPath.setAttribute("d", path(points));
  lineTargetPath.setAttribute("d", path(targetPoints));
  lineAreaPath.setAttribute("d", `${path(points)} L${points[points.length - 1].x} 260 L${points[0].x} 260 Z`);
  linePoints.innerHTML = points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="5"></circle>`).join("");
  lineAxis.innerHTML = ticks.map((day) => `<span>${day} ${escapeHtml(getMonthLabel(metrics.activeMonthKey, { month: "short", year: undefined }).replace(".", ""))}</span>`).join("");
  applyStatusPill(statusElements.line, metrics.transactionCount ? (metrics.hasPreviousBaseline ? `${formatSignedPercent(metrics.comparisons.dailyAverageChange)} vs ${metrics.previousMonthLabelShort}` : `Proyeccion ${formatMoney(metrics.projectedMonthlySpend)}`) : "Sin datos", getTrendTone(metrics.comparisons.dailyAverageChange, { lowerIsBetter: true }));
};
const renderIncomeCard = (state, metrics, animate = false) => {
  setMetricValue(summaryElements.incomeHighlight, state.income, animate);
  setMetricValue(summaryElements.fixedAmount, metrics.fixedSpend, animate);
  setMetricValue(summaryElements.variableAmount, metrics.variableSpend, animate);
  setTextValue(textElements.incomeCaption, state.income > 0 ? "Editar el ingreso actualiza balance, ahorro, promedio diario y comparativas al instante." : "Define el ingreso mensual para que el resumen sea real.");
  if (stackedSegments.length >= 2) { stackedSegments[0].style.width = `${clamp(metrics.fixedShare, 0, 100)}%`; stackedSegments[1].style.width = `${clamp(metrics.variableShare, 0, 100)}%`; }
  setTextValue(document.querySelector("[data-projection-label]"), metrics.transactionCount ? `${formatValue(metrics.fixedShare, 1)}% fijos - ${formatValue(metrics.variableShare, 1)}% variables` : "Sin gastos cargados");
  setMetricValue(document.querySelector("[data-projection-output]"), metrics.remainingBalance, animate);
  setMetricValue(document.querySelector("[data-projection-gain]"), metrics.savingsRate, animate);
  setTextValue(textElements.savingsAmountText, formatMoney(metrics.savingsAmount));
};

const createInsight = (flag, tone, title, body, meta) => ({ flag, tone, title, body, meta });
const generateInsights = (state, metrics) => !metrics.transactionCount ? [createInsight("Setup", "mint", "Carga tu primer gasto del mes", "Con un ingreso y al menos un gasto vas a ver balance, ahorro, categorias y comparativas reales.", state.income > 0 ? `Ingreso actual: ${formatMoney(state.income)}.` : "Todavía no hay ingreso mensual cargado.")] : [
  createInsight(metrics.topCategory?.category || "Categoria", "blue", "Categoria principal", metrics.topCategory ? `${metrics.topCategory.category} concentra ${formatValue(metrics.topCategory.share, 1)}% del gasto del mes.` : "Sin categoria dominante.", metrics.topCategory ? `Total: ${formatMoney(metrics.topCategory.total)}.` : "Sin datos."),
  createInsight("Mayor gasto", "rose", "Gasto mas alto", metrics.largestExpense ? `${metrics.largestExpense.title} fue el gasto mas grande del mes.` : "Todavía no hay gastos.", metrics.largestExpense ? `${formatMoney(metrics.largestExpense.amount)} el ${formatDate(metrics.largestExpense.date, { month: "short", day: "numeric", year: undefined })}.` : "Sin datos."),
  createInsight("Promedio", "mint", "Promedio diario", `${formatMoney(metrics.dailyAverage)} por dia sobre ${metrics.elapsedDays} dia(s) cargados.`, `Proyeccion al cierre: ${formatMoney(metrics.projectedMonthlySpend)}.`),
  createInsight("Ahorro", metrics.savingsRate > 0 ? "mint" : "blue", "Tasa de ahorro", state.income > 0 ? `Llevas ${formatValue(metrics.savingsRate, 1)}% de ahorro sobre tu ingreso del mes.` : "Define tu ingreso mensual para calcular la tasa de ahorro.", state.income > 0 ? `${formatMoney(metrics.savingsAmount)} libres sobre ${formatMoney(state.income)}.` : "Sin ingreso cargado."),
  createInsight("Split", "blue", "Fijos vs variables", `${formatValue(metrics.fixedShare, 1)}% fijos y ${formatValue(metrics.variableShare, 1)}% variables dentro de tus gastos.`, `Fijos: ${formatMoney(metrics.fixedSpend)} - Variables: ${formatMoney(metrics.variableSpend)}.`),
];
const renderInsights = (insights) => { if (!insightList) return; insightList.innerHTML = insights.map((insight) => `<article class="insight"><div class="insight__flag ${INSIGHT_FLAG_TONES[insight.tone] || INSIGHT_FLAG_TONES.blue}">${escapeHtml(insight.flag)}</div><div><strong>${escapeHtml(insight.title)}</strong><p>${escapeHtml(insight.body)}</p><span class="insight__meta">${escapeHtml(insight.meta)}</span></div></article>`).join(""); };

const renderDashboard = (animate = false) => {
  const state = getState();
  const metrics = computeDashboardMetrics(state);
  renderPeriod(metrics);
  renderFilterControls(state, metrics);
  renderExpenseList(state, metrics);
  renderExportState(state, metrics);
  renderKpis(state, metrics, animate);
  renderKpiMeta(state, metrics);
  renderSummaries(state, metrics, animate);
  renderSidebar(metrics);
  renderHero(state, metrics, animate);
  renderPlanner(state, metrics, animate);
  renderCategoryMix(metrics);
  renderLineChart(metrics);
  renderIncomeCard(state, metrics, animate);
  renderInsights(generateInsights(state, metrics));
};

const closeSidebar = () => body.classList.remove("sidebar-open");
const getScrollBehavior = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? "auto" : "smooth";
const setActiveNavItem = (target) => navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.navItem === target));
const scrollToDashboardSection = (target) => {
  const section = SECTION_TARGETS[target] || SECTION_TARGETS.dashboard;
  if (!section) return;
  closeSidebar();
  setActiveNavItem(target);
  window.requestAnimationFrame(() => window.scrollTo({ top: Math.max(0, window.scrollY + section.getBoundingClientRect().top - ((topbar?.offsetHeight || 0) + NAV_SCROLL_OFFSET)), behavior: getScrollBehavior() }));
};

const setModalPanel = (panelName) => modalPanels.forEach((panel) => { panel.hidden = panel.dataset.modalPanel !== panelName; });
const clearFormFeedback = () => { if (formFeedback) formFeedback.textContent = ""; };
const clearIncomeFeedback = () => { if (incomeFeedback) incomeFeedback.textContent = ""; };
const applyFilterPatch = (patch) => { updateState({ filters: patch }); renderDashboard(false); };
const resetFilters = () => { updateState((state) => ({ filters: getDefaultFilters(state) })); renderDashboard(false); };
const openModal = (focusTarget = null) => { if (!modal) return; if (modal.hidden && document.activeElement instanceof HTMLElement) uiState.lastFocusedElement = document.activeElement; modal.hidden = false; body.classList.add("modal-open"); closeSidebar(); if (focusTarget instanceof HTMLElement) window.requestAnimationFrame(() => focusTarget.focus()); };
const closeModal = () => { if (!modal) return; modal.hidden = true; body.classList.remove("modal-open"); uiState.modalMode = null; uiState.activeExpenseId = null; clearFormFeedback(); clearIncomeFeedback(); expenseForm?.reset(); incomeForm?.reset(); if (uiState.lastFocusedElement instanceof HTMLElement) window.requestAnimationFrame(() => uiState.lastFocusedElement.focus()); uiState.lastFocusedElement = null; };
const getExpenseById = (expenseId) => getState().expenses.find((expense) => expense.id === expenseId) || null;

const openFiltersModal = () => { uiState.modalMode = "filters"; setModalPanel("filters"); renderDashboard(false); openModal(filterMonthInput || filterCategoryInput); };
const openExportModal = () => { uiState.modalMode = "export"; setModalPanel("export"); renderDashboard(false); openModal(!exportCsvButton?.disabled ? exportCsvButton : !exportJsonButton?.disabled ? exportJsonButton : modalCloseButton); };
const openRestoreModal = () => { uiState.modalMode = "restore"; setModalPanel("reset"); openModal(confirmRestoreButton || modalCloseButton); };
const openIncomeModal = () => { if (!incomeForm || !incomeInput) return; uiState.modalMode = "income"; setModalPanel("income"); clearIncomeFeedback(); incomeForm.reset(); incomeInput.value = String(roundCurrency(getState().income)); openModal(incomeInput); };
const openExpenseModal = (mode, expense = null) => {
  if (!expenseForm || !modalTitle || !modalEyebrow || !modalCopy || !formSubmit) return;
  uiState.modalMode = mode;
  uiState.activeExpenseId = expense?.id || null;
  setModalPanel("form");
  openModal();
  clearFormFeedback();
  expenseForm.reset();
  getFormField("id").value = expense?.id || "";
  getFormField("title").value = expense?.title || "";
  getFormField("amount").value = expense?.amount ? String(expense.amount) : "";
  getFormField("category").value = expense?.category || "";
  getFormField("date").value = expense?.date ? expense.date.slice(0, 10) : new Date().toISOString().slice(0, 10);
  getFormField("paymentMethod").value = expense?.paymentMethod || "";
  getFormField("note").value = expense?.note || "";
  getFormField("isFixed").checked = Boolean(expense?.isFixed);
  modalEyebrow.textContent = mode === "edit" ? "Editar movimiento" : "Agregar movimiento";
  modalTitle.textContent = mode === "edit" ? "Editar gasto" : "Agregar gasto";
  modalCopy.textContent = mode === "edit" ? "Actualiza los datos y el resumen del mes se recalcula al instante." : "Carga un gasto real del mes sin salir del dashboard.";
  formSubmit.textContent = mode === "edit" ? "Guardar cambios" : "Guardar gasto";
  window.requestAnimationFrame(() => getFormField("title").focus());
};
const openDeleteModal = (expense) => {
  if (!expense || !confirmDeleteButton) return;
  uiState.modalMode = "delete";
  uiState.activeExpenseId = expense.id;
  confirmTitle.textContent = expense.title;
  confirmDate.textContent = formatDate(expense.date, { month: "short", day: "numeric", year: "numeric" });
  confirmCopy.textContent = expense.note || "Vas a eliminar este gasto del registro mensual.";
  confirmAmount.textContent = `- ${formatMoney(expense.amount)}`;
  setModalPanel("confirm");
  openModal(confirmDeleteButton);
};

const validateExpensePayload = (payload) => !payload.title || payload.title.trim().length < 2 ? "Agrega una descripcion clara." : !Number.isFinite(payload.amount) || payload.amount <= 0 ? "Ingresa un monto mayor a cero." : !payload.category ? "Elegí una categoria." : !payload.date || Number.isNaN(new Date(payload.date).getTime()) ? "Selecciona una fecha valida." : !payload.paymentMethod ? "Elegí un medio de pago." : "";
const validateIncomeValue = (rawValue, value) => !rawValue ? "Ingresa el monto mensual." : !Number.isFinite(value) ? "Ingresa un numero valido." : value < 0 ? "El ingreso no puede ser negativo." : "";
const buildExpensePayload = () => {
  if (!expenseForm) return null;
  const data = new FormData(expenseForm);
  const existingExpense = uiState.activeExpenseId ? getExpenseById(uiState.activeExpenseId) : null;
  const submittedDate = String(data.get("date") || "").trim();
  return {
    id: existingExpense?.id || String(data.get("id") || "").trim() || generateId(),
    title: String(data.get("title") || "").trim(),
    amount: roundCurrency(Number(data.get("amount"))),
    category: String(data.get("category") || "").trim(),
    date: submittedDate ? `${submittedDate}T12:00:00` : "",
    paymentMethod: String(data.get("paymentMethod") || "").trim(),
    note: String(data.get("note") || "").trim(),
    createdAt: existingExpense?.createdAt || new Date().toISOString(),
    isFixed: Boolean(data.get("isFixed")),
  };
};

const handleExpenseSubmit = (event) => {
  event.preventDefault();
  const payload = buildExpensePayload();
  const validation = validateExpensePayload(payload);
  if (validation) { if (formFeedback) formFeedback.textContent = validation; return; }
  const wasEditing = uiState.modalMode === "edit";
  updateState((state) => wasEditing && uiState.activeExpenseId ? { expenses: state.expenses.map((expense) => expense.id === uiState.activeExpenseId ? { ...expense, ...payload, id: expense.id, createdAt: expense.createdAt } : expense) } : { expenses: [payload, ...state.expenses] });
  closeModal();
  renderDashboard(true);
  showToast(wasEditing ? "Gasto actualizado." : "Gasto agregado.");
};
const handleDeleteExpense = () => { if (!uiState.activeExpenseId) return; updateState((state) => ({ expenses: state.expenses.filter((expense) => expense.id !== uiState.activeExpenseId) })); closeModal(); renderDashboard(true); showToast("Gasto eliminado."); };
const handleIncomeSubmit = (event) => {
  event.preventDefault();
  const rawIncome = String(new FormData(incomeForm).get("income") || "").trim();
  const income = roundCurrency(Number(rawIncome));
  const validation = validateIncomeValue(rawIncome, income);
  if (validation) { if (incomeFeedback) incomeFeedback.textContent = validation; return; }
  updateState({ income });
  closeModal();
  renderDashboard(true);
  showToast("Ingreso mensual actualizado.");
};
const handleSearchUpdate = (value) => { const currentState = getState(); const normalized = normalizeSearchValue(value); const shouldReveal = Boolean(normalized) && !hasSearchFilter(currentState); applyFilterPatch({ search: normalized }); if (shouldReveal) scrollToDashboardSection("activity"); };
const handleMonthFilterUpdate = (value) => applyFilterPatch({ month: normalizeMonthFilterValue(value, getDefaultFilters(getState()).month) });
const handleCategoryFilterUpdate = (value) => applyFilterPatch({ category: normalizeCategoryFilterValue(value) });
const exportVisibleExpenses = (format) => {
  const state = getState();
  const { filteredExpenses } = getVisibleExpensesContext(state);
  if (!filteredExpenses.length) return showToast("No hay gastos visibles para exportar.", "error");
  const content = format === "json" ? serializeExpensesToJson(filteredExpenses) : serializeExpensesToCsv(filteredExpenses);
  downloadTextFile(`${getExportBaseFilename(state)}.${format}`, content, format === "json" ? "application/json;charset=utf-8" : "text/csv;charset=utf-8");
  closeModal();
  showToast(`Exportacion ${format.toUpperCase()} lista.`);
};
const restoreDemoData = () => { setState(getDemoState()); closeModal(); renderDashboard(true); scrollToDashboardSection("dashboard"); showToast("Ejemplo restaurado."); };

const initializeModals = () => {
  if (fab) fab.addEventListener("click", () => openExpenseModal("add"));
  openIncomeButtons.forEach((button) => button.addEventListener("click", openIncomeModal));
  openFilterButtons.forEach((button) => button.addEventListener("click", openFiltersModal));
  openExportButtons.forEach((button) => button.addEventListener("click", openExportModal));
  modalCloseTriggers.forEach((trigger) => trigger.addEventListener("click", closeModal));
  expenseForm?.addEventListener("submit", handleExpenseSubmit);
  expenseForm?.addEventListener("input", clearFormFeedback);
  expenseForm?.addEventListener("change", clearFormFeedback);
  incomeForm?.addEventListener("submit", handleIncomeSubmit);
  incomeForm?.addEventListener("input", clearIncomeFeedback);
  incomeForm?.addEventListener("change", clearIncomeFeedback);
  confirmDeleteButton?.addEventListener("click", handleDeleteExpense);
  confirmRestoreButton?.addEventListener("click", restoreDemoData);
  searchInput?.addEventListener("input", (event) => handleSearchUpdate(event.target.value));
  filterMonthInput?.addEventListener("change", (event) => handleMonthFilterUpdate(event.target.value));
  filterCategoryInput?.addEventListener("change", (event) => handleCategoryFilterUpdate(event.target.value));
  clearFiltersButton?.addEventListener("click", resetFilters);
  filterForm?.addEventListener("submit", (event) => { event.preventDefault(); closeModal(); });
  exportJsonButton?.addEventListener("click", () => exportVisibleExpenses("json"));
  exportCsvButton?.addEventListener("click", () => exportVisibleExpenses("csv"));
  modalRestoreButtons.forEach((button) => button.addEventListener("click", openRestoreModal));
  expenseList?.addEventListener("click", (event) => {
    const listAction = event.target.closest("[data-list-action]");
    if (listAction) {
      const action = listAction.dataset.listAction;
      if (action === "clear-filters") resetFilters();
      if (action === "open-filters") openFiltersModal();
      if (action === "restore-demo") openRestoreModal();
      if (action === "open-add") openExpenseModal("add");
      return;
    }
    const actionTrigger = event.target.closest("[data-expense-action]");
    if (!actionTrigger) return;
    const expense = getExpenseById(actionTrigger.dataset.expenseId);
    if (!expense) return;
    if (actionTrigger.dataset.expenseAction === "edit") return openExpenseModal("edit", expense);
    if (actionTrigger.dataset.expenseAction === "delete") openDeleteModal(expense);
  });
  window.addEventListener("keydown", (event) => { if (event.key === "Escape" && modal && !modal.hidden) closeModal(); });
};

renderDashboard(false);
initializeModals();

window.addEventListener("load", () => {
  window.setTimeout(() => {
    body.classList.remove("is-loading");
    body.classList.add("is-ready");
    animateInitialCountups();
  }, 950);
});

menuToggle?.addEventListener("click", () => body.classList.toggle("sidebar-open"));
backdrop?.addEventListener("click", closeSidebar);
navItems.forEach((item) => item.addEventListener("click", () => scrollToDashboardSection(item.dataset.navItem)));
window.addEventListener("resize", () => { if (window.innerWidth >= 1120) closeSidebar(); });
