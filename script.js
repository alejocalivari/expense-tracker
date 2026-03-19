const { getSampleState, getState, setState, updateState } = window.aleclvExpenseTrackerState;
const { formatCurrency, formatDate, generateId } = window.aleclvExpenseTrackerUtils;

const TOAST_TIMEOUT_MS = 2600;
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;
const DEFAULT_VIEW = "resumen";
const ACTIVE_VIEW_STORAGE_KEY = `${window.aleclvExpenseTrackerStorage?.STORAGE_KEY || "aleclv-salary-planner-state"}:active-view`;
const VIEW_TOPBAR_CONFIG = {
  resumen: {
    eyebrow: "vision general",
    getTitle: (metrics) => `${metrics.monthLabelLong} - resumen mensual del salario`,
    showSearch: false,
    showFilters: false,
    showIncomeAction: false,
  },
  flujo: {
    eyebrow: "analisis del mes",
    getTitle: () => "flujo del mes",
    showSearch: false,
    showFilters: false,
    showIncomeAction: false,
  },
  ingreso: {
    eyebrow: "control del mes",
    getTitle: () => "plan de ingreso del mes",
    showSearch: false,
    showFilters: false,
    showIncomeAction: true,
  },
  actividad: {
    eyebrow: "operaciones del mes",
    getTitle: () => "movimientos del mes",
    showSearch: true,
    showFilters: true,
    showIncomeAction: false,
  },
  calendario: {
    eyebrow: "planificacion anual",
    getTitle: () => "plan anual por mes",
    showSearch: false,
    showFilters: false,
    showIncomeAction: false,
  },
};
const CATEGORY_SWATCHES = [
  { className: "mint", color: "var(--accent)" },
  { className: "blue", color: "var(--accent-blue)" },
  { className: "amber", color: "var(--accent-amber)" },
  { className: "rose", color: "var(--accent-rose)" },
  { className: "slate", color: "var(--accent-slate)" },
];
const STATUS_PILL_CLASSES = ["status-pill--positive", "status-pill--neutral", "status-pill--negative"];
const SAVINGS_CAPACITY_STATES = {
  neutral: { label: "Sin ingreso" },
  excellent: { label: "Excelente" },
  healthy: { label: "Saludable" },
  low: { label: "Bajo" },
};
const DEFAULT_GOAL_LABEL = "Meta mensual de inversion";

const body = document.body;
const topbar = document.querySelector(".topbar");
const openIncomeButtons = document.querySelectorAll("[data-open-income]");
const openGoalButtons = document.querySelectorAll("[data-open-goal]");
const openInvestmentButtons = document.querySelectorAll("[data-open-investment]");
const openExpenseButtons = document.querySelectorAll("[data-open-expense]");
const modalRestoreButtons = document.querySelectorAll("[data-modal-restore-sample]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const backdrop = document.querySelector("[data-backdrop]");
const navItems = document.querySelectorAll("[data-nav-item]");
const openFilterButtons = document.querySelectorAll("[data-open-filters]");
const openExportButtons = document.querySelectorAll("[data-open-export]");
const searchInput = document.querySelector("[data-search-input]");
const topbarActions = document.querySelector("[data-topbar-actions]");
const topbarEyebrow = document.querySelector("[data-topbar-eyebrow]");
const topbarSearch = document.querySelector("[data-topbar-search]");
const topbarFilters = document.querySelector("[data-topbar-filters]");
const topbarIncomeButton = document.querySelector("[data-topbar-income]");
const dashboardMain = document.querySelector("[data-dashboard-main]");
const expenseList = document.querySelector("[data-expense-list]");
const expenseResults = document.querySelector("[data-expense-results]");
const insightList = document.querySelector("[data-insight-list]");
const fab = document.querySelector(".fab");
const fabLabel = document.querySelector(".fab__label");
const modal = document.querySelector("[data-modal]");
const modalPanels = document.querySelectorAll("[data-modal-panel]");
const modalCloseButton = document.querySelector(".app-modal__close");
const modalCloseTriggers = document.querySelectorAll("[data-modal-close]");
const modalEyebrow = document.querySelector("[data-modal-eyebrow]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalCopy = document.querySelector("[data-modal-copy]");
const expenseForm = document.querySelector("[data-expense-form]");
const incomeForm = document.querySelector("[data-income-form]");
const goalForm = document.querySelector("[data-goal-form]");
const formFeedback = document.querySelector("[data-form-feedback]");
const incomeFeedback = document.querySelector("[data-income-feedback]");
const goalFeedback = document.querySelector("[data-goal-feedback]");
const formSubmit = document.querySelector("[data-form-submit]");
const incomeBaseInput = document.querySelector("[data-income-base-input]");
const incomeExtraInput = document.querySelector("[data-income-extra-input]");
const incomeTotalPreview = document.querySelector("[data-income-total-preview]");
const incomeMonthLabel = document.querySelector("[data-income-month-label]");
const goalAmountInput = document.querySelector("[data-goal-amount-input]");
const goalLabelInput = document.querySelector("[data-goal-label-input]");
const goalAmountPreview = document.querySelector("[data-goal-amount-preview]");
const goalLabelPreview = document.querySelector("[data-goal-label-preview]");
const confirmDeleteButton = document.querySelector("[data-confirm-delete]");
const confirmTitle = document.querySelector("[data-confirm-title]");
const confirmDate = document.querySelector("[data-confirm-date]");
const confirmCopy = document.querySelector("[data-confirm-copy]");
const confirmAmount = document.querySelector("[data-confirm-amount]");
const filterForm = document.querySelector("[data-filter-form]");
const filterMonthInput = document.querySelector("[data-filter-month]");
const filterCategoryInput = document.querySelector("[data-filter-category]");
const filterPaymentMethodInput = document.querySelector("[data-filter-payment-method]");
const filterExpenseTypeInput = document.querySelector("[data-filter-expense-type]");
const filterSortInput = document.querySelector("[data-filter-sort]");
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
const lineActualPath = document.querySelector("[data-line-actual]");
const lineTargetPath = document.querySelector("[data-line-target]");
const lineAreaPath = document.querySelector("[data-line-area]");
const linePoints = document.querySelector("[data-line-points]");
const lineAxis = document.querySelector("[data-line-axis]");
const calendarGrid = document.querySelector("[data-calendar-grid]");
const calendarYearLabel = document.querySelector("[data-calendar-year]");
const calendarCopy = document.querySelector("[data-calendar-copy]");
const calendarSummaryNote = document.querySelector("[data-calendar-summary-note]");
const calendarShiftButtons = document.querySelectorAll("[data-calendar-shift]");

const viewSections = {
  resumen: document.querySelector('[data-view="resumen"]'),
  flujo: document.querySelector('[data-view="flujo"]'),
  ingreso: document.querySelector('[data-view="ingreso"]'),
  actividad: document.querySelector('[data-view="actividad"]'),
  calendario: document.querySelector('[data-view="calendario"]'),
};

const canUseLocalStorage = () => {
  try {
    return typeof window.localStorage !== "undefined";
  } catch (error) {
    return false;
  }
};

const isKnownView = (viewName) => Boolean(viewName && Object.prototype.hasOwnProperty.call(viewSections, viewName) && viewSections[viewName]);

const readPersistedActiveView = () => {
  if (!canUseLocalStorage()) {
    return DEFAULT_VIEW;
  }

  try {
    const persistedView = window.localStorage.getItem(ACTIVE_VIEW_STORAGE_KEY);
    return isKnownView(persistedView) ? persistedView : DEFAULT_VIEW;
  } catch (error) {
    return DEFAULT_VIEW;
  }
};

const persistActiveView = (viewName) => {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(ACTIVE_VIEW_STORAGE_KEY, isKnownView(viewName) ? viewName : DEFAULT_VIEW);
  } catch (error) {
    return;
  }
};

const kpiElements = {
  incomeTotal: document.querySelector('[data-kpi="incomeTotal"]'),
  totalSpent: document.querySelector('[data-kpi="totalSpent"]'),
  savingsCapacity: document.querySelector('[data-kpi="savingsCapacity"]'),
  remainingBalance: document.querySelector('[data-kpi="remainingBalance"]'),
  savingsAmount: document.querySelector('[data-kpi="savingsAmount"]'),
  dailyAverage: document.querySelector('[data-kpi="dailyAverage"]'),
  goalProgress: document.querySelector('[data-kpi="goalProgress"]'),
};

const kpiDeltaElements = {
  incomeTotal: document.querySelector('[data-kpi-delta="incomeTotal"]'),
  totalSpent: document.querySelector('[data-kpi-delta="totalSpent"]'),
  savingsCapacity: document.querySelector('[data-kpi-delta="savingsCapacity"]'),
  remainingBalance: document.querySelector('[data-kpi-delta="remainingBalance"]'),
  savingsAmount: document.querySelector('[data-kpi-delta="savingsAmount"]'),
  dailyAverage: document.querySelector('[data-kpi-delta="dailyAverage"]'),
  goalProgress: document.querySelector('[data-kpi-delta="goalProgress"]'),
};

const kpiCaptionElements = {
  incomeTotal: document.querySelector('[data-kpi-caption="incomeTotal"]'),
  totalSpent: document.querySelector('[data-kpi-caption="totalSpent"]'),
  savingsCapacity: document.querySelector('[data-kpi-caption="savingsCapacity"]'),
  remainingBalance: document.querySelector('[data-kpi-caption="remainingBalance"]'),
  savingsAmount: document.querySelector('[data-kpi-caption="savingsAmount"]'),
  dailyAverage: document.querySelector('[data-kpi-caption="dailyAverage"]'),
  goalProgress: document.querySelector('[data-kpi-caption="goalProgress"]'),
};

const kpiProgressElements = {
  savingsCapacity: document.querySelector('[data-kpi-progress="savingsCapacity"]'),
};

const kpiBarElements = {
  savingsCapacity: document.querySelector('[data-kpi-bar="savingsCapacity"]'),
};

const kpiCardElements = {
  savingsCapacity: document.querySelector('[data-kpi-card="savingsCapacity"]'),
};

const yearSummaryElements = {
  income: document.querySelector('[data-year-summary="income"]'),
  spent: document.querySelector('[data-year-summary="spent"]'),
  invested: document.querySelector('[data-year-summary="invested"]'),
  average: document.querySelector('[data-year-summary="average"]'),
};

const summaryElements = {
  sidebarFreeCash: document.querySelector('[data-summary="sidebar-free-cash"]'),
  sidebarSavings: document.querySelector('[data-summary="sidebar-savings"]'),
  heroRemaining: document.querySelector('[data-summary="hero-remaining"]'),
  heroGoalSavings: document.querySelector('[data-summary="hero-goal-savings"]'),
  miniDailyAverage: document.querySelector('[data-summary="mini-daily-average"]'),
  miniSecondaryValue: document.querySelector('[data-summary="mini-secondary-value"]'),
  chartTotalSpent: document.querySelector('[data-summary="chart-total-spent"]'),
  goalAmount: document.querySelector('[data-summary="goal-amount"]'),
  goalSaved: document.querySelector('[data-summary="goal-saved"]'),
  goalGapValue: document.querySelector('[data-summary="goal-gap-value"]'),
  goalExceeded: document.querySelector('[data-summary="goal-exceeded"]'),
  incomeTotal: document.querySelector('[data-summary="income-total"]'),
  incomeBase: document.querySelector('[data-summary="income-base"]'),
  incomeExtra: document.querySelector('[data-summary="income-extra"]'),
  incomeBalance: document.querySelector('[data-summary="income-balance"]'),
  incomeSavings: document.querySelector('[data-summary="income-savings"]'),
  incomeCapacityAmount: document.querySelector('[data-summary="income-capacity-amount"]'),
  incomeSpent: document.querySelector('[data-summary="income-spent"]'),
  incomeGoalAmount: document.querySelector('[data-summary="income-goal-amount"]'),
  incomeGoalSaved: document.querySelector('[data-summary="income-goal-saved"]'),
  incomeGoalGap: document.querySelector('[data-summary="income-goal-gap"]'),
};

const textElements = {
  periodTitle: document.querySelector("[data-period-title]"),
  periodPill: document.querySelector("[data-period-pill]"),
  sidebarSavingsCapacity: document.querySelector('[data-summary-text="sidebar-savings-capacity"]'),
  heroCaption: document.querySelector('[data-summary-text="hero-caption"]'),
  heroStat2Value: document.querySelector('[data-summary-text="hero-stat-2-value"]'),
  miniDailyNote: document.querySelector('[data-summary-text="mini-daily-note"]'),
  miniSecondaryNote: document.querySelector('[data-summary-text="mini-secondary-note"]'),
  miniTertiaryValue: document.querySelector('[data-summary-text="mini-tertiary-value"]'),
  miniTertiaryNote: document.querySelector('[data-summary-text="mini-tertiary-note"]'),
  categoryCountPill: document.querySelector('[data-summary-text="category-count-pill"]'),
  goalHeading: document.querySelector('[data-summary-text="goal-heading"]'),
  goalNote: document.querySelector('[data-summary-text="goal-note"]'),
  goalProgressText: document.querySelector('[data-summary-text="goal-progress-text"]'),
  comparisonNote: document.querySelector('[data-summary-text="comparison-note"]'),
  incomeCaption: document.querySelector('[data-summary-text="income-caption"]'),
  incomeUsageLabel: document.querySelector("[data-income-usage-label]"),
  incomeUsageCopy: document.querySelector('[data-summary-text="income-usage-copy"]'),
  incomeGoalLabel: document.querySelector('[data-summary-text="income-goal-label"]'),
  incomeGoalGapLabel: document.querySelector('[data-summary-text="income-goal-gap-label"]'),
  incomeGoalCopy: document.querySelector('[data-summary-text="income-goal-copy"]'),
  incomeResultCopy: document.querySelector('[data-summary-text="income-result-copy"]'),
};

const comparisonElements = {
  totalSpentCopy: document.querySelector('[data-comparison="totalSpent-copy"]'),
  totalSpentValue: document.querySelector('[data-comparison="totalSpent-value"]'),
  remainingBalanceCopy: document.querySelector('[data-comparison="remainingBalance-copy"]'),
  remainingBalanceValue: document.querySelector('[data-comparison="remainingBalance-value"]'),
  investedCopy: document.querySelector('[data-comparison="invested-copy"]'),
  investedValue: document.querySelector('[data-comparison="invested-value"]'),
  categoryShiftCopy: document.querySelector('[data-comparison="categoryShift-copy"]'),
  categoryShiftValue: document.querySelector('[data-comparison="categoryShift-value"]'),
};

const labelElements = {
  heroStat1: document.querySelector('[data-summary-label="hero-stat-1-label"]'),
  heroStat2: document.querySelector('[data-summary-label="hero-stat-2-label"]'),
  miniSecondary: document.querySelector('[data-summary-label="mini-secondary-label"]'),
  miniTertiary: document.querySelector('[data-summary-label="mini-tertiary-label"]'),
  goalGap: document.querySelector('[data-summary-label="goal-gap-label"]'),
};

const barElements = {
  sidebarSavingsCapacity: document.querySelector('[data-summary-bar="sidebar-savings-capacity"]'),
  goalProgress: document.querySelector('[data-summary-bar="goal-progress"]'),
};

const statusElements = {
  sidebar: document.querySelector('[data-summary-status="sidebar"]'),
  hero: document.querySelector('[data-summary-status="hero"]'),
  goal: document.querySelector('[data-summary-status="goal"]'),
  line: document.querySelector('[data-summary-status="line"]'),
};

const stackedSegments = document.querySelectorAll(".stacked-bar__segment");

const uiState = {
  activeView: readPersistedActiveView(),
  latestMetrics: null,
  categoryLegendItems: [],
  categoryHighlightIndex: -1,
  modalMode: null,
  activeExpenseId: null,
  lastFocusedElement: null,
  toastTimer: null,
};

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const roundCurrency = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
const escapeHtml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const normalizeText = (value = "") => String(value).trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const formatMoney = (value, decimals = 2) => formatCurrency(Number(value || 0), { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const formatNumber = (value, decimals = 0) => Number(value || 0).toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const formatPercent = (value, decimals = 1) => `${formatNumber(value, decimals)}%`;
const formatSignedCurrency = (value) => `${value > 0 ? "+" : value < 0 ? "-" : ""}${formatMoney(Math.abs(value))}`;
const formatSignedPercent = (value, decimals = 1) => (Number.isFinite(value) ? `${value > 0 ? "+" : value < 0 ? "-" : ""}${formatNumber(Math.abs(value), decimals)}%` : "Sin base");
const getSavingsCapacityPercent = (remainingBalance, totalIncome) => (totalIncome > 0 ? roundCurrency((remainingBalance / totalIncome) * 100) : 0);
const getSavingsCapacityState = (percent, totalIncome) => {
  if (!(totalIncome > 0)) {
    return "neutral";
  }

  if (percent > 40) {
    return "excellent";
  }

  if (percent >= 20) {
    return "healthy";
  }

  return "low";
};
const getSavingsCapacityStateLabel = (state) => SAVINGS_CAPACITY_STATES[state]?.label || SAVINGS_CAPACITY_STATES.low.label;
const getSavingsCapacityHeadline = (metrics) => {
  if (!metrics.totalIncome) {
    return "Todavia no hay ingreso cargado";
  }

  if (metrics.remainingBalance < 0) {
    return `${getSavingsCapacityStateLabel(metrics.savingsCapacityState)}: vas ${formatPercent(Math.abs(metrics.savingsCapacityPercent), 1)} por encima del ingreso`;
  }

  return `${getSavingsCapacityStateLabel(metrics.savingsCapacityState)}: ${formatPercent(metrics.savingsCapacityPercent, 1)} del ingreso sigue disponible`;
};
const getSavingsCapacityInsight = (metrics) => {
  if (!metrics.totalIncome) {
    return "Carga el ingreso del mes para calcular tu capacidad de ahorro.";
  }

  if (metrics.remainingBalance < 0) {
    return `Bajo: ya consumiste ${formatPercent(Math.abs(metrics.savingsCapacityPercent), 1)} por encima del ingreso mensual.`;
  }

  return `${getSavingsCapacityStateLabel(metrics.savingsCapacityState)}: estas ahorrando el ${formatPercent(metrics.savingsCapacityPercent, 1)} de tu ingreso mensual.`;
};
const readDecimals = (element) => Number(element?.dataset.decimals || 0);
const isValidMonthKey = (value) => MONTH_KEY_PATTERN.test(String(value || "").trim());
const getExpenseDate = (expense) => {
  const parsed = new Date(expense?.date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
const getMonthKey = (value) => {
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
};
const getCurrentMonthKey = () => getMonthKey(new Date());
const getLatestMonthKey = (expenses = []) => {
  const latestDate = expenses.reduce((latest, expense) => {
    const parsed = getExpenseDate(expense);
    return !parsed || (latest && latest > parsed) ? latest : parsed;
  }, null);

  return latestDate ? getMonthKey(latestDate) : getCurrentMonthKey();
};
const shiftMonthKey = (monthKey, offset) => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1, 12));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};
const getMonthLabel = (monthKey, options = {}) => {
  const date = new Date(`${monthKey}-01T12:00:00`);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", ...options }).format(date);
};
const getYearFromMonthKey = (monthKey) => Number(String(monthKey || "").split("-")[0]) || new Date().getFullYear();
const getMonthNumberFromMonthKey = (monthKey) => Number(String(monthKey || "").split("-")[1]) || 1;
const buildMonthKey = (year, monthNumber) => `${year}-${String(monthNumber).padStart(2, "0")}`;
const getCalendarMonthLabel = (monthKey) => getMonthLabel(monthKey, { month: "short", year: undefined }).replace(".", "");
const isFutureMonthKey = (monthKey) => monthKey > getCurrentMonthKey();
const getDaysInMonth = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month, 0).getDate();
};
const getDefaultFilters = (state = getState()) => ({
  month: getLatestMonthKey(state.expenses),
  category: "all",
  paymentMethod: "all",
  expenseType: "all",
  sort: "newest",
  search: "",
});
const getActiveMonthKey = (state) => (isValidMonthKey(state.filters.month) ? state.filters.month : getLatestMonthKey(state.expenses));
const getTotalIncome = (state) => roundCurrency(Number(state.incomeBase || 0) + Number(state.incomeExtra || 0));
const getExpensesForMonth = (expenses, monthKey) => expenses.filter((expense) => getMonthKey(expense.date) === monthKey);
const getElapsedDaysForMonth = (monthKey, expenses) => {
  const daysInMonth = getDaysInMonth(monthKey);

  if (monthKey === getCurrentMonthKey()) {
    return clamp(new Date().getDate(), 1, daysInMonth);
  }

  if (monthKey < getCurrentMonthKey()) {
    return daysInMonth;
  }

  const latestDay = expenses.reduce((maxDay, expense) => {
    const parsed = getExpenseDate(expense);
    return Math.max(maxDay, parsed?.getDate() || 0);
  }, 0);

  return clamp(latestDay || 1, 1, daysInMonth);
};

const buildCategoryBreakdown = (expenses, totalSpent) => {
  const totals = expenses.reduce((accumulator, expense) => {
    const category = expense.category || "Otros";
    accumulator[category] = roundCurrency((accumulator[category] || 0) + Number(expense.amount || 0));
    return accumulator;
  }, {});

  return Object.entries(totals)
    .map(([category, total]) => ({
      category,
      total,
      share: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
    }))
    .sort((left, right) => right.total - left.total);
};

const buildLegendCategories = (breakdown) => {
  if (breakdown.length <= 5) {
    return breakdown;
  }

  const remaining = breakdown.slice(4);

  return [
    ...breakdown.slice(0, 4),
    {
      category: "Otros",
      total: roundCurrency(remaining.reduce((sum, item) => sum + item.total, 0)),
      share: remaining.reduce((sum, item) => sum + item.share, 0),
    },
  ];
};

const summarizeMonth = (expenses, incomeTotal, monthKey) => {
  const totalSpent = roundCurrency(expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0));
  const fixedSpend = roundCurrency(expenses.filter((expense) => expense.isFixed).reduce((sum, expense) => sum + Number(expense.amount || 0), 0));
  const variableSpend = roundCurrency(Math.max(totalSpent - fixedSpend, 0));
  const investmentTransactions = expenses.filter((expense) => expense.category === "Inversion");
  const investedThisMonth = roundCurrency(investmentTransactions.reduce((sum, expense) => sum + Number(expense.amount || 0), 0));
  const investmentTransactionsCount = investmentTransactions.length;
  const remainingBalance = roundCurrency(incomeTotal - totalSpent);
  const savingsAmount = roundCurrency(Math.max(remainingBalance, 0));
  const daysInMonth = getDaysInMonth(monthKey);
  const elapsedDays = getElapsedDaysForMonth(monthKey, expenses);
  const dailyAverage = roundCurrency(totalSpent / Math.max(elapsedDays, 1));
  const spentRatio = incomeTotal > 0 ? (totalSpent / incomeTotal) * 100 : 0;
  const savingsRate = incomeTotal > 0 ? (remainingBalance / incomeTotal) * 100 : 0;
  const largestExpense = expenses.reduce((largest, expense) => {
    if (!largest || Number(expense.amount || 0) > Number(largest.amount || 0)) {
      return expense;
    }

    return largest;
  }, null);
  const categoryBreakdown = buildCategoryBreakdown(expenses, totalSpent);

  return {
    monthKey,
    monthLabelLong: getMonthLabel(monthKey),
    monthLabelShort: getMonthLabel(monthKey, { month: "short", year: undefined }).replace(".", ""),
    monthLabelShortYear: getMonthLabel(monthKey, { month: "short", year: "numeric" }).replace(".", ""),
    expenses,
    transactionCount: expenses.length,
    totalSpent,
    fixedSpend,
    variableSpend,
    fixedShare: totalSpent > 0 ? (fixedSpend / totalSpent) * 100 : 0,
    variableShare: totalSpent > 0 ? (variableSpend / totalSpent) * 100 : 0,
    investedThisMonth,
    investmentTransactionsCount,
    remainingBalance,
    savingsAmount,
    dailyAverage,
    spentRatio,
    savingsRate,
    largestExpense,
    categoryBreakdown,
    topCategory: categoryBreakdown[0] || null,
    activeCategoryCount: categoryBreakdown.length,
    daysInMonth,
    elapsedDays,
    projectedMonthlySpend: totalSpent > 0 ? roundCurrency((totalSpent / Math.max(elapsedDays, 1)) * daysInMonth) : 0,
    projectedInvestmentAmount: investedThisMonth > 0 ? roundCurrency((investedThisMonth / Math.max(elapsedDays, 1)) * daysInMonth) : 0,
  };
};

const calculatePercentChange = (currentValue, previousValue, hasBaseline) => {
  if (!hasBaseline || !Number.isFinite(previousValue) || previousValue === 0) {
    return null;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
};

const compareMetric = (currentValue, previousValue, hasBaseline) => ({
  current: currentValue,
  previous: previousValue,
  difference: roundCurrency(currentValue - previousValue),
  percent: calculatePercentChange(currentValue, previousValue, hasBaseline),
});

const getTopCategoryShift = (currentBreakdown, previousBreakdown) => {
  const categories = new Set([
    ...currentBreakdown.map((item) => item.category),
    ...previousBreakdown.map((item) => item.category),
  ]);

  let winner = null;

  categories.forEach((category) => {
    const currentTotal = currentBreakdown.find((item) => item.category === category)?.total || 0;
    const previousTotal = previousBreakdown.find((item) => item.category === category)?.total || 0;
    const difference = roundCurrency(currentTotal - previousTotal);

    if (!winner || Math.abs(difference) > Math.abs(winner.difference)) {
      winner = {
        category,
        currentTotal,
        previousTotal,
        difference,
      };
    }
  });

  return winner;
};

const computeMetrics = (state) => {
  const activeMonthKey = getActiveMonthKey(state);
  const previousMonthKey = shiftMonthKey(activeMonthKey, -1);
  const totalIncome = getTotalIncome(state);
  const goalAmount = roundCurrency(Number(state.savingsGoalAmount || 0));
  const goalLabel = String(state.savingsGoalLabel || "").trim() || DEFAULT_GOAL_LABEL;
  const currentMonth = summarizeMonth(getExpensesForMonth(state.expenses, activeMonthKey), totalIncome, activeMonthKey);
  const previousMonth = summarizeMonth(getExpensesForMonth(state.expenses, previousMonthKey), totalIncome, previousMonthKey);
  const hasPreviousData = previousMonth.transactionCount > 0;
  const goalProgressPercent = goalAmount > 0 ? roundCurrency(Math.max((currentMonth.investedThisMonth / goalAmount) * 100, 0)) : 0;
  const goalRemainingAmount = goalAmount > 0 && currentMonth.investedThisMonth < goalAmount ? roundCurrency(goalAmount - currentMonth.investedThisMonth) : 0;
  const goalExceededAmount = goalAmount > 0 && currentMonth.investedThisMonth >= goalAmount ? roundCurrency(currentMonth.investedThisMonth - goalAmount) : 0;
  const isGoalMet = goalAmount > 0 && currentMonth.investedThisMonth >= goalAmount;
  const savingsCapacityPercent = getSavingsCapacityPercent(currentMonth.remainingBalance, totalIncome);
  const savingsCapacityState = getSavingsCapacityState(savingsCapacityPercent, totalIncome);

  return {
    ...currentMonth,
    activeMonthKey,
    previousMonthKey,
    previousMonth,
    previousMonthLabel: previousMonth.monthLabelShort || getMonthLabel(previousMonthKey, { month: "short", year: undefined }).replace(".", ""),
    hasPreviousData,
    incomeBase: Number(state.incomeBase || 0),
    incomeExtra: Number(state.incomeExtra || 0),
    totalIncome,
    savingsCapacityAmount: currentMonth.remainingBalance,
    savingsCapacityPercent,
    savingsCapacityBarPercent: clamp(savingsCapacityPercent, 0, 100),
    savingsCapacityState,
    goalAmount,
    goalLabel,
    goalProgressPercent,
    goalProgressBarPercent: clamp(goalProgressPercent, 0, 100),
    goalRemainingAmount,
    goalExceededAmount,
    isGoalMet,
    comparisons: {
      totalSpent: compareMetric(currentMonth.totalSpent, previousMonth.totalSpent, hasPreviousData),
      remainingBalance: compareMetric(currentMonth.remainingBalance, previousMonth.remainingBalance, hasPreviousData),
      investedThisMonth: compareMetric(currentMonth.investedThisMonth, previousMonth.investedThisMonth, hasPreviousData),
      savingsAmount: compareMetric(currentMonth.savingsAmount, previousMonth.savingsAmount, hasPreviousData),
      dailyAverage: compareMetric(currentMonth.dailyAverage, previousMonth.dailyAverage, hasPreviousData),
    },
    topCategoryShift: hasPreviousData ? getTopCategoryShift(currentMonth.categoryBreakdown, previousMonth.categoryBreakdown) : null,
  };
};

const getVisibleExpensesContext = (state, metrics = computeMetrics(state)) => {
  const filters = {
    ...getDefaultFilters(state),
    ...(state.filters || {}),
  };
  const searchQuery = normalizeText(filters.search);
  const monthExpenses = getExpensesForMonth(state.expenses, metrics.activeMonthKey);

  const visibleExpenses = monthExpenses
    .filter((expense) => filters.category === "all" || expense.category === filters.category)
    .filter((expense) => filters.paymentMethod === "all" || expense.paymentMethod === filters.paymentMethod)
    .filter((expense) => {
      if (filters.expenseType === "fixed") {
        return expense.isFixed;
      }

      if (filters.expenseType === "variable") {
        return !expense.isFixed;
      }

      return true;
    })
    .filter((expense) => {
      if (!searchQuery) {
        return true;
      }

      const haystack = normalizeText([expense.title, expense.category, expense.paymentMethod, expense.note].filter(Boolean).join(" "));
      return haystack.includes(searchQuery);
    })
    .sort((left, right) => {
      const leftDate = getExpenseDate(left)?.getTime() || 0;
      const rightDate = getExpenseDate(right)?.getTime() || 0;

      switch (filters.sort) {
        case "oldest":
          return leftDate - rightDate;
        case "highest":
          return Number(right.amount || 0) - Number(left.amount || 0);
        case "lowest":
          return Number(left.amount || 0) - Number(right.amount || 0);
        case "newest":
        default:
          return rightDate - leftDate;
      }
    });

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.paymentMethod !== "all" ||
    filters.expenseType !== "all" ||
    filters.sort !== "newest" ||
    Boolean(searchQuery);

  return {
    filters,
    monthExpenses,
    visibleExpenses,
    searchQuery,
    hasActiveFilters,
  };
};

const buildYearContext = (state, metrics) => {
  const activeYear = getYearFromMonthKey(metrics.activeMonthKey);
  const months = Array.from({ length: 12 }, (_, index) => {
    const monthKey = buildMonthKey(activeYear, index + 1);
    const monthSummary = summarizeMonth(getExpensesForMonth(state.expenses, monthKey), metrics.totalIncome, monthKey);
    const goalProgressPercent = metrics.goalAmount > 0 ? roundCurrency(Math.max((monthSummary.investedThisMonth / metrics.goalAmount) * 100, 0)) : 0;

    return {
      ...monthSummary,
      shortLabel: getCalendarMonthLabel(monthKey),
      goalProgressPercent,
      goalProgressBarPercent: clamp(goalProgressPercent, 0, 100),
      hasData: monthSummary.transactionCount > 0,
      isActive: monthKey === metrics.activeMonthKey,
      isFuture: isFutureMonthKey(monthKey),
      isGoalMet: metrics.goalAmount > 0 && monthSummary.investedThisMonth >= metrics.goalAmount,
    };
  });
  const monthsWithData = months.filter((month) => month.hasData);
  const totalSpent = roundCurrency(months.reduce((sum, month) => sum + month.totalSpent, 0));
  const totalInvested = roundCurrency(months.reduce((sum, month) => sum + month.investedThisMonth, 0));
  const totalFree = roundCurrency(monthsWithData.reduce((sum, month) => sum + month.savingsAmount, 0));

  return {
    activeYear,
    months,
    monthsWithDataCount: monthsWithData.length,
    yearIncomeReference: metrics.totalIncome > 0 ? roundCurrency(metrics.totalIncome * 12) : 0,
    totalSpent,
    totalInvested,
    averageMonthlyFree: monthsWithData.length ? roundCurrency(totalFree / monthsWithData.length) : 0,
  };
};

const setTextValue = (element, value) => {
  if (element) {
    element.textContent = value;
  }
};

const setBarWidth = (element, percent) => {
  if (element) {
    element.style.width = `${clamp(percent, 0, 100)}%`;
  }
};

const applyStatusPill = (element, label, tone = "neutral") => {
  if (!element) {
    return;
  }

  element.textContent = label;
  element.classList.remove(...STATUS_PILL_CLASSES);
  element.classList.add(`status-pill--${tone}`);
};

const applyCapacityState = (element, state) => {
  if (element) {
    element.dataset.capacityState = state;
  }
};

const getTrendTone = (difference, { lowerIsBetter = false } = {}) => {
  if (!Number.isFinite(difference) || Math.abs(difference) < 0.05) {
    return "neutral";
  }

  const improved = lowerIsBetter ? difference < 0 : difference > 0;
  return improved ? "positive" : "negative";
};

const formatMetricValue = (value, options = {}) => {
  const { element, decimals = readDecimals(element), prefix = element?.dataset.prefix || "", suffix = element?.dataset.suffix || "" } = options;

  if (suffix === "%") {
    return `${formatNumber(value, decimals)}${suffix}`;
  }

  if (prefix === "$") {
    return formatMoney(value, decimals);
  }

  return `${prefix}${formatNumber(value, decimals)}${suffix}`;
};

const animateValue = (element, value, options = {}) => {
  if (!element) {
    return;
  }

  const nextValue = Number(value || 0);
  const previousValue = Number(element.dataset.currentValue || 0);
  const render = (current) => {
    element.textContent = formatMetricValue(current, { ...options, element });
    element.dataset.currentValue = String(current);
  };

  if (!options.animate || prefersReducedMotion()) {
    render(nextValue);
    return;
  }

  const startedAt = performance.now();
  const duration = 360;

  const frame = (timestamp) => {
    const progress = clamp((timestamp - startedAt) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    render(previousValue + (nextValue - previousValue) * eased);

    if (progress < 1) {
      window.requestAnimationFrame(frame);
    } else {
      render(nextValue);
    }
  };

  window.requestAnimationFrame(frame);
};

const getCategoryTone = (category) => {
  if (category === "Inversion") {
    return "badge--investment";
  }

  if (["Supermercado", "Salud"].includes(category)) {
    return "badge--blue";
  }

  if (["Transporte", "Auto/Moto"].includes(category)) {
    return "badge--amber";
  }

  if (["Casa/Servicios", "Suscripciones"].includes(category)) {
    return "badge--mint";
  }

  if (["Gimnasio", "Salidas"].includes(category)) {
    return "badge--rose";
  }

  return "badge--slate";
};

const getSortLabel = (sort) => ({
  newest: "Mas recientes",
  oldest: "Mas antiguos",
  highest: "Monto mas alto",
  lowest: "Monto mas bajo",
}[sort] || "Mas recientes");

const getScrollBehavior = () => (prefersReducedMotion() ? "auto" : "smooth");
const getExpenseById = (expenseId) => getState().expenses.find((expense) => expense.id === expenseId) || null;
const getFormField = (name) => expenseForm?.elements.namedItem(name);
const isInvestmentCategory = (category = "") => category === "Inversion";
const getMovementCopy = (category = "") => {
  const isInvestment = isInvestmentCategory(category);

  return {
    noun: isInvestment ? "aporte" : "gasto",
    nounCapitalized: isInvestment ? "Aporte" : "Gasto",
    editLabel: isInvestment ? "Editar aporte" : "Editar gasto",
    duplicateLabel: isInvestment ? "Duplicar aporte" : "Duplicar gasto",
    deleteLabel: isInvestment ? "Eliminar aporte" : "Eliminar gasto",
    registeredToast: isInvestment ? "Aporte registrado." : "Gasto registrado.",
    updatedToast: isInvestment ? "Aporte actualizado." : "Gasto actualizado.",
    deletedToast: isInvestment ? "Aporte eliminado." : "Gasto eliminado.",
    duplicatedToast: isInvestment ? "Aporte duplicado." : "Gasto duplicado.",
    deleteCopy: isInvestment ? "Vas a eliminar este aporte del registro mensual." : "Vas a eliminar este gasto del registro mensual.",
  };
};

const getFloatingActionConfig = (metrics) => {
  const activeView = uiState.activeView || DEFAULT_VIEW;

  if (activeView === "actividad") {
    return {
      visible: true,
      label: "Registrar gasto",
      action: "expense",
    };
  }

  return {
    visible: false,
    label: "Registrar gasto",
    action: "expense",
  };
};

const renderFloatingAction = (metrics) => {
  if (!fab) {
    return;
  }

  const config = getFloatingActionConfig(metrics);

  fab.hidden = !config.visible;
  fab.classList.toggle("is-hidden", !config.visible);
  fab.classList.toggle("is-investment", config.visible && config.action === "investment");
  fab.dataset.fabAction = config.visible ? config.action : "";
  fab.setAttribute("aria-label", config.label);
  setTextValue(fabLabel, config.label);
};

const renderTopbar = (metrics) => {
  const activeView = uiState.activeView || DEFAULT_VIEW;
  const config = VIEW_TOPBAR_CONFIG[activeView] || VIEW_TOPBAR_CONFIG[DEFAULT_VIEW];

  setTextValue(topbarEyebrow, config.eyebrow);
  setTextValue(textElements.periodTitle, config.getTitle(metrics));
  setTextValue(textElements.periodPill, metrics.monthLabelShortYear);
  setTextValue(incomeMonthLabel, `Se usa como base para ${metrics.monthLabelLong}.`);
  setTextValue(goalLabelPreview, metrics.goalLabel);

  if (topbarSearch) {
    topbarSearch.hidden = !config.showSearch;
  }

  if (topbarFilters) {
    topbarFilters.hidden = !config.showFilters;
  }

  if (topbarIncomeButton) {
    topbarIncomeButton.hidden = !config.showIncomeAction;
  }

  if (topbarActions) {
    topbarActions.hidden = !config.showSearch && !config.showFilters && !config.showIncomeAction;
  }
};

const renderSidebar = (metrics, animate) => {
  animateValue(summaryElements.sidebarFreeCash, metrics.remainingBalance, { animate });
  animateValue(summaryElements.sidebarSavings, metrics.savingsAmount, { animate });
  setTextValue(textElements.sidebarSavingsCapacity, metrics.totalIncome ? formatPercent(metrics.savingsCapacityPercent, 1) : "0%");
  setBarWidth(barElements.sidebarSavingsCapacity, metrics.savingsCapacityBarPercent);

  if (!metrics.totalIncome) {
    applyStatusPill(statusElements.sidebar, "Cargar ingreso", "neutral");
    return;
  }

  if (!metrics.goalAmount) {
    applyStatusPill(statusElements.sidebar, "Sin meta", "neutral");
    return;
  }

  if (metrics.isGoalMet) {
    applyStatusPill(statusElements.sidebar, "Meta cumplida", "positive");
    return;
  }

  if (metrics.investmentTransactionsCount && metrics.projectedInvestmentAmount >= metrics.goalAmount) {
    applyStatusPill(statusElements.sidebar, "En ritmo", "positive");
    return;
  }

  if (!metrics.investmentTransactionsCount) {
    applyStatusPill(statusElements.sidebar, "Sin aportes", "neutral");
    return;
  }

  applyStatusPill(statusElements.sidebar, `${formatPercent(metrics.goalProgressPercent, 1)} invertido`, "neutral");
};

const renderHero = (metrics, animate) => {
  const hasGoalExceeded = metrics.goalExceededAmount > 0;
  const goalGapLabel = metrics.isGoalMet ? (hasGoalExceeded ? "Excedente" : "Meta cumplida") : "Te falta invertir";
  const goalGapValue = metrics.isGoalMet ? metrics.goalExceededAmount : metrics.goalRemainingAmount;

  animateValue(summaryElements.heroRemaining, metrics.remainingBalance, { animate });
  animateValue(summaryElements.heroGoalSavings, metrics.investedThisMonth, { animate });
  setTextValue(
    textElements.heroCaption,
    !metrics.goalAmount
      ? "Usa Registrar gasto para cargar tus salidas reales del mes y define una meta de inversion para medir el avance del plan."
      : metrics.isGoalMet
      ? hasGoalExceeded
        ? `Ya registraste ${formatMoney(metrics.investedThisMonth)} en Inversion para "${metrics.goalLabel}" y superaste la meta por ${formatMoney(metrics.goalExceededAmount)}.`
        : `Ya registraste ${formatMoney(metrics.investedThisMonth)} en Inversion y alcanzaste exactamente la meta "${metrics.goalLabel}".`
      : metrics.investmentTransactionsCount
        ? `Saldo disponible: ${formatMoney(metrics.remainingBalance)}. Llevas ${formatMoney(metrics.investedThisMonth)} invertidos para "${metrics.goalLabel}" y te falta invertir ${formatMoney(metrics.goalRemainingAmount)}.`
        : metrics.transactionCount
          ? `Saldo disponible: ${formatMoney(metrics.remainingBalance)}. Ya registraste gastos del mes, pero todavia no cargaste aportes en Inversion para avanzar sobre "${metrics.goalLabel}".`
          : "Empieza por registrar un gasto real del mes y usa \"Registrar inversion\" cuando hagas un aporte en la categoria Inversion."
  );
  setTextValue(labelElements.heroStat1, "Invertido este mes");
  setTextValue(labelElements.heroStat2, "Progreso de inversion");
  setTextValue(textElements.heroStat2Value, metrics.goalAmount > 0 ? formatPercent(metrics.goalProgressPercent, 1) : "Sin meta");
  animateValue(summaryElements.miniDailyAverage, metrics.dailyAverage, { animate });
  animateValue(summaryElements.miniSecondaryValue, goalGapValue, { animate });
  setTextValue(textElements.miniDailyNote, metrics.transactionCount ? `${metrics.elapsedDays} dia(s) tomados para el promedio.` : "Sin salidas en el mes activo");
  setTextValue(labelElements.miniSecondary, goalGapLabel);
  setTextValue(
    textElements.miniSecondaryNote,
    metrics.isGoalMet
      ? hasGoalExceeded
        ? "Capital invertido por encima de tu objetivo mensual."
        : "Tu objetivo mensual ya quedo cubierto."
      : "Monto pendiente para completar la meta."
  );
  setTextValue(labelElements.miniTertiary, "Estado de meta");
  setTextValue(textElements.miniTertiaryValue, metrics.isGoalMet ? "Meta cumplida" : metrics.investmentTransactionsCount ? `${formatPercent(metrics.goalProgressPercent, 1)} invertido` : "Sin aportes");
  setTextValue(
    textElements.miniTertiaryNote,
    metrics.investmentTransactionsCount
      ? `${formatNumber(metrics.investmentTransactionsCount)} aporte(s) en Inversion.`
      : "La meta solo avanza con movimientos en Inversion."
  );

  if (!metrics.totalIncome) {
    applyStatusPill(statusElements.hero, "Sin ingreso", "neutral");
    return;
  }

  if (!metrics.goalAmount) {
    applyStatusPill(statusElements.hero, "Sin meta", "neutral");
    return;
  }

  if (metrics.isGoalMet) {
    applyStatusPill(statusElements.hero, "Meta cumplida", "positive");
    return;
  }

  if (metrics.investmentTransactionsCount && metrics.projectedInvestmentAmount >= metrics.goalAmount) {
    applyStatusPill(statusElements.hero, "En ritmo", "positive");
    return;
  }

  if (!metrics.investmentTransactionsCount) {
    applyStatusPill(statusElements.hero, "Sin aportes", "neutral");
    return;
  }

  applyStatusPill(statusElements.hero, `Falta invertir ${formatMoney(metrics.goalRemainingAmount)}`, "negative");
};

const renderSplitCard = (metrics, animate) => {
  animateValue(summaryElements.goalAmount, metrics.goalAmount, { animate });
  animateValue(summaryElements.goalSaved, metrics.investedThisMonth, { animate });
  animateValue(summaryElements.goalGapValue, metrics.goalRemainingAmount, { animate });
  animateValue(summaryElements.goalExceeded, metrics.goalExceededAmount, { animate });
  setBarWidth(barElements.goalProgress, metrics.goalProgressBarPercent);
  setTextValue(textElements.goalHeading, metrics.goalLabel);
  setTextValue(textElements.goalProgressText, metrics.goalAmount > 0 ? formatPercent(metrics.goalProgressPercent, 1) : "Sin meta");
  setTextValue(labelElements.goalGap, metrics.isGoalMet ? "Meta cumplida" : "Te falta invertir");
  setTextValue(
    textElements.goalNote,
    metrics.investmentTransactionsCount
      ? `${formatNumber(metrics.investmentTransactionsCount)} aporte(s) registrados en Inversion por ${formatMoney(metrics.investedThisMonth)}. Tu saldo disponible sigue aparte en ${formatMoney(metrics.remainingBalance)}.`
      : metrics.transactionCount
        ? `Todavia no registraste aportes en la categoria Inversion. Tienes ${formatMoney(metrics.remainingBalance)} de saldo disponible, pero la meta no sube hasta cargar un aporte.`
        : "La meta solo suma movimientos en la categoria Inversion. Usa \"Registrar inversion\" cuando hagas un aporte real."
  );

  if (!metrics.goalAmount) {
    applyStatusPill(statusElements.goal, "Sin meta", "neutral");
  } else if (metrics.isGoalMet) {
    applyStatusPill(statusElements.goal, "Meta cumplida", "positive");
  } else if (metrics.investmentTransactionsCount && metrics.projectedInvestmentAmount >= metrics.goalAmount) {
    applyStatusPill(statusElements.goal, "En ritmo", "positive");
  } else if (!metrics.investmentTransactionsCount) {
    applyStatusPill(statusElements.goal, "Sin aportes", "neutral");
  } else {
    applyStatusPill(statusElements.goal, `${formatPercent(metrics.goalProgressPercent, 1)} invertido`, "negative");
  }

  if (goalAmountPreview && uiState.modalMode !== "goal") {
    animateValue(goalAmountPreview, metrics.goalAmount, { animate: false });
  }

  if (goalLabelPreview && uiState.modalMode !== "goal") {
    setTextValue(goalLabelPreview, metrics.goalLabel);
  }

  if (!metrics.hasPreviousData) {
    setTextValue(textElements.comparisonNote, `No hay movimientos en ${getMonthLabel(metrics.previousMonthKey)} para comparar salidas, saldo disponible e inversion registrada.`);
    setTextValue(comparisonElements.totalSpentCopy, "Sin base para comparar");
    setTextValue(comparisonElements.totalSpentValue, formatMoney(metrics.totalSpent));
    setTextValue(comparisonElements.remainingBalanceCopy, "Sin base para comparar");
    setTextValue(comparisonElements.remainingBalanceValue, formatMoney(metrics.remainingBalance));
    setTextValue(comparisonElements.investedCopy, "Sin base para comparar");
    setTextValue(comparisonElements.investedValue, formatMoney(metrics.investedThisMonth));
    setTextValue(comparisonElements.categoryShiftCopy, "Sin categoria para comparar");
    setTextValue(comparisonElements.categoryShiftValue, "Sin datos");
    return;
  }

  setTextValue(textElements.comparisonNote, `Comparacion directa contra ${metrics.previousMonth.monthLabelLong} con foco en salidas, saldo disponible e inversion ejecutada.`);
  setTextValue(comparisonElements.totalSpentCopy, `${formatSignedCurrency(metrics.comparisons.totalSpent.difference)} vs ${metrics.previousMonthLabel}`);
  setTextValue(comparisonElements.totalSpentValue, formatMoney(metrics.totalSpent));
  setTextValue(comparisonElements.remainingBalanceCopy, `${formatSignedCurrency(metrics.comparisons.remainingBalance.difference)} vs ${metrics.previousMonthLabel}`);
  setTextValue(comparisonElements.remainingBalanceValue, formatMoney(metrics.remainingBalance));
  setTextValue(comparisonElements.investedCopy, `${formatSignedCurrency(metrics.comparisons.investedThisMonth.difference)} vs ${metrics.previousMonthLabel}`);
  setTextValue(comparisonElements.investedValue, formatMoney(metrics.investedThisMonth));

  if (!metrics.topCategoryShift || Math.abs(metrics.topCategoryShift.difference) < 1) {
    setTextValue(comparisonElements.categoryShiftCopy, "Sin cambio fuerte entre categorias");
    setTextValue(comparisonElements.categoryShiftValue, "Estable");
    return;
  }

  const direction = metrics.topCategoryShift.difference > 0 ? "subio" : "bajo";
  setTextValue(comparisonElements.categoryShiftCopy, `${metrics.topCategoryShift.category} ${direction} ${formatSignedCurrency(metrics.topCategoryShift.difference)}.`);
  setTextValue(comparisonElements.categoryShiftValue, metrics.topCategoryShift.category);
};

const renderKpis = (metrics, animate) => {
  animateValue(kpiElements.incomeTotal, metrics.totalIncome, { animate });
  animateValue(kpiElements.totalSpent, metrics.totalSpent, { animate });
  animateValue(kpiElements.savingsCapacity, metrics.savingsCapacityAmount, { animate });
  animateValue(kpiElements.remainingBalance, metrics.remainingBalance, { animate });
  animateValue(kpiElements.savingsAmount, metrics.savingsAmount, { animate });
  animateValue(kpiElements.dailyAverage, metrics.dailyAverage, { animate });
  animateValue(kpiElements.goalProgress, metrics.goalProgressPercent, { animate, decimals: 1, suffix: "%" });

  setTextValue(kpiDeltaElements.incomeTotal, metrics.totalIncome ? `${formatMoney(metrics.incomeBase)} base + ${formatMoney(metrics.incomeExtra)} extra` : "Editable");
  setTextValue(kpiCaptionElements.incomeTotal, metrics.totalIncome ? "La suma del ingreso base y el ingreso extra del mes." : "Carga el ingreso del mes para activar el tablero completo.");
  setTextValue(kpiDeltaElements.savingsCapacity, getSavingsCapacityStateLabel(metrics.savingsCapacityState));
  setTextValue(kpiCaptionElements.savingsCapacity, getSavingsCapacityInsight(metrics));
  setTextValue(kpiProgressElements.savingsCapacity, metrics.totalIncome ? formatPercent(metrics.savingsCapacityPercent, 1) : "0%");
  setBarWidth(kpiBarElements.savingsCapacity, metrics.savingsCapacityBarPercent);
  applyCapacityState(kpiCardElements.savingsCapacity, metrics.savingsCapacityState);

  if (metrics.hasPreviousData) {
    setTextValue(kpiDeltaElements.totalSpent, formatSignedPercent(metrics.comparisons.totalSpent.percent));
    setTextValue(kpiDeltaElements.remainingBalance, formatSignedPercent(metrics.comparisons.remainingBalance.percent));
    setTextValue(kpiDeltaElements.savingsAmount, formatSignedPercent(metrics.comparisons.savingsAmount.percent));
    setTextValue(kpiDeltaElements.dailyAverage, formatSignedPercent(metrics.comparisons.dailyAverage.percent));
  } else {
    setTextValue(kpiDeltaElements.totalSpent, "Sin base");
    setTextValue(kpiDeltaElements.remainingBalance, "Sin base");
    setTextValue(kpiDeltaElements.savingsAmount, "Sin base");
    setTextValue(kpiDeltaElements.dailyAverage, "Promedio actual");
  }

  setTextValue(
    kpiDeltaElements.goalProgress,
    metrics.goalAmount > 0
      ? metrics.isGoalMet
        ? metrics.goalExceededAmount > 0
          ? `+ ${formatMoney(metrics.goalExceededAmount)} extra`
          : "Meta cumplida"
        : !metrics.investmentTransactionsCount
          ? "Sin aportes"
        : `Falta invertir ${formatMoney(metrics.goalRemainingAmount)}`
      : "Sin meta"
  );

  setTextValue(kpiCaptionElements.totalSpent, "Las salidas incluyen gastos e inversiones registradas del mes activo.");
  setTextValue(kpiCaptionElements.remainingBalance, "Ingreso total menos salidas del mes activo.");
  setTextValue(kpiCaptionElements.savingsAmount, "Saldo libre despues de salidas e inversion que todavia no usaste.");
  setTextValue(kpiCaptionElements.dailyAverage, "Promedio diario usando los dias cargados o transcurridos.");
  setTextValue(kpiCaptionElements.goalProgress, "Porcentaje de tu meta mensual cubierto con movimientos en Inversion.");
};

const renderIncomeCard = (metrics, animate) => {
  const incomeGoalGapValue = metrics.isGoalMet ? metrics.goalExceededAmount : metrics.goalRemainingAmount;
  const incomeGoalGapLabel = metrics.isGoalMet
    ? metrics.goalExceededAmount > 0
      ? "Excedente sobre la meta"
      : "Meta cumplida"
    : "Te falta invertir";

  animateValue(summaryElements.incomeTotal, metrics.totalIncome, { animate });
  animateValue(summaryElements.incomeBase, metrics.incomeBase, { animate });
  animateValue(summaryElements.incomeExtra, metrics.incomeExtra, { animate });
  animateValue(summaryElements.incomeBalance, metrics.remainingBalance, { animate });
  animateValue(summaryElements.incomeSavings, metrics.savingsAmount, { animate });
  animateValue(summaryElements.incomeCapacityAmount, metrics.savingsCapacityAmount, { animate });
  animateValue(summaryElements.incomeSpent, metrics.totalSpent, { animate });
  animateValue(summaryElements.incomeGoalAmount, metrics.goalAmount, { animate });
  animateValue(summaryElements.incomeGoalSaved, metrics.investedThisMonth, { animate });
  animateValue(summaryElements.incomeGoalGap, incomeGoalGapValue, { animate });
  setTextValue(
    textElements.incomeCaption,
    metrics.totalIncome
      ? "El ingreso total marca el techo del mes: base y extra actualizan al instante el saldo disponible."
      : "Define un ingreso base y otro extra para construir el plan real del mes."
  );
  setTextValue(
    textElements.incomeUsageCopy,
    metrics.totalIncome
      ? "Capacidad de ahorro = saldo disponible / ingreso total. Cada gasto o inversion reduce este margen al instante."
      : "Cuando cargues ingreso y movimientos vas a ver cuanta capacidad de ahorro real te queda."
  );
  setTextValue(textElements.incomeGoalLabel, metrics.goalLabel);
  setTextValue(textElements.incomeGoalGapLabel, incomeGoalGapLabel);
  setTextValue(
    textElements.incomeGoalCopy,
    metrics.goalAmount > 0
      ? "Ajusta tus ingresos y metas para mantener coherencia mensual."
      : "Carga ingreso y define una meta mensual para ordenar el plan del mes desde aqui."
  );
  setTextValue(
    textElements.incomeUsageLabel,
    getSavingsCapacityHeadline(metrics)
  );
  setTextValue(
    textElements.incomeResultCopy,
    metrics.goalAmount > 0
      ? `Saldo libre: ${formatMoney(metrics.savingsAmount)}. La meta "${metrics.goalLabel}" lleva ${formatPercent(metrics.goalProgressPercent, 1)} cubierto con aportes reales.`
      : "El saldo libre queda despues de asignar gastos e inversion; define una meta para seguir el avance real."
  );

  if (stackedSegments.length >= 2) {
    stackedSegments[0].style.width = `${metrics.savingsCapacityBarPercent}%`;
    stackedSegments[1].style.width = `${clamp(100 - metrics.savingsCapacityBarPercent, 0, 100)}%`;
  }

  if (incomeTotalPreview && uiState.modalMode !== "income") {
    animateValue(incomeTotalPreview, metrics.totalIncome, { animate: false });
  }
};

const getCategoryMixStopColor = (swatchColor, index, highlightedIndex) => {
  if (highlightedIndex < 0) {
    return swatchColor;
  }

  if (highlightedIndex === index) {
    return `color-mix(in srgb, ${swatchColor} 76%, white)`;
  }

  return `color-mix(in srgb, ${swatchColor} 34%, #0c1219)`;
};

const buildCategoryMixGradient = (legendItems, highlightedIndex = -1) => {
  let cursor = 0;
  const stops = legendItems.map((item, index) => {
    const swatch = CATEGORY_SWATCHES[index % CATEGORY_SWATCHES.length];
    const start = cursor;
    cursor += item.share;
    return `${getCategoryMixStopColor(swatch.color, index, highlightedIndex)} ${start}% ${cursor}%`;
  });

  if (cursor < 100) {
    stops.push(`rgba(255,255,255,0.05) ${cursor}% 100%`);
  }

  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
};

const setCategoryMixHighlight = (nextIndex = -1) => {
  if (uiState.categoryHighlightIndex === nextIndex) {
    return;
  }

  uiState.categoryHighlightIndex = nextIndex;
  applyCategoryMixHighlight();
};

const applyCategoryMixHighlight = () => {
  if (!donutChart) {
    return;
  }

  const legendItems = uiState.categoryLegendItems || [];
  const highlightedIndex = Number.isInteger(uiState.categoryHighlightIndex) && uiState.categoryHighlightIndex >= 0 && uiState.categoryHighlightIndex < legendItems.length
    ? uiState.categoryHighlightIndex
    : -1;

  donutChart.style.background = legendItems.length
    ? buildCategoryMixGradient(legendItems, highlightedIndex)
    : "conic-gradient(from -90deg, rgba(255,255,255,0.08) 0 100%)";
  donutChart.classList.toggle("is-highlighted", highlightedIndex >= 0);

  if (!categoryLegend) {
    return;
  }

  categoryLegend.querySelectorAll(".legend-item").forEach((item, index) => {
    const isActive = highlightedIndex === index;
    const isDimmed = highlightedIndex >= 0 && !isActive;

    item.classList.toggle("is-active", isActive);
    item.classList.toggle("is-dimmed", isDimmed);
  });
};

const renderCategoryMix = (metrics, animate) => {
  animateValue(summaryElements.chartTotalSpent, metrics.totalSpent, { animate });
  setTextValue(textElements.categoryCountPill, `${metrics.activeCategoryCount} categoria${metrics.activeCategoryCount === 1 ? "" : "s"}`);

  if (!categoryLegend) {
    return;
  }

  if (!metrics.categoryBreakdown.length) {
    uiState.categoryLegendItems = [];
    uiState.categoryHighlightIndex = -1;
    categoryLegend.innerHTML = '<div class="expense-list__empty"><strong>Sin categorias</strong><p>Carga salidas para ver la mezcla del mes.</p></div>';
    if (donutChart) {
      donutChart.style.background = "conic-gradient(from -90deg, rgba(255,255,255,0.08) 0 100%)";
      donutChart.classList.remove("is-highlighted");
    }
    return;
  }

  const legendItems = buildLegendCategories(metrics.categoryBreakdown);
  uiState.categoryLegendItems = legendItems;
  if (uiState.categoryHighlightIndex >= legendItems.length) {
    uiState.categoryHighlightIndex = -1;
  }
  categoryLegend.innerHTML = legendItems
    .map((item, index) => {
      const swatch = CATEGORY_SWATCHES[index % CATEGORY_SWATCHES.length];
      return `<div class="legend-item" data-legend-index="${index}" tabindex="0" style="--legend-accent:${swatch.color};"><div class="legend-item__title"><span class="legend-swatch" aria-hidden="true"></span><span>${escapeHtml(item.category)}</span></div><div class="legend-item__value"><strong>${escapeHtml(formatPercent(item.share, item.share < 10 ? 1 : 0))}</strong><span>${escapeHtml(formatMoney(item.total))}</span></div></div>`;
    })
    .join("");

  if (!donutChart) {
    return;
  }

  applyCategoryMixHighlight();
};

const renderLineChart = (metrics) => {
  if (!lineActualPath || !lineTargetPath || !lineAreaPath || !linePoints || !lineAxis) {
    return;
  }

  const dailyTotals = new Array(metrics.daysInMonth).fill(0);
  metrics.expenses.forEach((expense) => {
    const day = getExpenseDate(expense)?.getDate() || 1;
    dailyTotals[day - 1] = roundCurrency(dailyTotals[day - 1] + Number(expense.amount || 0));
  });

  const cumulativeTotals = dailyTotals.reduce((accumulator, amount) => {
    accumulator.push(roundCurrency((accumulator[accumulator.length - 1] || 0) + amount));
    return accumulator;
  }, []);
  const ticks = [...new Set(Array.from({ length: 7 }, (_, index) => (index === 6 ? metrics.daysInMonth : Math.max(1, Math.round(1 + ((metrics.daysInMonth - 1) * index) / 6)))))];
  const actualSeries = ticks.map((day) => cumulativeTotals[day - 1] || 0);
  const projectedTotal = Math.max(metrics.projectedMonthlySpend, metrics.totalSpent, 1);
  const projectedSeries = ticks.map((day) => roundCurrency((projectedTotal / metrics.daysInMonth) * day));
  const maxValue = Math.max(...actualSeries, ...projectedSeries, 1);
  const toPoints = (series) => series.map((value, index) => ({
    x: 40 + (560 * index) / Math.max(ticks.length - 1, 1),
    y: 260 - (value / maxValue) * 220,
  }));
  const actualPoints = toPoints(actualSeries);
  const projectedPoints = toPoints(projectedSeries);
  const pathFromPoints = (points) => points.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join(" ");

  lineActualPath.setAttribute("d", pathFromPoints(actualPoints));
  lineTargetPath.setAttribute("d", pathFromPoints(projectedPoints));
  lineAreaPath.setAttribute("d", `${pathFromPoints(actualPoints)} L${actualPoints[actualPoints.length - 1].x} 260 L${actualPoints[0].x} 260 Z`);
  linePoints.innerHTML = actualPoints.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="5"></circle>`).join("");
  lineAxis.innerHTML = ticks.map((day) => `<span>${day} ${escapeHtml(metrics.monthLabelShort)}</span>`).join("");

  if (!metrics.transactionCount) {
    applyStatusPill(statusElements.line, "Sin salidas", "neutral");
    return;
  }

  if (!metrics.hasPreviousData) {
    applyStatusPill(statusElements.line, `Proyeccion ${formatMoney(metrics.projectedMonthlySpend)}`, "neutral");
    return;
  }

  applyStatusPill(
    statusElements.line,
    `${formatSignedPercent(metrics.comparisons.dailyAverage.percent)} vs ${metrics.previousMonthLabel}`,
    getTrendTone(metrics.comparisons.dailyAverage.difference, { lowerIsBetter: true })
  );
};

const createInsight = (label, tone, value, copy) => ({
  label,
  tone,
  value,
  copy,
});

const generateInsights = (metrics) => {
  const isSpendingOverIncome = metrics.totalIncome > 0 && metrics.projectedMonthlySpend > metrics.totalIncome;
  const spendingTone = isSpendingOverIncome ? "rose" : metrics.totalIncome > 0 && metrics.spentRatio <= 70 ? "mint" : "blue";
  const capacityTone = metrics.totalIncome > 0
    ? metrics.savingsCapacityState === "low"
      ? "rose"
      : metrics.savingsCapacityState === "excellent"
        ? "mint"
        : "blue"
    : "slate";
  const dailyAverageTone = metrics.transactionCount
    ? metrics.hasPreviousData
      ? metrics.comparisons.dailyAverage.difference < 0
        ? "mint"
        : metrics.comparisons.dailyAverage.difference > 0
          ? "rose"
          : "blue"
      : "blue"
    : "slate";
  const projectionTone = metrics.totalIncome > 0
    ? metrics.projectedMonthlySpend > metrics.totalIncome
      ? "rose"
      : "mint"
    : metrics.transactionCount
      ? "blue"
      : "slate";
  const dominantCategoryValue = metrics.topCategory ? metrics.topCategory.category : "Sin categoria";
  const investedIncomePercent = metrics.totalIncome > 0 ? roundCurrency((metrics.investedThisMonth / metrics.totalIncome) * 100) : 0;
  const investmentTone = metrics.investedThisMonth > 0 ? "amber" : "slate";
  const dominantCategoryDetails = metrics.topCategory
    ? `${formatPercent(metrics.topCategory.share, 1)} del total - ${formatMoney(metrics.topCategory.total)}.`
    : "Todavia no hay una categoria dominante.";

  return [
    createInsight(
      "Uso del ingreso",
      spendingTone,
      metrics.totalIncome > 0 ? formatPercent(metrics.spentRatio, 1) : "Sin ingreso",
      metrics.totalIncome > 0
        ? isSpendingOverIncome
          ? "Ya estas por encima de tu ingreso mensual."
          : `Estas usando ${formatPercent(metrics.spentRatio, 1)} de tu ingreso.`
        : metrics.transactionCount
          ? "Carga el ingreso para medir este porcentaje."
          : "Todavia no hay salidas registradas."
    ),
    createInsight(
      "Capacidad de ahorro",
      capacityTone,
      metrics.totalIncome > 0 ? formatPercent(metrics.savingsCapacityPercent, 1) : "Sin ingreso",
      metrics.totalIncome > 0
        ? metrics.remainingBalance >= 0
          ? `${formatMoney(metrics.savingsCapacityAmount)} siguen disponibles este mes.`
          : `Vas ${formatMoney(Math.abs(metrics.remainingBalance))} por encima del ingreso.`
        : "Se calcula con saldo disponible / ingreso total."
    ),
    createInsight(
      "Ritmo de gasto",
      dailyAverageTone,
      formatMoney(metrics.dailyAverage),
      metrics.transactionCount
        ? `Promedio diario sobre ${formatNumber(metrics.elapsedDays)} dia(s) del mes.`
        : "Se activara cuando registres movimientos."
    ),
    createInsight(
      "Proyeccion de cierre",
      projectionTone,
      formatMoney(metrics.projectedMonthlySpend),
      metrics.transactionCount
        ? metrics.totalIncome > 0
          ? metrics.projectedMonthlySpend > metrics.totalIncome
            ? `Si seguis asi, cerrarias ${formatMoney(metrics.projectedMonthlySpend - metrics.totalIncome)} arriba del ingreso.`
            : `Si seguis asi, te quedarian ${formatMoney(metrics.totalIncome - metrics.projectedMonthlySpend)} dentro del ingreso.`
          : "Manteniendo el ritmo actual del mes."
        : "Sin movimientos todavia para proyectar el cierre."
    ),
    createInsight(
      "Categoria dominante",
      metrics.topCategory ? "blue" : "slate",
      dominantCategoryValue,
      dominantCategoryDetails
    ),
    createInsight(
      "Inversion",
      investmentTone,
      formatMoney(metrics.investedThisMonth),
      metrics.investedThisMonth > 0
        ? metrics.totalIncome > 0
          ? `${formatPercent(investedIncomePercent, 1)} del ingreso en ${formatNumber(metrics.investmentTransactionsCount)} aporte(s).`
          : `${formatNumber(metrics.investmentTransactionsCount)} aporte(s) registrados este mes.`
        : "Todavia no registraste aportes en Inversion."
    ),
  ];
};

const renderInsights = (metrics) => {
  if (!insightList) {
    return;
  }

  insightList.innerHTML = generateInsights(metrics)
    .map((insight) => `<article class="insight insight--${escapeHtml(insight.tone || "blue")}"><div class="insight__content"><span class="insight__label">${escapeHtml(insight.label)}</span><strong class="insight__value">${escapeHtml(insight.value)}</strong><span class="insight__copy">${escapeHtml(insight.copy)}</span></div></article>`)
    .join("");
};

const getEmptyStateMarkup = (state, metrics, context) => {
  if (!context.monthExpenses.length) {
    return `<div class="expense-list__empty"><strong>No hay salidas en ${escapeHtml(metrics.monthLabelLong)}</strong><p>Empieza cargando un gasto real o registra una inversion para medir por separado tu saldo disponible y el avance real de la meta.</p><div class="expense-list__actions"><button class="button button--accent button--small" type="button" data-list-action="open-investment">Registrar inversion</button><button class="button button--ghost button--small" type="button" data-list-action="open-add">Registrar gasto</button>${!state.expenses.length ? '<button class="button button--ghost button--small" type="button" data-list-action="restore-sample">Cargar muestra</button>' : ""}</div></div>`;
  }

  return `<div class="expense-list__empty"><strong>No hay movimientos con estos filtros</strong><p>Prueba limpiar categoria, medio de pago, tipo de movimiento o la busqueda para volver a ver resultados.</p><div class="expense-list__actions"><button class="button button--ghost button--small" type="button" data-list-action="clear-filters">Limpiar filtros</button><button class="button button--ghost button--small" type="button" data-list-action="open-filters">Ajustar filtros</button></div></div>`;
};

const renderExpenseList = (state, metrics, context) => {
  if (!expenseList) {
    return;
  }

  setTextValue(expenseResults, `${context.visibleExpenses.length} visible(s)`);

  if (!context.visibleExpenses.length) {
    expenseList.innerHTML = getEmptyStateMarkup(state, metrics, context);
    return;
  }

  expenseList.innerHTML = context.visibleExpenses
    .map((expense) => {
      const isInvestmentExpense = isInvestmentCategory(expense.category);
      const movementCopy = getMovementCopy(expense.category);
      const notePreview = expense.note ? `<p class="expense-row__note">${escapeHtml(expense.note)}</p>` : "";
      const fixedBadge = expense.isFixed ? '<span class="badge badge--fixed">Fijo</span>' : '<span class="badge badge--variable">Variable</span>';
      const investmentBadge = isInvestmentExpense ? '<span class="badge badge--investment">Aporte</span>' : "";
      const amountClass = isInvestmentExpense ? "expense-row__amount expense-row__amount--investment" : "expense-row__amount";

      return `<article class="expense-row${isInvestmentExpense ? " expense-row--investment" : ""}"><div class="expense-row__merchant"><strong>${escapeHtml(expense.title)}</strong>${notePreview || `<span>${escapeHtml(expense.category)} - ${escapeHtml(expense.paymentMethod)}</span>`}</div><div class="expense-row__meta"><span class="badge ${getCategoryTone(expense.category)}">${escapeHtml(expense.category)}</span>${investmentBadge}<span class="badge badge--method">${escapeHtml(expense.paymentMethod)}</span>${fixedBadge}<span class="expense-row__method">${escapeHtml(formatDate(expense.date, { month: "short", day: "numeric", year: "numeric" }).replace(".", ""))}</span></div><div class="expense-row__side"><strong class="${amountClass}">- ${escapeHtml(formatMoney(expense.amount))}</strong><div class="expense-row__actions"><button class="icon-button icon-button--soft" type="button" aria-label="${escapeHtml(movementCopy.editLabel)}" data-expense-action="edit" data-expense-id="${expense.id}"><svg viewBox="0 0 24 24" fill="none"><path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20Z"></path><path d="m12.5 7 4.5 4.5"></path></svg></button><button class="icon-button icon-button--soft" type="button" aria-label="${escapeHtml(movementCopy.duplicateLabel)}" data-expense-action="duplicate" data-expense-id="${expense.id}"><svg viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"></path></svg></button><button class="icon-button icon-button--soft" type="button" aria-label="${escapeHtml(movementCopy.deleteLabel)}" data-expense-action="delete" data-expense-id="${expense.id}"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7.5h16"></path><path d="M9.5 10.5v6"></path><path d="M14.5 10.5v6"></path><path d="M6.5 7.5 7.4 19a2 2 0 0 0 2 1.8h5.2a2 2 0 0 0 2-1.8l.9-11.5"></path><path d="M9 7.5V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8v1.7"></path></svg></button></div></div></article>`;
    })
    .join("");
};

const renderFilters = (context, metrics) => {
  if (filterMonthInput) {
    filterMonthInput.value = context.filters.month;
  }

  if (filterCategoryInput) {
    filterCategoryInput.value = context.filters.category;
  }

  if (filterPaymentMethodInput) {
    filterPaymentMethodInput.value = context.filters.paymentMethod;
  }

  if (filterExpenseTypeInput) {
    filterExpenseTypeInput.value = context.filters.expenseType;
  }

  if (filterSortInput) {
    filterSortInput.value = context.filters.sort;
  }

  if (searchInput && searchInput.value !== (context.filters.search || "")) {
    searchInput.value = context.filters.search || "";
  }

  setTextValue(filterSearchPreview, context.searchQuery ? `Busqueda: "${context.filters.search}"` : "Sin busqueda aplicada");
  setTextValue(
    filterResultsCopy,
    `${context.visibleExpenses.length} resultado(s) en ${metrics.monthLabelLong}. Orden actual: ${getSortLabel(context.filters.sort)}.`
  );
};

const serializeExpensesToJson = (expenses) => JSON.stringify(expenses, null, 2);

const serializeExpensesToCsv = (expenses) => {
  const rows = [
    ["descripcion", "monto", "fecha", "categoria", "medio_pago", "es_fijo", "nota"],
    ...expenses.map((expense) => [
      expense.title,
      String(roundCurrency(expense.amount)),
      expense.date,
      expense.category,
      expense.paymentMethod,
      expense.isFixed ? "si" : "no",
      expense.note || "",
    ]),
  ];

  return rows
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
};

const downloadTextFile = (filename, contents, mimeType) => {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const getExportBaseFilename = (metrics) => `aleclv-salary-planner-${metrics.activeMonthKey}`;

const renderExportState = (metrics, context) => {
  setTextValue(exportSummary, `${context.visibleExpenses.length} movimiento(s) listos para exportar`);
  setTextValue(exportFilename, `${getExportBaseFilename(metrics)}.csv`);
  setTextValue(
    exportCopy,
    context.visibleExpenses.length
      ? `Incluye filtros de ${metrics.monthLabelLong}: ${context.filters.category === "all" ? "todas las categorias" : context.filters.category}, ${context.filters.paymentMethod === "all" ? "todos los medios" : context.filters.paymentMethod}.`
      : "No hay movimientos visibles para exportar con los filtros actuales."
  );

  if (exportJsonButton) {
    exportJsonButton.disabled = !context.visibleExpenses.length;
  }

  if (exportCsvButton) {
    exportCsvButton.disabled = !context.visibleExpenses.length;
  }
};

const renderCalendar = (state, metrics, animate) => {
  const yearContext = buildYearContext(state, metrics);

  animateValue(yearSummaryElements.income, yearContext.yearIncomeReference, { animate });
  animateValue(yearSummaryElements.spent, yearContext.totalSpent, { animate });
  animateValue(yearSummaryElements.invested, yearContext.totalInvested, { animate });
  animateValue(yearSummaryElements.average, yearContext.averageMonthlyFree, { animate });

  setTextValue(calendarYearLabel, String(yearContext.activeYear));
  setTextValue(calendarCopy, `Haz clic en cualquier mes disponible de ${yearContext.activeYear} para actualizar resumen, transacciones, meta y graficos sin recargar la pagina.`);
  setTextValue(
    calendarSummaryNote,
    yearContext.monthsWithDataCount
      ? `Promedio calculado sobre ${formatNumber(yearContext.monthsWithDataCount)} mes(es) con movimientos. Las salidas incluyen gastos e inversiones registradas.`
      : "Todavia no hay meses con movimientos en este anio. Usa el calendario para navegar y cargar datos cuando los necesites."
  );

  if (!calendarGrid) {
    return;
  }

  calendarGrid.innerHTML = yearContext.months
    .map((month) => {
      const isDisabled = month.isFuture && !month.hasData;
      const stateLabel = month.isGoalMet
        ? "Meta cumplida"
        : month.hasData
          ? "Con movimientos"
          : isDisabled
            ? "Futuro"
            : "Sin datos";
      const monthCopy = month.hasData
        ? `${formatPercent(month.goalProgressPercent, 1)} de meta invertida`
        : isDisabled
          ? "Mes futuro sin movimientos."
          : "Mes sin movimientos cargados.";
      const classes = [
        "calendar-month",
        month.isActive ? "is-active" : "",
        month.hasData ? "has-data" : "",
        month.isGoalMet ? "is-goal-met" : "",
        isDisabled ? "is-future" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `<button class="${classes}" type="button" data-calendar-month="${month.monthKey}" ${isDisabled ? "disabled" : ""}><div class="calendar-month__header"><span>${escapeHtml(month.shortLabel)}</span><span class="calendar-month__status">${escapeHtml(stateLabel)}</span></div><strong class="calendar-month__value">${escapeHtml(formatMoney(month.totalSpent))}</strong><div class="calendar-month__meta"><span>Salidas ${escapeHtml(formatMoney(month.totalSpent))}</span><span>Invertido ${escapeHtml(formatMoney(month.investedThisMonth))}</span></div><div class="progress calendar-month__progress"><span style="width: ${month.goalProgressBarPercent}%;"></span></div><small>${escapeHtml(monthCopy)}</small></button>`;
    })
    .join("");
};

const renderDashboard = (animate = false) => {
  const state = getState();
  const metrics = computeMetrics(state);
  const context = getVisibleExpensesContext(state, metrics);
  uiState.latestMetrics = metrics;

  renderTopbar(metrics);
  renderFloatingAction(metrics);
  renderSidebar(metrics, animate);
  renderHero(metrics, animate);
  renderSplitCard(metrics, animate);
  renderKpis(metrics, animate);
  renderIncomeCard(metrics, animate);
  renderCategoryMix(metrics, animate);
  renderLineChart(metrics);
  renderCalendar(state, metrics, animate);
  renderExpenseList(state, metrics, context);
  renderFilters(context, metrics);
  renderInsights(metrics);
  renderExportState(metrics, context);
};

const clearFormFeedback = () => {
  if (formFeedback) {
    formFeedback.textContent = "";
  }
};

const clearIncomeFeedback = () => {
  if (incomeFeedback) {
    incomeFeedback.textContent = "";
  }
};

const clearGoalFeedback = () => {
  if (goalFeedback) {
    goalFeedback.textContent = "";
  }
};

const setModalPanel = (panelName) => {
  modalPanels.forEach((panel) => {
    panel.hidden = panel.dataset.modalPanel !== panelName;
  });
};

const openModal = (focusTarget = null) => {
  if (!modal) {
    return;
  }

  if (modal.hidden && document.activeElement instanceof HTMLElement) {
    uiState.lastFocusedElement = document.activeElement;
  }

  modal.hidden = false;
  body.classList.add("modal-open");
  body.classList.remove("sidebar-open");

  if (focusTarget instanceof HTMLElement) {
    window.requestAnimationFrame(() => focusTarget.focus());
  }
};

const closeModal = () => {
  if (!modal) {
    return;
  }

  modal.hidden = true;
  body.classList.remove("modal-open");
  uiState.modalMode = null;
  uiState.activeExpenseId = null;
  clearFormFeedback();
  clearIncomeFeedback();
  clearGoalFeedback();
  expenseForm?.reset();
  incomeForm?.reset();
  goalForm?.reset();

  if (uiState.lastFocusedElement instanceof HTMLElement) {
    window.requestAnimationFrame(() => uiState.lastFocusedElement.focus());
  }

  uiState.lastFocusedElement = null;
};

const showToast = (message, tone = "success") => {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add("is-visible");
  toast.classList.toggle("toast--error", tone === "error");

  window.clearTimeout(uiState.toastTimer);
  uiState.toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.classList.remove("toast--error");
    toast.hidden = true;
  }, TOAST_TIMEOUT_MS);
};

const validateExpensePayload = (payload) => {
  if (!payload.title || payload.title.trim().length < 2) {
    return "Agrega una descripcion clara.";
  }

  if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
    return "Ingresa un monto mayor a cero.";
  }

  if (!payload.category) {
    return "Elegi una categoria.";
  }

  if (!payload.date || Number.isNaN(new Date(payload.date).getTime())) {
    return "Selecciona una fecha valida.";
  }

  if (!payload.paymentMethod) {
    return "Elegi un medio de pago.";
  }

  return "";
};

const validateIncomePayload = (incomeBase, incomeExtra) => {
  if (!Number.isFinite(incomeBase) || incomeBase < 0) {
    return "Ingresa un monto valido para el ingreso base.";
  }

  if (!Number.isFinite(incomeExtra) || incomeExtra < 0) {
    return "Ingresa un monto valido para el ingreso extra.";
  }

  return "";
};

const validateGoalPayload = (goalAmount) => {
  if (!Number.isFinite(goalAmount) || goalAmount <= 0) {
    return "Ingresa un objetivo mensual mayor a cero.";
  }

  return "";
};

const updateIncomePreview = () => {
  const total = roundCurrency(Number(incomeBaseInput?.value || 0) + Number(incomeExtraInput?.value || 0));
  animateValue(incomeTotalPreview, total, { animate: false });
};

const updateGoalPreview = () => {
  const goalAmount = roundCurrency(Number(goalAmountInput?.value || 0));
  animateValue(goalAmountPreview, goalAmount, { animate: false });
  setTextValue(goalLabelPreview, String(goalLabelInput?.value || "").trim() || DEFAULT_GOAL_LABEL);
};

const buildExpensePayload = () => {
  if (!expenseForm) {
    return null;
  }

  const formData = new FormData(expenseForm);
  const existingExpense = uiState.activeExpenseId ? getExpenseById(uiState.activeExpenseId) : null;
  const submittedDate = String(formData.get("date") || "").trim();

  return {
    id: existingExpense?.id || String(formData.get("id") || "").trim() || generateId(),
    title: String(formData.get("title") || "").trim(),
    amount: roundCurrency(Number(formData.get("amount"))),
    category: String(formData.get("category") || "").trim(),
    date: submittedDate ? `${submittedDate}T12:00:00` : "",
    paymentMethod: String(formData.get("paymentMethod") || "").trim(),
    note: String(formData.get("note") || "").trim(),
    createdAt: existingExpense?.createdAt || new Date().toISOString(),
    isFixed: Boolean(formData.get("isFixed")),
  };
};

const openExpenseModal = (mode, expense = null, options = {}) => {
  if (!expenseForm || !modalTitle || !modalEyebrow || !modalCopy || !formSubmit) {
    return;
  }

  const presetCategory = options.presetCategory || "";
  const isInvestmentMode = mode === "investment";
  const isInvestmentEntry = (expense?.category || presetCategory) === "Inversion";
  uiState.modalMode = mode;
  uiState.activeExpenseId = mode === "edit" ? expense?.id || null : null;
  setModalPanel("form");
  clearFormFeedback();
  expenseForm.reset();
  getFormField("id").value = expense?.id || "";
  getFormField("title").value = expense?.title || "";
  getFormField("amount").value = expense?.amount ? String(expense.amount) : "";
  getFormField("category").value = expense?.category || presetCategory || "";
  getFormField("date").value = expense?.date ? expense.date.slice(0, 10) : new Date().toISOString().slice(0, 10);
  getFormField("paymentMethod").value = expense?.paymentMethod || "";
  getFormField("note").value = expense?.note || "";
  getFormField("isFixed").checked = Boolean(expense?.isFixed);

  modalEyebrow.textContent = mode === "edit" ? (isInvestmentEntry ? "Editar inversion" : "Editar gasto") : isInvestmentMode ? "Registrar inversion" : "Registrar gasto";
  modalTitle.textContent = mode === "edit" ? (isInvestmentEntry ? "Editar aporte" : "Editar gasto") : isInvestmentMode ? "Registrar inversion" : "Registrar gasto";
  modalCopy.textContent = mode === "edit" ? (isInvestmentEntry ? "Actualiza el aporte y el progreso de la meta se recalcula al instante." : "Actualiza el gasto y el resumen del mes se recalcula al instante.") : isInvestmentMode ? "La categoria Inversion ya queda seleccionada para registrar un aporte real del mes." : "Carga un gasto real del mes sin salir del planner.";
  formSubmit.textContent = mode === "edit" ? (isInvestmentEntry ? "Guardar aporte" : "Guardar gasto") : isInvestmentMode ? "Guardar aporte" : "Guardar gasto";
  openModal(getFormField("title"));
};

const openIncomeModal = () => {
  if (!incomeForm || !incomeBaseInput || !incomeExtraInput) {
    return;
  }

  const state = getState();
  uiState.modalMode = "income";
  setModalPanel("income");
  clearIncomeFeedback();
  incomeForm.reset();
  incomeBaseInput.value = String(roundCurrency(state.incomeBase || 0));
  incomeExtraInput.value = String(roundCurrency(state.incomeExtra || 0));
  updateIncomePreview();
  openModal(incomeBaseInput);
};

const openInvestmentModal = () => {
  openExpenseModal("investment", null, { presetCategory: "Inversion" });
};

const openGoalModal = () => {
  if (!goalForm || !goalAmountInput || !goalLabelInput) {
    return;
  }

  const state = getState();
  uiState.modalMode = "goal";
  setModalPanel("goal");
  clearGoalFeedback();
  goalForm.reset();
  goalAmountInput.value = String(roundCurrency(state.savingsGoalAmount || 0));
  goalLabelInput.value = String(state.savingsGoalLabel || "").trim();
  updateGoalPreview();
  openModal(goalAmountInput);
};

const openFiltersModal = () => {
  uiState.modalMode = "filters";
  setModalPanel("filters");
  renderDashboard(false);
  openModal(filterMonthInput || filterCategoryInput);
};

const openExportModal = () => {
  uiState.modalMode = "export";
  setModalPanel("export");
  renderDashboard(false);
  openModal(!exportCsvButton?.disabled ? exportCsvButton : !exportJsonButton?.disabled ? exportJsonButton : modalCloseButton);
};

const openRestoreModal = () => {
  uiState.modalMode = "restore";
  setModalPanel("reset");
  openModal(confirmRestoreButton || modalCloseButton);
};

const openDeleteModal = (expense) => {
  if (!expense) {
    return;
  }

  uiState.modalMode = "delete";
  uiState.activeExpenseId = expense.id;
  setModalPanel("confirm");
  setTextValue(confirmTitle, expense.title);
  setTextValue(confirmDate, formatDate(expense.date, { month: "short", day: "numeric", year: "numeric" }).replace(".", ""));
  setTextValue(confirmCopy, expense.note || getMovementCopy(expense.category).deleteCopy);
  setTextValue(confirmAmount, `- ${formatMoney(expense.amount)}`);
  openModal(confirmDeleteButton);
};

const applyFilterPatch = (patch) => {
  updateState((state) => ({
    filters: {
      ...state.filters,
      ...patch,
    },
  }));
  renderDashboard(false);
};

const setActiveMonth = (monthKey, animate = true) => {
  updateState((state) => ({
    filters: {
      ...state.filters,
      month: monthKey,
    },
  }));
  renderDashboard(animate);
};

const shiftCalendarYear = (offset) => {
  const state = getState();
  const activeMonthKey = getActiveMonthKey(state);
  const nextMonthKey = buildMonthKey(getYearFromMonthKey(activeMonthKey) + offset, getMonthNumberFromMonthKey(activeMonthKey));
  setActiveMonth(nextMonthKey, true);
};

const resetFilters = () => {
  updateState((state) => ({
    filters: getDefaultFilters(state),
  }));
  renderDashboard(false);
};

const handleExpenseSubmit = (event) => {
  event.preventDefault();

  const payload = buildExpensePayload();
  const validation = validateExpensePayload(payload);

  if (validation) {
    setTextValue(formFeedback, validation);
    return;
  }

  const expenseMonth = getMonthKey(payload.date);
  const isEditing = uiState.modalMode === "edit";
  const movementCopy = getMovementCopy(payload.category);

  updateState((state) => ({
    expenses: isEditing && uiState.activeExpenseId
      ? state.expenses.map((expense) => (expense.id === uiState.activeExpenseId ? { ...expense, ...payload, id: expense.id, createdAt: expense.createdAt } : expense))
      : [payload, ...state.expenses],
    filters: {
      ...state.filters,
      month: expenseMonth || state.filters.month,
    },
  }));

  closeModal();
  renderDashboard(true);
  showToast(isEditing ? movementCopy.updatedToast : movementCopy.registeredToast);
};

const handleDeleteExpense = () => {
  if (!uiState.activeExpenseId) {
    return;
  }

  const deletedExpense = getExpenseById(uiState.activeExpenseId);
  updateState((state) => ({
    expenses: state.expenses.filter((expense) => expense.id !== uiState.activeExpenseId),
  }));
  closeModal();
  renderDashboard(true);
  showToast(getMovementCopy(deletedExpense?.category).deletedToast);
};

const duplicateExpense = (expense) => {
  if (!expense) {
    return;
  }

  const duplicate = {
    ...expense,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  updateState((state) => ({
    expenses: [duplicate, ...state.expenses],
    filters: {
      ...state.filters,
      month: getMonthKey(expense.date) || state.filters.month,
    },
  }));
  renderDashboard(true);
  showToast(getMovementCopy(expense.category).duplicatedToast);
};

const handleIncomeSubmit = (event) => {
  event.preventDefault();

  const base = roundCurrency(Number(incomeBaseInput?.value || 0));
  const extra = roundCurrency(Number(incomeExtraInput?.value || 0));
  const validation = validateIncomePayload(base, extra);

  if (validation) {
    setTextValue(incomeFeedback, validation);
    return;
  }

  updateState({
    incomeBase: base,
    incomeExtra: extra,
  });

  closeModal();
  renderDashboard(true);
  showToast("Ingreso mensual actualizado.");
};

const handleGoalSubmit = (event) => {
  event.preventDefault();

  const goalAmount = roundCurrency(Number(goalAmountInput?.value || 0));
  const goalLabel = String(goalLabelInput?.value || "").trim();
  const validation = validateGoalPayload(goalAmount);

  if (validation) {
    setTextValue(goalFeedback, validation);
    return;
  }

  updateState({
    savingsGoalAmount: goalAmount,
    savingsGoalLabel: goalLabel,
  });

  closeModal();
  renderDashboard(true);
  showToast("Meta mensual actualizada.");
};

const handleSearchUpdate = (value) => {
  applyFilterPatch({ search: String(value || "").trim() });
};

const exportVisibleExpenses = (format) => {
  const state = getState();
  const metrics = computeMetrics(state);
  const context = getVisibleExpensesContext(state, metrics);

  if (!context.visibleExpenses.length) {
    showToast("No hay movimientos visibles para exportar.", "error");
    return;
  }

  const contents = format === "json" ? serializeExpensesToJson(context.visibleExpenses) : serializeExpensesToCsv(context.visibleExpenses);
  downloadTextFile(`${getExportBaseFilename(metrics)}.${format}`, contents, format === "json" ? "application/json;charset=utf-8" : "text/csv;charset=utf-8");
  closeModal();
  showToast(`Exportacion ${format.toUpperCase()} lista.`);
};

const restoreSampleData = () => {
  setState(getSampleState());
  closeModal();
  renderDashboard(true);
  setActiveView(DEFAULT_VIEW, { instant: true });
  showToast("Muestra restaurada.");
};

const setActiveNavItem = (target) => {
  navItems.forEach((item) => {
    const isActive = item.dataset.navItem === target;
    item.classList.toggle("is-active", isActive);
    if (isActive) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
};

const setActiveView = (target, options = {}) => {
  const nextView = Object.prototype.hasOwnProperty.call(viewSections, target) ? target : DEFAULT_VIEW;
  const metrics = uiState.latestMetrics || computeMetrics(getState());
  const shouldFocusMain = options.focusMain !== false && !options.instant;

  uiState.activeView = nextView;
  body.dataset.activeView = nextView;
  body.classList.remove("sidebar-open");
  persistActiveView(nextView);
  setActiveNavItem(nextView);
  Object.entries(viewSections).forEach(([viewName, section]) => {
    if (!section) {
      return;
    }

    const isActive = viewName === nextView;
    section.hidden = !isActive;
    section.classList.toggle("is-hidden", !isActive);
    section.classList.toggle("is-active", isActive);
    section.inert = !isActive;
    section.setAttribute("aria-hidden", isActive ? "false" : "true");
  });
  renderTopbar(metrics);
  renderFloatingAction(metrics);

  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      behavior: options.instant ? "auto" : getScrollBehavior(),
    });

    if (shouldFocusMain && dashboardMain instanceof HTMLElement) {
      dashboardMain.focus({ preventScroll: true });
    }
  });
};

const initializeInteractions = () => {
  renderDashboard(false);
  setActiveView(uiState.activeView, { instant: true });

  if (fab) {
    fab.addEventListener("click", () => {
      if (fab.dataset.fabAction === "investment") {
        openInvestmentModal();
        return;
      }

      openExpenseModal("add");
    });
  }

  openExpenseButtons.forEach((button) => button.addEventListener("click", () => openExpenseModal("add")));
  openIncomeButtons.forEach((button) => button.addEventListener("click", openIncomeModal));
  openGoalButtons.forEach((button) => button.addEventListener("click", openGoalModal));
  openInvestmentButtons.forEach((button) => button.addEventListener("click", openInvestmentModal));
  openFilterButtons.forEach((button) => button.addEventListener("click", openFiltersModal));
  openExportButtons.forEach((button) => button.addEventListener("click", openExportModal));
  modalRestoreButtons.forEach((button) => button.addEventListener("click", openRestoreModal));
  modalCloseTriggers.forEach((trigger) => trigger.addEventListener("click", closeModal));

  expenseForm?.addEventListener("submit", handleExpenseSubmit);
  expenseForm?.addEventListener("input", clearFormFeedback);
  expenseForm?.addEventListener("change", clearFormFeedback);
  incomeForm?.addEventListener("submit", handleIncomeSubmit);
  incomeForm?.addEventListener("input", () => {
    clearIncomeFeedback();
    updateIncomePreview();
  });
  incomeForm?.addEventListener("change", () => {
    clearIncomeFeedback();
    updateIncomePreview();
  });
  goalForm?.addEventListener("submit", handleGoalSubmit);
  goalForm?.addEventListener("input", () => {
    clearGoalFeedback();
    updateGoalPreview();
  });
  goalForm?.addEventListener("change", () => {
    clearGoalFeedback();
    updateGoalPreview();
  });

  confirmDeleteButton?.addEventListener("click", handleDeleteExpense);
  confirmRestoreButton?.addEventListener("click", restoreSampleData);
  clearFiltersButton?.addEventListener("click", resetFilters);
  exportJsonButton?.addEventListener("click", () => exportVisibleExpenses("json"));
  exportCsvButton?.addEventListener("click", () => exportVisibleExpenses("csv"));
  calendarShiftButtons.forEach((button) =>
    button.addEventListener("click", () => shiftCalendarYear(Number(button.dataset.calendarShift || 0)))
  );

  searchInput?.addEventListener("input", (event) => handleSearchUpdate(event.target.value));
  filterMonthInput?.addEventListener("change", (event) => applyFilterPatch({ month: event.target.value || getDefaultFilters(getState()).month }));
  filterCategoryInput?.addEventListener("change", (event) => applyFilterPatch({ category: event.target.value || "all" }));
  filterPaymentMethodInput?.addEventListener("change", (event) => applyFilterPatch({ paymentMethod: event.target.value || "all" }));
  filterExpenseTypeInput?.addEventListener("change", (event) => applyFilterPatch({ expenseType: event.target.value || "all" }));
  filterSortInput?.addEventListener("change", (event) => applyFilterPatch({ sort: event.target.value || "newest" }));
  filterForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    closeModal();
  });

  expenseList?.addEventListener("click", (event) => {
    const listAction = event.target.closest("[data-list-action]");
    if (listAction) {
      if (listAction.dataset.listAction === "open-add") {
        openExpenseModal("add");
      }

      if (listAction.dataset.listAction === "open-investment") {
        openInvestmentModal();
      }

      if (listAction.dataset.listAction === "restore-sample") {
        openRestoreModal();
      }

      if (listAction.dataset.listAction === "clear-filters") {
        resetFilters();
      }

      if (listAction.dataset.listAction === "open-filters") {
        openFiltersModal();
      }

      return;
    }

    const actionTrigger = event.target.closest("[data-expense-action]");
    if (!actionTrigger) {
      return;
    }

    const expense = getExpenseById(actionTrigger.dataset.expenseId);
    if (!expense) {
      return;
    }

    if (actionTrigger.dataset.expenseAction === "edit") {
      openExpenseModal("edit", expense);
    }

    if (actionTrigger.dataset.expenseAction === "duplicate") {
      duplicateExpense(expense);
    }

    if (actionTrigger.dataset.expenseAction === "delete") {
      openDeleteModal(expense);
    }
  });

  calendarGrid?.addEventListener("click", (event) => {
    const monthTrigger = event.target.closest("[data-calendar-month]");
    if (!(monthTrigger instanceof HTMLButtonElement) || monthTrigger.disabled) {
      return;
    }

    setActiveMonth(monthTrigger.dataset.calendarMonth, true);
  });
  categoryLegend?.addEventListener("mouseover", (event) => {
    const legendItem = event.target.closest("[data-legend-index]");
    if (!legendItem || !categoryLegend.contains(legendItem)) {
      return;
    }

    setCategoryMixHighlight(Number(legendItem.dataset.legendIndex));
  });
  categoryLegend?.addEventListener("mouseleave", () => setCategoryMixHighlight(-1));
  categoryLegend?.addEventListener("focusin", (event) => {
    const legendItem = event.target.closest("[data-legend-index]");
    if (!legendItem || !categoryLegend.contains(legendItem)) {
      return;
    }

    setCategoryMixHighlight(Number(legendItem.dataset.legendIndex));
  });
  categoryLegend?.addEventListener("focusout", (event) => {
    if (categoryLegend.contains(event.relatedTarget)) {
      return;
    }

    setCategoryMixHighlight(-1);
  });

  menuToggle?.addEventListener("click", () => body.classList.toggle("sidebar-open"));
  backdrop?.addEventListener("click", () => body.classList.remove("sidebar-open"));
  navItems.forEach((item) => item.addEventListener("click", () => setActiveView(item.dataset.navItem)));
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1120) {
      body.classList.remove("sidebar-open");
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) {
      closeModal();
    }
  });
  window.addEventListener("load", () => {
    window.setTimeout(() => {
      body.classList.remove("is-loading");
      body.classList.add("is-ready");
      renderDashboard(true);
    }, 900);
  });
};

initializeInteractions();

