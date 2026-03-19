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
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
    } = options;

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  };

  const formatDate = (value, options = {}) => {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...options,
    }).format(date);
  };

  window.aleclvFinanceUtils = {
    generateId,
    formatCurrency,
    formatDate,
  };
})();
