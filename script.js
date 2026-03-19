const { getSampleState, getState, setState, updateState } = window.aleclvExpenseTrackerState;
const { formatCurrency, formatDate, generateId } = window.aleclvExpenseTrackerUtils;

const TOAST_TIMEOUT_MS = 2600;
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;
const NAV_SCROLL_OFFSET = 20;
const CATEGORY_SWATCHES = [
  { className: "mint", color: "var(--accent)" },
  { className: "blue", color: "var(--accent-blue)" },
  { className: "amber", color: "var(--accent-amber)" },
  { className: "rose", color: "var(--accent-rose)" },
  { className: "slate", color: "var(--accent-slate)" },
];
const STATUS_PILL_CLASSES = ["status-pill--positive", "status-pill--neutral", "status-pill--negative"];
const INSIGHT_FLAG_TONES = {
  mint: "insight__flag--mint",
  blue: "insight__flag--blue",
  rose: "insight__flag--rose",
};

const body = document.body;
const topbar = document.querySelector(".topbar");
const openIncomeButtons = document.querySelectorAll("[data-open-income]");
const modalRestoreButtons = document.querySelectorAll("[data-modal-restore-sample]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const backdrop = document.querySelector("[data-backdrop]");
const navItems = document.querySelectorAll("[data-nav-item]");
const openFilterButtons = document.querySelectorAll("[data-open-filters]");
const openExportButtons = document.querySelectorAll("[data-open-export]");
const searchInput = document.querySelector("[data-search-input]");
const expenseList = document.querySelector("[data-expense-list]");
const expenseResults = document.querySelector("[data-expense-results]");
const insightList = document.querySelector("[data-insight-list]");
const fab = document.querySelector(".fab");
const modal = document.querySelector("[data-modal]");
const modalPanels = document.querySelectorAll("[data-modal-panel]");
const modalCloseButton = document.querySelector(".app-modal__close");
const modalCloseTriggers = document.querySelectorAll("[data-modal-close]");
const modalEyebrow = document.querySelector("[data-modal-eyebrow]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalCopy = document.querySelector("[data-modal-copy]");
const expenseForm = document.querySelector("[data-expense-form]");
const incomeForm = document.querySelector("[data-income-form]");
const formFeedback = document.querySelector("[data-form-feedback]");
const incomeFeedback = document.querySelector("[data-income-feedback]");
const formSubmit = document.querySelector("[data-form-submit]");
const incomeBaseInput = document.querySelector("[data-income-base-input]");
const incomeExtraInput = document.querySelector("[data-income-extra-input]");
const incomeTotalPreview = document.querySelector("[data-income-total-preview]");
const incomeMonthLabel = document.querySelector("[data-income-month-label]");
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

const sections = {
  dashboard: document.querySelector(".hero-grid"),
  cashflow: document.querySelector(".kpi-grid"),
  income: document.querySelector(".income-card"),
  activity: document.querySelector(".expenses-card"),
  insights: document.querySelector(".insights-card"),
};

const kpiElements = {
  incomeTotal: document.querySelector('[data-kpi="incomeTotal"]'),
  totalSpent: document.querySelector('[data-kpi="totalSpent"]'),
  remainingBalance: document.querySelector('[data-kpi="remainingBalance"]'),
  savingsAmount: document.querySelector('[data-kpi="savingsAmount"]'),
  dailyAverage: document.querySelector('[data-kpi="dailyAverage"]'),
  savingsRate: document.querySelector('[data-kpi="savingsRate"]'),
};

const kpiDeltaElements = {
  incomeTotal: document.querySelector('[data-kpi-delta="incomeTotal"]'),
  totalSpent: document.querySelector('[data-kpi-delta="totalSpent"]'),
  remainingBalance: document.querySelector('[data-kpi-delta="remainingBalance"]'),
  savingsAmount: document.querySelector('[data-kpi-delta="savingsAmount"]'),
  dailyAverage: document.querySelector('[data-kpi-delta="dailyAverage"]'),
  savingsRate: document.querySelector('[data-kpi-delta="savingsRate"]'),
};

const kpiCaptionElements = {
  incomeTotal: document.querySelector('[data-kpi-caption="incomeTotal"]'),
  totalSpent: document.querySelector('[data-kpi-caption="totalSpent"]'),
  remainingBalance: document.querySelector('[data-kpi-caption="remainingBalance"]'),
  savingsAmount: document.querySelector('[data-kpi-caption="savingsAmount"]'),
  dailyAverage: document.querySelector('[data-kpi-caption="dailyAverage"]'),
  savingsRate: document.querySelector('[data-kpi-caption="savingsRate"]'),
};

const summaryElements = {
  sidebarFreeCash: document.querySelector('[data-summary="sidebar-free-cash"]'),
  sidebarSavings: document.querySelector('[data-summary="sidebar-savings"]'),
  heroRemaining: document.querySelector('[data-summary="hero-remaining"]'),
  miniDailyAverage: document.querySelector('[data-summary="mini-daily-average"]'),
  miniSecondaryValue: document.querySelector('[data-summary="mini-secondary-value"]'),
  chartTotalSpent: document.querySelector('[data-summary="chart-total-spent"]'),
  fixedSpend: document.querySelector('[data-summary="fixed-spend"]'),
  variableSpend: document.querySelector('[data-summary="variable-spend"]'),
  monthSavings: document.querySelector('[data-summary="month-savings"]'),
  incomeTotal: document.querySelector('[data-summary="income-total"]'),
  incomeBase: document.querySelector('[data-summary="income-base"]'),
  incomeExtra: document.querySelector('[data-summary="income-extra"]'),
  incomeBalance: document.querySelector('[data-summary="income-balance"]'),
  incomeSavingsRate: document.querySelector('[data-summary="income-savings-rate"]'),
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
  categoryCountPill: document.querySelector('[data-summary-text="category-count-pill"]'),
  splitNote: document.querySelector('[data-summary-text="split-note"]'),
  comparisonNote: document.querySelector('[data-summary-text="comparison-note"]'),
  incomeCaption: document.querySelector('[data-summary-text="income-caption"]'),
  incomeSavingsAmount: document.querySelector('[data-summary-text="income-savings-amount"]'),
  incomeUsageLabel: document.querySelector("[data-income-usage-label]"),
};

const comparisonElements = {
  totalSpentCopy: document.querySelector('[data-comparison="totalSpent-copy"]'),
  totalSpentValue: document.querySelector('[data-comparison="totalSpent-value"]'),
  remainingBalanceCopy: document.querySelector('[data-comparison="remainingBalance-copy"]'),
  remainingBalanceValue: document.querySelector('[data-comparison="remainingBalance-value"]'),
  savingsCopy: document.querySelector('[data-comparison="savings-copy"]'),
  savingsValue: document.querySelector('[data-comparison="savings-value"]'),
  categoryShiftCopy: document.querySelector('[data-comparison="categoryShift-copy"]'),
  categoryShiftValue: document.querySelector('[data-comparison="categoryShift-value"]'),
};

const labelElements = {
  heroStat1: document.querySelector('[data-summary-label="hero-stat-1-label"]'),
  heroStat2: document.querySelector('[data-summary-label="hero-stat-2-label"]'),
  miniSecondary: document.querySelector('[data-summary-label="mini-secondary-label"]'),
  miniTertiary: document.querySelector('[data-summary-label="mini-tertiary-label"]'),
};

const barElements = {
  sidebarSpendRatio: document.querySelector('[data-summary-bar="sidebar-spend-ratio"]'),
  heroRunway: document.querySelector('[data-summary-bar="hero-runway"]'),
  fixedSpend: document.querySelector('[data-summary-bar="fixed-spend"]'),
  variableSpend: document.querySelector('[data-summary-bar="variable-spend"]'),
  monthSavings: document.querySelector('[data-summary-bar="month-savings"]'),
};

const statusElements = {
  sidebar: document.querySelector('[data-summary-status="sidebar"]'),
  hero: document.querySelector('[data-summary-status="hero"]'),
  line: document.querySelector('[data-summary-status="line"]'),
};

const stackedSegments = document.querySelectorAll(".stacked-bar__segment");

const uiState = {
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
  const remainingBalance = roundCurrency(incomeTotal - totalSpent);
  const savingsAmount = roundCurrency(Math.max(remainingBalance, 0));
  const daysInMonth = getDaysInMonth(monthKey);
  const elapsedDays = getElapsedDaysForMonth(monthKey, expenses);
  const dailyAverage = roundCurrency(totalSpent / Math.max(elapsedDays, 1));
  const spentRatio = incomeTotal > 0 ? (totalSpent / incomeTotal) * 100 : 0;
  const savingsRate = incomeTotal > 0 ? (savingsAmount / incomeTotal) * 100 : 0;
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
  const currentMonth = summarizeMonth(getExpensesForMonth(state.expenses, activeMonthKey), totalIncome, activeMonthKey);
  const previousMonth = summarizeMonth(getExpensesForMonth(state.expenses, previousMonthKey), totalIncome, previousMonthKey);
  const hasPreviousData = previousMonth.transactionCount > 0;

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
    comparisons: {
      totalSpent: compareMetric(currentMonth.totalSpent, previousMonth.totalSpent, hasPreviousData),
      remainingBalance: compareMetric(currentMonth.remainingBalance, previousMonth.remainingBalance, hasPreviousData),
      savingsAmount: compareMetric(currentMonth.savingsAmount, previousMonth.savingsAmount, hasPreviousData),
      dailyAverage: compareMetric(currentMonth.dailyAverage, previousMonth.dailyAverage, hasPreviousData),
      savingsRate: {
        current: currentMonth.savingsRate,
        previous: previousMonth.savingsRate,
        difference: roundCurrency(currentMonth.savingsRate - previousMonth.savingsRate),
        percent: null,
      },
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
  if (["Supermercado", "Salud"].includes(category)) {
    return "badge--blue";
  }

  if (["Transporte", "Auto/Moto"].includes(category)) {
    return "badge--amber";
  }

  if (["Casa/Servicios", "Suscripciones", "Inversion"].includes(category)) {
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

const renderPeriod = (metrics) => {
  setTextValue(textElements.periodTitle, `${metrics.monthLabelLong} - resumen de gastos`);
  setTextValue(textElements.periodPill, metrics.monthLabelShortYear);
  setTextValue(incomeMonthLabel, `Se usa como base para ${metrics.monthLabelLong}.`);
};

const renderSidebar = (metrics, animate) => {
  animateValue(summaryElements.sidebarFreeCash, metrics.remainingBalance, { animate });
  animateValue(summaryElements.sidebarSavings, metrics.savingsAmount, { animate });
  setTextValue(textElements.sidebarSpendRatio, formatPercent(metrics.spentRatio, 1));
  setBarWidth(barElements.sidebarSpendRatio, metrics.spentRatio);

  if (!metrics.totalIncome) {
    applyStatusPill(statusElements.sidebar, "Cargar ingreso", "neutral");
    return;
  }

  if (!metrics.hasPreviousData) {
    applyStatusPill(statusElements.sidebar, "Sin mes anterior", "neutral");
    return;
  }

  applyStatusPill(
    statusElements.sidebar,
    `${formatSignedPercent(metrics.comparisons.totalSpent.percent)} vs ${metrics.previousMonthLabel}`,
    getTrendTone(metrics.comparisons.totalSpent.difference, { lowerIsBetter: true })
  );
};

const renderHero = (metrics, animate) => {
  animateValue(summaryElements.heroRemaining, metrics.remainingBalance, { animate });
  setTextValue(
    textElements.heroCaption,
    metrics.transactionCount
      ? `${formatPercent(metrics.spentRatio, 1)} del ingreso ya fue consumido en ${metrics.monthLabelLong}.`
      : "Carga tu primer gasto del mes para ver un balance real y comparaciones utiles."
  );
  setTextValue(labelElements.heroStat1, "Movimientos");
  setTextValue(textElements.heroStat1Value, `${metrics.transactionCount} en ${metrics.monthLabelShort}`);
  setTextValue(labelElements.heroStat2, "Gasto fijo");
  setTextValue(textElements.heroStat2Value, metrics.transactionCount ? `${formatPercent(metrics.fixedShare, 1)} del total` : "Todavia sin base");
  setTextValue(textElements.heroRunway, formatPercent(metrics.spentRatio, 1));
  setBarWidth(barElements.heroRunway, metrics.spentRatio);
  animateValue(summaryElements.miniDailyAverage, metrics.dailyAverage, { animate });
  animateValue(summaryElements.miniSecondaryValue, metrics.largestExpense?.amount || 0, { animate });
  setTextValue(textElements.miniDailyNote, metrics.transactionCount ? `${metrics.elapsedDays} dia(s) tomados para el promedio.` : "Sin gastos en el mes activo");
  setTextValue(labelElements.miniSecondary, "Gasto mas alto");
  setTextValue(
    textElements.miniSecondaryNote,
    metrics.largestExpense
      ? `${metrics.largestExpense.title} el ${formatDate(metrics.largestExpense.date, { month: "short", day: "numeric", year: undefined }).replace(".", "")}.`
      : "Todavia no hay gastos cargados."
  );
  setTextValue(labelElements.miniTertiary, "Categoria principal");
  setTextValue(textElements.miniTertiaryValue, metrics.topCategory?.category || "Sin categoria");
  setTextValue(
    textElements.miniTertiaryNote,
    metrics.topCategory ? `${formatPercent(metrics.topCategory.share, 1)} del total de gastos.` : "Todavia no hay mezcla de gastos."
  );

  if (!metrics.totalIncome) {
    applyStatusPill(statusElements.hero, "Sin ingreso", "neutral");
    return;
  }

  if (!metrics.hasPreviousData) {
    applyStatusPill(statusElements.hero, metrics.remainingBalance >= 0 ? "Al dia" : "Ajustado", metrics.remainingBalance >= 0 ? "positive" : "negative");
    return;
  }

  applyStatusPill(
    statusElements.hero,
    `${formatSignedPercent(metrics.comparisons.remainingBalance.percent)} vs ${metrics.previousMonthLabel}`,
    getTrendTone(metrics.comparisons.remainingBalance.difference)
  );
};

const renderSplitCard = (metrics, animate) => {
  animateValue(summaryElements.fixedSpend, metrics.fixedSpend, { animate });
  animateValue(summaryElements.variableSpend, metrics.variableSpend, { animate });
  animateValue(summaryElements.monthSavings, metrics.savingsAmount, { animate });
  setBarWidth(barElements.fixedSpend, metrics.fixedShare);
  setBarWidth(barElements.variableSpend, metrics.variableShare);
  setBarWidth(barElements.monthSavings, metrics.totalIncome > 0 ? metrics.savingsRate : 0);
  setTextValue(
    textElements.splitNote,
    metrics.transactionCount
      ? `${formatPercent(metrics.fixedShare, 1)} fijos y ${formatPercent(metrics.variableShare, 1)} variables dentro del mes activo.`
      : "Cuando cargues gastos fijos y variables vas a ver rapidamente cuanto margen real te queda."
  );

  if (!metrics.hasPreviousData) {
    setTextValue(textElements.comparisonNote, `No hay movimientos en ${getMonthLabel(metrics.previousMonthKey)} para comparar.`);
    setTextValue(comparisonElements.totalSpentCopy, "Sin base para comparar");
    setTextValue(comparisonElements.totalSpentValue, formatMoney(metrics.totalSpent));
    setTextValue(comparisonElements.remainingBalanceCopy, "Sin base para comparar");
    setTextValue(comparisonElements.remainingBalanceValue, formatMoney(metrics.remainingBalance));
    setTextValue(comparisonElements.savingsCopy, "Sin base para comparar");
    setTextValue(comparisonElements.savingsValue, formatMoney(metrics.savingsAmount));
    setTextValue(comparisonElements.categoryShiftCopy, "Sin categoria para comparar");
    setTextValue(comparisonElements.categoryShiftValue, "Sin datos");
    return;
  }

  setTextValue(textElements.comparisonNote, `Comparacion directa contra ${metrics.previousMonth.monthLabelLong} usando el ingreso mensual actual como referencia.`);
  setTextValue(comparisonElements.totalSpentCopy, `${formatSignedCurrency(metrics.comparisons.totalSpent.difference)} vs ${metrics.previousMonthLabel}`);
  setTextValue(comparisonElements.totalSpentValue, formatMoney(metrics.totalSpent));
  setTextValue(comparisonElements.remainingBalanceCopy, `${formatSignedCurrency(metrics.comparisons.remainingBalance.difference)} vs ${metrics.previousMonthLabel}`);
  setTextValue(comparisonElements.remainingBalanceValue, formatMoney(metrics.remainingBalance));
  setTextValue(comparisonElements.savingsCopy, `${formatSignedCurrency(metrics.comparisons.savingsAmount.difference)} vs ${metrics.previousMonthLabel}`);
  setTextValue(comparisonElements.savingsValue, formatMoney(metrics.savingsAmount));

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
  animateValue(kpiElements.remainingBalance, metrics.remainingBalance, { animate });
  animateValue(kpiElements.savingsAmount, metrics.savingsAmount, { animate });
  animateValue(kpiElements.dailyAverage, metrics.dailyAverage, { animate });
  animateValue(kpiElements.savingsRate, metrics.savingsRate, { animate, decimals: 1, suffix: "%" });

  setTextValue(kpiDeltaElements.incomeTotal, metrics.totalIncome ? `${formatMoney(metrics.incomeBase)} base + ${formatMoney(metrics.incomeExtra)} extra` : "Editable");
  setTextValue(kpiCaptionElements.incomeTotal, metrics.totalIncome ? "La suma del ingreso base y el ingreso extra del mes." : "Carga el ingreso del mes para activar el tablero completo.");

  if (metrics.hasPreviousData) {
    setTextValue(kpiDeltaElements.totalSpent, formatSignedPercent(metrics.comparisons.totalSpent.percent));
    setTextValue(kpiDeltaElements.remainingBalance, formatSignedPercent(metrics.comparisons.remainingBalance.percent));
    setTextValue(kpiDeltaElements.savingsAmount, formatSignedPercent(metrics.comparisons.savingsAmount.percent));
    setTextValue(kpiDeltaElements.dailyAverage, formatSignedPercent(metrics.comparisons.dailyAverage.percent));
    setTextValue(kpiDeltaElements.savingsRate, `${metrics.comparisons.savingsRate.difference > 0 ? "+" : ""}${formatNumber(metrics.comparisons.savingsRate.difference, 1)} pts`);
  } else {
    setTextValue(kpiDeltaElements.totalSpent, "Sin base");
    setTextValue(kpiDeltaElements.remainingBalance, "Sin base");
    setTextValue(kpiDeltaElements.savingsAmount, "Sin base");
    setTextValue(kpiDeltaElements.dailyAverage, "Promedio actual");
    setTextValue(kpiDeltaElements.savingsRate, formatPercent(metrics.savingsRate, 1));
  }

  setTextValue(kpiCaptionElements.totalSpent, "Suma de todos los gastos cargados en el mes activo.");
  setTextValue(kpiCaptionElements.remainingBalance, "Ingreso total menos gastos del mes activo.");
  setTextValue(kpiCaptionElements.savingsAmount, "Lo que todavia queda libre si hoy cerrara el mes.");
  setTextValue(kpiCaptionElements.dailyAverage, "Promedio diario usando los dias cargados o transcurridos.");
  setTextValue(kpiCaptionElements.savingsRate, "Porcentaje del ingreso que sigue libre despues de tus gastos.");
};

const renderIncomeCard = (metrics, animate) => {
  animateValue(summaryElements.incomeTotal, metrics.totalIncome, { animate });
  animateValue(summaryElements.incomeBase, metrics.incomeBase, { animate });
  animateValue(summaryElements.incomeExtra, metrics.incomeExtra, { animate });
  animateValue(summaryElements.incomeBalance, metrics.remainingBalance, { animate });
  animateValue(summaryElements.incomeSavingsRate, metrics.savingsRate, { animate, decimals: 1, suffix: "%" });
  setTextValue(
    textElements.incomeCaption,
    metrics.totalIncome
      ? "Editar ingreso base o extra actualiza balance, ahorro, comparativas y porcentaje gastado al instante."
      : "Define un ingreso base y otro extra para convertir el tablero en un seguimiento mensual real."
  );
  setTextValue(textElements.incomeSavingsAmount, formatMoney(metrics.savingsAmount));
  setTextValue(textElements.incomeUsageLabel, metrics.totalIncome ? `${formatPercent(metrics.spentRatio, 1)} del ingreso ya gastado` : "Todavia no hay ingreso cargado");

  if (stackedSegments.length >= 2) {
    stackedSegments[0].style.width = `${clamp(metrics.spentRatio, 0, 100)}%`;
    stackedSegments[1].style.width = `${clamp(100 - metrics.spentRatio, 0, 100)}%`;
  }

  if (incomeTotalPreview && uiState.modalMode !== "income") {
    animateValue(incomeTotalPreview, metrics.totalIncome, { animate: false });
  }
};

const renderCategoryMix = (metrics, animate) => {
  animateValue(summaryElements.chartTotalSpent, metrics.totalSpent, { animate });
  setTextValue(textElements.categoryCountPill, `${metrics.activeCategoryCount} categoria(s) activas`);

  if (!categoryLegend) {
    return;
  }

  if (!metrics.categoryBreakdown.length) {
    categoryLegend.innerHTML = '<div class="expense-list__empty"><strong>Sin categorias para mostrar</strong><p>Cuando cargues gastos de este mes vas a ver la mezcla por categoria y cuanto pesa cada una.</p></div>';
    if (donutChart) {
      donutChart.style.background = "conic-gradient(rgba(255,255,255,0.08) 0 100%)";
    }
    return;
  }

  const legendItems = buildLegendCategories(metrics.categoryBreakdown);
  categoryLegend.innerHTML = legendItems
    .map((item, index) => {
      const swatch = CATEGORY_SWATCHES[index % CATEGORY_SWATCHES.length];
      return `<div class="legend-item"><div class="legend-item__title"><span class="legend-swatch legend-swatch--${swatch.className}"></span><span>${escapeHtml(item.category)}</span></div><div class="legend-item__value"><strong>${escapeHtml(formatPercent(item.share, item.share < 10 ? 1 : 0))}</strong><span>${escapeHtml(formatMoney(item.total))}</span></div></div>`;
    })
    .join("");

  if (!donutChart) {
    return;
  }

  let cursor = 0;
  const stops = legendItems.map((item, index) => {
    const swatch = CATEGORY_SWATCHES[index % CATEGORY_SWATCHES.length];
    const start = cursor;
    cursor += item.share;
    return `${swatch.color} ${start}% ${cursor}%`;
  });

  if (cursor < 100) {
    stops.push(`rgba(255,255,255,0.05) ${cursor}% 100%`);
  }

  donutChart.style.background = `conic-gradient(${stops.join(", ")})`;
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
    applyStatusPill(statusElements.line, "Sin gastos", "neutral");
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

const createInsight = (flag, tone, title, body, meta) => ({ flag, tone, title, body, meta });

const generateInsights = (metrics) => {
  if (!metrics.transactionCount) {
    return [
      createInsight("Setup", "mint", "Carga tu primer gasto", "Con un ingreso y al menos un gasto vas a ver categorias, comparativas y balance real.", metrics.totalIncome ? `Ingreso actual: ${formatMoney(metrics.totalIncome)}.` : "Todavia no hay ingreso mensual cargado."),
      createInsight("Filtro", "blue", "Usa filtros practicos", "Filtra por categoria, medio de pago, tipo de gasto y orden para revisar mejor cada mes.", `Mes activo: ${metrics.monthLabelLong}.`),
    ];
  }

  return [
    createInsight(metrics.topCategory?.category || "Categoria", "blue", "Categoria con mayor gasto", metrics.topCategory ? `${metrics.topCategory.category} concentra ${formatPercent(metrics.topCategory.share, 1)} del gasto del mes.` : "Sin categoria dominante.", metrics.topCategory ? `Total: ${formatMoney(metrics.topCategory.total)}.` : "Sin datos."),
    createInsight("Mayor gasto", "rose", "Gasto mas alto", metrics.largestExpense ? `${metrics.largestExpense.title} fue el gasto mas grande del mes.` : "Todavia no hay un gasto dominante.", metrics.largestExpense ? `${formatMoney(metrics.largestExpense.amount)} el ${formatDate(metrics.largestExpense.date, { month: "short", day: "numeric", year: undefined }).replace(".", "")}.` : "Sin datos."),
    createInsight("Promedio", "mint", "Promedio diario", `${formatMoney(metrics.dailyAverage)} por dia durante ${metrics.elapsedDays} dia(s) considerados.`, `Proyeccion mensual: ${formatMoney(metrics.projectedMonthlySpend)}.`),
    createInsight("Split", "blue", "Fijos vs variables", `${formatPercent(metrics.fixedShare, 1)} fijos y ${formatPercent(metrics.variableShare, 1)} variables dentro de tus gastos.`, `Fijos: ${formatMoney(metrics.fixedSpend)}. Variables: ${formatMoney(metrics.variableSpend)}.`),
    createInsight("Ingreso", metrics.spentRatio > 85 ? "rose" : "mint", "Porcentaje del ingreso gastado", `${formatPercent(metrics.spentRatio, 1)} de tu ingreso total ya fue consumido en el mes activo.`, metrics.totalIncome ? `Te quedan ${formatMoney(metrics.remainingBalance)} sobre ${formatMoney(metrics.totalIncome)}.` : "Carga un ingreso para completar este dato."),
  ];
};

const renderInsights = (metrics) => {
  if (!insightList) {
    return;
  }

  insightList.innerHTML = generateInsights(metrics)
    .map((insight) => `<article class="insight"><div class="insight__flag ${INSIGHT_FLAG_TONES[insight.tone] || INSIGHT_FLAG_TONES.blue}">${escapeHtml(insight.flag)}</div><div><strong>${escapeHtml(insight.title)}</strong><p>${escapeHtml(insight.body)}</p><span class="insight__meta">${escapeHtml(insight.meta)}</span></div></article>`)
    .join("");
};

const getEmptyStateMarkup = (state, metrics, context) => {
  if (!context.monthExpenses.length) {
    return `<div class="expense-list__empty"><strong>No hay gastos en ${escapeHtml(metrics.monthLabelLong)}</strong><p>Empieza cargando un gasto real para ver la actividad del mes, los insights y la comparacion contra meses anteriores.</p><div class="expense-list__actions"><button class="button button--accent button--small" type="button" data-list-action="open-add">Agregar gasto</button>${!state.expenses.length ? '<button class="button button--ghost button--small" type="button" data-list-action="restore-sample">Cargar muestra</button>' : ""}</div></div>`;
  }

  return `<div class="expense-list__empty"><strong>No hay movimientos con estos filtros</strong><p>Prueba limpiar categoria, medio de pago, tipo de gasto o la busqueda para volver a ver resultados.</p><div class="expense-list__actions"><button class="button button--ghost button--small" type="button" data-list-action="clear-filters">Limpiar filtros</button><button class="button button--ghost button--small" type="button" data-list-action="open-filters">Ajustar filtros</button></div></div>`;
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
      const notePreview = expense.note ? `<p class="expense-row__note">${escapeHtml(expense.note)}</p>` : "";
      const fixedBadge = expense.isFixed ? '<span class="badge badge--fixed">Fijo</span>' : '<span class="badge badge--variable">Variable</span>';

      return `<article class="expense-row"><div class="expense-row__merchant"><strong>${escapeHtml(expense.title)}</strong>${notePreview || `<span>${escapeHtml(expense.category)} - ${escapeHtml(expense.paymentMethod)}</span>`}</div><div class="expense-row__meta"><span class="badge ${getCategoryTone(expense.category)}">${escapeHtml(expense.category)}</span><span class="badge badge--method">${escapeHtml(expense.paymentMethod)}</span>${fixedBadge}<span class="expense-row__method">${escapeHtml(formatDate(expense.date, { month: "short", day: "numeric", year: "numeric" }).replace(".", ""))}</span></div><div class="expense-row__side"><strong class="expense-row__amount">- ${escapeHtml(formatMoney(expense.amount))}</strong><div class="expense-row__actions"><button class="icon-button icon-button--soft" type="button" aria-label="Editar gasto" data-expense-action="edit" data-expense-id="${expense.id}"><svg viewBox="0 0 24 24" fill="none"><path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20Z"></path><path d="m12.5 7 4.5 4.5"></path></svg></button><button class="icon-button icon-button--soft" type="button" aria-label="Duplicar gasto" data-expense-action="duplicate" data-expense-id="${expense.id}"><svg viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"></path></svg></button><button class="icon-button icon-button--soft" type="button" aria-label="Eliminar gasto" data-expense-action="delete" data-expense-id="${expense.id}"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7.5h16"></path><path d="M9.5 10.5v6"></path><path d="M14.5 10.5v6"></path><path d="M6.5 7.5 7.4 19a2 2 0 0 0 2 1.8h5.2a2 2 0 0 0 2-1.8l.9-11.5"></path><path d="M9 7.5V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8v1.7"></path></svg></button></div></div></article>`;
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

const getExportBaseFilename = (metrics) => `aleclv-expense-tracker-${metrics.activeMonthKey}`;

const renderExportState = (metrics, context) => {
  setTextValue(exportSummary, `${context.visibleExpenses.length} gasto(s) listos para exportar`);
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

const renderDashboard = (animate = false) => {
  const state = getState();
  const metrics = computeMetrics(state);
  const context = getVisibleExpensesContext(state, metrics);

  renderPeriod(metrics);
  renderSidebar(metrics, animate);
  renderHero(metrics, animate);
  renderSplitCard(metrics, animate);
  renderKpis(metrics, animate);
  renderIncomeCard(metrics, animate);
  renderCategoryMix(metrics, animate);
  renderLineChart(metrics);
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
  expenseForm?.reset();
  incomeForm?.reset();

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

const updateIncomePreview = () => {
  const total = roundCurrency(Number(incomeBaseInput?.value || 0) + Number(incomeExtraInput?.value || 0));
  animateValue(incomeTotalPreview, total, { animate: false });
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

const openExpenseModal = (mode, expense = null) => {
  if (!expenseForm || !modalTitle || !modalEyebrow || !modalCopy || !formSubmit) {
    return;
  }

  uiState.modalMode = mode;
  uiState.activeExpenseId = mode === "edit" ? expense?.id || null : null;
  setModalPanel("form");
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
  setTextValue(confirmCopy, expense.note || "Vas a eliminar este gasto del registro mensual.");
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
  showToast(isEditing ? "Gasto actualizado." : "Gasto agregado.");
};

const handleDeleteExpense = () => {
  if (!uiState.activeExpenseId) {
    return;
  }

  updateState((state) => ({
    expenses: state.expenses.filter((expense) => expense.id !== uiState.activeExpenseId),
  }));
  closeModal();
  renderDashboard(true);
  showToast("Gasto eliminado.");
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
  showToast("Gasto duplicado.");
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

const handleSearchUpdate = (value) => {
  applyFilterPatch({ search: String(value || "").trim() });
};

const exportVisibleExpenses = (format) => {
  const state = getState();
  const metrics = computeMetrics(state);
  const context = getVisibleExpensesContext(state, metrics);

  if (!context.visibleExpenses.length) {
    showToast("No hay gastos visibles para exportar.", "error");
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
  scrollToSection("dashboard");
  showToast("Muestra restaurada.");
};

const setActiveNavItem = (target) => {
  navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.navItem === target));
};

const scrollToSection = (target) => {
  const section = sections[target] || sections.dashboard;

  if (!section) {
    return;
  }

  body.classList.remove("sidebar-open");
  setActiveNavItem(target);
  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: Math.max(0, window.scrollY + section.getBoundingClientRect().top - ((topbar?.offsetHeight || 0) + NAV_SCROLL_OFFSET)),
      behavior: getScrollBehavior(),
    });
  });
};

const initializeInteractions = () => {
  renderDashboard(false);

  if (fab) {
    fab.addEventListener("click", () => openExpenseModal("add"));
  }

  openIncomeButtons.forEach((button) => button.addEventListener("click", openIncomeModal));
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

  confirmDeleteButton?.addEventListener("click", handleDeleteExpense);
  confirmRestoreButton?.addEventListener("click", restoreSampleData);
  clearFiltersButton?.addEventListener("click", resetFilters);
  exportJsonButton?.addEventListener("click", () => exportVisibleExpenses("json"));
  exportCsvButton?.addEventListener("click", () => exportVisibleExpenses("csv"));

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

  menuToggle?.addEventListener("click", () => body.classList.toggle("sidebar-open"));
  backdrop?.addEventListener("click", () => body.classList.remove("sidebar-open"));
  navItems.forEach((item) => item.addEventListener("click", () => scrollToSection(item.dataset.navItem)));
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
