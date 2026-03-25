$path = 'c:\Users\Alejo\Documents\GitHub\expense-tracker\script.js'
$text = [IO.File]::ReadAllText($path)

$text = $text.Replace('const { formatCurrency, formatDate, generateId } = window.aleclvExpenseTrackerUtils;', 'const { formatCurrency, formatDate, generateId, MONTH_KEY_PATTERN, prefersReducedMotion, clamp, roundCurrency, escapeHtml, normalizeText, toSafeNumber, readDecimals, isValidMonthKey, getExpenseDate, getMonthKey, getCurrentMonthKey, getLatestMonthKey, shiftMonthKey, getYearFromMonthKey, getMonthNumberFromMonthKey, buildMonthKey, isFutureMonthKey, getDaysInMonth, getRemainingDaysInMonth, getSpendTodayAmount } = window.aleclvExpenseTrackerUtils;')

$text = $text.Replace('const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;', '')
$text = $text.Replace('const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;', '')
$text = $text.Replace('const clamp = (value, min, max) => Math.min(Math.max(value, min), max);', '')
$text = $text.Replace('const roundCurrency = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;', '')
$text = $text.Replace('const escapeHtml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(''"'', "&quot;").replaceAll("''", "&#39;");', '')
$text = $text.Replace('const normalizeText = (value = "") => String(value).trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();', '')

$func1 = 'const toSafeNumber = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};'
$text = $text.Replace($func1.Replace("`n", "`r`n"), '').Replace($func1, '')

$text = $text.Replace('const readDecimals = (element) => Number(element?.dataset.decimals || 0);', '')
$text = $text.Replace('const isValidMonthKey = (value) => MONTH_KEY_PATTERN.test(String(value || "").trim());', '')

$func2 = 'const getExpenseDate = (expense) => {
  const parsed = new Date(expense?.date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};'
$text = $text.Replace($func2.Replace("`n", "`r`n"), '').Replace($func2, '')

$func3 = 'const getMonthKey = (value) => {
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
};'
$text = $text.Replace($func3.Replace("`n", "`r`n"), '').Replace($func3, '')

$text = $text.Replace('const getCurrentMonthKey = () => getMonthKey(new Date());', '')

$func4 = 'const getLatestMonthKey = (expenses = []) => {
  const latestDate = expenses.reduce((latest, expense) => {
    const parsed = getExpenseDate(expense);
    return !parsed || (latest && latest > parsed) ? latest : parsed;
  }, null);

  return latestDate ? getMonthKey(latestDate) : getCurrentMonthKey();
};'
$text = $text.Replace($func4.Replace("`n", "`r`n"), '').Replace($func4, '')

$func5 = 'const shiftMonthKey = (monthKey, offset) => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1, 12));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};'
$text = $text.Replace($func5.Replace("`n", "`r`n"), '').Replace($func5, '')

$text = $text.Replace('const getYearFromMonthKey = (monthKey) => Number(String(monthKey || "").split("-")[0]) || new Date().getFullYear();', '')
$text = $text.Replace('const getMonthNumberFromMonthKey = (monthKey) => Number(String(monthKey || "").split("-")[1]) || 1;', '')
$text = $text.Replace('const buildMonthKey = (year, monthNumber) => `${year}-${String(monthNumber).padStart(2, "0")}`;', '')
$text = $text.Replace('const isFutureMonthKey = (monthKey) => monthKey > getCurrentMonthKey();', '')

$func6 = 'const getDaysInMonth = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month, 0).getDate();
};'
$text = $text.Replace($func6.Replace("`n", "`r`n"), '').Replace($func6, '')

$func7 = 'const getRemainingDaysInMonth = (monthKey) => {
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
};'
$text = $text.Replace($func7.Replace("`n", "`r`n"), '').Replace($func7, '')

$func8 = 'const getSpendTodayAmount = (liquidityAmount, monthKey) => {
  const safeLiquidityAmount = Number(liquidityAmount);
  const normalizedLiquidityAmount = Number.isFinite(safeLiquidityAmount) ? safeLiquidityAmount : 0;
  const daysRemaining = getRemainingDaysInMonth(monthKey);

  if (daysRemaining <= 0) {
    return Math.round(normalizedLiquidityAmount);
  }

  const dailyAmount = normalizedLiquidityAmount / daysRemaining;
  return Number.isFinite(dailyAmount) ? Math.round(dailyAmount) : 0;
};'
$text = $text.Replace($func8.Replace("`n", "`r`n"), '').Replace($func8, '')

[IO.File]::WriteAllText($path, $text)
Write-Output "Refactor PS1 completed."
