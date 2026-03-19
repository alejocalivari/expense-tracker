const { getDemoState, getState, setState, updateState } = window.aleclvFinanceState;
const { formatCurrency, formatDate, generateId } = window.aleclvFinanceUtils;

const OPERATING_BUFFER = 2240;
const TOAST_TIMEOUT_MS = 2600;

const body = document.body;
const topbar = document.querySelector(".topbar");
const openIncomeButtons = document.querySelectorAll("[data-open-income]");
const modalRestoreButtons = document.querySelectorAll("[data-modal-restore-demo]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const backdrop = document.querySelector("[data-backdrop]");
const navItems = document.querySelectorAll("[data-nav-item]");
const countupElements = document.querySelectorAll(".countup");
const riskOptions = document.querySelectorAll("[data-risk-option]");
const openFilterButtons = document.querySelectorAll("[data-open-filters]");
const openExportButtons = document.querySelectorAll("[data-open-export]");
const searchInput = document.querySelector("[data-search-input]");
const projectionOutput = document.querySelector("[data-projection-output]");
const projectionGain = document.querySelector("[data-projection-gain]");
const projectionLabel = document.querySelector("[data-projection-label]");
const stackedSegments = document.querySelectorAll(".stacked-bar__segment");
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
  investCaption: document.querySelector('[data-summary-text="invest-caption"]'),
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
  lastFocusedElement: null,
  toastTimer: null,
};

const CORE_SPEND_CATEGORIES = new Set(["Housing", "Utilities", "Subscriptions", "Software"]);
const ENTERTAINMENT_CATEGORIES = ["Leisure", "Lifestyle"];
const STATUS_PILL_CLASSES = ["status-pill--positive", "status-pill--neutral", "status-pill--negative"];
const NAV_SCROLL_OFFSET = 20;
const CATEGORY_SWATCHES = [
  { className: "mint", color: "var(--accent)" },
  { className: "blue", color: "var(--accent-blue)" },
  { className: "amber", color: "var(--accent-amber)" },
  { className: "rose", color: "var(--accent-rose)" },
  { className: "slate", color: "var(--accent-slate)" },
];
const INSIGHT_FLAG_TONES = {
  rose: "insight__flag--rose",
  mint: "insight__flag--mint",
  blue: "insight__flag--blue",
};
const SECTION_TARGETS = {
  dashboard: heroSection,
  cashflow: kpiSection,
  investing: investSection,
  activity: activitySection,
  insights: insightsSection,
};

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
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;

const isValidMonthKey = (value) => MONTH_KEY_PATTERN.test(String(value || "").trim());

const getExpenseDate = (expense) => {
  const parsedDate = new Date(expense?.date);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getLatestMonthKey = (expenses = []) => {
  const latestDate = expenses.reduce((latest, expense) => {
    const expenseDate = getExpenseDate(expense);

    if (!expenseDate) {
      return latest;
    }

    return !latest || expenseDate > latest ? expenseDate : latest;
  }, null);

  if (!latestDate) {
    return getCurrentMonthKey();
  }

  return `${latestDate.getFullYear()}-${String(latestDate.getMonth() + 1).padStart(2, "0")}`;
};

const getDefaultFilters = (state = getState()) => ({
  month: getLatestMonthKey(state.expenses),
  category: "all",
  search: "",
});

const normalizeMonthFilterValue = (value, fallbackMonth = getCurrentMonthKey()) =>
  isValidMonthKey(value) ? String(value).trim() : fallbackMonth;

const normalizeCategoryFilterValue = (value) => {
  const normalizedValue = String(value || "").trim();
  return normalizedValue || "all";
};

const normalizeSearchValue = (value) => String(value || "").trim();

const getSearchQuery = (state) => normalizeSearchValue(state.filters.search).toLowerCase();
const hasSearchFilter = (state) => Boolean(getSearchQuery(state));
const hasCategoryFilter = (state) => state.filters.category !== "all";
const hasSecondaryExpenseFilters = (state) => hasCategoryFilter(state) || hasSearchFilter(state);

const getVisibleExpensesContext = (state) => {
  const monthExpenses = getMonthExpenses(state);
  const filteredExpenses = getFilteredExpenses(state);

  return {
    monthExpenses,
    filteredExpenses,
    hasMonthExpenses: monthExpenses.length > 0,
    hasResults: filteredExpenses.length > 0,
    hasSecondaryFilters: hasSecondaryExpenseFilters(state),
  };
};

const escapeCsvValue = (value) => {
  const normalizedValue = String(value ?? "");
  return `"${normalizedValue.replaceAll('"', '""')}"`;
};

const serializeExpensesToJson = (expenses) => JSON.stringify(expenses, null, 2);

const serializeExpensesToCsv = (expenses) => {
  const headers = ["id", "title", "amount", "category", "date", "paymentMethod", "note", "createdAt"];
  const rows = expenses.map((expense) =>
    headers
      .map((header) => {
        const rawValue = header === "amount" ? roundCurrency(Number(expense[header] || 0)) : expense[header] ?? "";
        return escapeCsvValue(rawValue);
      })
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
};

const downloadTextFile = (filename, content, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 0);
};

const getExportBaseFilename = (state) => `aleclv-finance-${getActiveMonthKey(state)}`;

const getResultsLabel = (count) =>
  count === 1 ? "1 expense" : `${formatValue(count, 0)} expenses`;

const showToast = (message, tone = "success") => {
  if (!toast) {
    return;
  }

  if (uiState.toastTimer) {
    window.clearTimeout(uiState.toastTimer);
  }

  toast.textContent = message;
  toast.hidden = false;
  toast.classList.remove("toast--error");

  if (tone === "error") {
    toast.classList.add("toast--error");
  }

  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  uiState.toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => {
      toast.hidden = true;
      uiState.toastTimer = null;
    }, 180);
  }, TOAST_TIMEOUT_MS);
};

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

const getActiveMonthKey = (state) => state.filters.month || getCurrentMonthKey();

const shiftMonthKey = (monthKey, offset) => {
  const [year, month] = monthKey.split("-").map(Number);
  const shiftedDate = new Date(Date.UTC(year, month - 1 + offset, 1, 12));
  return `${shiftedDate.getUTCFullYear()}-${String(shiftedDate.getUTCMonth() + 1).padStart(2, "0")}`;
};

const getDaysInMonth = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
};

const getMonthLabel = (monthKey, options = {}) => {
  const date = new Date(`${monthKey}-01T12:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    ...options,
  }).format(date);
};

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

const getCategoryTotal = (categoryBreakdown, categories) => {
  const categoryNames = Array.isArray(categories) ? categories : [categories];

  return roundCurrency(
    categoryBreakdown.reduce(
      (sum, item) => (categoryNames.includes(item.category) ? sum + Number(item.total || 0) : sum),
      0
    )
  );
};

const getCurrentMonthKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
};

const getLatestExpenseDay = (expenses) =>
  expenses.reduce((latestDay, expense) => {
    const expenseDate = new Date(expense.date);
    return Number.isNaN(expenseDate.getTime()) ? latestDay : Math.max(latestDay, expenseDate.getDate());
  }, 0);

const getElapsedDaysForMonth = (monthKey, expenses) => {
  const currentMonthKey = getCurrentMonthKey();
  const daysInMonth = getDaysInMonth(monthKey);

  if (monthKey === currentMonthKey) {
    return clamp(new Date().getDate(), 1, daysInMonth);
  }

  if (monthKey < currentMonthKey) {
    return daysInMonth;
  }

  return clamp(getLatestExpenseDay(expenses) || 1, 1, daysInMonth);
};

const summarizeMonth = (expenses, income, monthKey) => {
  const daysInMonth = getDaysInMonth(monthKey);
  const elapsedDays = getElapsedDaysForMonth(monthKey, expenses);
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
  const projectedMonthlySpend =
    totalSpent > 0 ? roundCurrency((totalSpent / Math.max(elapsedDays, 1)) * daysInMonth) : 0;
  const projectedEndBalance = roundCurrency(income - projectedMonthlySpend);
  const projectedEndInvestable = roundCurrency(Math.max(projectedEndBalance - OPERATING_BUFFER, 0));
  const targetDailySpend = roundCurrency(Math.max(income - OPERATING_BUFFER, 0) / Math.max(daysInMonth, 1));
  const entertainmentSpend = getCategoryTotal(categoryBreakdown, ENTERTAINMENT_CATEGORIES);

  return {
    monthKey,
    monthLabelLong: getMonthLabel(monthKey),
    monthLabelShort: getMonthLabel(monthKey, { month: "short", year: undefined }),
    monthLabelShortYear: getMonthLabel(monthKey, { month: "short", year: "numeric" }),
    daysInMonth,
    elapsedDays,
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
    projectedMonthlySpend,
    projectedEndBalance,
    projectedEndInvestable,
    targetDailySpend,
    entertainmentSpend,
  };
};

const closeSidebar = () => {
  body.classList.remove("sidebar-open");
};

const getScrollBehavior = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? "auto" : "smooth";

const setActiveNavItem = (target) => {
  navItems.forEach((candidate) => {
    candidate.classList.toggle("is-active", candidate.dataset.navItem === target);
  });
};

const scrollToDashboardSection = (target) => {
  const section = SECTION_TARGETS[target] || SECTION_TARGETS.dashboard;

  if (!section) {
    return;
  }

  closeSidebar();
  setActiveNavItem(target);

  window.requestAnimationFrame(() => {
    const topOffset = (topbar?.offsetHeight || 0) + NAV_SCROLL_OFFSET;
    const nextScrollTop = window.scrollY + section.getBoundingClientRect().top - topOffset;

    window.scrollTo({
      top: Math.max(0, nextScrollTop),
      behavior: getScrollBehavior(),
    });
  });
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
  const activeMonth = normalizeMonthFilterValue(getActiveMonthKey(state), getLatestMonthKey(state.expenses));

  if (!activeMonth) {
    return [...state.expenses];
  }

  return getExpensesForMonth(state, activeMonth);
};

const getFilteredExpenses = (state) => {
  const normalizedSearch = getSearchQuery(state);

  return getMonthExpenses(state)
    .filter((expense) => {
      if (normalizeCategoryFilterValue(state.filters.category) !== "all" && expense.category !== state.filters.category) {
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
    .sort((left, right) => (getExpenseDate(right)?.getTime() || 0) - (getExpenseDate(left)?.getTime() || 0));
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
  const expenseTimestamp = formatExpenseTimestamp(expense.date) || "Date unavailable";

  return `
    <article class="expense-row" data-expense-id="${escapeHtml(expense.id)}">
      <div class="expense-row__merchant">
        <strong>${escapeHtml(expense.title)}</strong>
        <span>${escapeHtml(expenseTimestamp)}</span>
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

const getExpenseEmptyStateMarkup = (state, metrics, context) => {
  if (!state.expenses.length) {
    return `
      <article class="expense-list__empty">
        <strong>No spending tracked yet</strong>
        <p>Start tracking your transactions to unlock live cashflow visibility, smarter alerts, and investment-ready planning.</p>
        <div class="expense-list__actions">
          <button class="button button--accent button--small" type="button" data-list-action="open-add">Add first expense</button>
          <button class="button button--ghost button--small" type="button" data-list-action="restore-demo">Restore demo data</button>
        </div>
      </article>
    `;
  }

  if (!context.hasMonthExpenses) {
    const baselineCopy = state.income > 0
      ? `Your ${formatMoney(state.income)} monthly income baseline is still loaded, but no expenses have posted for this period yet.`
      : "Add a monthly income baseline and a few transactions to unlock balance, savings, and investment projections.";

    return `
      <article class="expense-list__empty">
        <strong>No activity recorded for ${escapeHtml(metrics.monthLabelLong)}</strong>
        <p>${escapeHtml(baselineCopy)}</p>
        <div class="expense-list__actions">
          <button class="button button--ghost button--small" type="button" data-list-action="open-filters">Choose another month</button>
        </div>
      </article>
    `;
  }

  return `
    <article class="expense-list__empty">
      <strong>No expenses match the current view</strong>
      <p>Broaden the search or clear the category filter to bring matching activity back into view.</p>
      <div class="expense-list__actions">
        <button class="button button--ghost button--small" type="button" data-list-action="clear-filters">Clear filters</button>
        <button class="button button--ghost button--small" type="button" data-list-action="open-filters">Refine filters</button>
      </div>
    </article>
  `;
};

const renderExpenseList = (state, metrics) => {
  if (!expenseList) {
    return;
  }

  const context = getVisibleExpensesContext(state);

  if (!context.filteredExpenses.length) {
    expenseList.innerHTML = getExpenseEmptyStateMarkup(state, metrics, context);
    return;
  }

  expenseList.innerHTML = context.filteredExpenses.map(renderExpenseRow).join("");
};

const renderFilterControls = (state, metrics) => {
  const visibleContext = getVisibleExpensesContext(state);
  const defaultFilters = getDefaultFilters(state);

  if (searchInput && searchInput.value !== state.filters.search) {
    searchInput.value = state.filters.search;
  }

  if (filterMonthInput) {
    filterMonthInput.value = normalizeMonthFilterValue(state.filters.month, defaultFilters.month);
  }

  if (filterCategoryInput) {
    filterCategoryInput.value = normalizeCategoryFilterValue(state.filters.category);
  }

  setTextValue(
    filterSearchPreview,
    hasSearchFilter(state) ? `"${state.filters.search}"` : "No search applied"
  );
  setTextValue(
    filterResultsCopy,
    visibleContext.hasResults
      ? `${getResultsLabel(visibleContext.filteredExpenses.length)} visible in ${metrics.monthLabelShortYear}.`
      : visibleContext.hasMonthExpenses
        ? `No visible activity in ${metrics.monthLabelShortYear} for the active search and category filters.`
        : `No activity exists in ${metrics.monthLabelShortYear} yet.`
  );
};

const renderExportState = (state, metrics) => {
  const { filteredExpenses } = getVisibleExpensesContext(state);
  const baseFilename = getExportBaseFilename(state);

  setTextValue(exportSummary, `${getResultsLabel(filteredExpenses.length)} ready to export`);
  setTextValue(exportFilename, `${baseFilename}.csv / ${baseFilename}.json`);
  setTextValue(
    exportCopy,
    filteredExpenses.length
      ? `This export reflects the visible ${metrics.monthLabelShortYear} dataset currently shown in the dashboard.`
      : `There are no visible expenses to export for ${metrics.monthLabelShortYear}.`
  );

  if (exportJsonButton) {
    exportJsonButton.disabled = filteredExpenses.length === 0;
  }

  if (exportCsvButton) {
    exportCsvButton.disabled = filteredExpenses.length === 0;
  }
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
    state.income > 0 ? "User-set baseline" : "Set baseline"
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
    state.income > 0
      ? `Monthly income baseline currently driving ${metrics.monthLabelShort} balance and savings projections.`
      : "Set a monthly income baseline to unlock balance, savings, and investable cash."
  );
  setTextValue(
    kpiCaptionElements.totalSpent,
    metrics.transactionCount > 0
      ? `${metrics.transactionCount} transactions across ${metrics.activeCategoryCount} categories.`
      : `No expenses posted in ${metrics.monthLabelShort} yet.`
  );
  setTextValue(
    kpiCaptionElements.remainingBalance,
    state.income > 0
      ? `Income minus ${formatMoney(metrics.totalSpent)} in spending.`
      : "Remaining balance needs an income baseline."
  );
  setTextValue(
    kpiCaptionElements.investableSurplus,
    state.income > 0
      ? `After holding ${formatMoney(OPERATING_BUFFER)} in operating cash.`
      : "Add income before deployable capital can be projected."
  );
  setTextValue(
    kpiCaptionElements.dailyAverage,
    metrics.transactionCount > 0
      ? `Average across ${metrics.daysInMonth} days in ${metrics.monthLabelShort}.`
      : `No daily spend pace in ${metrics.monthLabelShort} yet.`
  );
  setTextValue(
    kpiCaptionElements.savingsRate,
    state.income > 0
      ? `You kept ${formatMoney(metrics.remainingBalance)} of ${formatMoney(state.income)}.`
      : "Savings rate appears once income is set."
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
    state.income > 0
      ? `Remaining from ${formatMoney(state.income)} income after ${formatMoney(metrics.totalSpent)} across ${metrics.transactionCount} posted expenses.`
      : `No income baseline is set yet. ${formatMoney(metrics.totalSpent)} in spending is currently tracked in this workspace.`
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
      : "No expenses posted yet"
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
    state.income > 0
      ? `Built from ${metrics.transactionCount} posted expenses against a ${formatMoney(state.income)} monthly income baseline.`
      : `Add income to turn spending activity into balance, reserve, and investment planning.`
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
  const lineLabel = metrics.transactionCount === 0
    ? `No spend pace in ${metrics.monthLabelShort}`
    : metrics.hasPreviousBaseline
      ? `${formatSignedPercent(metrics.comparisons.dailyAverageChange)} vs ${metrics.previousMonthLabelShort} pace`
      : `No ${metrics.previousMonthLabelShort} baseline`;

  applyStatusPill(
    statusElements.line,
    lineLabel,
    getTrendTone(metrics.comparisons.dailyAverageChange, { lowerIsBetter: true })
  );
};

const calculateInvestmentPlan = (profileName, metrics) => {
  const normalizedProfileName = profileMeta[profileName] ? profileName : "balanced";
  const activeProfile = profileMeta[normalizedProfileName];
  const monthlyInvestable = metrics.investableSurplus;
  const yearlyContribution = roundCurrency(monthlyInvestable * 12);
  const futureValue = roundCurrency(calculateFutureValue(monthlyInvestable, activeProfile.annualRate));
  const projectedGrowth = roundCurrency(futureValue - yearlyContribution);

  return {
    profileName: normalizedProfileName,
    ...activeProfile,
    monthlyInvestable,
    yearlyContribution,
    futureValue,
    projectedGrowth,
    annualRatePercent: Math.round(activeProfile.annualRate * 100),
  };
};

const renderInvestmentPlan = (investmentPlan, metrics, income, animate = false) => {
  const {
    profileName,
    label,
    split,
    monthlyInvestable,
    yearlyContribution,
    futureValue,
    projectedGrowth,
  } = investmentPlan;

  riskOptions.forEach((option) => {
    const isActive = option.dataset.profile === profileName;
    option.classList.toggle("is-active", isActive);
    option.setAttribute("aria-pressed", String(isActive));
  });

  if (projectionLabel) {
    projectionLabel.textContent = label;
  }

  if (stackedSegments.length >= 2) {
    stackedSegments[0].style.width = `${split[0]}%`;
    stackedSegments[1].style.width = `${split[1]}%`;
  }

  setTextValue(
    textElements.investCaption,
    income > 0
      ? monthlyInvestable > 0
        ? metrics.coreSpend > 0
          ? `Based on ${formatMoney(metrics.remainingBalance)} free cash with ${formatValue(metrics.reserveRunwayMonths, 1)} months of reserve runway still protected.`
          : `Based on ${formatMoney(metrics.remainingBalance)} free cash after current month spending and reserve targets.`
        : "No deployable capital yet. Reduce flexible spending or raise income to reopen your monthly investment lane."
      : "Add monthly income to model deployable capital and 12-month investment projections."
  );
  setMetricValue(summaryElements.investableAmount, monthlyInvestable, animate);
  setMetricValue(summaryElements.monthlyInvestable, monthlyInvestable, animate);
  setMetricValue(summaryElements.yearlyInvestable, yearlyContribution, animate);
  setMetricValue(projectionOutput, futureValue, animate);
  setMetricValue(projectionGain, projectedGrowth, animate);
};

const createInsight = ({ key, priority, flag, tone, title, body, meta }) => ({
  key,
  priority,
  flag,
  tone,
  title,
  body,
  meta,
});

const calculateMonthlyOpportunityValue = (monthlyAmount, annualRate) =>
  roundCurrency(calculateFutureValue(monthlyAmount, annualRate));

const generateInsights = (state, metrics, investmentPlan) => {
  const insights = [];
  if (metrics.transactionCount === 0) {
    if (state.income > 0) {
      return [
        createInsight({
          key: "no-activity",
          priority: 100,
          flag: "Tracking",
          tone: "blue",
          title: `No spending has been recorded for ${metrics.monthLabelLong} yet.`,
          body: `${formatMoney(state.income)} of monthly income is still unallocated in this view.`,
          meta: investmentPlan.monthlyInvestable > 0
            ? `${formatMoney(investmentPlan.monthlyInvestable)} is currently available to invest once real activity starts posting.`
            : "Add transactions to turn this dashboard into a live operating and investment plan.",
        }),
        createInsight({
          key: "add-activity",
          priority: 96,
          flag: "Flow",
          tone: "mint",
          title: "Your dashboard is ready for the first real transaction.",
          body: "Once spending starts flowing in, aleclv finance will surface category drift, pace risk, and opportunity cost automatically.",
          meta: "Use the add expense action to start building a real monthly baseline.",
        }),
      ];
    }

    return [
      createInsight({
        key: "no-income",
        priority: 100,
        flag: "Setup",
        tone: "mint",
        title: "Add income and expenses to unlock financial guidance.",
        body: "The dashboard is stable, but savings, investable capital, and pace insights need a monthly income baseline and activity data.",
        meta: "Start with one income baseline and your first expense to activate projections.",
      }),
    ];
  }

  const mostIncreasedCategory = metrics.hasPreviousBaseline
    ? metrics.categoryBreakdown
        .map((category) => {
          const previousTotal = getCategoryTotal(metrics.previousMonth.categoryBreakdown, category.category);
          const delta = roundCurrency(category.total - previousTotal);
          const change = previousTotal > 0 ? getPercentageChange(category.total, previousTotal, true) : null;

          return {
            ...category,
            previousTotal,
            delta,
            change,
          };
        })
        .filter(
          (category) =>
            category.previousTotal > 0 &&
            category.delta > 25 &&
            Number.isFinite(category.change)
        )
        .sort((left, right) => right.delta - left.delta || right.change - left.change)[0] || null
    : null;
  const entertainmentReduction = roundCurrency(metrics.entertainmentSpend * 0.1);
  const entertainmentPlanValue = calculateMonthlyOpportunityValue(
    entertainmentReduction,
    investmentPlan.annualRate
  );
  const topCategoryOpportunityValue = calculateMonthlyOpportunityValue(
    Math.max(mostIncreasedCategory?.delta || 0, 0),
    investmentPlan.annualRate
  );
  const savingsRateChange = metrics.comparisons.savingsRateChange;

  if (mostIncreasedCategory) {
    insights.push(
      createInsight({
        key: "category-compare",
        priority: 100,
        flag: mostIncreasedCategory.category,
        tone: "rose",
        title: `You spent ${formatValue(Math.abs(mostIncreasedCategory.change), 1)}% more on ${mostIncreasedCategory.category} than last month.`,
        body: `${formatMoney(mostIncreasedCategory.delta)} more than ${metrics.previousMonthLabelShort} - that could have been added to your monthly investment plan.`,
        meta: `Repeated monthly, that change would project to ${formatMoney(topCategoryOpportunityValue)} in 12 months at ${investmentPlan.annualRatePercent}%.`,
      })
    );
  }

  if (metrics.topCategory) {
    insights.push(
      createInsight({
        key: "top-category",
        priority: metrics.hasPreviousBaseline ? 70 : 92,
        flag: metrics.topCategory.category,
        tone: "blue",
        title: `${metrics.topCategory.category} is your top spending category this month.`,
        body: `${formatMoney(metrics.topCategory.total)} or ${formatValue(metrics.topCategory.share, 1)}% of current monthly spend.`,
        meta: "This is the fastest category to tighten if you want to create more investable cash.",
      })
    );
  }

  if (metrics.hasPreviousBaseline && Number.isFinite(savingsRateChange) && Math.abs(savingsRateChange) >= 0.5) {
    const savingsDirection = savingsRateChange >= 0 ? "improved" : "declined";

    insights.push(
      createInsight({
        key: "savings-rate",
        priority: savingsRateChange > 0 ? 96 : 82,
        flag: "Savings",
        tone: savingsRateChange > 0 ? "mint" : "blue",
        title: `Your savings rate ${savingsDirection} by ${formatValue(Math.abs(savingsRateChange), 1)} points vs ${metrics.previousMonthLabelShort}.`,
        body: `You are keeping ${formatMoney(metrics.remainingBalance)} from this month's ${formatMoney(state.income)} income.`,
        meta:
          savingsRateChange > 0
            ? "Protect the improvement by routing it into your monthly investment plan before spend expands."
            : "Recovering even one point restores meaningful monthly free cash for investing.",
      })
    );
  }

  if (investmentPlan.monthlyInvestable > 0) {
    insights.push(
      createInsight({
        key: "investable-now",
        priority: 98,
        flag: "Investing",
        tone: "mint",
        title: `You still have ${formatMoney(investmentPlan.monthlyInvestable)} available to invest.`,
        body: `At your current pace, month-end investable cash trends toward ${formatMoney(metrics.projectedEndInvestable)}.`,
        meta: `${formatMoney(investmentPlan.monthlyInvestable)}/month projects to ${formatMoney(investmentPlan.futureValue)} in 12 months at ${investmentPlan.annualRatePercent}%.`,
      })
    );
  } else {
    insights.push(
      createInsight({
        key: "investable-gap",
        priority: 94,
        flag: "Investing",
        tone: "mint",
        title: "There is no deployable capital available right now.",
        body: `At your current pace, month-end spending projects to ${formatMoney(metrics.projectedMonthlySpend)}.`,
        meta: state.income > 0
          ? `Holding spend near ${formatMoney(metrics.targetDailySpend)}/day helps reopen your investment lane.`
          : "Add income first, then use spending controls to reopen your investment lane.",
      })
    );
  }

  if (metrics.entertainmentSpend > 0) {
    insights.push(
      createInsight({
        key: "entertainment-cut",
        priority: 88,
        flag: "Entertainment",
        tone: "blue",
        title: `Reducing Entertainment by 10% would free up ${formatMoney(entertainmentReduction)} monthly.`,
        body: `That would lift your investable amount to ${formatMoney(metrics.investableSurplus + entertainmentReduction)} this cycle.`,
        meta: `Repeated monthly, that shift would project to ${formatMoney(entertainmentPlanValue)} in 12 months at ${investmentPlan.annualRatePercent}%.`,
      })
    );
  }

  if (metrics.transactionCount > 0 && metrics.elapsedDays < metrics.daysInMonth) {
    insights.push(
      createInsight({
        key: "spend-pace",
        priority: 84,
        flag: "Pace",
        tone: "blue",
        title: `Your current pace projects ${formatMoney(metrics.projectedMonthlySpend)} of monthly spending.`,
        body: `That would leave ${formatMoney(metrics.projectedEndInvestable)} available to invest by month end.`,
        meta: `Keeping spend near ${formatMoney(metrics.targetDailySpend)}/day preserves the current reserve target.`,
      })
    );
  }

  const rankedInsights = insights
    .sort((left, right) => right.priority - left.priority)
    .filter(
      (insight, index, list) =>
        list.findIndex((candidate) => candidate.key === insight.key) === index
    );

  return rankedInsights.slice(0, 3);
};

const renderInsights = (insights) => {
  if (!insightList) {
    return;
  }

  insightList.innerHTML = insights
    .map((insight) => {
      const toneClass = INSIGHT_FLAG_TONES[insight.tone] || INSIGHT_FLAG_TONES.blue;

      return `
        <article class="insight">
          <div class="insight__flag ${toneClass}">${escapeHtml(insight.flag)}</div>
          <div>
            <strong>${escapeHtml(insight.title)}</strong>
            <p>${escapeHtml(insight.body)}</p>
            <span class="insight__meta">${escapeHtml(insight.meta)}</span>
          </div>
        </article>
      `;
    })
    .join("");
};

const renderDashboard = (animate = false) => {
  const state = getState();
  const metrics = computeDashboardMetrics(state);
  const investmentPlan = calculateInvestmentPlan(state.selectedInvestmentProfile, metrics);
  const insights = generateInsights(state, metrics, investmentPlan);

  renderPeriod(metrics);
  renderFilterControls(state, metrics);
  renderExpenseList(state, metrics);
  renderExportState(state, metrics);
  renderKpis(state, metrics, animate);
  renderKpiMeta(state, metrics);
  renderSummaries(metrics, animate);
  renderSidebar(metrics, animate);
  renderHero(state, metrics, animate);
  renderPlanner(state, metrics, animate);
  renderCategoryMix(metrics);
  renderLineStatus(metrics);
  renderInvestmentPlan(investmentPlan, metrics, state.income, animate);
  renderInsights(insights);
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

const clearIncomeFeedback = () => {
  if (incomeFeedback) {
    incomeFeedback.textContent = "";
  }
};

const applyFilterPatch = (patch) => {
  updateState({
    filters: patch,
  });
  renderDashboard(false);
};

const resetFilters = () => {
  updateState((currentState) => ({
    filters: getDefaultFilters(currentState),
  }));
  renderDashboard(false);
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
  closeSidebar();

  if (focusTarget instanceof HTMLElement) {
    window.requestAnimationFrame(() => {
      focusTarget.focus();
    });
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

  if (expenseForm) {
    expenseForm.reset();
  }

  if (incomeForm) {
    incomeForm.reset();
  }

  if (uiState.lastFocusedElement instanceof HTMLElement) {
    window.requestAnimationFrame(() => {
      uiState.lastFocusedElement.focus();
    });
  }

  uiState.lastFocusedElement = null;
};

const getExpenseById = (expenseId) =>
  getState().expenses.find((expense) => expense.id === expenseId) || null;

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
  const exportFocusTarget = !exportCsvButton?.disabled
    ? exportCsvButton
    : !exportJsonButton?.disabled
      ? exportJsonButton
      : modalCloseButton;

  openModal(exportFocusTarget);
};

const openRestoreModal = () => {
  uiState.modalMode = "restore";
  setModalPanel("reset");
  openModal(confirmRestoreButton || modalCloseButton);
};

const openIncomeModal = () => {
  if (!incomeForm || !incomeInput) {
    return;
  }

  uiState.modalMode = "income";
  setModalPanel("income");
  clearIncomeFeedback();
  incomeForm.reset();
  incomeInput.value = String(roundCurrency(getState().income));
  openModal(incomeInput);
};

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

const validateIncomeValue = (rawValue, value) => {
  if (!rawValue) {
    return "Enter a monthly income amount.";
  }

  if (!Number.isFinite(value)) {
    return "Enter a valid monthly income amount.";
  }

  if (value < 0) {
    return "Monthly income cannot be negative.";
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

const handleIncomeSubmit = (event) => {
  event.preventDefault();

  if (!incomeForm) {
    return;
  }

  const formData = new FormData(incomeForm);
  const rawIncome = String(formData.get("income") || "").trim();
  const submittedIncome = roundCurrency(Number(rawIncome));
  const validationMessage = validateIncomeValue(rawIncome, submittedIncome);

  if (validationMessage) {
    if (incomeFeedback) {
      incomeFeedback.textContent = validationMessage;
    }
    return;
  }

  updateState({
    income: submittedIncome,
  });

  closeModal();
  renderDashboard(true);
  showToast("Monthly income updated.");
};

const handleSearchUpdate = (value) => {
  const currentState = getState();
  const normalizedSearch = normalizeSearchValue(value);
  const shouldRevealActivity = Boolean(normalizedSearch) && !hasSearchFilter(currentState);

  applyFilterPatch({
    search: normalizedSearch,
  });

  if (shouldRevealActivity) {
    scrollToDashboardSection("activity");
  }
};

const handleMonthFilterUpdate = (value) => {
  const state = getState();
  applyFilterPatch({
    month: normalizeMonthFilterValue(value, getDefaultFilters(state).month),
  });
};

const handleCategoryFilterUpdate = (value) => {
  applyFilterPatch({
    category: normalizeCategoryFilterValue(value),
  });
};

const exportVisibleExpenses = (format) => {
  const state = getState();
  const { filteredExpenses } = getVisibleExpensesContext(state);

  if (!filteredExpenses.length) {
    showToast("No visible expenses to export for the current view.", "error");
    return;
  }

  const baseFilename = getExportBaseFilename(state);
  const content = format === "json"
    ? serializeExpensesToJson(filteredExpenses)
    : serializeExpensesToCsv(filteredExpenses);
  const extension = format === "json" ? "json" : "csv";
  const mimeType = format === "json" ? "application/json;charset=utf-8" : "text/csv;charset=utf-8";

  downloadTextFile(`${baseFilename}.${extension}`, content, mimeType);
  closeModal();
  showToast(`${format.toUpperCase()} export ready for ${getResultsLabel(filteredExpenses.length)}.`);
};

const restoreDemoData = () => {
  setState(getDemoState());
  closeModal();
  renderDashboard(true);
  scrollToDashboardSection("dashboard");
  showToast("Demo activity restored.");
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

  openIncomeButtons.forEach((button) => {
    button.addEventListener("click", openIncomeModal);
  });

  openFilterButtons.forEach((button) => {
    button.addEventListener("click", openFiltersModal);
  });

  openExportButtons.forEach((button) => {
    button.addEventListener("click", openExportModal);
  });

  modalCloseTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeModal);
  });

  if (expenseForm) {
    expenseForm.addEventListener("submit", handleExpenseSubmit);
    expenseForm.addEventListener("input", clearFormFeedback);
    expenseForm.addEventListener("change", clearFormFeedback);
  }

  if (incomeForm) {
    incomeForm.addEventListener("submit", handleIncomeSubmit);
    incomeForm.addEventListener("input", clearIncomeFeedback);
    incomeForm.addEventListener("change", clearIncomeFeedback);
  }

  if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener("click", handleDeleteExpense);
  }

  if (confirmRestoreButton) {
    confirmRestoreButton.addEventListener("click", restoreDemoData);
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      handleSearchUpdate(event.target.value);
    });
  }

  if (filterMonthInput) {
    filterMonthInput.addEventListener("change", (event) => {
      handleMonthFilterUpdate(event.target.value);
    });
  }

  if (filterCategoryInput) {
    filterCategoryInput.addEventListener("change", (event) => {
      handleCategoryFilterUpdate(event.target.value);
    });
  }

  if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", resetFilters);
  }

  if (filterForm) {
    filterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      closeModal();
    });
  }

  if (exportJsonButton) {
    exportJsonButton.addEventListener("click", () => {
      exportVisibleExpenses("json");
    });
  }

  if (exportCsvButton) {
    exportCsvButton.addEventListener("click", () => {
      exportVisibleExpenses("csv");
    });
  }

  modalRestoreButtons.forEach((button) => {
    button.addEventListener("click", openRestoreModal);
  });

  if (expenseList) {
    expenseList.addEventListener("click", (event) => {
      const listActionTrigger = event.target.closest("[data-list-action]");

      if (listActionTrigger) {
        const action = listActionTrigger.dataset.listAction;

        if (action === "clear-filters") {
          resetFilters();
        } else if (action === "open-filters") {
          openFiltersModal();
        } else if (action === "restore-demo") {
          openRestoreModal();
        } else if (action === "open-add") {
          openExpenseModal("add");
        }

        return;
      }

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

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    scrollToDashboardSection(item.dataset.navItem);
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1120) {
    closeSidebar();
  }
});
