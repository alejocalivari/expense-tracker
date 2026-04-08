const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PLANNER_SCHEMA_VERSION = 5;
const DEFAULT_GOAL_AMOUNT = 740000;
const DEFAULT_GOAL_LABEL = "Meta mensual de inversion";
const DEFAULT_FILTER_VALUES = {
  category: "all",
  paymentMethod: "all",
  expenseType: "all",
  sort: "newest",
  search: "",
};
const PAYMENT_METHODS = new Set(["Efectivo", "Debito", "Credito", "Transferencia"]);
const EXPENSE_TYPE_FILTERS = new Set(["all", "fixed", "variable"]);
const SORT_FILTERS = new Set(["newest", "oldest", "highest", "lowest"]);
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;
const DATA_DIRECTORY_PATH = path.join(__dirname, "data");
const DATA_FILE_PATH = path.join(DATA_DIRECTORY_PATH, "store.json");

const cloneValue = (value) => JSON.parse(JSON.stringify(value));

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const roundCurrency = (value) =>
  Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

const normalizeName = (value = "") => String(value).trim().replace(/\s+/g, " ");

const getCurrentMonthKey = () => {
  const currentDate = new Date();
  return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
};

const createId = (prefix) => {
  if (typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
};

const createInitialPlannerState = () => ({
  schemaVersion: PLANNER_SCHEMA_VERSION,
  incomeBase: 0,
  incomeExtra: 0,
  savingsGoalAmount: DEFAULT_GOAL_AMOUNT,
  savingsGoalLabel: DEFAULT_GOAL_LABEL,
  expenses: [],
  filters: {
    month: getCurrentMonthKey(),
    ...DEFAULT_FILTER_VALUES,
  },
});

const normalizeMonthFilter = (value) => {
  const normalizedValue = String(value || "").trim();
  return MONTH_KEY_PATTERN.test(normalizedValue) ? normalizedValue : getCurrentMonthKey();
};

const normalizeFilters = (value = {}) => ({
  month: normalizeMonthFilter(value.month),
  category: String(value.category || DEFAULT_FILTER_VALUES.category).trim() || DEFAULT_FILTER_VALUES.category,
  paymentMethod:
    String(value.paymentMethod || DEFAULT_FILTER_VALUES.paymentMethod).trim() || DEFAULT_FILTER_VALUES.paymentMethod,
  expenseType: EXPENSE_TYPE_FILTERS.has(String(value.expenseType || "").trim())
    ? String(value.expenseType || "").trim()
    : DEFAULT_FILTER_VALUES.expenseType,
  sort: SORT_FILTERS.has(String(value.sort || "").trim())
    ? String(value.sort || "").trim()
    : DEFAULT_FILTER_VALUES.sort,
  search: String(value.search || "").trim(),
});

const normalizePaymentMethod = (value) => {
  const normalizedValue = String(value || "").trim();
  return PAYMENT_METHODS.has(normalizedValue) ? normalizedValue : "Transferencia";
};

const normalizeDate = (value, fallbackValue = new Date()) => {
  const parsedDate = value ? new Date(value) : new Date(fallbackValue);
  return Number.isNaN(parsedDate.getTime()) ? new Date(fallbackValue).toISOString() : parsedDate.toISOString();
};

const normalizeExpense = (expense = {}) => {
  const date = normalizeDate(expense.date);
  return {
    id: String(expense.id || "").trim() || createId("exp"),
    title: String(expense.title || "").trim() || "Movimiento",
    amount: roundCurrency(Math.max(Number(expense.amount) || 0, 0)),
    category: String(expense.category || "").trim() || "Otros",
    date,
    paymentMethod: normalizePaymentMethod(expense.paymentMethod),
    note: String(expense.note || "").trim(),
    createdAt: normalizeDate(expense.createdAt, date),
    isFixed: typeof expense.isFixed === "boolean" ? expense.isFixed : false,
  };
};

const normalizePlannerState = (value = {}) => {
  const nextState = isPlainObject(value) ? value : {};
  const incomeBaseCandidate =
    nextState.incomeBase !== undefined && nextState.incomeBase !== null
      ? nextState.incomeBase
      : nextState.income;
  const goalAmountCandidate =
    nextState.savingsGoalAmount !== undefined && nextState.savingsGoalAmount !== null
      ? nextState.savingsGoalAmount
      : DEFAULT_GOAL_AMOUNT;
  const normalizedGoalAmount = roundCurrency(Math.max(Number(goalAmountCandidate) || 0, 0));

  return {
    schemaVersion: PLANNER_SCHEMA_VERSION,
    incomeBase: roundCurrency(Math.max(Number(incomeBaseCandidate) || 0, 0)),
    incomeExtra: roundCurrency(Math.max(Number(nextState.incomeExtra) || 0, 0)),
    savingsGoalAmount: normalizedGoalAmount > 0 ? normalizedGoalAmount : DEFAULT_GOAL_AMOUNT,
    savingsGoalLabel: String(nextState.savingsGoalLabel || "").trim() || DEFAULT_GOAL_LABEL,
    expenses: Array.isArray(nextState.expenses) ? nextState.expenses.map(normalizeExpense) : [],
    filters: normalizeFilters(nextState.filters),
  };
};

const isValidPlannerStatePayload = (value) => isPlainObject(value);

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIRECTORY_PATH)) {
    fs.mkdirSync(DATA_DIRECTORY_PATH, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({ users: [] }, null, 2));
  }
};

const readStore = () => {
  ensureDataFile();

  try {
    const rawValue = fs.readFileSync(DATA_FILE_PATH, "utf8");
    const parsedValue = JSON.parse(rawValue);
    return {
      users: Array.isArray(parsedValue?.users) ? parsedValue.users : [],
    };
  } catch (error) {
    const fallbackStore = { users: [] };
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(fallbackStore, null, 2));
    return fallbackStore;
  }
};

const writeStore = (store) => {
  ensureDataFile();

  const normalizedStore = {
    users: Array.isArray(store?.users) ? store.users : [],
  };
  const tempFilePath = `${DATA_FILE_PATH}.tmp`;

  fs.writeFileSync(tempFilePath, JSON.stringify(normalizedStore, null, 2));
  fs.renameSync(tempFilePath, DATA_FILE_PATH);

  return cloneValue(normalizedStore);
};

const findUserByEmail = (email) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  const store = readStore();
  return store.users.find((user) => normalizeEmail(user.email) === normalizedEmail) || null;
};

const createUser = ({ fullName, email, passwordHash }) => {
  const store = readStore();
  const now = new Date().toISOString();
  const userRecord = {
    id: createId("usr"),
    fullName: normalizeName(fullName),
    email: normalizeEmail(email),
    password: passwordHash,
    plannerState: null,
    createdAt: now,
    updatedAt: now,
    plannerUpdatedAt: null,
  };

  store.users.push(userRecord);
  writeStore(store);

  return cloneValue(userRecord);
};

const savePlannerState = (userId, plannerState) => {
  const store = readStore();
  const userIndex = store.users.findIndex((user) => user.id === userId);

  if (userIndex < 0) {
    return null;
  }

  const normalizedPlannerState = normalizePlannerState(plannerState);
  const now = new Date().toISOString();
  store.users[userIndex] = {
    ...store.users[userIndex],
    plannerState: normalizedPlannerState,
    updatedAt: now,
    plannerUpdatedAt: now,
  };

  writeStore(store);

  return cloneValue(normalizedPlannerState);
};

const getPlannerState = (userId) => {
  const store = readStore();
  const userRecord = store.users.find((user) => user.id === userId);

  if (!userRecord) {
    return null;
  }

  if (!userRecord.plannerState) {
    return createInitialPlannerState();
  }

  return normalizePlannerState(userRecord.plannerState);
};

module.exports = {
  DATA_FILE_PATH,
  createInitialPlannerState,
  createUser,
  findUserByEmail,
  getPlannerState,
  isValidPlannerStatePayload,
  normalizeEmail,
  savePlannerState,
};
