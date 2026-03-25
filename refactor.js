const fs = require('fs');
const scriptPath = 'c:/Users/Alejo/Documents/GitHub/expense-tracker/script.js';
const utilsPath = 'c:/Users/Alejo/Documents/GitHub/expense-tracker/utils.js';

let scriptContent = fs.readFileSync(scriptPath, 'utf8');
let utilsContent = fs.readFileSync(utilsPath, 'utf8');

const utilsToAdd = `  const MONTH_KEY_PATTERN = /^\\d{4}-\\d{2}$/;
  const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const roundCurrency = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
  const escapeHtml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const normalizeText = (value = "") => String(value).trim().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();

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
    return Number.isNaN(parsed.getTime()) ? "" : \`\${parsed.getFullYear()}-\${String(parsed.getMonth() + 1).padStart(2, "0")}\`;
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
    return \`\${date.getUTCFullYear()}-\${String(date.getUTCMonth() + 1).padStart(2, "0")}\`;
  };
  const getYearFromMonthKey = (monthKey) => Number(String(monthKey || "").split("-")[0]) || new Date().getFullYear();
  const getMonthNumberFromMonthKey = (monthKey) => Number(String(monthKey || "").split("-")[1]) || 1;
  const buildMonthKey = (year, monthNumber) => \`\${year}-\${String(monthNumber).padStart(2, "0")}\`;
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

  const utilsApi = {`;

const utilsExportsToAdd = `    MONTH_KEY_PATTERN,
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
    getSpendTodayAmount,`;

utilsContent = utilsContent.replace('  const utilsApi = {', utilsToAdd + '\\n' + utilsExportsToAdd);
fs.writeFileSync(utilsPath, utilsContent, 'utf8');

const toRemove = [
  'const MONTH_KEY_PATTERN = /^\\d{4}-\\d{2}$/;',
  'const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;',
  'const clamp = (value, min, max) => Math.min(Math.max(value, min), max);',
  'const roundCurrency = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;',
  'const escapeHtml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(\'"\', "&quot;").replaceAll("\'", "&#39;");',
  'const normalizeText = (value = "") => String(value).trim().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();',
  'const toSafeNumber = (value) => {\\r\\n  const parsedValue = Number(value);\\r\\n  return Number.isFinite(parsedValue) ? parsedValue : 0;\\r\\n};',
  'const toSafeNumber = (value) => {\\n  const parsedValue = Number(value);\\n  return Number.isFinite(parsedValue) ? parsedValue : 0;\\n};',
  'const readDecimals = (element) => Number(element?.dataset.decimals || 0);',
  'const isValidMonthKey = (value) => MONTH_KEY_PATTERN.test(String(value || "").trim());',
  'const getExpenseDate = (expense) => {\\n  const parsed = new Date(expense?.date);\\n  return Number.isNaN(parsed.getTime()) ? null : parsed;\\n};',
  'const getExpenseDate = (expense) => {\\r\\n  const parsed = new Date(expense?.date);\\r\\n  return Number.isNaN(parsed.getTime()) ? null : parsed;\\r\\n};',
  'const getMonthKey = (value) => {\\n  const parsed = value instanceof Date ? value : new Date(value);\\n  return Number.isNaN(parsed.getTime()) ? "" : `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;\\n};',
  'const getMonthKey = (value) => {\\r\\n  const parsed = value instanceof Date ? value : new Date(value);\\r\\n  return Number.isNaN(parsed.getTime()) ? "" : `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;\\r\\n};',
  'const getCurrentMonthKey = () => getMonthKey(new Date());',
  'const getLatestMonthKey = (expenses = []) => {\\n  const latestDate = expenses.reduce((latest, expense) => {\\n    const parsed = getExpenseDate(expense);\\n    return !parsed || (latest && latest > parsed) ? latest : parsed;\\n  }, null);\\n\\n  return latestDate ? getMonthKey(latestDate) : getCurrentMonthKey();\\n};',
  'const getLatestMonthKey = (expenses = []) => {\\r\\n  const latestDate = expenses.reduce((latest, expense) => {\\r\\n    const parsed = getExpenseDate(expense);\\r\\n    return !parsed || (latest && latest > parsed) ? latest : parsed;\\r\\n  }, null);\\r\\n\\r\\n  return latestDate ? getMonthKey(latestDate) : getCurrentMonthKey();\\r\\n};',
  'const shiftMonthKey = (monthKey, offset) => {\\n  const [year, month] = monthKey.split("-").map(Number);\\n  const date = new Date(Date.UTC(year, month - 1 + offset, 1, 12));\\n  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;\\n};',
  'const shiftMonthKey = (monthKey, offset) => {\\r\\n  const [year, month] = monthKey.split("-").map(Number);\\r\\n  const date = new Date(Date.UTC(year, month - 1 + offset, 1, 12));\\r\\n  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;\\r\\n};',
  'const getYearFromMonthKey = (monthKey) => Number(String(monthKey || "").split("-")[0]) || new Date().getFullYear();',
  'const getMonthNumberFromMonthKey = (monthKey) => Number(String(monthKey || "").split("-")[1]) || 1;',
  'const buildMonthKey = (year, monthNumber) => `${year}-${String(monthNumber).padStart(2, "0")}`;',
  'const isFutureMonthKey = (monthKey) => monthKey > getCurrentMonthKey();',
  'const getDaysInMonth = (monthKey) => {\\n  const [year, month] = monthKey.split("-").map(Number);\\n  return new Date(year, month, 0).getDate();\\n};',
  'const getDaysInMonth = (monthKey) => {\\r\\n  const [year, month] = monthKey.split("-").map(Number);\\r\\n  return new Date(year, month, 0).getDate();\\r\\n};',
  'const getRemainingDaysInMonth = (monthKey) => {\\n  if (!isValidMonthKey(monthKey)) {\\n    return 0;\\n  }\\n\\n  const currentMonthKey = getCurrentMonthKey();\\n\\n  if (monthKey < currentMonthKey) {\\n    return 0;\\n  }\\n\\n  const daysInMonth = getDaysInMonth(monthKey);\\n\\n  if (monthKey > currentMonthKey) {\\n    return daysInMonth;\\n  }\\n\\n  return Math.max(daysInMonth - new Date().getDate(), 0);\\n};',
  'const getRemainingDaysInMonth = (monthKey) => {\\r\\n  if (!isValidMonthKey(monthKey)) {\\r\\n    return 0;\\r\\n  }\\r\\n\\r\\n  const currentMonthKey = getCurrentMonthKey();\\r\\n\\r\\n  if (monthKey < currentMonthKey) {\\r\\n    return 0;\\r\\n  }\\r\\n\\r\\n  const daysInMonth = getDaysInMonth(monthKey);\\r\\n\\r\\n  if (monthKey > currentMonthKey) {\\r\\n    return daysInMonth;\\r\\n  }\\r\\n\\r\\n  return Math.max(daysInMonth - new Date().getDate(), 0);\\r\\n};',
  'const getSpendTodayAmount = (liquidityAmount, monthKey) => {\\n  const safeLiquidityAmount = Number(liquidityAmount);\\n  const normalizedLiquidityAmount = Number.isFinite(safeLiquidityAmount) ? safeLiquidityAmount : 0;\\n  const daysRemaining = getRemainingDaysInMonth(monthKey);\\n\\n  if (daysRemaining <= 0) {\\n    return Math.round(normalizedLiquidityAmount);\\n  }\\n\\n  const dailyAmount = normalizedLiquidityAmount / daysRemaining;\\n  return Number.isFinite(dailyAmount) ? Math.round(dailyAmount) : 0;\\n};',
  'const getSpendTodayAmount = (liquidityAmount, monthKey) => {\\r\\n  const safeLiquidityAmount = Number(liquidityAmount);\\r\\n  const normalizedLiquidityAmount = Number.isFinite(safeLiquidityAmount) ? safeLiquidityAmount : 0;\\r\\n  const daysRemaining = getRemainingDaysInMonth(monthKey);\\r\\n\\r\\n  if (daysRemaining <= 0) {\\r\\n    return Math.round(normalizedLiquidityAmount);\\r\\n  }\\r\\n\\r\\n  const dailyAmount = normalizedLiquidityAmount / daysRemaining;\\r\\n  return Number.isFinite(dailyAmount) ? Math.round(dailyAmount) : 0;\\r\\n};'
];

toRemove.forEach(str => {
  scriptContent = scriptContent.replace(str + '\\r\\n', '');
  scriptContent = scriptContent.replace(str + '\\n', '');
  scriptContent = scriptContent.replace(str, '');
});

const destructuringOriginal = 'const { formatCurrency, formatDate, generateId } = window.aleclvExpenseTrackerUtils;';
const destructuringNew = `const {
  formatCurrency, formatDate, generateId, MONTH_KEY_PATTERN,
  prefersReducedMotion, clamp, roundCurrency, escapeHtml, normalizeText,
  toSafeNumber, readDecimals, isValidMonthKey, getExpenseDate, getMonthKey,
  getCurrentMonthKey, getLatestMonthKey, shiftMonthKey, getYearFromMonthKey,
  getMonthNumberFromMonthKey, buildMonthKey, isFutureMonthKey, getDaysInMonth,
  getRemainingDaysInMonth, getSpendTodayAmount
} = window.aleclvExpenseTrackerUtils;`;

scriptContent = scriptContent.replace(destructuringOriginal, destructuringNew);

// Strip multiple empty lines
scriptContent = scriptContent.replace(/\\n\\s*\\n\\s*\\n/g, '\\n\\n');

fs.writeFileSync(scriptPath, scriptContent, 'utf8');
console.log("Refactoring complete");
