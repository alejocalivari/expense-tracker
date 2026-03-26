(function () {
  const DEFAULT_LOCALE = "es-AR";
  const DEFAULT_CURRENCY = "ARS";

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
    generateId,
    formatCurrency,
    formatDate,
  };

  window.aleclvExpenseTrackerUtils = utilsApi;
})();
