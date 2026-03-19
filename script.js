const { getState, updateState } = window.aleclvFinanceState;
const { formatCurrency, formatDate, generateId } = window.aleclvFinanceUtils;

const OPERATING_BUFFER = 2240;

const body = document.body;
const emptyToggle = document.querySelector("[data-empty-toggle]");
const restoreButtons = document.querySelectorAll("[data-restore]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const backdrop = document.querySelector("[data-backdrop]");
const navItems = document.querySelectorAll("[data-nav-item]");
const countupElements = document.querySelectorAll(".countup");
const riskOptions = document.querySelectorAll("[data-risk-option]");
const projectionOutput = document.querySelector("[data-projection-output]");
const projectionGain = document.querySelector("[data-projection-gain]");
const projectionLabel = document.querySelector("[data-projection-label]");
const stackedSegments = document.querySelectorAll(".stacked-bar__segment");
const expenseList = document.querySelector("[data-expense-list]");
const fab = document.querySelector(".fab");
const modal = document.querySelector("[data-modal]");
const modalPanels = document.querySelectorAll("[data-modal-panel]");
const modalEyebrow = document.querySelector("[data-modal-eyebrow]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalCopy = document.querySelector("[data-modal-copy]");
const modalCloseTriggers = document.querySelectorAll("[data-modal-close]");
const expenseForm = document.querySelector("[data-expense-form]");
const formFeedback = document.querySelector("[data-form-feedback]");
const formSubmit = document.querySelector("[data-form-submit]");
const confirmDeleteButton = document.querySelector("[data-confirm-delete]");
const confirmTitle = document.querySelector("[data-confirm-title]");
const confirmDate = document.querySelector("[data-confirm-date]");
const confirmCopy = document.querySelector("[data-confirm-copy]");
const confirmAmount = document.querySelector("[data-confirm-amount]");
const donutChart = document.querySelector("[data-donut-chart]");
const categoryLegend = document.querySelector("[data-category-legend]");

const kpiElements = {
  income: document.querySelector('[data-kpi="income"]'),
  totalSpent: document.querySelector('[data-kpi="totalSpent"]'),
  remainingBalance: document.querySelector('[data-kpi="remainingBalance"]'),
  investableSurplus: document.querySelector('[data-kpi="investableSurplus"]'),
  dailyAverage: document.querySelector('[data-kpi="dailyAverage"]'),
  savingsRate: document.querySelector('[data-kpi="savingsRate"]'),
};

const summaryElements = {
  sidebarFreeCash: document.querySelector('[data-summary="sidebar-free-cash"]'),
  heroRemaining: document.querySelector('[data-summary="hero-remaining"]'),
  chartTotalSpent: document.querySelector('[data-summary="chart-total-spent"]'),
  investableAmount: document.querySelector('[data-summary="investable-amount"]'),
  monthlyInvestable: document.querySelector('[data-summary="monthly-investable"]'),
  yearlyInvestable: document.querySelector('[data-summary="yearly-investable"]'),
  sidebarInvestable: document.querySelector('[data-summary="sidebar-investable"]'),
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
  reserveRunway: document.querySelector('[data-summary-text="reserve-runway"]'),
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
  investableSurplus: document.querySelector('[data-kpi-delta="investableSurplus"]'),
  dailyAverage: document.querySelector('[data-kpi-delta="dailyAverage"]'),
  savingsRate: document.querySelector('[data-kpi-delta="savingsRate"]'),
};

const kpiCaptionElements = {
  income: document.querySelector('[data-kpi-caption="income"]'),
  totalSpent: document.querySelector('[data-kpi-caption="totalSpent"]'),
  remainingBalance: document.querySelector('[data-kpi-caption="remainingBalance"]'),
  investableSurplus: document.querySelector('[data-kpi-caption="investableSurplus"]'),
  dailyAverage: document.querySelector('[data-kpi-caption="dailyAverage"]'),
  savingsRate: document.querySelector('[data-kpi-caption="savingsRate"]'),
};

const profileMeta = {
  conservative: {
    annualRate: 0.06,
    label: "Conservative profile at 6% annual return",
    split: [60, 40],
  },
  balanced: {
    annualRate: 0.08,
    label: "Balanced profile at 8% annual return",
    split: [68, 32],
  },
  aggressive: {
    annualRate: 0.1,
    label: "Aggressive profile at 10% annual return",
    split: [78, 22],
  },
};

const uiState = {
  modalMode: null,
  activeExpenseId: null,
};

const CORE_SPEND_CATEGORIES = new Set(["Housing", "Utilities", "Subscriptions", "Software"]);
const STATUS_PILL_CLASSES = ["status-pill--positive", "status-pill--neutral", "status-pill--negative"];
const CATEGORY_SWATCHES = [
  { className: "mint", color: "var(--accent)" },
  { className: "blue", color: "var(--accent-blue)" },
  { className: "amber", color: "var(--accent-amber)" },
  { className: "rose", color: "var(--accent-rose)" },
  { className: "slate", color: "var(--accent-slate)" },
];

let hasAnimatedCountups = false;
let riskToggleInitialized = false;

const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

const formatValue = (value, decimals = 0) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const readDecimals = (element) => Number(element?.dataset.decimals || 0);

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const formatMoney = (value, decimals = 0) =>
  formatCurrency(value, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const getFormField = (name) => expenseForm?.elements.namedItem(name);
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

const formatSignedPercent = (value, decimals = 1) => {
  if (!Number.isFinite(value)) {
    return "n/a";
  }

  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatValue(Math.abs(value), decimals)}%`;
};

const formatSignedPoints = (value, decimals = 1) => {
  if (!Number.isFinite(value)) {
    return "n/a";
  }

  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatValue(Math.abs(value), decimals)} pts`;
};

const getTrendTone = (change, options = {}) => {
  const { lowerIsBetter = false } = options;

  if (!Number.isFinite(change) || Math.abs(change) < 0.05) {
    return "neutral";
  }

  const positiveTrend = lowerIsBetter ? change < 0 : change > 0;
  return positiveTrend ? "positive" : "negative";
};

const getActiveMonthKey = (state) => state.filters.month || new Date().toISOString().slice(0, 7);

const shiftMonthKey = (monthKey, offset) => {
  const [year, month] = monthKey.split("-").map(Number);
  const shiftedDate = new Date(Date.UTC(year, month - 1 + offset, 1, 12));
  return `${shiftedDate.getUTCFullYear()}-${String(shiftedDate.getUTCMonth() + 1).padStart(2, "0")}`;
};

const getDaysInMonth = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
};

const getMonthLabel = (monthKey, options = {}) =>
  formatDate(`${monthKey}-01T12:00:00Z`, {
    month: "long",
    year: "numeric",
    ...options,
  });

const getExpensesForMonth = (state, monthKey) =>
  state.expenses.filter((expense) => expense.date.slice(0, 7) === monthKey);

const getPercentageChange = (currentValue, previousValue, hasBaseline) => {
  if (!hasBaseline || !Number.isFinite(previousValue) || previousValue === 0) {
    return null;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
};

const buildCategoryBreakdown = (expenses, totalSpent) => {
  const totalsByCategory = expenses.reduce((accumulator, expense) => {
    const categoryName = expense.category || "Other";
    const nextTotal = (accumulator[categoryName] || 0) + Number(expense.amount || 0);
    accumulator[categoryName] = roundCurrency(nextTotal);
    return accumulator;
  }, {});

  return Object.entries(totalsByCategory)
    .map(([category, total]) => ({
      category,
      total,
      share: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
    }))
    .sort((left, right) => right.total - left.total);
};

const buildLegendCategories = (categoryBreakdown) => {
  if (categoryBreakdown.length <= 5) {
    return categoryBreakdown;
  }

  const topCategories = categoryBreakdown.slice(0, 4);
  const otherCategories = categoryBreakdown.slice(4);
  const otherTotal = otherCategories.reduce((sum, item) => sum + item.total, 0);
  const otherShare = otherCategories.reduce((sum, item) => sum + item.share, 0);

  return [
    ...topCategories,
    {
      category: "Other",
      total: roundCurrency(otherTotal),
      share: otherShare,
    },
  ];
};

const summarizeMonth = (expenses, income, monthKey) => {
  const daysInMonth = getDaysInMonth(monthKey);
  const totalSpent = roundCurrency(
    expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  );
  const remainingBalance = roundCurrency(income - totalSpent);
  const investableSurplus = roundCurrency(Math.max(remainingBalance - OPERATING_BUFFER, 0));
  const dailyAverage = roundCurrency(totalSpent / Math.max(daysInMonth, 1));
  const savingsRate = income > 0 ? roundCurrency((remainingBalance / income) * 100) : 0;
  const largestExpense =
    expenses.reduce(
      (largest, expense) =>
        !largest || Number(expense.amount || 0) > Number(largest.amount || 0) ? expense : largest,
      null
    ) || null;
  const categoryBreakdown = buildCategoryBreakdown(expenses, totalSpent);
  const topCategory = categoryBreakdown[0] || null;
  const coreSpend = roundCurrency(
    expenses.reduce(
      (sum, expense) =>
        CORE_SPEND_CATEGORIES.has(expense.category)
          ? sum + Number(expense.amount || 0)
          : sum,
      0
    )
  );
  const variableSpend = roundCurrency(Math.max(totalSpent - coreSpend, 0));
  const spentRatio = income > 0 ? (totalSpent / income) * 100 : 0;
  const runwayDays = dailyAverage > 0 ? Math.max(remainingBalance / dailyAverage, 0) : daysInMonth;
  const reserveRunwayMonths = coreSpend > 0 ? Math.max(remainingBalance / coreSpend, 0) : 0;

  return {
    monthKey,
    monthLabelLong: getMonthLabel(monthKey),
    monthLabelShort: getMonthLabel(monthKey, { month: "short", year: undefined }),
    monthLabelShortYear: getMonthLabel(monthKey, { month: "short", year: "numeric" }),
    daysInMonth,
    totalSpent,
    remainingBalance,
    investableSurplus,
    dailyAverage,
    savingsRate,
    transactionCount: expenses.length,
    largestExpense,
    topCategory,
    categoryBreakdown,
    activeCategoryCount: categoryBreakdown.length,
    coreSpend,
    variableSpend,
    spentRatio,
    runwayDays,
    reserveRunwayMonths,
  };
};

const syncEmptyToggle = () => {
  if (!emptyToggle) {
    return;
  }

  const isEmpty = body.classList.contains("show-empty");
  emptyToggle.textContent = isEmpty ? "Back to dashboard" : "Preview empty state";
  emptyToggle.setAttribute("aria-pressed", String(isEmpty));
};

const closeSidebar = () => {
  body.classList.remove("sidebar-open");
};

const getBadgeVariant = (category) => {
  const normalizedCategory = String(category || "").trim().toLowerCase();

  switch (normalizedCategory) {
    case "food":
      return "food";
    case "transport":
      return "transport";
    case "software":
      return "software";
    case "lifestyle":
    case "leisure":
      return "lifestyle";
    case "housing":
      return "housing";
    case "utilities":
      return "utilities";
    case "subscriptions":
      return "subscriptions";
    case "travel":
      return "travel";
    default:
      return "other";
  }
};

const formatExpenseTimestamp = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  return `${datePart} at ${timePart}`;
};

const getMonthExpenses = (state) => {
  const activeMonth = getActiveMonthKey(state);

  if (!activeMonth) {
    return [...state.expenses];
  }

  return getExpensesForMonth(state, activeMonth);
};

const getFilteredExpenses = (state) => {
  const normalizedSearch = state.filters.search.trim().toLowerCase();

  return getMonthExpenses(state)
    .filter((expense) => {
      if (state.filters.category !== "all" && expense.category !== state.filters.category) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [expense.title, expense.category, expense.paymentMethod, expense.note]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    })
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
};

const calculateFutureValue = (monthlyAmount, annualRate, months = 12) => {
  const monthlyRate = annualRate / 12;

  if (monthlyRate === 0) {
    return monthlyAmount * months;
  }

  return monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
};

const computeDashboardMetrics = (state) => {
  const activeMonthKey = getActiveMonthKey(state);
  const previousMonthKey = shiftMonthKey(activeMonthKey, -1);
  const currentMonthExpenses = getExpensesForMonth(state, activeMonthKey);
  const previousMonthExpenses = getExpensesForMonth(state, previousMonthKey);
  const currentMonth = summarizeMonth(currentMonthExpenses, state.income, activeMonthKey);
  const previousMonth = summarizeMonth(previousMonthExpenses, state.income, previousMonthKey);
  const hasPreviousBaseline = previousMonth.transactionCount > 0;

  return {
    ...currentMonth,
    activeMonthKey,
    previousMonthKey,
    previousMonthLabelShort: previousMonth.monthLabelShort,
    previousMonthLabelLong: previousMonth.monthLabelLong,
    previousMonth,
    hasPreviousBaseline,
    comparisons: {
      totalSpentChange: getPercentageChange(
        currentMonth.totalSpent,
        previousMonth.totalSpent,
        hasPreviousBaseline
      ),
      remainingBalanceChange: getPercentageChange(
        currentMonth.remainingBalance,
        previousMonth.remainingBalance,
        hasPreviousBaseline
      ),
      investableSurplusChange: getPercentageChange(
        currentMonth.investableSurplus,
        previousMonth.investableSurplus,
        hasPreviousBaseline && previousMonth.investableSurplus > 0
      ),
      dailyAverageChange: getPercentageChange(
        currentMonth.dailyAverage,
        previousMonth.dailyAverage,
        hasPreviousBaseline
      ),
      savingsRateChange:
        hasPreviousBaseline && Number.isFinite(previousMonth.savingsRate)
          ? currentMonth.savingsRate - previousMonth.savingsRate
          : null,
    },
  };
};

const setCountupText = (element, value) => {
  const decimals = readDecimals(element);
  const prefix = element.dataset.prefix || "";
  const suffix = element.dataset.suffix || "";

  if (prefix === "$" || prefix === "+$" || prefix === "-$") {
    let sign = "";

    if (prefix === "+$") {
      sign = "+";
    } else if (prefix === "-$") {
      sign = "-";
    } else if (value < 0) {
      sign = "-";
    }

    const formattedCurrency = formatCurrency(Math.abs(value), {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    element.textContent = `${sign}${formattedCurrency}${suffix}`;
    return;
  }

  element.textContent = `${prefix}${formatValue(value, decimals)}${suffix}`;
};

const animateCountup = (element, targetValue, options = {}) => {
  if (!element || Number.isNaN(targetValue)) {
    return;
  }

  const duration = options.duration ?? Number(element.dataset.duration || 1200);
  const startValue = options.from ?? Number(element.dataset.currentValue || 0);
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const currentValue = startValue + (targetValue - startValue) * easeOutCubic(progress);

    setCountupText(element, currentValue);

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    element.dataset.currentValue = String(targetValue);
    setCountupText(element, targetValue);
  };

  requestAnimationFrame(tick);
};

const setMetricValue = (element, value, animate = false) => {
  if (!element) {
    return;
  }

  element.dataset.countup = String(value);

  if (animate && hasAnimatedCountups) {
    animateCountup(element, value, {
      from: Number(element.dataset.currentValue || 0),
      duration: 720,
    });
    return;
  }

  element.dataset.currentValue = String(value);
  setCountupText(element, value);
};

const animateInitialCountups = () => {
  if (hasAnimatedCountups) {
    return;
  }

  hasAnimatedCountups = true;

  countupElements.forEach((element, index) => {
    const targetValue = Number(element.dataset.countup);

    animateCountup(element, targetValue, {
      from: 0,
      duration: 980 + index * 36,
    });
  });
};

const renderExpenseRow = (expense) => {
  const badgeVariant = getBadgeVariant(expense.category);

  return `
    <article class="expense-row" data-expense-id="${escapeHtml(expense.id)}">
      <div class="expense-row__merchant">
        <strong>${escapeHtml(expense.title)}</strong>
        <span>${escapeHtml(formatExpenseTimestamp(expense.date))}</span>
      </div>
      <div class="expense-row__meta">
        <span class="badge badge--${escapeHtml(badgeVariant)}">${escapeHtml(expense.category)}</span>
        <span class="expense-row__method">${escapeHtml(expense.paymentMethod)}</span>
      </div>
      <div class="expense-row__side">
        <strong class="expense-row__amount">- ${escapeHtml(formatCurrency(expense.amount))}</strong>
        <div class="expense-row__actions">
          <button class="icon-button icon-button--soft" type="button" aria-label="Edit expense" data-expense-action="edit" data-expense-id="${escapeHtml(expense.id)}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m4 16.5 8.6-8.6 2.5 2.5-8.6 8.6H4v-2.5Z"></path>
              <path d="m11.8 8.7 2-2a2 2 0 0 1 2.8 0l.7.7a2 2 0 0 1 0 2.8l-2 2"></path>
            </svg>
          </button>
          <button class="icon-button icon-button--soft" type="button" aria-label="Delete expense" data-expense-action="delete" data-expense-id="${escapeHtml(expense.id)}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5.5 7.5h13"></path>
              <path d="M9 7.5V5h6v2.5"></path>
              <path d="M8.5 10.5v6"></path>
              <path d="M12 10.5v6"></path>
              <path d="M15.5 10.5v6"></path>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `;
};

const renderExpenseList = (state) => {
  if (!expenseList) {
    return;
  }

  const filteredExpenses = getFilteredExpenses(state);

  if (!filteredExpenses.length) {
    expenseList.innerHTML = `
      <article class="expense-list__empty">
        <strong>No expenses match the current view</strong>
        <p>Add a new transaction to start building your cashflow history.</p>
      </article>
    `;
    return;
  }

  expenseList.innerHTML = filteredExpenses.map(renderExpenseRow).join("");
};

const renderKpis = (state, metrics, animate = false) => {
  setMetricValue(kpiElements.income, state.income, animate);
  setMetricValue(kpiElements.totalSpent, metrics.totalSpent, animate);
  setMetricValue(kpiElements.remainingBalance, metrics.remainingBalance, animate);
  setMetricValue(kpiElements.investableSurplus, metrics.investableSurplus, animate);
  setMetricValue(kpiElements.dailyAverage, metrics.dailyAverage, animate);
  setMetricValue(kpiElements.savingsRate, metrics.savingsRate, animate);
};

const renderPeriod = (metrics) => {
  setTextValue(textElements.periodTitle, `${metrics.monthLabelLong} cashflow dashboard`);
  setTextValue(textElements.periodPill, metrics.monthLabelShortYear);
};

const renderKpiMeta = (state, metrics) => {
  const fallbackLabel = `No ${metrics.previousMonthLabelShort} baseline`;

  setTextValue(
    kpiDeltaElements.income,
    metrics.hasPreviousBaseline ? `Flat vs ${metrics.previousMonthLabelShort}` : "Current baseline"
  );
  setTextValue(
    kpiDeltaElements.totalSpent,
    metrics.hasPreviousBaseline
      ? `${formatSignedPercent(metrics.comparisons.totalSpentChange)} vs ${metrics.previousMonthLabelShort}`
      : fallbackLabel
  );
  setTextValue(
    kpiDeltaElements.remainingBalance,
    metrics.hasPreviousBaseline
      ? `${formatSignedPercent(metrics.comparisons.remainingBalanceChange)} vs ${metrics.previousMonthLabelShort}`
      : fallbackLabel
  );
  setTextValue(
    kpiDeltaElements.investableSurplus,
    metrics.hasPreviousBaseline && Number.isFinite(metrics.comparisons.investableSurplusChange)
      ? `${formatSignedPercent(metrics.comparisons.investableSurplusChange)} vs ${metrics.previousMonthLabelShort}`
      : "Available now"
  );
  setTextValue(
    kpiDeltaElements.dailyAverage,
    metrics.hasPreviousBaseline
      ? `${formatSignedPercent(metrics.comparisons.dailyAverageChange)} vs ${metrics.previousMonthLabelShort}`
      : "Month average"
  );
  setTextValue(
    kpiDeltaElements.savingsRate,
    metrics.hasPreviousBaseline
      ? `${formatSignedPoints(metrics.comparisons.savingsRateChange)} vs ${metrics.previousMonthLabelShort}`
      : `${formatValue(metrics.savingsRate, 1)}% saved`
  );

  setTextValue(
    kpiCaptionElements.income,
    `${metrics.transactionCount} posted expenses tracked in ${metrics.monthLabelShort}.`
  );
  setTextValue(
    kpiCaptionElements.totalSpent,
    `${metrics.transactionCount} transactions across ${metrics.activeCategoryCount} categories.`
  );
  setTextValue(
    kpiCaptionElements.remainingBalance,
    `Income minus ${formatMoney(metrics.totalSpent)} in spending.`
  );
  setTextValue(
    kpiCaptionElements.investableSurplus,
    `After holding ${formatMoney(OPERATING_BUFFER)} in operating cash.`
  );
  setTextValue(
    kpiCaptionElements.dailyAverage,
    `Average across ${metrics.daysInMonth} days in ${metrics.monthLabelShort}.`
  );
  setTextValue(
    kpiCaptionElements.savingsRate,
    `You kept ${formatMoney(metrics.remainingBalance)} of ${formatMoney(state.income)}.`
  );
};

const renderSummaries = (metrics, animate = false) => {
  setMetricValue(summaryElements.sidebarFreeCash, metrics.remainingBalance, animate);
  setMetricValue(summaryElements.heroRemaining, metrics.remainingBalance, animate);
  setMetricValue(summaryElements.chartTotalSpent, metrics.totalSpent, animate);
  setTextValue(
    textElements.reserveRunway,
    metrics.coreSpend > 0
      ? `${formatValue(metrics.reserveRunwayMonths, 1)} months intact`
      : "No core bill baseline"
  );
};

const renderSidebar = (metrics, animate = false) => {
  const sidebarLabel = metrics.hasPreviousBaseline
    ? `${formatSignedPercent(metrics.comparisons.totalSpentChange)} vs ${metrics.previousMonthLabelShort}`
    : `No ${metrics.previousMonthLabelShort} baseline`;

  setMetricValue(summaryElements.sidebarInvestable, metrics.investableSurplus, animate);
  setTextValue(textElements.sidebarSpendRatio, `${formatValue(metrics.spentRatio, 1)}%`);
  setBarWidth(barElements.sidebarSpendRatio, metrics.spentRatio);
  applyStatusPill(
    statusElements.sidebar,
    sidebarLabel,
    getTrendTone(metrics.comparisons.totalSpentChange, { lowerIsBetter: true })
  );
};

const renderHero = (state, metrics, animate = false) => {
  const runwayLabel =
    metrics.transactionCount > 0
      ? `${Math.max(0, Math.round(metrics.runwayDays))} days at current pace`
      : "No spending pace yet";
  const dailyNote = metrics.hasPreviousBaseline
    ? `${formatSignedPercent(metrics.comparisons.dailyAverageChange)} vs ${metrics.previousMonthLabelShort} pace`
    : `Average across ${metrics.daysInMonth} days`;
  const heroLabel = metrics.hasPreviousBaseline
    ? `${formatSignedPercent(metrics.comparisons.remainingBalanceChange)} vs ${metrics.previousMonthLabelShort}`
    : `No ${metrics.previousMonthLabelShort} baseline`;

  applyStatusPill(
    statusElements.hero,
    heroLabel,
    getTrendTone(metrics.comparisons.remainingBalanceChange)
  );
  setTextValue(
    textElements.heroCaption,
    `Remaining from ${formatMoney(state.income)} income after ${formatMoney(metrics.totalSpent)} across ${metrics.transactionCount} posted expenses.`
  );
  setTextValue(labelElements.heroStat1, "Transactions posted");
  setTextValue(textElements.heroStat1Value, `${metrics.transactionCount} this month`);
  setTextValue(labelElements.heroStat2, "Active categories");
  setTextValue(textElements.heroStat2Value, `${metrics.activeCategoryCount} tracked`);
  setTextValue(textElements.heroRunway, runwayLabel);
  setBarWidth(
    barElements.heroRunway,
    metrics.transactionCount > 0 ? (metrics.runwayDays / metrics.daysInMonth) * 100 : 100
  );

  setMetricValue(summaryElements.miniDailyAverage, metrics.dailyAverage, animate);
  setTextValue(textElements.miniDailyNote, dailyNote);

  setTextValue(labelElements.miniSecondary, "Largest expense");
  setMetricValue(
    summaryElements.miniSecondaryValue,
    metrics.largestExpense ? Number(metrics.largestExpense.amount || 0) : 0,
    animate
  );
  setTextValue(
    textElements.miniSecondaryNote,
    metrics.largestExpense
      ? `${metrics.largestExpense.title} - ${formatDate(metrics.largestExpense.date, {
          month: "short",
          day: "numeric",
          year: undefined,
        })}`
      : "No expenses posted"
  );

  setTextValue(labelElements.miniTertiary, "Top category");
  setTextValue(textElements.miniTertiaryValue, metrics.topCategory ? metrics.topCategory.category : "No category");
  setTextValue(
    textElements.miniTertiaryNote,
    metrics.topCategory
      ? `${formatMoney(metrics.topCategory.total)} - ${formatValue(metrics.topCategory.share, 1)}% of spend`
      : "No category mix yet"
  );
};

const renderPlanner = (state, metrics, animate = false) => {
  setTextValue(
    textElements.plannerNote,
    `Built from ${metrics.transactionCount} posted expenses against a ${formatMoney(state.income)} monthly income baseline.`
  );

  setTextValue(labelElements.plannerRow1, "Core bills");
  setMetricValue(summaryElements.plannerRow1Value, metrics.coreSpend, animate);
  setBarWidth(barElements.plannerRow1, state.income > 0 ? (metrics.coreSpend / state.income) * 100 : 0);

  setTextValue(labelElements.plannerRow2, "Flexible spend");
  setMetricValue(summaryElements.plannerRow2Value, metrics.variableSpend, animate);
  setBarWidth(
    barElements.plannerRow2,
    state.income > 0 ? (metrics.variableSpend / state.income) * 100 : 0
  );

  setTextValue(labelElements.plannerRow3, "Investable");
  setMetricValue(summaryElements.plannerRow3Value, metrics.investableSurplus, animate);
  setBarWidth(
    barElements.plannerRow3,
    state.income > 0 ? (metrics.investableSurplus / state.income) * 100 : 0
  );

  setTextValue(textElements.plannerSectionLabel, "Month breakdown");
  setTextValue(textElements.plannerItem1Title, "Transactions posted");
  setTextValue(
    textElements.plannerItem1Subtitle,
    `${metrics.activeCategoryCount} categories active in ${metrics.monthLabelShort}`
  );
  setTextValue(textElements.plannerItem1Value, String(metrics.transactionCount));

  setTextValue(textElements.plannerItem2Title, "Largest expense");
  setTextValue(
    textElements.plannerItem2Subtitle,
    metrics.largestExpense ? metrics.largestExpense.title : "No expenses posted"
  );
  setTextValue(
    textElements.plannerItem2Value,
    metrics.largestExpense ? formatMoney(metrics.largestExpense.amount) : "$0"
  );

  setTextValue(textElements.plannerItem3Title, "Top category");
  setTextValue(
    textElements.plannerItem3Subtitle,
    metrics.topCategory
      ? `${formatMoney(metrics.topCategory.total)} - ${formatValue(metrics.topCategory.share, 1)}% of spend`
      : "No category mix yet"
  );
  setTextValue(
    textElements.plannerItem3Value,
    metrics.topCategory ? metrics.topCategory.category : "No category"
  );
};

const renderCategoryMix = (metrics) => {
  if (!categoryLegend) {
    return;
  }

  const legendCategories = buildLegendCategories(metrics.categoryBreakdown);

  setTextValue(textElements.categoryCountPill, `${metrics.activeCategoryCount} active categories`);

  if (!legendCategories.length) {
    categoryLegend.innerHTML = `
      <div class="legend-item">
        <div class="legend-item__title">
          <span class="legend-swatch legend-swatch--slate"></span>
          <span>No categories yet</span>
        </div>
        <div class="legend-item__value">
          <strong>0%</strong>
          <span>$0</span>
        </div>
      </div>
    `;

    if (donutChart) {
      donutChart.style.background = "";
    }

    return;
  }

  categoryLegend.innerHTML = legendCategories
    .map((item, index) => {
      const swatch = CATEGORY_SWATCHES[index % CATEGORY_SWATCHES.length];
      const shareLabel = `${formatValue(item.share, item.share < 10 ? 1 : 0)}%`;

      return `
        <div class="legend-item">
          <div class="legend-item__title">
            <span class="legend-swatch legend-swatch--${swatch.className}"></span>
            <span>${escapeHtml(item.category)}</span>
          </div>
          <div class="legend-item__value">
            <strong>${escapeHtml(shareLabel)}</strong>
            <span>${escapeHtml(formatMoney(item.total))}</span>
          </div>
        </div>
      `;
    })
    .join("");

  if (donutChart) {
    let cursor = 0;
    const gradientStops = legendCategories.map((item, index) => {
      const swatch = CATEGORY_SWATCHES[index % CATEGORY_SWATCHES.length];
      const start = cursor;
      const end = cursor + item.share;
      cursor = end;
      return `${swatch.color} ${start}% ${end}%`;
    });

    if (cursor < 100) {
      gradientStops.push(`rgba(255, 255, 255, 0.05) ${cursor}% 100%`);
    }

    donutChart.style.background = `conic-gradient(${gradientStops.join(", ")})`;
  }
};

const renderLineStatus = (metrics) => {
  const lineLabel = metrics.hasPreviousBaseline
    ? `${formatSignedPercent(metrics.comparisons.dailyAverageChange)} vs ${metrics.previousMonthLabelShort} pace`
    : `No ${metrics.previousMonthLabelShort} baseline`;

  applyStatusPill(
    statusElements.line,
    lineLabel,
    getTrendTone(metrics.comparisons.dailyAverageChange, { lowerIsBetter: true })
  );
};

const applyProjectionProfile = (profileName, metrics, animate = false) => {
  const activeProfile = profileMeta[profileName] || profileMeta.balanced;
  const monthlyInvestable = metrics.investableSurplus;
  const yearlyContribution = roundCurrency(monthlyInvestable * 12);
  const futureValue = roundCurrency(calculateFutureValue(monthlyInvestable, activeProfile.annualRate));
  const projectedGrowth = roundCurrency(futureValue - yearlyContribution);

  riskOptions.forEach((option) => {
    const isActive = option.dataset.profile === profileName;
    option.classList.toggle("is-active", isActive);
    option.setAttribute("aria-pressed", String(isActive));
  });

  if (projectionLabel) {
    projectionLabel.textContent = activeProfile.label;
  }

  if (stackedSegments.length >= 2) {
    stackedSegments[0].style.width = `${activeProfile.split[0]}%`;
    stackedSegments[1].style.width = `${activeProfile.split[1]}%`;
  }

  setMetricValue(summaryElements.investableAmount, monthlyInvestable, animate);
  setMetricValue(summaryElements.monthlyInvestable, monthlyInvestable, animate);
  setMetricValue(summaryElements.yearlyInvestable, yearlyContribution, animate);
  setMetricValue(projectionOutput, futureValue, animate);
  setMetricValue(projectionGain, projectedGrowth, animate);
};

const renderDashboard = (animate = false) => {
  const state = getState();
  const metrics = computeDashboardMetrics(state);

  renderPeriod(metrics);
  renderExpenseList(state);
  renderKpis(state, metrics, animate);
  renderKpiMeta(state, metrics);
  renderSummaries(metrics, animate);
  renderSidebar(metrics, animate);
  renderHero(state, metrics, animate);
  renderPlanner(state, metrics, animate);
  renderCategoryMix(metrics);
  renderLineStatus(metrics);
  applyProjectionProfile(state.selectedInvestmentProfile, metrics, animate);
};

const setModalPanel = (panelName) => {
  modalPanels.forEach((panel) => {
    panel.hidden = panel.dataset.modalPanel !== panelName;
  });
};

const clearFormFeedback = () => {
  if (formFeedback) {
    formFeedback.textContent = "";
  }
};

const openModal = () => {
  if (!modal) {
    return;
  }

  modal.hidden = false;
  body.classList.add("modal-open");
  closeSidebar();
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

  if (expenseForm) {
    expenseForm.reset();
  }
};

const getExpenseById = (expenseId) =>
  getState().expenses.find((expense) => expense.id === expenseId) || null;

const openExpenseModal = (mode, expense = null) => {
  if (!expenseForm || !modalTitle || !modalEyebrow || !modalCopy || !formSubmit) {
    return;
  }

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

  if (mode === "edit" && expense) {
    modalEyebrow.textContent = "Update transaction";
    modalTitle.textContent = "Edit expense";
    modalCopy.textContent = "Adjust the transaction details and keep the dashboard in sync.";
    formSubmit.textContent = "Save changes";
  } else {
    modalEyebrow.textContent = "Add transaction";
    modalTitle.textContent = "Add expense";
    modalCopy.textContent = "Capture a transaction without leaving the dashboard.";
    formSubmit.textContent = "Save expense";
  }

  window.requestAnimationFrame(() => {
    getFormField("title").focus();
  });
};

const openDeleteModal = (expense) => {
  if (!expense || !confirmDeleteButton || !confirmTitle || !confirmDate || !confirmCopy || !confirmAmount) {
    return;
  }

  uiState.modalMode = "delete";
  uiState.activeExpenseId = expense.id;

  confirmTitle.textContent = expense.title;
  confirmDate.textContent = formatDate(expense.date, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  confirmCopy.textContent = expense.note
    ? expense.note
    : "You are about to delete this transaction from aleclv finance.";
  confirmAmount.textContent = `- ${formatCurrency(expense.amount)}`;

  setModalPanel("confirm");
  openModal();

  window.requestAnimationFrame(() => {
    confirmDeleteButton.focus();
  });
};

const validateExpensePayload = (payload) => {
  if (!payload.title || payload.title.trim().length < 2) {
    return "Add a clear expense title so it is easy to recognize later.";
  }

  if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
    return "Enter an amount greater than zero.";
  }

  if (!payload.category) {
    return "Choose a category for this expense.";
  }

  if (!payload.date || Number.isNaN(new Date(payload.date).getTime())) {
    return "Select a valid transaction date.";
  }

  if (!payload.paymentMethod || payload.paymentMethod.trim().length < 2) {
    return "Add the payment method used for this expense.";
  }

  return "";
};

const buildExpensePayload = () => {
  if (!expenseForm) {
    return null;
  }

  const formData = new FormData(expenseForm);
  const existingExpense = uiState.activeExpenseId ? getExpenseById(uiState.activeExpenseId) : null;
  const submittedDate = String(formData.get("date") || "").trim();
  const expenseId = existingExpense?.id || String(formData.get("id") || "").trim() || generateId();

  return {
    id: expenseId,
    title: String(formData.get("title") || "").trim(),
    amount: roundCurrency(Number(formData.get("amount"))),
    category: String(formData.get("category") || "").trim(),
    date: submittedDate ? `${submittedDate}T12:00:00` : "",
    paymentMethod: String(formData.get("paymentMethod") || "").trim(),
    note: String(formData.get("note") || "").trim(),
    createdAt: existingExpense?.createdAt || new Date().toISOString(),
  };
};

const handleExpenseSubmit = (event) => {
  event.preventDefault();

  const payload = buildExpensePayload();

  if (!payload) {
    return;
  }

  const validationMessage = validateExpensePayload(payload);

  if (validationMessage) {
    if (formFeedback) {
      formFeedback.textContent = validationMessage;
    }
    return;
  }

  updateState((currentState) => {
    if (uiState.modalMode === "edit" && uiState.activeExpenseId) {
      return {
        expenses: currentState.expenses.map((expense) =>
          expense.id === uiState.activeExpenseId
            ? {
                ...expense,
                ...payload,
                id: expense.id,
                createdAt: expense.createdAt,
              }
            : expense
        ),
      };
    }

    return {
      expenses: [payload, ...currentState.expenses],
    };
  });

  closeModal();
  renderDashboard(true);
};

const handleDeleteExpense = () => {
  if (!uiState.activeExpenseId) {
    return;
  }

  updateState((currentState) => ({
    expenses: currentState.expenses.filter((expense) => expense.id !== uiState.activeExpenseId),
  }));

  closeModal();
  renderDashboard(true);
};

const initializeRiskToggle = () => {
  if (riskToggleInitialized) {
    return;
  }

  riskToggleInitialized = true;

  riskOptions.forEach((option) => {
    option.addEventListener("click", () => {
      updateState({
        selectedInvestmentProfile: option.dataset.profile,
      });
      renderDashboard(true);
    });
  });
};

const initializeModals = () => {
  if (fab) {
    fab.addEventListener("click", () => {
      openExpenseModal("add");
    });
  }

  modalCloseTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeModal);
  });

  if (expenseForm) {
    expenseForm.addEventListener("submit", handleExpenseSubmit);
    expenseForm.addEventListener("input", clearFormFeedback);
    expenseForm.addEventListener("change", clearFormFeedback);
  }

  if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener("click", handleDeleteExpense);
  }

  if (expenseList) {
    expenseList.addEventListener("click", (event) => {
      const actionTrigger = event.target.closest("[data-expense-action]");

      if (!actionTrigger) {
        return;
      }

      const expenseId = actionTrigger.dataset.expenseId;
      const expense = getExpenseById(expenseId);

      if (!expense) {
        return;
      }

      if (actionTrigger.dataset.expenseAction === "edit") {
        openExpenseModal("edit", expense);
        return;
      }

      if (actionTrigger.dataset.expenseAction === "delete") {
        openDeleteModal(expense);
      }
    });
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) {
      closeModal();
    }
  });
};

renderDashboard(false);
initializeRiskToggle();
initializeModals();

window.addEventListener("load", () => {
  window.setTimeout(() => {
    body.classList.remove("is-loading");
    body.classList.add("is-ready");
    animateInitialCountups();
  }, 950);
});

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    body.classList.toggle("sidebar-open");
  });
}

if (backdrop) {
  backdrop.addEventListener("click", closeSidebar);
}

if (emptyToggle) {
  syncEmptyToggle();
  emptyToggle.addEventListener("click", () => {
    body.classList.toggle("show-empty");
    closeSidebar();
    syncEmptyToggle();
  });
}

restoreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    body.classList.remove("show-empty");
    syncEmptyToggle();
  });
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.navItem;

    navItems.forEach((candidate) => {
      candidate.classList.toggle("is-active", candidate.dataset.navItem === target);
    });

    closeSidebar();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1120) {
    closeSidebar();
  }
});
