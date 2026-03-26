const { getSampleState, getState, setState, updateState } = window.aleclvExpenseTrackerState;
const {
  translations,
  t: translateText,
} = window.aleclvExpenseTrackerI18n;
const { registerAppEventListeners } = window.aleclvExpenseTrackerEvents;
const {
  prefersReducedMotion,
  clamp,
  roundCurrency,
  escapeHtml,
  normalizeText,
  toSafeNumber,
  readDecimals,
  isValidMonthKey,
  getExpenseDate,
  getMonthKey,
  getCurrentMonthKey,
  getLatestMonthKey,
  shiftMonthKey,
  getYearFromMonthKey,
  getMonthNumberFromMonthKey,
  buildMonthKey,
  isFutureMonthKey,
  getDaysInMonth,
  getRemainingDaysInMonth,
  getSpendTodayAmount,
  formatCurrency,
  formatDate,
  generateId,
} = window.aleclvExpenseTrackerUtils;
const {
  body,
  topbar,
  openIncomeButtons,
  openGoalButtons,
  openInvestmentButtons,
  openExpenseButtons,
  modalRestoreButtons,
  menuToggle,
  backdrop,
  navItems,
  openFilterButtons,
  openImportJsonButtons,
  openImportCsvButtons,
  openExportButtons,
  importJsonInput,
  importCsvInput,
  languageSwitch,
  languageOptionButtons,
  exchangeRateNote,
  searchInput,
  topbarActions,
  topbarEyebrow,
  topbarSearch,
  topbarFilters,
  dashboardMain,
  expenseList,
  expenseResults,
  insightList,
  fab,
  fabLabel,
  modal,
  modalPanels,
  modalCloseButton,
  modalCloseTriggers,
  modalEyebrow,
  modalTitle,
  modalCopy,
  expenseForm,
  incomeForm,
  goalForm,
  formFeedback,
  incomeFeedback,
  goalFeedback,
  formSubmit,
  incomeBaseInput,
  incomeExtraInput,
  incomeTotalPreview,
  incomeMonthLabel,
  goalAmountInput,
  goalLabelInput,
  goalAmountPreview,
  goalLabelPreview,
  confirmDeleteButton,
  confirmTitle,
  confirmDate,
  confirmCopy,
  confirmAmount,
  filterForm,
  filterMonthInput,
  filterCategoryInput,
  filterPaymentMethodInput,
  filterExpenseTypeInput,
  filterSortInput,
  filterSearchPreview,
  filterResultsCopy,
  clearFiltersButton,
  exportJsonButton,
  exportCsvButton,
  exportSummary,
  exportFilename,
  exportCopy,
  confirmRestoreButton,
  toast,
  donutChart,
  categoryLegend,
  lineActualPath,
  lineTargetPath,
  lineAreaPath,
  linePoints,
  lineAxis,
  calendarGrid,
  calendarYearLabel,
  calendarCopy,
  calendarSummaryNote,
  calendarShiftButtons,
  viewSections,
  kpiElements,
  kpiDeltaElements,
  kpiCaptionElements,
  kpiSecondaryElements,
  kpiBarElements,
  kpiCardElements,
  heroCardElement,
  yearSummaryElements,
  summaryElements,
  textElements,
  heroDifferenceCardElement,
  comparisonElements,
  labelElements,
  barElements,
  statusElements,
  stackedSegments,
} = window.aleclvExpenseTrackerDom;

const TOAST_TIMEOUT_MS = 2600;
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;
const DEFAULT_VIEW = "resumen";
const ACTIVE_VIEW_STORAGE_KEY = `${window.aleclvExpenseTrackerStorage?.STORAGE_KEY || "aleclv-salary-planner-state"}:active-view`;
const LANGUAGE_STORAGE_KEY = "app-language";
const CURRENCY_STORAGE_KEY = "app-currency";
const EXCHANGE_RATE_STORAGE_KEY = "exchange-rate-usd-ars";
const EXCHANGE_RATE_TIMESTAMP_STORAGE_KEY = "exchange-rate-usd-ars-timestamp";
const DEFAULT_LANGUAGE = "es";
const DEFAULT_EXCHANGE_RATE_USD_ARS = 1450;
const EXCHANGE_RATE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const EXCHANGE_RATE_REQUEST_TIMEOUT_MS = 8000;
const EXCHANGE_RATE_API_URL = "https://open.er-api.com/v6/latest/USD";
const DEFAULT_CURRENCY_BY_LANGUAGE = {
  es: "ARS",
  en: "USD",
};
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
    showIncomeAction: false,
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
const KPI_FEEDBACK_CLASSES = ["kpi-card--positive", "kpi-card--neutral", "kpi-card--negative"];
const HERO_DIFFERENCE_STATE_CLASSES = ["hero-card__meta-item--positive", "hero-card__meta-item--neutral", "hero-card__meta-item--negative"];
const SAVINGS_CAPACITY_STATES = {
  neutral: { label: "Sin ingreso" },
  excellent: { label: "Excelente" },
  healthy: { label: "Saludable" },
  low: { label: "Bajo" },
};
const DEFAULT_GOAL_LABEL = "Meta mensual de inversion";

const canUseLocalStorage = () => {
  try {
    return typeof window.localStorage !== "undefined";
  } catch (error) {
    return false;
  }
};
const isSupportedLanguage = (value) => Object.prototype.hasOwnProperty.call(DEFAULT_CURRENCY_BY_LANGUAGE, value);
const resolveCurrencyFromLanguage = (language) => DEFAULT_CURRENCY_BY_LANGUAGE[language] || DEFAULT_CURRENCY_BY_LANGUAGE[DEFAULT_LANGUAGE];
const readPersistedLanguage = () => {
  if (!canUseLocalStorage()) {
    return DEFAULT_LANGUAGE;
  }

  try {
    const persistedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupportedLanguage(persistedLanguage)) {
      return persistedLanguage;
    }

    const persistedCurrency = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    return persistedCurrency === "USD" ? "en" : DEFAULT_LANGUAGE;
  } catch (error) {
    return DEFAULT_LANGUAGE;
  }
};
const readPersistedCurrency = (language = readPersistedLanguage()) => resolveCurrencyFromLanguage(language);
const readPersistedExchangeRate = () => {
  if (!canUseLocalStorage()) {
    return DEFAULT_EXCHANGE_RATE_USD_ARS;
  }

  try {
    const persistedRate = Number(window.localStorage.getItem(EXCHANGE_RATE_STORAGE_KEY));
    return Number.isFinite(persistedRate) && persistedRate > 0 ? persistedRate : DEFAULT_EXCHANGE_RATE_USD_ARS;
  } catch (error) {
    return DEFAULT_EXCHANGE_RATE_USD_ARS;
  }
};
const readPersistedExchangeRateTimestamp = () => {
  if (!canUseLocalStorage()) {
    return 0;
  }

  try {
    const persistedTimestamp = Number(window.localStorage.getItem(EXCHANGE_RATE_TIMESTAMP_STORAGE_KEY));
    return Number.isFinite(persistedTimestamp) ? persistedTimestamp : 0;
  } catch (error) {
    return 0;
  }
};
const persistLanguageSettings = (language) => {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, resolveCurrencyFromLanguage(language));
  } catch (error) {
    return;
  }
};
const persistExchangeRate = (rate) => {
  if (!canUseLocalStorage() || !Number.isFinite(rate) || !(rate > 0)) {
    return;
  }

  try {
    window.localStorage.setItem(EXCHANGE_RATE_STORAGE_KEY, String(rate));
    window.localStorage.setItem(EXCHANGE_RATE_TIMESTAMP_STORAGE_KEY, String(Date.now()));
  } catch (error) {
    return;
  }
};
const isExchangeRateCacheFresh = (timestamp) => Number.isFinite(timestamp) && Date.now() - timestamp < EXCHANGE_RATE_CACHE_TTL_MS;
const fetchExchangeRatePayload = async () => {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  let timeoutId = 0;

  try {
    const response = await Promise.race([
      fetch(EXCHANGE_RATE_API_URL, {
        cache: "no-store",
        ...(controller ? { signal: controller.signal } : {}),
      }),
      new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => {
          controller?.abort();
          reject(new Error("exchange-rate-timeout"));
        }, EXCHANGE_RATE_REQUEST_TIMEOUT_MS);
      }),
    ]);

    if (!response.ok) {
      throw new Error("exchange-rate-response");
    }

    return await response.json();
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  }
};
const isValidImportState = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  if (!Array.isArray(value.expenses)) {
    return false;
  }

  if (!value.filters || typeof value.filters !== "object" || Array.isArray(value.filters)) {
    return false;
  }

  const hasIncomeData = ["incomeBase", "income", "incomeExtra"].some((key) => Object.prototype.hasOwnProperty.call(value, key));
  const hasValidExpenses = value.expenses.every((expense) => expense && typeof expense === "object" && !Array.isArray(expense));

  return hasIncomeData && hasValidExpenses;
};
const normalizeImportToken = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
const splitCsvLine = (line = "") => {
  const values = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        currentValue += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (character === "," && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue.trim());
  return values;
};
const parseImportCsvAmount = (value) => {
  const rawValue = String(value || "").trim().replace(/\s/g, "").replace(/\$/g, "");

  if (!rawValue) {
    return null;
  }

  let normalizedValue = rawValue;

  if (normalizedValue.includes(",") && normalizedValue.includes(".")) {
    normalizedValue = normalizedValue.lastIndexOf(",") > normalizedValue.lastIndexOf(".")
      ? normalizedValue.replace(/\./g, "").replace(",", ".")
      : normalizedValue.replace(/,/g, "");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(normalizedValue)) {
    normalizedValue = normalizedValue.replace(/\./g, "");
  } else if (/^\d{1,3}(,\d{3})+$/.test(normalizedValue)) {
    normalizedValue = normalizedValue.replace(/,/g, "");
  } else if (normalizedValue.includes(",")) {
    normalizedValue = normalizedValue.replace(/\./g, "").replace(",", ".");
  }

  const parsedAmount = Number(normalizedValue);
  return Number.isFinite(parsedAmount) ? Math.abs(parsedAmount) : null;
};
const parseImportCsvDate = (value) => {
  const rawValue = String(value || "").trim();
  const buildStableImportedDate = (year, month, day) => {
    const normalizedYear = Number(year);
    const normalizedMonth = Number(month);
    const normalizedDay = Number(day);
    const parsedDate = new Date(normalizedYear, normalizedMonth - 1, normalizedDay, 12);

    if (
      Number.isNaN(parsedDate.getTime())
      || parsedDate.getFullYear() !== normalizedYear
      || parsedDate.getMonth() !== normalizedMonth - 1
      || parsedDate.getDate() !== normalizedDay
    ) {
      return null;
    }

    return `${normalizedYear}-${String(normalizedMonth).padStart(2, "0")}-${String(normalizedDay).padStart(2, "0")}T12:00:00`;
  };

  if (!rawValue) {
    return null;
  }

  const yearMonthDayMatch = rawValue.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);

  if (yearMonthDayMatch) {
    const [, year, month, day] = yearMonthDayMatch;
    return buildStableImportedDate(year, month, day);
  }

  const dayMonthYearMatch = rawValue.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

  if (dayMonthYearMatch) {
    const [, day, month, year] = dayMonthYearMatch;
    return buildStableImportedDate(year, month, day);
  }

  const parsedDate = new Date(rawValue);
  return Number.isNaN(parsedDate.getTime())
    ? null
    : buildStableImportedDate(parsedDate.getFullYear(), parsedDate.getMonth() + 1, parsedDate.getDate());
};
const parseImportCsvFrequency = (value) => {
  const normalizedValue = normalizeImportToken(value);

  if (!normalizedValue) {
    return undefined;
  }

  if (/^fij/.test(normalizedValue)) {
    return true;
  }

  if (/^vari/.test(normalizedValue)) {
    return false;
  }

  return undefined;
};
const buildExpenseFromCsvRow = (row) => {
  const movementType = normalizeImportToken(row.tipo);
  const parsedDate = parseImportCsvDate(row.fecha);
  const parsedAmount = parseImportCsvAmount(row.monto);

  if (!movementType || !parsedDate || parsedAmount === null) {
    return null;
  }

  const isIncomeMovement = /ingres/.test(movementType);
  const isInvestmentMovement = /inver|aport/.test(movementType);
  const isExpenseMovement = /gast/.test(movementType);

  if (!isIncomeMovement && !isInvestmentMovement && !isExpenseMovement) {
    return null;
  }

  const frequency = parseImportCsvFrequency(row.frecuencia);
  const description = String(row.descripcion || "").trim() || (isIncomeMovement ? "Ingreso importado" : "Movimiento importado");

  return {
    title: description,
    amount: isIncomeMovement ? -parsedAmount : parsedAmount,
    category: isInvestmentMovement ? "Inversion" : String(row.categoria || "").trim() || "Otros",
    date: parsedDate,
    paymentMethod: String(row.metodo || "").trim(),
    note: isIncomeMovement ? "Ingreso importado por CSV" : "",
    isFixed: typeof frequency === "boolean" ? frequency : undefined,
  };
};
const parseExpensesFromCsv = (contents) => {
  const lines = String(contents || "")
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return null;
  }

  const normalizedHeaders = splitCsvLine(lines[0]).map(normalizeImportToken);

  if (!["fecha", "tipo", "monto"].every((header) => normalizedHeaders.includes(header))) {
    return null;
  }

  const getValueByHeader = (values, headerName) => {
    const headerIndex = normalizedHeaders.indexOf(headerName);
    return headerIndex >= 0 ? values[headerIndex] || "" : "";
  };

  return lines.slice(1).reduce((expenses, line) => {
    const values = splitCsvLine(line);
    const importedExpense = buildExpenseFromCsvRow({
      fecha: getValueByHeader(values, "fecha"),
      tipo: getValueByHeader(values, "tipo"),
      categoria: getValueByHeader(values, "categoria"),
      descripcion: getValueByHeader(values, "descripcion"),
      monto: getValueByHeader(values, "monto"),
      metodo: getValueByHeader(values, "metodo"),
      frecuencia: getValueByHeader(values, "frecuencia"),
    });

    if (importedExpense) {
      expenses.push(importedExpense);
    }

    return expenses;
  }, []);
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

const uiState = {
  activeView: readPersistedActiveView(),
  currentLanguage: readPersistedLanguage(),
  currentCurrency: readPersistedCurrency(),
  exchangeRateUsdArs: readPersistedExchangeRate(),
  latestMetrics: null,
  categoryLegendItems: [],
  categoryHighlightIndex: -1,
  modalMode: null,
  activeExpenseId: null,
  lastFocusedElement: null,
  toastTimer: null,
};

const getCurrentLanguage = () => (isSupportedLanguage(uiState.currentLanguage) ? uiState.currentLanguage : DEFAULT_LANGUAGE);
const getCurrentCurrency = () => (uiState.currentCurrency === "USD" ? "USD" : "ARS");
const getCurrentLocale = () => translations[getCurrentLanguage()]?.locale || translations[DEFAULT_LANGUAGE].locale;
const getExchangeRateUsdArs = () => {
  const parsedRate = Number(uiState.exchangeRateUsdArs);
  return Number.isFinite(parsedRate) && parsedRate > 0 ? parsedRate : DEFAULT_EXCHANGE_RATE_USD_ARS;
};
const t = (key, replacements = {}) => translateText(key, replacements, { language: getCurrentLanguage(), fallbackLanguage: DEFAULT_LANGUAGE });
const convertMoneyForDisplay = (value) => {
  const safeValue = toSafeNumber(value);
  if (getCurrentCurrency() !== "USD") {
    return safeValue;
  }

  const convertedValue = safeValue / getExchangeRateUsdArs();
  return Number.isFinite(convertedValue) ? convertedValue : 0;
};
const convertMoneyInputToBase = (value) => {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue)) {
    return Number.NaN;
  }

  return roundCurrency(getCurrentCurrency() === "USD" ? parsedValue * getExchangeRateUsdArs() : parsedValue);
};
const getDisplayMoneyInputValue = (value) => String(roundCurrency(convertMoneyForDisplay(value)));
const formatMoney = (value, decimals = 2) => {
  const currency = getCurrentCurrency();
  const resolvedDecimals = currency === "USD" ? 2 : decimals;
  return formatCurrency(convertMoneyForDisplay(value), {
    locale: getCurrentLocale(),
    currency,
    currencyDisplay: currency === "USD" ? "code" : "symbol",
    minimumFractionDigits: resolvedDecimals,
    maximumFractionDigits: resolvedDecimals,
  });
};
const formatNumber = (value, decimals = 0) => toSafeNumber(value).toLocaleString(getCurrentLocale(), {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
});
const formatPercent = (value, decimals = 1) => `${formatNumber(value, decimals)}%`;
const formatSignedCurrency = (value) => `${value > 0 ? "+" : value < 0 ? "-" : ""}${formatMoney(Math.abs(value))}`;
const formatSignedPercent = (value, decimals = 1) => (Number.isFinite(value) ? `${value > 0 ? "+" : value < 0 ? "-" : ""}${formatNumber(Math.abs(value), decimals)}%` : t("status.noBase"));
const formatLocalizedDate = (value, options = {}) => formatDate(value, { locale: getCurrentLocale(), ...options });
const getDisplayGoalLabel = (value = "") => {
  const normalizedValue = normalizeText(value);
  const defaultGoalLabels = [normalizeText(DEFAULT_GOAL_LABEL), normalizeText(translations.en.goal?.defaultLabel || ""), normalizeText(translations.es.goal?.defaultLabel || "")];

  if (!normalizedValue || defaultGoalLabels.includes(normalizedValue)) {
    return t("goal.defaultLabel");
  }

  return String(value).trim();
};
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
const getSavingsCapacityStateLabel = (state) => t(`savingsCapacityStates.${state}`, { }) || t("savingsCapacityStates.low");
const getSavingsCapacityTone = (state) => {
  if (state === "excellent") {
    return "positive";
  }

  if (state === "low") {
    return "negative";
  }

  return "neutral";
};
const getSavingsCapacityHeadline = (metrics) => {
  if (!metrics.totalIncome) {
    return getCurrentLanguage() === "en" ? "There is no recorded income yet." : "Todavia no hay ingreso cargado";
  }

  if (metrics.remainingBalance < 0) {
    return getCurrentLanguage() === "en"
      ? `${getSavingsCapacityStateLabel(metrics.savingsCapacityState)}: you have nothing left to save.`
      : `${getSavingsCapacityStateLabel(metrics.savingsCapacityState)}: no tienes disponible para ahorrar`;
  }

  if (metrics.savingsCapacityState === "excellent") {
    return getCurrentLanguage() === "en"
      ? `${getSavingsCapacityStateLabel(metrics.savingsCapacityState)}: you are saving ${formatPercent(metrics.savingsCapacityPercent, 0)}.`
      : `${getSavingsCapacityStateLabel(metrics.savingsCapacityState)}: estas ahorrando el ${formatPercent(metrics.savingsCapacityPercent, 0)}.`;
  }

  if (metrics.savingsCapacityState === "healthy") {
    return getCurrentLanguage() === "en" ? "Healthy: good savings level." : "Saludable: buen nivel de ahorro.";
  }

  return getCurrentLanguage() === "en" ? "Low: you are spending too much." : "Bajo: estas gastando demasiado.";
};
const getSavingsCapacityInsight = (metrics) => {
  if (!metrics.totalIncome) {
    return getCurrentLanguage() === "en"
      ? "Add this month's income to calculate your savings capacity."
      : "Carga el ingreso del mes para calcular tu capacidad de ahorro.";
  }

  if (metrics.remainingBalance < 0) {
    return getCurrentLanguage() === "en" ? "Low: you are spending too much." : "Bajo: estas gastando demasiado.";
  }

  if (metrics.savingsCapacityState === "excellent") {
    return getCurrentLanguage() === "en"
      ? `Excellent: you are saving ${formatPercent(metrics.savingsCapacityPercent, 0)}.`
      : `Excelente: estas ahorrando el ${formatPercent(metrics.savingsCapacityPercent, 0)}.`;
  }

  if (metrics.savingsCapacityState === "healthy") {
    return getCurrentLanguage() === "en" ? "Healthy: good savings level." : "Saludable: buen nivel de ahorro.";
  }

  return getCurrentLanguage() === "en" ? "Low: you are spending too much." : "Bajo: estas gastando demasiado.";
};
const getSavingsCapacitySecondaryCopy = (metrics) => {
  return getCurrentLanguage() === "en"
    ? `${formatMoney(metrics.savingsCapacityAmount)} available to save`
    : `${formatMoney(metrics.savingsCapacityAmount)} disponibles para ahorrar`;
};
const getSavingsCapacityBadgeCopy = (metrics) => {
  if (!metrics.totalIncome) {
    return t("status.noIncome");
  }

  return getSavingsCapacityStateLabel(metrics.savingsCapacityState);
};
const getMonthLabel = (monthKey, options = {}) => {
  const date = new Date(`${monthKey}-01T12:00:00`);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat(getCurrentLocale(), { month: "long", year: "numeric", ...options }).format(date);
};
const getCalendarMonthLabel = (monthKey) => getMonthLabel(monthKey, { month: "short", year: undefined }).replace(".", "");
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
  const investmentTransactions = expenses.filter((expense) => expense.category === "Inversion");
  const spendingTransactions = expenses.filter((expense) => expense.category !== "Inversion");
  const totalSpent = roundCurrency(spendingTransactions.reduce((sum, expense) => sum + Number(expense.amount || 0), 0));
  const totalInvested = roundCurrency(investmentTransactions.reduce((sum, expense) => sum + Number(expense.amount || 0), 0));
  const fixedSpend = roundCurrency(spendingTransactions.filter((expense) => expense.isFixed).reduce((sum, expense) => sum + Number(expense.amount || 0), 0));
  const variableSpend = roundCurrency(Math.max(totalSpent - fixedSpend, 0));
  const investedThisMonth = totalInvested;
  const investmentTransactionsCount = investmentTransactions.length;
  const expenseTransactionCount = spendingTransactions.length;
  const remainingBalance = roundCurrency(incomeTotal - totalSpent);
  const liquidityFinal = roundCurrency(remainingBalance - investedThisMonth);
  const savingsCapacityAmount = roundCurrency(Math.max(remainingBalance, 0));
  const daysInMonth = getDaysInMonth(monthKey);
  const elapsedDays = getElapsedDaysForMonth(monthKey, expenses);
  const dailyAverage = roundCurrency(totalSpent / Math.max(elapsedDays, 1));
  const spentRatio = incomeTotal > 0 ? (totalSpent / incomeTotal) * 100 : 0;
  const savingsRate = incomeTotal > 0 ? (remainingBalance / incomeTotal) * 100 : 0;
  const largestExpense = spendingTransactions.reduce((largest, expense) => {
    if (!largest || Number(expense.amount || 0) > Number(largest.amount || 0)) {
      return expense;
    }

    return largest;
  }, null);
  const categoryBreakdown = buildCategoryBreakdown(spendingTransactions, totalSpent);

  return {
    monthKey,
    monthLabelLong: getMonthLabel(monthKey),
    monthLabelShort: getMonthLabel(monthKey, { month: "short", year: undefined }).replace(".", ""),
    monthLabelShortYear: getMonthLabel(monthKey, { month: "short", year: "numeric" }).replace(".", ""),
    expenses,
    spendingTransactions,
    investmentTransactions,
    transactionCount: expenses.length,
    expenseTransactionCount,
    totalSpent,
    totalInvested,
    fixedSpend,
    variableSpend,
    fixedShare: totalSpent > 0 ? (fixedSpend / totalSpent) * 100 : 0,
    variableShare: totalSpent > 0 ? (variableSpend / totalSpent) * 100 : 0,
    investedThisMonth,
    investmentTransactionsCount,
    remainingBalance,
    liquidityFinal,
    savingsCapacityAmount,
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
    savingsCapacityAmount: currentMonth.savingsCapacityAmount,
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
  const totalFree = roundCurrency(monthsWithData.reduce((sum, month) => sum + month.savingsCapacityAmount, 0));

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

const applyKpiFeedbackState = (element, state) => {
  if (!element) {
    return;
  }

  applyCapacityState(element, state);
  element.classList.remove(...KPI_FEEDBACK_CLASSES);
  element.classList.add(`kpi-card--${getSavingsCapacityTone(state)}`);
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

const getCategoryLabel = (category = "") => {
  const normalizedCategory = String(category || "").trim();
  if (!normalizedCategory) {
    return "";
  }

  return translations[getCurrentLanguage()]?.categories?.[normalizedCategory]
    || translations[DEFAULT_LANGUAGE]?.categories?.[normalizedCategory]
    || normalizedCategory;
};

const getPaymentMethodLabel = (paymentMethod = "") => {
  const normalizedMethod = String(paymentMethod || "").trim();
  if (!normalizedMethod) {
    return "";
  }

  return translations[getCurrentLanguage()]?.paymentMethods?.[normalizedMethod]
    || translations[DEFAULT_LANGUAGE]?.paymentMethods?.[normalizedMethod]
    || normalizedMethod;
};

const getSortLabel = (sort) => translations[getCurrentLanguage()]?.sort?.[sort] || translations[DEFAULT_LANGUAGE]?.sort?.[sort] || translations[DEFAULT_LANGUAGE].sort.newest;

const getScrollBehavior = () => (prefersReducedMotion() ? "auto" : "smooth");
const getExpenseById = (expenseId) => getState().expenses.find((expense) => expense.id === expenseId) || null;
const getFormField = (name) => expenseForm?.elements.namedItem(name);
const isInvestmentCategory = (category = "") => category === "Inversion";
const getMovementCopy = (category = "") => {
  const isInvestment = isInvestmentCategory(category);

  return {
    noun: isInvestment ? t("movement.investmentNoun") : t("movement.expenseNoun"),
    nounCapitalized: isInvestment ? t("movement.investmentNounCap") : t("movement.expenseNounCap"),
    editLabel: isInvestment ? t("movement.editInvestment") : t("movement.editExpense"),
    duplicateLabel: isInvestment ? t("movement.duplicateInvestment") : t("movement.duplicateExpense"),
    deleteLabel: isInvestment ? t("movement.deleteInvestment") : t("movement.deleteExpense"),
    registeredToast: isInvestment ? t("movement.registeredInvestment") : t("movement.registeredExpense"),
    updatedToast: isInvestment ? t("movement.updatedInvestment") : t("movement.updatedExpense"),
    deletedToast: isInvestment ? t("movement.deletedInvestment") : t("movement.deletedExpense"),
    duplicatedToast: isInvestment ? t("movement.duplicatedInvestment") : t("movement.duplicatedExpense"),
    deleteCopy: isInvestment ? t("movement.deleteInvestmentCopy") : t("movement.deleteExpenseCopy"),
  };
};

const getFloatingActionConfig = (metrics) => {
  const activeView = uiState.activeView || DEFAULT_VIEW;

  if (activeView === "actividad") {
    return {
      visible: true,
      label: t("hero.registerExpense"),
      action: "expense",
    };
  }

  return {
    visible: false,
    label: t("hero.registerExpense"),
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

const setSelectOptionText = (selectElement, optionValue, label) => {
  const nextOption = Array.from(selectElement?.options || []).find((option) => option.value === optionValue);
  if (nextOption) {
    nextOption.textContent = label;
  }
};

const syncLanguageButtons = () => {
  languageOptionButtons.forEach((button) => {
    const isActive = button.dataset.languageOption === getCurrentLanguage();
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  if (languageSwitch) {
    languageSwitch.setAttribute("aria-label", t("income.languageLabel"));
  }

  if (exchangeRateNote) {
    exchangeRateNote.hidden = getCurrentCurrency() !== "USD";
    exchangeRateNote.textContent = t("income.exchangeNote");
  }
};

const translateStaticUi = () => {
  document.documentElement.lang = getCurrentLanguage();
  body.dataset.language = getCurrentLanguage();

  setTextValue(document.querySelector(".sidebar__brand .eyebrow"), t("sidebar.brandEyebrow"));
  setTextValue(document.querySelector(".sidebar__rail .panel__header .eyebrow"), t("sidebar.activeMonthEyebrow"));
  setTextValue(document.querySelector(".sidebar__footer .eyebrow"), t("sidebar.profileEyebrow"));
  setTextValue(document.querySelector(".profile-card span"), t("sidebar.personalSpace"));
  if (summaryElements.sidebarFreeCash?.nextSibling) {
    summaryElements.sidebarFreeCash.nextSibling.textContent = getCurrentLanguage() === "en"
      ? " of liquidity until next income"
      : " de liquidez hasta proximo ingreso";
  }

  document.querySelector(".sidebar")?.setAttribute("aria-label", t("sidebar.primaryAria"));
  document.querySelector(".mobile-nav")?.setAttribute("aria-label", t("sidebar.mobileAria"));
  menuToggle?.setAttribute("aria-label", getCurrentLanguage() === "en" ? "Open menu" : "Abrir menu");
  modalCloseButton?.setAttribute("aria-label", t("modal.closeButton"));

  const railMetricLabels = document.querySelectorAll(".sidebar__rail .rail-metric > span");
  setTextValue(railMetricLabels[0], t("sidebar.savingsCapacity"));
  setTextValue(railMetricLabels[1], t("sidebar.availableToSave"));

  Object.entries(translations[getCurrentLanguage()]?.views || translations[DEFAULT_LANGUAGE].views).forEach(([viewName, label]) => {
    document.querySelectorAll(`[data-nav-item="${viewName}"]`).forEach((item) => {
      setTextValue(item.lastElementChild, label);
    });
  });

  setTextValue(heroCardElement?.querySelector(".panel__header .eyebrow"), t("hero.eyebrow"));
  setTextValue(heroCardElement?.querySelector(".panel__header h3"), t("hero.title"));
  heroCardElement?.querySelector(".hero-card__meta")?.setAttribute("aria-label", t("hero.ariaLabel"));
  setTextValue(summaryElements.heroIncome?.closest(".hero-card__meta-item")?.querySelector("span"), t("hero.dailySpend"));
  setTextValue(summaryElements.heroSpent?.closest(".hero-card__meta-item")?.querySelector("span"), t("hero.dailyLimit"));
  setTextValue(summaryElements.heroInvested?.closest(".hero-card__meta-item")?.querySelector("span"), t("hero.difference"));
  openExpenseButtons.forEach((button) => setTextValue(button, t("hero.registerExpense")));

  const splitCard = document.querySelector(".split-card");
  const allocationTitleLabels = splitCard?.querySelectorAll(".allocation-row__title > span");
  const allocationStatLabels = splitCard?.querySelectorAll(".allocation-stat > span");
  const timelineTitles = splitCard?.querySelectorAll(".timeline-item > div > strong");
  setTextValue(splitCard?.querySelector(".panel__header .eyebrow"), t("goal.eyebrow"));
  setTextValue(allocationTitleLabels?.[0], t("goal.objective"));
  setTextValue(allocationTitleLabels?.[1], t("goal.investedThisMonth"));
  setTextValue(splitCard?.querySelector(".goal-progress__labels span"), t("goal.progress"));
  setTextValue(allocationStatLabels?.[1], t("goal.exceeded"));
  setTextValue(splitCard?.querySelector(".split-card__label"), t("goal.comparisonLabel"));
  setTextValue(timelineTitles?.[0], t("goal.comparisonSpent"));
  setTextValue(timelineTitles?.[1], t("goal.comparisonAvailable"));
  setTextValue(timelineTitles?.[2], t("goal.comparisonInvested"));
  setTextValue(timelineTitles?.[3], t("goal.comparisonCategoryShift"));
  setTextValue(splitCard?.querySelector(".panel-actions [data-open-investment]"), t("income.registerInvestment"));

  const flowSection = document.querySelector(".financial-flow");
  const flowLabels = flowSection?.querySelectorAll(".flow-step__label");
  const flowCopies = flowSection?.querySelectorAll(".flow-step__copy");
  flowSection?.setAttribute("aria-label", t("flow.ariaLabel"));
  setTextValue(flowSection?.querySelector(".financial-flow__header .eyebrow"), t("flow.eyebrow"));
  setTextValue(flowSection?.querySelector(".financial-flow__header h3"), t("flow.title"));
  setTextValue(flowSection?.querySelector(".financial-flow__header .panel-note"), t("flow.note"));
  setTextValue(flowLabels?.[0], t("flow.totalIncome"));
  setTextValue(flowLabels?.[1], t("flow.spent"));
  setTextValue(flowLabels?.[2], t("flow.availableBeforeInvesting"));
  setTextValue(flowLabels?.[3], t("flow.investment"));
  setTextValue(flowLabels?.[4], t("flow.liquidityFinal"));
  setTextValue(flowCopies?.[0], t("flow.totalIncomeCopy"));
  setTextValue(flowCopies?.[1], t("flow.spentCopy"));
  setTextValue(flowCopies?.[2], t("flow.availableBeforeInvestingCopy"));
  setTextValue(flowCopies?.[3], t("flow.investmentCopy"));
  setTextValue(flowCopies?.[4], t("flow.liquidityFinalCopy"));

  const chartCards = document.querySelectorAll(".chart-card");
  const lineLegendLabels = document.querySelectorAll(".line-chart__badge span:last-child");
  setTextValue(chartCards?.[0]?.querySelector(".panel__header .eyebrow"), t("charts.distributionEyebrow"));
  setTextValue(chartCards?.[0]?.querySelector(".panel__header h3"), t("charts.distributionTitle"));
  setTextValue(chartCards?.[0]?.querySelector(".donut-chart__center span"), t("charts.totalExpenses"));
  setTextValue(chartCards?.[1]?.querySelector(".panel__header .eyebrow"), t("charts.evolutionEyebrow"));
  setTextValue(chartCards?.[1]?.querySelector(".panel__header h3"), t("charts.evolutionTitle"));
  chartCards?.[1]?.querySelector("svg")?.setAttribute("aria-label", t("charts.axisLabel"));
  setTextValue(lineLegendLabels?.[0], t("charts.actual"));
  setTextValue(lineLegendLabels?.[1], t("charts.projection"));
  setTextValue(document.querySelector(".insights-card .panel__header .eyebrow"), t("charts.readingEyebrow"));
  setTextValue(document.querySelector(".insights-card .panel__header h3"), t("charts.readingTitle"));
  setTextValue(document.querySelector(".insights-card .panel__header .pill"), t("charts.indicators", { count: 6 }));

  const incomeBoard = document.querySelector(".income-board");
  const incomeKpiLabels = incomeBoard?.querySelectorAll(".income-kpi-card__eyebrow > span");
  const incomeKpiNotes = incomeBoard?.querySelectorAll(".income-kpi-card__eyebrow > small");
  const incomeBlockHeaders = incomeBoard?.querySelectorAll(".income-block .panel__header .eyebrow");
  const incomeBlockTitles = incomeBoard?.querySelectorAll(".income-block .panel__header h3");
  const incomeTileLabels = incomeBoard?.querySelectorAll(".projection-tile > span");
  setTextValue(incomeBoard?.querySelector(".income-board__header .eyebrow"), t("income.eyebrow"));
  setTextValue(incomeBoard?.querySelector(".income-board__header h3"), t("income.title"));
  incomeBoard?.querySelector(".income-kpi-grid")?.setAttribute("aria-label", t("income.kpiAria"));
  setTextValue(incomeKpiLabels?.[0], t("income.totalIncome"));
  setTextValue(incomeKpiLabels?.[1], t("income.balance"));
  setTextValue(incomeKpiLabels?.[2], t("income.savingsCapacity"));
  setTextValue(incomeKpiNotes?.[0], t("income.basePlusExtra"));
  setTextValue(incomeKpiNotes?.[1], t("income.afterExpenses"));
  setTextValue(incomeKpiNotes?.[2], t("income.currentMargin"));
  setTextValue(incomeBlockHeaders?.[0], t("income.compositionEyebrow"));
  setTextValue(incomeBlockHeaders?.[1], t("income.resultEyebrow"));
  setTextValue(incomeBlockTitles?.[0], t("income.compositionTitle"));
  setTextValue(incomeBlockTitles?.[1], t("income.resultTitle"));
  setTextValue(incomeTileLabels?.[0], t("income.baseIncome"));
  setTextValue(incomeTileLabels?.[1], t("income.extraIncome"));
  setTextValue(incomeTileLabels?.[2], t("income.availableToSave"));
  setTextValue(incomeTileLabels?.[4], t("income.investedThisMonth"));
  setTextValue(document.querySelector(".income-actions-card .eyebrow"), t("income.actionsEyebrow"));
  setTextValue(document.querySelector(".income-actions-card h3"), t("income.actionsTitle"));
  openIncomeButtons.forEach((button) => setTextValue(button, t("income.editIncome")));
  openGoalButtons.forEach((button) => setTextValue(button, t("income.editGoal")));
  openInvestmentButtons.forEach((button) => setTextValue(button, t("income.registerInvestment")));
  setTextValue(languageSwitch?.querySelector(".language-switch__label"), t("income.languageLabel"));

  const expensesCard = document.querySelector(".expenses-card");
  setTextValue(expensesCard?.querySelector(".panel__header .eyebrow"), t("activity.eyebrow"));
  setTextValue(expensesCard?.querySelector(".panel__header h3"), t("activity.title"));
  setTextValue(expensesCard?.querySelector("[data-open-filters]"), t("activity.filters"));
  setTextValue(expensesCard?.querySelector("[data-open-import-json]"), t("activity.importJson"));
  setTextValue(expensesCard?.querySelector("[data-open-import-csv]"), t("activity.importCsv"));
  setTextValue(expensesCard?.querySelector("[data-open-export]"), t("activity.export"));

  const calendarCard = document.querySelector(".calendar-card");
  const calendarSummaryLabels = calendarCard?.querySelectorAll(".calendar-summary__card > span");
  setTextValue(calendarCard?.querySelector(".panel__header .eyebrow"), t("calendar.eyebrow"));
  setTextValue(calendarCard?.querySelector(".panel__header h3"), t("calendar.title"));
  calendarShiftButtons?.[0]?.setAttribute("aria-label", t("calendar.previousYear"));
  calendarShiftButtons?.[1]?.setAttribute("aria-label", t("calendar.nextYear"));
  setTextValue(calendarSummaryLabels?.[0], t("calendar.incomeReference"));
  setTextValue(calendarSummaryLabels?.[1], t("calendar.spentYear"));
  setTextValue(calendarSummaryLabels?.[2], t("calendar.investedYear"));
  setTextValue(calendarSummaryLabels?.[3], t("calendar.averageAvailable"));

  setTextValue(expenseForm?.querySelector('[name="title"]')?.closest(".field")?.querySelector(".field__label"), t("modal.description"));
  setTextValue(expenseForm?.querySelector('[name="amount"]')?.closest(".field")?.querySelector(".field__label"), t("modal.amount"));
  setTextValue(expenseForm?.querySelector('[name="date"]')?.closest(".field")?.querySelector(".field__label"), t("modal.date"));
  setTextValue(expenseForm?.querySelector('[name="category"]')?.closest(".field")?.querySelector(".field__label"), t("modal.category"));
  setTextValue(expenseForm?.querySelector('[name="paymentMethod"]')?.closest(".field")?.querySelector(".field__label"), t("modal.paymentMethod"));
  setTextValue(expenseForm?.querySelector('[name="note"]')?.closest(".field")?.querySelector(".field__label"), t("modal.notes"));
  setTextValue(expenseForm?.querySelector('[name="isFixed"]')?.closest(".field")?.querySelector(".field__label"), t("modal.movementType"));
  setTextValue(expenseForm?.querySelector(".toggle-card__copy strong"), t("modal.markFixed"));
  setTextValue(expenseForm?.querySelector(".toggle-card__copy small"), t("modal.fixedHelp"));
  setTextValue(expenseForm?.querySelector(".modal-actions [data-modal-close]"), t("modal.cancel"));
  if (getFormField("title")) {
    getFormField("title").placeholder = getCurrentLanguage() === "en" ? "Ex: YPF, Groceries, Spotify" : "Ej: YPF, Supermercado, Spotify";
  }
  if (getFormField("amount")) {
    getFormField("amount").placeholder = getCurrentLanguage() === "en" ? "0.00" : "0,00";
  }
  if (getFormField("note")) {
    getFormField("note").placeholder = t("modal.notesPlaceholder");
  }

  setTextValue(incomeForm?.querySelector(".panel__header .eyebrow"), t("modal.incomeEyebrow"));
  setTextValue(incomeForm?.querySelector(".panel__header h3"), t("modal.incomeTitle"));
  setTextValue(incomeForm?.querySelector(".panel__header .panel-note"), t("modal.incomeCopy"));
  setTextValue(incomeBaseInput?.closest(".field")?.querySelector(".field__label"), t("modal.incomeBase"));
  setTextValue(incomeExtraInput?.closest(".field")?.querySelector(".field__label"), t("modal.incomeExtra"));
  setTextValue(incomeTotalPreview?.closest(".field")?.querySelector(".field__label"), t("modal.incomeTotalCalculated"));
  setTextValue(incomeTotalPreview?.closest(".confirm-card")?.querySelector("p"), t("modal.incomeTotalEditCopy"));
  setTextValue(incomeForm?.querySelector(".modal-actions [data-modal-close]"), t("modal.cancel"));
  setTextValue(incomeForm?.querySelector('.modal-actions .button--accent[type="submit"]'), t("modal.saveIncome"));
  if (incomeBaseInput) {
    incomeBaseInput.placeholder = getCurrentLanguage() === "en" ? "0.00" : "0,00";
  }
  if (incomeExtraInput) {
    incomeExtraInput.placeholder = getCurrentLanguage() === "en" ? "0.00" : "0,00";
  }

  setTextValue(goalForm?.querySelector(".panel__header .eyebrow"), t("modal.goalEyebrow"));
  setTextValue(goalForm?.querySelector(".panel__header h3"), t("modal.goalTitle"));
  setTextValue(goalForm?.querySelector(".panel__header .panel-note"), t("modal.goalCopy"));
  setTextValue(goalAmountInput?.closest(".field")?.querySelector(".field__label"), t("modal.goalAmount"));
  setTextValue(goalLabelInput?.closest(".field")?.querySelector(".field__label"), t("modal.goalOptionalLabel"));
  setTextValue(goalAmountPreview?.closest(".field")?.querySelector(".field__label"), t("modal.goalSummary"));
  setTextValue(goalAmountPreview?.closest(".confirm-card")?.querySelector("p"), t("modal.goalExample"));
  setTextValue(goalForm?.querySelector(".modal-actions [data-modal-close]"), t("modal.cancel"));
  setTextValue(goalForm?.querySelector('.modal-actions .button--accent[type="submit"]'), t("modal.saveGoal"));
  if (goalLabelInput) {
    goalLabelInput.placeholder = t("goal.defaultLabel");
  }

  setTextValue(document.querySelector('[data-modal-panel="confirm"] .panel__header .eyebrow'), t("modal.deleteEyebrow"));
  setTextValue(document.querySelector('[data-modal-panel="confirm"] .panel__header h3'), t("modal.deleteTitle"));
  setTextValue(document.querySelector('[data-modal-panel="confirm"] .panel__header .panel-note'), t("modal.deleteNote"));
  setTextValue(document.querySelector('[data-modal-panel="confirm"] .modal-actions [data-modal-close]'), t("modal.cancel"));
  setTextValue(confirmDeleteButton, t("modal.deleteAction"));

  setTextValue(document.querySelector('[data-modal-panel="filters"] .panel__header .eyebrow'), t("modal.filtersEyebrow"));
  setTextValue(document.querySelector('[data-modal-panel="filters"] .panel__header h3'), t("modal.filtersTitle"));
  setTextValue(document.querySelector('[data-modal-panel="filters"] .panel__header .panel-note'), t("modal.filtersCopy"));
  setTextValue(filterMonthInput?.closest(".field")?.querySelector(".field__label"), t("modal.month"));
  setTextValue(filterCategoryInput?.closest(".field")?.querySelector(".field__label"), t("modal.category"));
  setTextValue(filterPaymentMethodInput?.closest(".field")?.querySelector(".field__label"), t("modal.paymentMethod"));
  setTextValue(filterExpenseTypeInput?.closest(".field")?.querySelector(".field__label"), t("modal.expenseType"));
  setTextValue(filterSortInput?.closest(".field")?.querySelector(".field__label"), t("modal.sortBy"));
  setTextValue(document.querySelector('[data-modal-panel="filters"] .confirm-card strong'), t("modal.currentSearch"));
  setTextValue(clearFiltersButton, t("filters.clearFilters"));
  setTextValue(document.querySelector('[data-modal-panel="filters"] [data-modal-restore-sample]'), t("modal.restoreSample"));
  setTextValue(document.querySelector('[data-modal-panel="filters"] [data-modal-close]'), t("modal.done"));

  setTextValue(document.querySelector('[data-modal-panel="export"] .panel__header .eyebrow'), t("modal.exportEyebrow"));
  setTextValue(document.querySelector('[data-modal-panel="export"] .panel__header h3'), t("modal.exportTitle"));
  setTextValue(document.querySelector('[data-modal-panel="export"] .panel__header .panel-note'), t("modal.exportCopy"));
  setTextValue(document.querySelector('[data-modal-panel="export"] [data-modal-close]'), t("modal.close"));
  setTextValue(exportJsonButton, t("modal.exportJson"));
  setTextValue(exportCsvButton, t("modal.exportCsv"));

  setTextValue(document.querySelector('[data-modal-panel="reset"] .panel__header .eyebrow'), t("modal.resetEyebrow"));
  setTextValue(document.querySelector('[data-modal-panel="reset"] .panel__header h3'), t("modal.resetTitle"));
  setTextValue(document.querySelector('[data-modal-panel="reset"] .panel__header .panel-note'), t("modal.resetCopy"));
  setTextValue(document.querySelector('[data-modal-panel="reset"] .confirm-card strong'), t("modal.sampleData"));
  setTextValue(document.querySelector('[data-modal-panel="reset"] .confirm-card span'), t("modal.sampleDataCopy"));
  setTextValue(document.querySelector('[data-modal-panel="reset"] .confirm-card p'), t("modal.sampleDataHint"));
  setTextValue(document.querySelector('[data-modal-panel="reset"] [data-modal-close]'), t("modal.cancel"));
  setTextValue(confirmRestoreButton, t("modal.restoreSampleAction"));

  if (uiState.modalMode === "add" || uiState.modalMode === "investment" || uiState.modalMode === "edit") {
    const activeExpense = uiState.activeExpenseId ? getExpenseById(uiState.activeExpenseId) : null;
    const activeCategory = activeExpense?.category || getFormField("category")?.value || "";
    const isInvestmentEntry = activeCategory === "Inversion" || uiState.modalMode === "investment";
    const isEditMode = uiState.modalMode === "edit";
    setTextValue(modalEyebrow, isEditMode ? (isInvestmentEntry ? t("modal.editInvestmentEyebrow") : t("modal.editExpenseEyebrow")) : isInvestmentEntry ? t("modal.investmentEyebrow") : t("modal.formEyebrow"));
    setTextValue(modalTitle, isEditMode ? (isInvestmentEntry ? t("modal.editInvestmentTitle") : t("modal.editExpenseTitle")) : isInvestmentEntry ? t("modal.investmentTitle") : t("modal.expenseTitle"));
    setTextValue(modalCopy, isEditMode ? (isInvestmentEntry ? t("modal.editInvestmentCopy") : t("modal.editExpenseCopy")) : isInvestmentEntry ? t("modal.investmentCopy") : t("modal.expenseCopy"));
    setTextValue(formSubmit, isInvestmentEntry ? t("modal.saveContribution") : t("modal.saveExpense"));
  }

  if (uiState.modalMode === "delete") {
    const activeExpense = uiState.activeExpenseId ? getExpenseById(uiState.activeExpenseId) : null;
    if (activeExpense && !activeExpense.note) {
      setTextValue(confirmCopy, getMovementCopy(activeExpense.category).deleteCopy);
    }
  }

  setSelectOptionText(getFormField("category"), "", t("modal.categoryPlaceholder"));
  setSelectOptionText(getFormField("paymentMethod"), "", t("modal.paymentMethodPlaceholder"));
  setSelectOptionText(filterCategoryInput, "all", t("filters.allCategories"));
  setSelectOptionText(filterPaymentMethodInput, "all", t("filters.allMethods"));
  setSelectOptionText(filterExpenseTypeInput, "all", t("filters.allMovementTypes"));
  setSelectOptionText(filterExpenseTypeInput, "fixed", t("filters.onlyFixed"));
  setSelectOptionText(filterExpenseTypeInput, "variable", t("filters.onlyVariable"));
  setSelectOptionText(filterSortInput, "newest", t("filters.newest"));
  setSelectOptionText(filterSortInput, "oldest", t("filters.oldest"));
  setSelectOptionText(filterSortInput, "highest", t("filters.highest"));
  setSelectOptionText(filterSortInput, "lowest", t("filters.lowest"));

  Array.from(getFormField("category")?.options || []).forEach((option) => {
    if (option.value) {
      option.textContent = getCategoryLabel(option.value);
    }
  });
  Array.from(getFormField("paymentMethod")?.options || []).forEach((option) => {
    if (option.value) {
      option.textContent = getPaymentMethodLabel(option.value);
    }
  });
  Array.from(filterCategoryInput?.options || []).forEach((option) => {
    if (option.value && option.value !== "all") {
      option.textContent = getCategoryLabel(option.value);
    }
  });
  Array.from(filterPaymentMethodInput?.options || []).forEach((option) => {
    if (option.value && option.value !== "all") {
      option.textContent = getPaymentMethodLabel(option.value);
    }
  });

  syncLanguageButtons();
};

const refreshExchangeRate = async ({ force = false } = {}) => {
  const cachedTimestamp = readPersistedExchangeRateTimestamp();
  const currentRate = Number(uiState.exchangeRateUsdArs);
  const fallbackRate = Number.isFinite(currentRate) && currentRate > 0 ? currentRate : readPersistedExchangeRate();

  if (!force && isExchangeRateCacheFresh(cachedTimestamp)) {
    return;
  }

  try {
    const payload = await fetchExchangeRatePayload();
    const parsedRate = Number(payload?.rates?.ARS);
    if (!Number.isFinite(parsedRate) || !(parsedRate > 0)) {
      throw new Error("exchange-rate-value");
    }

    uiState.exchangeRateUsdArs = parsedRate;
    persistExchangeRate(parsedRate);

    if (getCurrentCurrency() === "USD") {
      renderDashboard(false);
    }
  } catch (error) {
    uiState.exchangeRateUsdArs = fallbackRate;
  }
};

const setCurrency = (currency) => {
  uiState.currentCurrency = currency === "USD" ? "USD" : "ARS";
};

const setLanguage = (language, options = {}) => {
  const nextLanguage = isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;
  uiState.currentLanguage = nextLanguage;
  setCurrency(resolveCurrencyFromLanguage(nextLanguage));

  if (options.persist !== false) {
    persistLanguageSettings(nextLanguage);
  }

  renderDashboard(false);
  refreshOpenModalContent();

  if (uiState.currentCurrency === "USD") {
    refreshExchangeRate();
  }
};

const renderTopbar = (metrics) => {
  const activeView = uiState.activeView || DEFAULT_VIEW;
  const config = {
    resumen: {
      eyebrow: t("topbar.resumenEyebrow"),
      getTitle: () => t("topbar.resumenTitle", { month: metrics.monthLabelLong }),
      showSearch: false,
      showFilters: false,
    },
    flujo: {
      eyebrow: t("topbar.flujoEyebrow"),
      getTitle: () => t("topbar.flujoTitle"),
      showSearch: false,
      showFilters: false,
    },
    ingreso: {
      eyebrow: t("topbar.ingresoEyebrow"),
      getTitle: () => t("topbar.ingresoTitle"),
      showSearch: false,
      showFilters: false,
    },
    actividad: {
      eyebrow: t("topbar.actividadEyebrow"),
      getTitle: () => t("topbar.actividadTitle"),
      showSearch: true,
      showFilters: true,
    },
    calendario: {
      eyebrow: t("topbar.calendarioEyebrow"),
      getTitle: () => t("topbar.calendarioTitle"),
      showSearch: false,
      showFilters: false,
    },
  }[activeView] || {
    eyebrow: t("topbar.resumenEyebrow"),
    getTitle: () => t("topbar.resumenTitle", { month: metrics.monthLabelLong }),
    showSearch: false,
    showFilters: false,
  };

  setTextValue(topbarEyebrow, config.eyebrow);
  setTextValue(textElements.periodTitle, config.getTitle(metrics));
  setTextValue(textElements.periodPill, metrics.monthLabelShortYear);
  setTextValue(incomeMonthLabel, t("income.monthUseBase", { month: metrics.monthLabelLong }));
  setTextValue(goalLabelPreview, getDisplayGoalLabel(metrics.goalLabel));

  if (topbarSearch) {
    topbarSearch.hidden = !config.showSearch;
    topbarSearch.setAttribute("aria-label", t("search.aria"));
  }

  if (topbarFilters) {
    topbarFilters.hidden = !config.showFilters;
  }

  if (searchInput) {
    searchInput.placeholder = t("search.placeholder");
  }

  if (topbarActions) {
    topbarActions.hidden = !config.showSearch && !config.showFilters;
  }
};

const renderSidebar = (metrics, animate) => {
  animateValue(summaryElements.sidebarFreeCash, metrics.liquidityFinal, { animate });
  animateValue(summaryElements.sidebarAvailableToSave, metrics.savingsCapacityAmount, { animate });
  setTextValue(textElements.sidebarSavingsCapacity, metrics.totalIncome ? formatPercent(metrics.savingsCapacityPercent, 1) : "0%");
  setBarWidth(barElements.sidebarSavingsCapacity, metrics.savingsCapacityBarPercent);
  applyStatusPill(
    statusElements.sidebar,
    getSavingsCapacityBadgeCopy(metrics),
    getSavingsCapacityTone(metrics.savingsCapacityState)
  );
};

const renderHero = (metrics, animate) => {
  const activeMonthKey = metrics.activeMonthKey || metrics.monthKey || "";
  const hasActiveMonth = isValidMonthKey(activeMonthKey);
  const daysInActiveMonth = hasActiveMonth ? getDaysInMonth(activeMonthKey) : 0;
  const currentDay = daysInActiveMonth ? clamp(new Date().getDate(), 1, daysInActiveMonth) : 0;
  const daysElapsed = currentDay;
  const daysRemaining = Math.max(daysInActiveMonth - currentDay, 0);
  const totalSpent = Number.isFinite(Number(metrics.totalSpent)) ? Number(metrics.totalSpent) : 0;
  const totalIncome = Number.isFinite(Number(metrics.totalIncome)) ? Number(metrics.totalIncome) : 0;
  const investedThisMonth = Number.isFinite(Number(metrics.investedThisMonth)) ? Number(metrics.investedThisMonth) : 0;
  const liquidityAmount = Number.isFinite(Number(metrics.liquidityFinal)) ? Number(metrics.liquidityFinal) : 0;
  const availableLiquidity = Math.max(liquidityAmount, 0);
  const rawDailySpend = daysElapsed > 0 ? totalSpent / daysElapsed : 0;
  const dailySpend = Number.isFinite(rawDailySpend) ? Math.round(rawDailySpend) : 0;
  const dailyLimit = hasActiveMonth
    ? (daysRemaining > 0 ? Math.round(availableLiquidity / daysRemaining) : Math.round(availableLiquidity))
    : 0;
  const dailyDifference = Math.round(dailyLimit - dailySpend);
  const projectedSpendTotal = hasActiveMonth && daysElapsed > 0 && totalIncome > 0 ? rawDailySpend * daysInActiveMonth : 0;
  const projectedMonthEnd = Number.isFinite(projectedSpendTotal)
    ? roundCurrency(totalIncome - projectedSpendTotal - investedThisMonth)
    : 0;
  const rawDeviationCost = dailyDifference < 0 && daysRemaining > 0 ? Math.abs(dailyDifference) * daysRemaining : 0;
  const deviationCost = Math.min(rawDeviationCost, Math.max(totalIncome, 0));
  let riskReason = "";
  let differenceTone = "neutral";
  let differenceLabel = t("status.inBalance");

  if (liquidityAmount < 0) {
    riskReason = t("hero.riskLiquidity");
  } else if (dailyDifference < 0) {
    riskReason = t("hero.riskDaily");
  } else if (projectedMonthEnd < 0) {
    riskReason = t("hero.riskClosing");
  }

  if (dailyDifference > 0) {
    differenceTone = "positive";
    differenceLabel = t("status.onTrack");
  } else if (dailyDifference < 0) {
    differenceTone = "negative";
    differenceLabel = t("status.overspending");
  }

  const liquidityFinalPercent = metrics.totalIncome > 0 ? roundCurrency((metrics.liquidityFinal / metrics.totalIncome) * 100) : 0;
  const liquidityFinalState = getSavingsCapacityState(liquidityFinalPercent, metrics.totalIncome);
  let liquidityStatusLabel = t("status.noIncome");
  let liquidityStatusTone = "neutral";

  if (metrics.totalIncome > 0) {
    if (liquidityFinalPercent > 40) {
      liquidityStatusLabel = t("status.comfortable");
      liquidityStatusTone = "positive";
    } else if (liquidityFinalPercent >= 20) {
      liquidityStatusLabel = t("status.controlled");
      liquidityStatusTone = "neutral";
    } else if (liquidityFinalPercent >= 10) {
      liquidityStatusLabel = t("status.tight");
      liquidityStatusTone = "neutral";
    } else {
      liquidityStatusLabel = t("status.atRisk");
      liquidityStatusTone = "negative";
    }
  }

  animateValue(summaryElements.heroLiquidityFinal, metrics.liquidityFinal, { animate });
  animateValue(summaryElements.heroIncome, dailySpend, { animate });
  animateValue(summaryElements.heroSpent, dailyLimit, { animate });
  animateValue(summaryElements.heroInvested, dailyDifference, { animate });
  setTextValue(textElements.heroLiquidityCopy, "");
  setTextValue(textElements.heroDifferenceNote, differenceLabel);
  setTextValue(
    textElements.heroBalanceNote,
    projectedMonthEnd < 0
      ? t("hero.closingNegative", { amount: formatMoney(Math.abs(projectedMonthEnd), 0) })
      : t("hero.closingPositive", { amount: formatMoney(projectedMonthEnd, 0) })
  );
  setTextValue(textElements.heroCaption, t("hero.deviationCost", { amount: formatMoney(deviationCost, 0) }));
  if (heroDifferenceCardElement) {
    heroDifferenceCardElement.classList.remove(...HERO_DIFFERENCE_STATE_CLASSES);
    heroDifferenceCardElement.classList.add(`hero-card__meta-item--${differenceTone}`);
  }
  if (textElements.heroRiskReason) {
    setTextValue(textElements.heroRiskReason, liquidityStatusTone === "negative" ? riskReason : "");
    textElements.heroRiskReason.hidden = !(liquidityStatusTone === "negative" && riskReason);
  }
  applyCapacityState(heroCardElement, liquidityFinalState);
  applyStatusPill(
    statusElements.hero,
    liquidityStatusLabel,
    liquidityStatusTone
  );
};

const renderFinancialFlow = (metrics, animate) => {
  animateValue(summaryElements.kpiAvailableBeforeInvesting, metrics.remainingBalance, { animate });
  animateValue(summaryElements.flowIncome, metrics.totalIncome, { animate });
  animateValue(summaryElements.flowSpent, metrics.totalSpent, { animate });
  animateValue(summaryElements.flowAvailable, metrics.remainingBalance, { animate });
  animateValue(summaryElements.flowInvested, metrics.investedThisMonth, { animate });
  animateValue(summaryElements.flowLiquidityFinal, metrics.liquidityFinal, { animate });
};

const renderSplitCard = (metrics, animate) => {
  animateValue(summaryElements.goalAmount, metrics.goalAmount, { animate });
  animateValue(summaryElements.goalSaved, metrics.investedThisMonth, { animate });
  animateValue(summaryElements.goalGapValue, metrics.goalRemainingAmount, { animate });
  animateValue(summaryElements.goalExceeded, metrics.goalExceededAmount, { animate });
  setBarWidth(barElements.goalProgress, metrics.goalProgressBarPercent);
  setTextValue(textElements.goalHeading, getDisplayGoalLabel(metrics.goalLabel));
  setTextValue(textElements.goalProgressText, metrics.goalAmount > 0 ? formatPercent(metrics.goalProgressPercent, 1) : t("status.noGoal"));
  setTextValue(labelElements.goalGap, metrics.isGoalMet ? t("status.goalMet") : t("goal.toInvest"));
  setTextValue(
    textElements.goalNote,
    metrics.investmentTransactionsCount
      ? getCurrentLanguage() === "en"
        ? `${formatNumber(metrics.investmentTransactionsCount)} contribution(s) recorded in Investment for ${formatMoney(metrics.investedThisMonth)}. Your available amount before investing still sits separately at ${formatMoney(metrics.remainingBalance)}.`
        : `${formatNumber(metrics.investmentTransactionsCount)} aporte(s) registrados en Inversion por ${formatMoney(metrics.investedThisMonth)}. Tu disponible antes de invertir sigue aparte en ${formatMoney(metrics.remainingBalance)}.`
      : metrics.transactionCount
        ? getCurrentLanguage() === "en"
          ? `You still have no contributions in the Investment category. You have ${formatMoney(metrics.remainingBalance)} available before investing, but the goal does not move until you record a contribution.`
          : `Todavia no registraste aportes en la categoria Inversion. Tienes ${formatMoney(metrics.remainingBalance)} disponible antes de invertir, pero la meta no sube hasta cargar un aporte.`
        : getCurrentLanguage() === "en"
          ? "The goal only counts movements in the Investment category. Use \"Add investment\" when you make a real contribution."
          : "La meta solo suma movimientos en la categoria Inversion. Usa \"Registrar inversion\" cuando hagas un aporte real."
  );

  if (!metrics.goalAmount) {
    applyStatusPill(statusElements.goal, t("status.noGoal"), "neutral");
  } else if (metrics.isGoalMet) {
    applyStatusPill(statusElements.goal, t("status.goalMet"), "positive");
  } else if (metrics.investmentTransactionsCount && metrics.projectedInvestmentAmount >= metrics.goalAmount) {
    applyStatusPill(statusElements.goal, t("status.onPace"), "positive");
  } else if (!metrics.investmentTransactionsCount) {
    applyStatusPill(statusElements.goal, t("status.noContributions"), "neutral");
  } else {
    applyStatusPill(
      statusElements.goal,
      getCurrentLanguage() === "en" ? `${formatPercent(metrics.goalProgressPercent, 1)} invested` : `${formatPercent(metrics.goalProgressPercent, 1)} invertido`,
      "negative"
    );
  }

  if (goalAmountPreview && uiState.modalMode !== "goal") {
    animateValue(goalAmountPreview, metrics.goalAmount, { animate: false });
  }

  if (goalLabelPreview && uiState.modalMode !== "goal") {
    setTextValue(goalLabelPreview, getDisplayGoalLabel(metrics.goalLabel));
  }

  if (!metrics.hasPreviousData) {
    setTextValue(
      textElements.comparisonNote,
      getCurrentLanguage() === "en"
        ? `There are no movements in ${getMonthLabel(metrics.previousMonthKey)} to compare expenses, available before investing and recorded investment.`
        : `No hay movimientos en ${getMonthLabel(metrics.previousMonthKey)} para comparar gastos, disponible antes de invertir e inversion registrada.`
    );
    setTextValue(comparisonElements.totalSpentCopy, getCurrentLanguage() === "en" ? "No baseline to compare" : "Sin base para comparar");
    setTextValue(comparisonElements.totalSpentValue, formatMoney(metrics.totalSpent));
    setTextValue(comparisonElements.remainingBalanceCopy, getCurrentLanguage() === "en" ? "No baseline to compare" : "Sin base para comparar");
    setTextValue(comparisonElements.remainingBalanceValue, formatMoney(metrics.remainingBalance));
    setTextValue(comparisonElements.investedCopy, getCurrentLanguage() === "en" ? "No baseline to compare" : "Sin base para comparar");
    setTextValue(comparisonElements.investedValue, formatMoney(metrics.investedThisMonth));
    setTextValue(comparisonElements.categoryShiftCopy, getCurrentLanguage() === "en" ? "No category to compare" : "Sin categoria para comparar");
    setTextValue(comparisonElements.categoryShiftValue, t("status.noData"));
    return;
  }

  setTextValue(
    textElements.comparisonNote,
    getCurrentLanguage() === "en"
      ? `Direct comparison against ${metrics.previousMonth.monthLabelLong} focused on expenses, available before investing and recorded investment.`
      : `Comparacion directa contra ${metrics.previousMonth.monthLabelLong} con foco en gastos, disponible antes de invertir e inversion ejecutada.`
  );
  setTextValue(comparisonElements.totalSpentCopy, `${formatSignedCurrency(metrics.comparisons.totalSpent.difference)} vs ${metrics.previousMonthLabel}`);
  setTextValue(comparisonElements.totalSpentValue, formatMoney(metrics.totalSpent));
  setTextValue(comparisonElements.remainingBalanceCopy, `${formatSignedCurrency(metrics.comparisons.remainingBalance.difference)} vs ${metrics.previousMonthLabel}`);
  setTextValue(comparisonElements.remainingBalanceValue, formatMoney(metrics.remainingBalance));
  setTextValue(comparisonElements.investedCopy, `${formatSignedCurrency(metrics.comparisons.investedThisMonth.difference)} vs ${metrics.previousMonthLabel}`);
  setTextValue(comparisonElements.investedValue, formatMoney(metrics.investedThisMonth));

  if (!metrics.topCategoryShift || Math.abs(metrics.topCategoryShift.difference) < 1) {
    setTextValue(comparisonElements.categoryShiftCopy, getCurrentLanguage() === "en" ? "No strong category shift" : "Sin cambio fuerte entre categorias");
    setTextValue(comparisonElements.categoryShiftValue, t("status.stable"));
    return;
  }

  const direction = metrics.topCategoryShift.difference > 0
    ? getCurrentLanguage() === "en" ? "went up" : "subio"
    : getCurrentLanguage() === "en" ? "went down" : "bajo";
  setTextValue(comparisonElements.categoryShiftCopy, `${getCategoryLabel(metrics.topCategoryShift.category)} ${direction} ${formatSignedCurrency(metrics.topCategoryShift.difference)}.`);
  setTextValue(comparisonElements.categoryShiftValue, getCategoryLabel(metrics.topCategoryShift.category));
};

const renderKpis = (metrics, animate) => {
  const investedDelta = metrics.hasPreviousData && Number.isFinite(metrics.comparisons.investedThisMonth.percent)
    ? formatSignedPercent(metrics.comparisons.investedThisMonth.percent)
    : metrics.investmentTransactionsCount
      ? getCurrentLanguage() === "en"
        ? `${formatNumber(metrics.investmentTransactionsCount)} contribution(s)`
        : `${formatNumber(metrics.investmentTransactionsCount)} aporte(s)`
      : t("status.noContributions");

  animateValue(kpiElements.incomeTotal, metrics.totalIncome, { animate });
  animateValue(kpiElements.totalSpent, metrics.totalSpent, { animate });
  animateValue(kpiElements.investedThisMonth, metrics.investedThisMonth, { animate });
  animateValue(kpiElements.savingsCapacity, metrics.savingsCapacityPercent, { animate, decimals: 0, suffix: "%" });
  animateValue(kpiElements.dailyAverage, metrics.dailyAverage, { animate });
  animateValue(kpiElements.goalProgress, metrics.goalProgressPercent, { animate, decimals: 1, suffix: "%" });

  setTextValue(
    kpiDeltaElements.incomeTotal,
    metrics.totalIncome
      ? getCurrentLanguage() === "en"
        ? `${formatMoney(metrics.incomeBase)} base + ${formatMoney(metrics.incomeExtra)} extra`
        : `${formatMoney(metrics.incomeBase)} base + ${formatMoney(metrics.incomeExtra)} extra`
      : t("status.editable")
  );
  setTextValue(
    kpiCaptionElements.incomeTotal,
    metrics.totalIncome
      ? getCurrentLanguage() === "en"
        ? "The sum of base income and extra income for the month."
        : "La suma del ingreso base y el ingreso extra del mes."
      : getCurrentLanguage() === "en"
        ? "Add this month's income to unlock the full dashboard."
        : "Carga el ingreso del mes para activar el tablero completo."
  );
  setTextValue(kpiDeltaElements.investedThisMonth, investedDelta);
  setTextValue(kpiDeltaElements.savingsCapacity, getSavingsCapacityStateLabel(metrics.savingsCapacityState));
  setTextValue(kpiCaptionElements.savingsCapacity, getSavingsCapacityInsight(metrics));
  setTextValue(kpiSecondaryElements.savingsCapacity, getSavingsCapacitySecondaryCopy(metrics));
  setBarWidth(kpiBarElements.savingsCapacity, metrics.savingsCapacityBarPercent);
  applyKpiFeedbackState(kpiCardElements.savingsCapacity, metrics.savingsCapacityState);

  if (metrics.hasPreviousData) {
    setTextValue(kpiDeltaElements.totalSpent, formatSignedPercent(metrics.comparisons.totalSpent.percent));
    setTextValue(kpiDeltaElements.dailyAverage, formatSignedPercent(metrics.comparisons.dailyAverage.percent));
  } else {
    setTextValue(kpiDeltaElements.totalSpent, t("status.noBase"));
    setTextValue(kpiDeltaElements.dailyAverage, t("status.currentAverage"));
  }

  setTextValue(
    kpiDeltaElements.goalProgress,
    metrics.goalAmount > 0
      ? metrics.isGoalMet
        ? metrics.goalExceededAmount > 0
          ? getCurrentLanguage() === "en"
            ? `+ ${formatMoney(metrics.goalExceededAmount)} extra`
            : `+ ${formatMoney(metrics.goalExceededAmount)} extra`
          : t("status.goalMet")
        : !metrics.investmentTransactionsCount
          ? t("status.noContributions")
        : getCurrentLanguage() === "en"
          ? `Still to invest ${formatMoney(metrics.goalRemainingAmount)}`
          : `Falta invertir ${formatMoney(metrics.goalRemainingAmount)}`
      : t("status.noGoal")
  );

  setTextValue(kpiCaptionElements.totalSpent, getCurrentLanguage() === "en" ? "Only living expenses from the active month. Investment is shown separately." : "Solo gastos de vida del mes activo. La inversion se muestra aparte.");
  setTextValue(kpiCaptionElements.investedThisMonth, getCurrentLanguage() === "en" ? "Sum of movements recorded in the Investment category." : "Suma de los movimientos cargados en la categoria Inversion.");
  setTextValue(kpiCaptionElements.dailyAverage, getCurrentLanguage() === "en" ? "Daily average using elapsed or recorded days." : "Promedio diario usando los dias cargados o transcurridos.");
  setTextValue(kpiCaptionElements.goalProgress, getCurrentLanguage() === "en" ? "Percentage of your monthly goal covered with Investment movements." : "Porcentaje de tu meta mensual cubierto con movimientos en Inversion.");
};

const renderIncomeCard = (metrics, animate) => {
  const incomeGoalGapValue = metrics.isGoalMet ? metrics.goalExceededAmount : metrics.goalRemainingAmount;
  const incomeGoalGapLabel = metrics.isGoalMet
    ? metrics.goalExceededAmount > 0
      ? t("goal.exceeded")
      : t("status.goalMet")
    : t("goal.toInvest");

  animateValue(summaryElements.incomeTotal, metrics.totalIncome, { animate });
  animateValue(summaryElements.incomeBase, metrics.incomeBase, { animate });
  animateValue(summaryElements.incomeExtra, metrics.incomeExtra, { animate });
  animateValue(summaryElements.incomeBalance, metrics.remainingBalance, { animate });
  animateValue(summaryElements.incomeAvailableToSave, metrics.savingsCapacityAmount, { animate });
  animateValue(summaryElements.incomeCapacityAmount, metrics.savingsCapacityAmount, { animate });
  animateValue(summaryElements.incomeSpent, metrics.totalSpent, { animate });
  animateValue(summaryElements.incomeGoalAmount, metrics.goalAmount, { animate });
  animateValue(summaryElements.incomeGoalSaved, metrics.investedThisMonth, { animate });
  animateValue(summaryElements.incomeGoalGap, incomeGoalGapValue, { animate });
  setTextValue(
    textElements.incomeCaption,
    metrics.totalIncome
      ? getCurrentLanguage() === "en"
        ? "Total income defines this month's ceiling: base and extra update the available balance instantly."
        : "El ingreso total marca el techo del mes: base y extra actualizan al instante el saldo disponible."
      : getCurrentLanguage() === "en"
        ? "Set a base income and an extra income to build a realistic month plan."
        : "Define un ingreso base y otro extra para construir el plan real del mes."
  );
  setTextValue(
    textElements.incomeUsageCopy,
    metrics.totalIncome
      ? getCurrentLanguage() === "en"
        ? "Savings capacity = available balance / total income. Available to save = positive available balance after real expenses."
        : "Capacidad de ahorro = saldo disponible / ingreso total. Disponible para ahorrar = saldo disponible positivo despues de gastos reales."
      : getCurrentLanguage() === "en"
        ? "Once you add income and movements you will see how much real savings capacity is left."
        : "Cuando cargues ingreso y movimientos vas a ver cuanta capacidad de ahorro real te queda."
  );
  setTextValue(textElements.incomeGoalLabel, getDisplayGoalLabel(metrics.goalLabel));
  setTextValue(textElements.incomeGoalGapLabel, incomeGoalGapLabel);
  setTextValue(
    textElements.incomeGoalCopy,
    metrics.goalAmount > 0
      ? getCurrentLanguage() === "en"
        ? "Adjust income and goals to keep the month consistent."
        : "Ajusta tus ingresos y metas para mantener coherencia mensual."
      : getCurrentLanguage() === "en"
        ? "Add income and define a monthly goal to organize the plan from here."
        : "Carga ingreso y define una meta mensual para ordenar el plan del mes desde aqui."
  );
  setTextValue(
    textElements.incomeUsageLabel,
    getSavingsCapacityHeadline(metrics)
  );
  setTextValue(
    textElements.incomeResultCopy,
    metrics.goalAmount > 0
      ? getCurrentLanguage() === "en"
        ? `Available to save: ${formatMoney(metrics.savingsCapacityAmount)}. The goal "${getDisplayGoalLabel(metrics.goalLabel)}" is ${formatPercent(metrics.goalProgressPercent, 1)} covered by real contributions.`
        : `Disponible para ahorrar: ${formatMoney(metrics.savingsCapacityAmount)}. La meta "${getDisplayGoalLabel(metrics.goalLabel)}" lleva ${formatPercent(metrics.goalProgressPercent, 1)} cubierto con aportes reales.`
      : getCurrentLanguage() === "en"
        ? "The available balance can go negative; available to save only shows the positive margin for the month."
        : "El saldo disponible puede quedar negativo; el disponible para ahorrar solo muestra el margen positivo del mes."
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
  setTextValue(
    textElements.categoryCountPill,
    getCurrentLanguage() === "en"
      ? `${metrics.activeCategoryCount} categor${metrics.activeCategoryCount === 1 ? "y" : "ies"}`
      : `${metrics.activeCategoryCount} categoria${metrics.activeCategoryCount === 1 ? "" : "s"}`
  );

  if (!categoryLegend) {
    return;
  }

  if (!metrics.categoryBreakdown.length) {
    uiState.categoryLegendItems = [];
    uiState.categoryHighlightIndex = -1;
    categoryLegend.innerHTML = `<div class="expense-list__empty"><strong>${escapeHtml(t("charts.noCategories"))}</strong><p>${escapeHtml(t("charts.noCategoriesCopy"))}</p></div>`;
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
      return `<div class="legend-item" data-legend-index="${index}" tabindex="0" style="--legend-accent:${swatch.color};"><div class="legend-item__title"><span class="legend-swatch" aria-hidden="true"></span><span>${escapeHtml(getCategoryLabel(item.category))}</span></div><div class="legend-item__value"><strong>${escapeHtml(formatPercent(item.share, item.share < 10 ? 1 : 0))}</strong><span>${escapeHtml(formatMoney(item.total))}</span></div></div>`;
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
  metrics.spendingTransactions.forEach((expense) => {
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

  if (!metrics.expenseTransactionCount) {
    applyStatusPill(statusElements.line, t("status.noExpenses"), "neutral");
    return;
  }

  if (!metrics.hasPreviousData) {
    applyStatusPill(
      statusElements.line,
      getCurrentLanguage() === "en"
        ? `Projection ${formatMoney(metrics.projectedMonthlySpend)}`
        : `Proyeccion ${formatMoney(metrics.projectedMonthlySpend)}`,
      "neutral"
    );
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
  const dailyAverageTone = metrics.expenseTransactionCount
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
    : metrics.expenseTransactionCount
      ? "blue"
      : "slate";
  const dominantCategoryValue = metrics.topCategory ? getCategoryLabel(metrics.topCategory.category) : t("insights.noCategory");
  const spentRatioValue = metrics.totalIncome > 0 ? formatPercent(metrics.spentRatio, 1) : t("status.noIncome");
  const savingsCapacityValue = metrics.totalIncome > 0 ? formatPercent(metrics.savingsCapacityPercent, 1) : t("status.noIncome");
  const investedIncomePercent = metrics.totalIncome > 0 ? roundCurrency((metrics.investedThisMonth / metrics.totalIncome) * 100) : 0;
  const investmentTone = metrics.investedThisMonth > 0 ? "amber" : "slate";
  const dominantCategoryDetails = metrics.topCategory
    ? getCurrentLanguage() === "en"
      ? `Your biggest expense is ${getCategoryLabel(metrics.topCategory.category)} (${formatPercent(metrics.topCategory.share, 1)}).`
      : `Tu mayor gasto es ${getCategoryLabel(metrics.topCategory.category)} (${formatPercent(metrics.topCategory.share, 1)}).`
    : getCurrentLanguage() === "en"
      ? "There is no dominant category yet."
      : "Todavia no hay una categoria dominante.";

  return [
    createInsight(
      t("insights.incomeUse"),
      spendingTone,
      spentRatioValue,
      metrics.totalIncome > 0
        ? isSpendingOverIncome
          ? getCurrentLanguage() === "en"
            ? `You are already using ${spentRatioValue} and you are above your income.`
            : `Ya estas usando ${spentRatioValue} y superas tu ingreso.`
          : getCurrentLanguage() === "en"
            ? `You are using ${spentRatioValue} of your income.`
            : `Estas usando ${spentRatioValue} de tu ingreso.`
        : metrics.expenseTransactionCount
          ? getCurrentLanguage() === "en"
            ? "Add income to measure this percentage."
            : "Carga el ingreso para medir este porcentaje."
          : getCurrentLanguage() === "en"
            ? "There are no recorded expenses yet."
            : "Todavia no hay gastos registrados."
    ),
    createInsight(
      t("insights.savingsCapacity"),
      capacityTone,
      savingsCapacityValue,
      metrics.totalIncome > 0
        ? metrics.remainingBalance >= 0
          ? getCurrentLanguage() === "en"
            ? `Your savings capacity is ${savingsCapacityValue}.`
            : `Tu capacidad de ahorro es ${savingsCapacityValue}.`
          : getCurrentLanguage() === "en"
            ? "Your balance already exceeds monthly income."
            : "Tu saldo ya supera el ingreso mensual."
        : getCurrentLanguage() === "en"
          ? "It is calculated as available balance / total income."
          : "Se calcula con saldo disponible / ingreso total."
    ),
    createInsight(
      t("insights.dailyAverage"),
      dailyAverageTone,
      formatMoney(metrics.dailyAverage),
      metrics.expenseTransactionCount
        ? getCurrentLanguage() === "en"
          ? "Daily average for the active month."
          : "Promedio diario del mes activo."
        : getCurrentLanguage() === "en"
          ? "It activates once you record movements."
          : "Se activa cuando registras movimientos."
    ),
    createInsight(
      t("insights.closingProjection"),
      projectionTone,
      formatMoney(metrics.projectedMonthlySpend),
      metrics.expenseTransactionCount
        ? getCurrentLanguage() === "en"
          ? `If you keep this pace, you will close at ${formatMoney(metrics.projectedMonthlySpend)}.`
          : `Si seguis asi, vas a cerrar en ${formatMoney(metrics.projectedMonthlySpend)}.`
        : getCurrentLanguage() === "en"
          ? "No movements yet to project the closing."
          : "Sin movimientos para proyectar el cierre."
    ),
    createInsight(
      t("insights.dominantCategory"),
      metrics.topCategory ? "blue" : "slate",
      dominantCategoryValue,
      dominantCategoryDetails
    ),
    createInsight(
      t("insights.monthlyInvestment"),
      investmentTone,
      formatMoney(metrics.investedThisMonth),
      metrics.investedThisMonth > 0
        ? metrics.totalIncome > 0
          ? getCurrentLanguage() === "en"
            ? `You invested ${formatMoney(metrics.investedThisMonth)} (${formatPercent(investedIncomePercent, 1)} of income).`
            : `Invertiste ${formatMoney(metrics.investedThisMonth)} (${formatPercent(investedIncomePercent, 1)} del ingreso).`
          : getCurrentLanguage() === "en"
            ? `${formatNumber(metrics.investmentTransactionsCount)} contribution(s) recorded this month.`
            : `${formatNumber(metrics.investmentTransactionsCount)} aporte(s) registrados este mes.`
        : getCurrentLanguage() === "en"
          ? "You have not recorded Investment contributions yet."
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
    return `<div class="expense-list__empty"><strong>${escapeHtml(t("emptyState.noExpensesTitle", { month: metrics.monthLabelLong }))}</strong><p>${escapeHtml(t("emptyState.noExpensesCopy"))}</p><div class="expense-list__actions"><button class="button button--accent button--small" type="button" data-list-action="open-investment">${escapeHtml(t("income.registerInvestment"))}</button><button class="button button--ghost button--small" type="button" data-list-action="open-add">${escapeHtml(t("hero.registerExpense"))}</button>${!state.expenses.length ? `<button class="button button--ghost button--small" type="button" data-list-action="restore-sample">${escapeHtml(t("emptyState.loadSample"))}</button>` : ""}</div></div>`;
  }

  return `<div class="expense-list__empty"><strong>${escapeHtml(t("emptyState.noFilteredTitle"))}</strong><p>${escapeHtml(t("emptyState.noFilteredCopy"))}</p><div class="expense-list__actions"><button class="button button--ghost button--small" type="button" data-list-action="clear-filters">${escapeHtml(t("filters.clearFilters"))}</button><button class="button button--ghost button--small" type="button" data-list-action="open-filters">${escapeHtml(t("emptyState.adjustFilters"))}</button></div></div>`;
};

const renderExpenseList = (state, metrics, context) => {
  if (!expenseList) {
    return;
  }

  setTextValue(expenseResults, t("activity.visibleResults", { count: formatNumber(context.visibleExpenses.length, 0) }));

  if (!context.visibleExpenses.length) {
    expenseList.innerHTML = getEmptyStateMarkup(state, metrics, context);
    return;
  }

  expenseList.innerHTML = context.visibleExpenses
    .map((expense) => {
      const isInvestmentExpense = isInvestmentCategory(expense.category);
      const movementCopy = getMovementCopy(expense.category);
      const notePreview = expense.note ? `<p class="expense-row__note">${escapeHtml(expense.note)}</p>` : "";
      const movementTypeBadge = isInvestmentExpense
        ? `<span class="badge badge--investment">${escapeHtml(t("movementTypes.investment"))}</span>`
        : `<span class="badge badge--slate">${escapeHtml(t("movementTypes.expense"))}</span>`;
      const fixedBadge = expense.isFixed
        ? `<span class="badge badge--fixed">${escapeHtml(t("frequency.fixed"))}</span>`
        : `<span class="badge badge--variable">${escapeHtml(t("frequency.variable"))}</span>`;
      const amountClass = isInvestmentExpense ? "expense-row__amount expense-row__amount--investment" : "expense-row__amount";

      return `<article class="expense-row${isInvestmentExpense ? " expense-row--investment" : ""}"><div class="expense-row__merchant"><strong>${escapeHtml(expense.title)}</strong>${notePreview || `<span>${escapeHtml(getCategoryLabel(expense.category))} - ${escapeHtml(getPaymentMethodLabel(expense.paymentMethod))}</span>`}</div><div class="expense-row__meta">${movementTypeBadge}<span class="badge ${getCategoryTone(expense.category)}">${escapeHtml(getCategoryLabel(expense.category))}</span><span class="badge badge--method">${escapeHtml(getPaymentMethodLabel(expense.paymentMethod))}</span>${fixedBadge}<span class="expense-row__method">${escapeHtml(formatLocalizedDate(expense.date, { month: "short", day: "numeric", year: "numeric" }).replace(".", ""))}</span></div><div class="expense-row__side"><strong class="${amountClass}">- ${escapeHtml(formatMoney(expense.amount))}</strong><div class="expense-row__actions"><button class="icon-button icon-button--soft" type="button" aria-label="${escapeHtml(movementCopy.editLabel)}" data-expense-action="edit" data-expense-id="${expense.id}"><svg viewBox="0 0 24 24" fill="none"><path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20Z"></path><path d="m12.5 7 4.5 4.5"></path></svg></button><button class="icon-button icon-button--soft" type="button" aria-label="${escapeHtml(movementCopy.duplicateLabel)}" data-expense-action="duplicate" data-expense-id="${expense.id}"><svg viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"></path></svg></button><button class="icon-button icon-button--soft" type="button" aria-label="${escapeHtml(movementCopy.deleteLabel)}" data-expense-action="delete" data-expense-id="${expense.id}"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7.5h16"></path><path d="M9.5 10.5v6"></path><path d="M14.5 10.5v6"></path><path d="M6.5 7.5 7.4 19a2 2 0 0 0 2 1.8h5.2a2 2 0 0 0 2-1.8l.9-11.5"></path><path d="M9 7.5V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8v1.7"></path></svg></button></div></div></article>`;
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

  setTextValue(filterSearchPreview, context.searchQuery ? t("filters.searchPreview", { query: context.filters.search }) : t("filters.noSearch"));
  setTextValue(
    filterResultsCopy,
    t("filters.resultsCopy", {
      count: formatNumber(context.visibleExpenses.length, 0),
      month: metrics.monthLabelLong,
      sort: getSortLabel(context.filters.sort),
    })
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
  setTextValue(exportSummary, t("exportState.ready", { count: formatNumber(context.visibleExpenses.length, 0) }));
  setTextValue(exportFilename, `${getExportBaseFilename(metrics)}.csv`);
  setTextValue(
    exportCopy,
    context.visibleExpenses.length
      ? t("exportState.copy", {
        month: metrics.monthLabelLong,
        category: context.filters.category === "all" ? t("exportState.allCategories") : getCategoryLabel(context.filters.category),
        method: context.filters.paymentMethod === "all" ? t("exportState.allMethods") : getPaymentMethodLabel(context.filters.paymentMethod),
      })
      : t("exportState.empty")
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
  setTextValue(
    calendarCopy,
    getCurrentLanguage() === "en"
      ? `Click any available month in ${yearContext.activeYear} to update summary, transactions, goal and charts without reloading the page.`
      : `Haz clic en cualquier mes disponible de ${yearContext.activeYear} para actualizar resumen, transacciones, meta y graficos sin recargar la pagina.`
  );
  setTextValue(
    calendarSummaryNote,
    yearContext.monthsWithDataCount
      ? getCurrentLanguage() === "en"
        ? `Average calculated from ${formatNumber(yearContext.monthsWithDataCount)} month(s) with movements. Expenses include only real expenses; investment stays separate.`
        : `Promedio calculado sobre ${formatNumber(yearContext.monthsWithDataCount)} mes(es) con movimientos. Los gastos muestran solo gastos reales; la inversion va aparte.`
      : getCurrentLanguage() === "en"
        ? "There are no months with movements in this year yet. Use the calendar to navigate and add data when you need it."
        : "Todavia no hay meses con movimientos en este año. Usa el calendario para navegar y cargar datos cuando los necesites."
  );

  if (!calendarGrid) {
    return;
  }

  calendarGrid.innerHTML = yearContext.months
    .map((month) => {
      const isDisabled = month.isFuture && !month.hasData;
      const stateLabel = month.isGoalMet
        ? t("status.goalMet")
        : month.hasData
          ? t("status.withMovements")
          : isDisabled
            ? t("status.future")
            : t("status.noData");
      const monthCopy = month.hasData
        ? getCurrentLanguage() === "en"
          ? `${formatPercent(month.goalProgressPercent, 1)} of goal invested`
          : `${formatPercent(month.goalProgressPercent, 1)} de meta invertida`
        : isDisabled
          ? getCurrentLanguage() === "en"
            ? "Future month without movements."
            : "Mes futuro sin movimientos."
          : getCurrentLanguage() === "en"
            ? "Month without recorded movements."
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

      return `<button class="${classes}" type="button" data-calendar-month="${month.monthKey}" ${isDisabled ? "disabled" : ""}><div class="calendar-month__header"><span>${escapeHtml(month.shortLabel)}</span><span class="calendar-month__status">${escapeHtml(stateLabel)}</span></div><strong class="calendar-month__value">${escapeHtml(formatMoney(month.totalSpent))}</strong><div class="calendar-month__meta"><span>${escapeHtml(getCurrentLanguage() === "en" ? "Expenses" : "Gastos")} ${escapeHtml(formatMoney(month.totalSpent))}</span><span>${escapeHtml(getCurrentLanguage() === "en" ? "Invested" : "Invertido")} ${escapeHtml(formatMoney(month.investedThisMonth))}</span></div><div class="progress calendar-month__progress"><span style="width: ${month.goalProgressBarPercent}%;"></span></div><small>${escapeHtml(monthCopy)}</small></button>`;
    })
    .join("");
};

const renderDashboard = (animate = false) => {
  const state = getState();
  const metrics = computeMetrics(state);
  const context = getVisibleExpensesContext(state, metrics);
  uiState.latestMetrics = metrics;

  translateStaticUi();
  renderTopbar(metrics);
  renderFloatingAction(metrics);
  renderSidebar(metrics, animate);
  renderHero(metrics, animate);
  renderFinancialFlow(metrics, animate);
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
    const scheduledFocusTarget = focusTarget;
    window.requestAnimationFrame(() => {
      if (scheduledFocusTarget?.isConnected) {
        scheduledFocusTarget.focus();
      }
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
  clearGoalFeedback();
  expenseForm?.reset();
  incomeForm?.reset();
  goalForm?.reset();

  const focusTarget = uiState.lastFocusedElement;
  uiState.lastFocusedElement = null;

  if (focusTarget instanceof HTMLElement) {
    window.requestAnimationFrame(() => {
      if (focusTarget.isConnected && typeof focusTarget.focus === "function") {
        focusTarget.focus();
      }
    });
  }
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
    return t("validation.description");
  }

  if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
    return t("validation.amount");
  }

  if (!payload.category) {
    return t("validation.category");
  }

  if (!payload.date || Number.isNaN(new Date(payload.date).getTime())) {
    return t("validation.date");
  }

  if (!payload.paymentMethod) {
    return t("validation.paymentMethod");
  }

  return "";
};

const validateIncomePayload = (incomeBase, incomeExtra) => {
  if (!Number.isFinite(incomeBase) || incomeBase < 0) {
    return t("validation.incomeBase");
  }

  if (!Number.isFinite(incomeExtra) || incomeExtra < 0) {
    return t("validation.incomeExtra");
  }

  return "";
};

const validateGoalPayload = (goalAmount) => {
  if (!Number.isFinite(goalAmount) || goalAmount <= 0) {
    return t("validation.goalAmount");
  }

  return "";
};

const updateIncomePreview = () => {
  const base = convertMoneyInputToBase(incomeBaseInput?.value || 0);
  const extra = convertMoneyInputToBase(incomeExtraInput?.value || 0);
  const total = roundCurrency((Number.isFinite(base) ? base : 0) + (Number.isFinite(extra) ? extra : 0));
  animateValue(incomeTotalPreview, total, { animate: false });
};

const updateGoalPreview = () => {
  const parsedGoalAmount = convertMoneyInputToBase(goalAmountInput?.value || 0);
  const goalAmount = Number.isFinite(parsedGoalAmount) ? parsedGoalAmount : 0;
  animateValue(goalAmountPreview, goalAmount, { animate: false });
  setTextValue(goalLabelPreview, getDisplayGoalLabel(String(goalLabelInput?.value || "").trim()));
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
    amount: convertMoneyInputToBase(formData.get("amount")),
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
  getFormField("amount").value = expense?.amount ? getDisplayMoneyInputValue(expense.amount) : "";
  getFormField("category").value = expense?.category || presetCategory || "";
  getFormField("date").value = expense?.date ? expense.date.slice(0, 10) : new Date().toISOString().slice(0, 10);
  getFormField("paymentMethod").value = expense?.paymentMethod || "";
  getFormField("note").value = expense?.note || "";
  getFormField("isFixed").checked = Boolean(expense?.isFixed);

  modalEyebrow.textContent = mode === "edit" ? (isInvestmentEntry ? t("modal.editInvestmentEyebrow") : t("modal.editExpenseEyebrow")) : isInvestmentMode ? t("modal.investmentEyebrow") : t("modal.formEyebrow");
  modalTitle.textContent = mode === "edit" ? (isInvestmentEntry ? t("modal.editInvestmentTitle") : t("modal.editExpenseTitle")) : isInvestmentMode ? t("modal.investmentTitle") : t("modal.expenseTitle");
  modalCopy.textContent = mode === "edit" ? (isInvestmentEntry ? t("modal.editInvestmentCopy") : t("modal.editExpenseCopy")) : isInvestmentMode ? t("modal.investmentCopy") : t("modal.expenseCopy");
  formSubmit.textContent = mode === "edit" ? (isInvestmentEntry ? t("modal.saveContribution") : t("modal.saveExpense")) : isInvestmentMode ? t("modal.saveContribution") : t("modal.saveExpense");
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
  incomeBaseInput.value = getDisplayMoneyInputValue(state.incomeBase || 0);
  incomeExtraInput.value = getDisplayMoneyInputValue(state.incomeExtra || 0);
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
  goalAmountInput.value = getDisplayMoneyInputValue(state.savingsGoalAmount || 0);
  goalLabelInput.value = String(state.savingsGoalLabel || "").trim();
  updateGoalPreview();
  openModal(goalAmountInput);
};

const refreshOpenModalContent = () => {
  if (!modal || modal.hidden) {
    return;
  }

  if (uiState.modalMode === "income") {
    openIncomeModal();
    return;
  }

  if (uiState.modalMode === "goal") {
    openGoalModal();
    return;
  }

  if (uiState.modalMode === "delete") {
    openDeleteModal(getExpenseById(uiState.activeExpenseId));
    return;
  }

  if (uiState.modalMode === "edit") {
    openExpenseModal("edit", getExpenseById(uiState.activeExpenseId));
    return;
  }

  if (uiState.modalMode === "investment") {
    openInvestmentModal();
    return;
  }

  if (uiState.modalMode === "add") {
    openExpenseModal("add");
  }
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
  setTextValue(confirmDate, formatLocalizedDate(expense.date, { month: "short", day: "numeric", year: "numeric" }).replace(".", ""));
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

  const base = convertMoneyInputToBase(incomeBaseInput?.value || 0);
  const extra = convertMoneyInputToBase(incomeExtraInput?.value || 0);
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
  showToast(t("toast.incomeUpdated"));
};

const handleGoalSubmit = (event) => {
  event.preventDefault();

  const goalAmount = convertMoneyInputToBase(goalAmountInput?.value || 0);
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
  showToast(t("toast.goalUpdated"));
};

const handleSearchUpdate = (value) => {
  applyFilterPatch({ search: String(value || "").trim() });
};

const exportVisibleExpenses = (format) => {
  const state = getState();
  const metrics = computeMetrics(state);
  const context = getVisibleExpensesContext(state, metrics);

  if (!context.visibleExpenses.length) {
    showToast(t("toast.noVisibleExpenses"), "error");
    return;
  }

  const contents = format === "json" ? serializeExpensesToJson(context.visibleExpenses) : serializeExpensesToCsv(context.visibleExpenses);
  downloadTextFile(`${getExportBaseFilename(metrics)}.${format}`, contents, format === "json" ? "application/json;charset=utf-8" : "text/csv;charset=utf-8");
  closeModal();
  showToast(t("toast.exportReady", { format: format.toUpperCase() }));
};

const openImportJsonPicker = () => {
  if (!importJsonInput) {
    return;
  }

  importJsonInput.value = "";
  importJsonInput.click();
};

const openImportCsvPicker = () => {
  if (!importCsvInput) {
    return;
  }

  importCsvInput.value = "";
  importCsvInput.click();
};

const handleImportJsonSelection = async (event) => {
  const selectedFile = event.target?.files?.[0];

  if (!selectedFile) {
    return;
  }

  try {
    const rawContents = await selectedFile.text();
    const parsedState = JSON.parse(rawContents);

    if (!isValidImportState(parsedState)) {
      throw new Error("invalid-import-state");
    }

    setState(parsedState);
    renderDashboard(true);
    showToast(t("toast.jsonImported"));
  } catch (error) {
    showToast(t("toast.jsonInvalid"), "error");
  } finally {
    if (importJsonInput) {
      importJsonInput.value = "";
    }
  }
};

const handleImportCsvSelection = async (event) => {
  const selectedFile = event.target?.files?.[0];

  if (!selectedFile) {
    return;
  }

  try {
    const rawContents = await selectedFile.text();
    const importedExpenses = parseExpensesFromCsv(rawContents);

    if (!importedExpenses?.length) {
      throw new Error("invalid-import-csv");
    }

    updateState((state) => ({
      expenses: [...importedExpenses, ...state.expenses],
    }));
    renderDashboard(true);
    showToast(t("toast.csvImported"));
  } catch (error) {
    showToast(t("toast.csvInvalid"), "error");
  } finally {
    if (importCsvInput) {
      importCsvInput.value = "";
    }
  }
};

const restoreSampleData = () => {
  setState(getSampleState());
  closeModal();
  renderDashboard(true);
  setActiveView(DEFAULT_VIEW, { instant: true });
  showToast(t("toast.sampleRestored"));
};

const registerEventListeners = () => {
  registerAppEventListeners({
    dom: window.aleclvExpenseTrackerDom,
    onFabClick: () => {
      if (fab?.dataset.fabAction === "investment") {
        openInvestmentModal();
        return;
      }

      openExpenseModal("add");
    },
    onOpenExpenseClick: () => openExpenseModal("add"),
    onOpenIncomeClick: openIncomeModal,
    onOpenGoalClick: openGoalModal,
    onOpenInvestmentClick: openInvestmentModal,
    onOpenFiltersClick: openFiltersModal,
    onOpenImportJsonClick: openImportJsonPicker,
    onOpenImportCsvClick: openImportCsvPicker,
    onOpenExportClick: openExportModal,
    onOpenRestoreClick: openRestoreModal,
    onModalCloseClick: closeModal,
    onLanguageOptionClick: (language) => setLanguage(language),
    onImportJsonSelection: handleImportJsonSelection,
    onImportCsvSelection: handleImportCsvSelection,
    onExpenseFormSubmit: handleExpenseSubmit,
    onExpenseFormInput: clearFormFeedback,
    onExpenseFormChange: clearFormFeedback,
    onIncomeFormSubmit: handleIncomeSubmit,
    onIncomeFormInput: () => {
      clearIncomeFeedback();
      updateIncomePreview();
    },
    onIncomeFormChange: () => {
      clearIncomeFeedback();
      updateIncomePreview();
    },
    onGoalFormSubmit: handleGoalSubmit,
    onGoalFormInput: () => {
      clearGoalFeedback();
      updateGoalPreview();
    },
    onGoalFormChange: () => {
      clearGoalFeedback();
      updateGoalPreview();
    },
    onConfirmDeleteClick: handleDeleteExpense,
    onConfirmRestoreClick: restoreSampleData,
    onClearFiltersClick: resetFilters,
    onExportJsonClick: () => exportVisibleExpenses("json"),
    onExportCsvClick: () => exportVisibleExpenses("csv"),
    onCalendarShiftClick: (offset) => shiftCalendarYear(offset),
    onSearchInput: (event) => handleSearchUpdate(event.target.value),
    onFilterMonthChange: (event) => applyFilterPatch({ month: event.target.value || getDefaultFilters(getState()).month }),
    onFilterCategoryChange: (event) => applyFilterPatch({ category: event.target.value || "all" }),
    onFilterPaymentMethodChange: (event) => applyFilterPatch({ paymentMethod: event.target.value || "all" }),
    onFilterExpenseTypeChange: (event) => applyFilterPatch({ expenseType: event.target.value || "all" }),
    onFilterSortChange: (event) => applyFilterPatch({ sort: event.target.value || "newest" }),
    onFilterFormSubmit: (event) => {
      event.preventDefault();
      closeModal();
    },
    onExpenseListClick: (event) => {
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
    },
    onCalendarGridClick: (event) => {
      const monthTrigger = event.target.closest("[data-calendar-month]");
      if (!(monthTrigger instanceof HTMLButtonElement) || monthTrigger.disabled) {
        return;
      }

      setActiveMonth(monthTrigger.dataset.calendarMonth, true);
    },
    onCategoryLegendMouseOver: (event) => {
      const legendItem = event.target.closest("[data-legend-index]");
      if (!legendItem || !categoryLegend.contains(legendItem)) {
        return;
      }

      setCategoryMixHighlight(Number(legendItem.dataset.legendIndex));
    },
    onCategoryLegendMouseLeave: () => setCategoryMixHighlight(-1),
    onCategoryLegendFocusIn: (event) => {
      const legendItem = event.target.closest("[data-legend-index]");
      if (!legendItem || !categoryLegend.contains(legendItem)) {
        return;
      }

      setCategoryMixHighlight(Number(legendItem.dataset.legendIndex));
    },
    onCategoryLegendFocusOut: (event) => {
      if (categoryLegend.contains(event.relatedTarget)) {
        return;
      }

      setCategoryMixHighlight(-1);
    },
    onMenuToggleClick: () => body.classList.toggle("sidebar-open"),
    onBackdropClick: () => body.classList.remove("sidebar-open"),
    onNavItemClick: (viewName) => setActiveView(viewName),
    onWindowResize: () => {
      if (window.innerWidth >= 1120) {
        body.classList.remove("sidebar-open");
      }
    },
    onWindowKeyDown: (event) => {
      if (event.key === "Escape" && modal && !modal.hidden) {
        closeModal();
      }
    },
    onWindowLoad: () => {
      window.setTimeout(() => {
        body.classList.remove("is-loading");
        body.classList.add("is-ready");
        renderDashboard(true);
      }, 900);
    },
    onServiceWorkerLoad: "serviceWorker" in navigator
      ? () => navigator.serviceWorker.register("./service-worker.js", { scope: "./" }).catch(() => null)
      : null,
  });
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

    if (shouldFocusMain && dashboardMain instanceof HTMLElement && dashboardMain.isConnected) {
      dashboardMain.focus({ preventScroll: true });
    }
  });
};

const initializeInteractions = () => {
  setCurrency(readPersistedCurrency(uiState.currentLanguage));
  persistLanguageSettings(uiState.currentLanguage);
  renderDashboard(false);
  setActiveView(uiState.activeView, { instant: true });
  refreshExchangeRate();
  registerEventListeners();
};

initializeInteractions();

