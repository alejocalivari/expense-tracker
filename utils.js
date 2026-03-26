(function () {
  const DEFAULT_LOCALE = "es-AR";
  const DEFAULT_CURRENCY = "ARS";
  const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;

  const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const roundCurrency = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
  const escapeHtml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const normalizeText = (value = "") => String(value).trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const toSafeNumber = (value) => {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
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
  const getYearFromMonthKey = (monthKey) => Number(String(monthKey || "").split("-")[0]) || new Date().getFullYear();
  const getMonthNumberFromMonthKey = (monthKey) => Number(String(monthKey || "").split("-")[1]) || 1;
  const buildMonthKey = (year, monthNumber) => `${year}-${String(monthNumber).padStart(2, "0")}`;
  const isFutureMonthKey = (monthKey) => monthKey > getCurrentMonthKey();
  const getDaysInMonth = (monthKey) => {
    const [year, month] = monthKey.split("-").map(Number);
    return new Date(year, month, 0).getDate();
  };
  const getRemainingDaysInMonth = (monthKey) => {
    if (!isValidMonthKey(monthKey)) {
      return 0;
    }

    const currentMonthKey = getCurrentMonthKey();

    if (monthKey < currentMonthKey) {
      return 0;
    }

    const daysInMonth = getDaysInMonth(monthKey);

    if (monthKey > currentMonthKey) {
      return daysInMonth;
    }

    return Math.max(daysInMonth - new Date().getDate(), 0);
  };
  const getSpendTodayAmount = (liquidityAmount, monthKey) => {
    const safeLiquidityAmount = Number(liquidityAmount);
    const normalizedLiquidityAmount = Number.isFinite(safeLiquidityAmount) ? safeLiquidityAmount : 0;
    const daysRemaining = getRemainingDaysInMonth(monthKey);

    if (daysRemaining <= 0) {
      return Math.round(normalizedLiquidityAmount);
    }

    const dailyAmount = normalizedLiquidityAmount / daysRemaining;
    return Number.isFinite(dailyAmount) ? Math.round(dailyAmount) : 0;
  };

  const generateId = () => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    const randomSegment = Math.random().toString(36).slice(2, 10);
    return `exp_${Date.now().toString(36)}_${randomSegment}`;
  };

  const formatCurrency = (value, options = {}) => {
    const {
      locale = DEFAULT_LOCALE,
      currency = DEFAULT_CURRENCY,
      currencyDisplay = "symbol",
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
    } = options;

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  };

  const formatDate = (value, options = {}) => {
    const {
      locale = DEFAULT_LOCALE,
      ...dateOptions
    } = options;
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...dateOptions,
    }).format(date);
  };

  const utilsApi = {
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
    generateId,
    formatCurrency,
    formatDate,
  };

  window.aleclvExpenseTrackerUtils = utilsApi;
})();
