const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const app = express();

const DEFAULT_PORT = 3000;
const DEFAULT_ALLOWED_ORIGINS = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:5501",
  "http://localhost:5501",
];
const DATA_FILE = path.resolve(process.env.DATA_FILE || path.join(__dirname, "data", "app-data.json"));
const PLANNER_SCHEMA_VERSION = 5;
const DEFAULT_GOAL_AMOUNT = 740000;
const DEFAULT_GOAL_LABEL = "Meta mensual de inversion";
const DEFAULT_CATEGORY = "Otros";
const DEFAULT_PAYMENT_METHOD = "Transferencia";
const DEFAULT_EXPENSE_TITLE = "Movimiento";
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;
const ALLOWED_EXPENSE_TYPES = new Set(["all", "fixed", "variable"]);
const ALLOWED_SORTS = new Set(["newest", "oldest", "highest", "lowest"]);
const ALLOWED_PAYMENT_METHODS = new Set(["Efectivo", "Debito", "Credito", "Transferencia"]);

const stripTrailingSlash = (value = "") => String(value).trim().replace(/\/+$/, "");
const normalizeEmail = (value = "") => String(value).trim().toLowerCase();
const normalizeFullName = (value = "") => String(value).trim().replace(/\s+/g, " ");
const roundCurrency = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
const resolvePort = (value) => {
  const parsedPort = Number.parseInt(String(value || ""), 10);
  return Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_PORT;
};
const readAllowedOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => stripTrailingSlash(origin))
    .filter(Boolean);
const safeObject = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});
const normalizeNumericValue = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? roundCurrency(parsedValue) : fallback;
};
const normalizePositiveNumericValue = (value, fallback) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? roundCurrency(parsedValue) : fallback;
};
const createId = () => (typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};
const normalizeMonthKey = (value, fallback = getCurrentMonthKey()) => {
  const normalizedValue = String(value || "").trim();
  return MONTH_KEY_PATTERN.test(normalizedValue) ? normalizedValue : fallback;
};
const normalizeIsoDate = (value, fallback = new Date()) => {
  const parsedDate = value ? new Date(value) : fallback;
  const resolvedDate = Number.isNaN(parsedDate.getTime()) ? fallback : parsedDate;
  return resolvedDate.toISOString();
};
const buildDefaultPlannerFilters = () => ({
  month: getCurrentMonthKey(),
  category: "all",
  paymentMethod: "all",
  expenseType: "all",
  sort: "newest",
  search: "",
});
const normalizePlannerFilters = (filters = {}) => {
  const safeFilters = safeObject(filters);
  const defaultFilters = buildDefaultPlannerFilters();

  return {
    month: normalizeMonthKey(safeFilters.month, defaultFilters.month),
    category: String(safeFilters.category || "").trim() || defaultFilters.category,
    paymentMethod: String(safeFilters.paymentMethod || "").trim() || defaultFilters.paymentMethod,
    expenseType: ALLOWED_EXPENSE_TYPES.has(String(safeFilters.expenseType || "").trim())
      ? String(safeFilters.expenseType || "").trim()
      : defaultFilters.expenseType,
    sort: ALLOWED_SORTS.has(String(safeFilters.sort || "").trim())
      ? String(safeFilters.sort || "").trim()
      : defaultFilters.sort,
    search: String(safeFilters.search || "").trim(),
  };
};
const normalizePlannerExpense = (expense = {}) => {
  const safeExpense = safeObject(expense);
  const date = normalizeIsoDate(safeExpense.date);

  return {
    id: String(safeExpense.id || "").trim() || createId(),
    title: String(safeExpense.title || "").trim() || DEFAULT_EXPENSE_TITLE,
    amount: normalizeNumericValue(safeExpense.amount, 0),
    category: String(safeExpense.category || "").trim() || DEFAULT_CATEGORY,
    date,
    paymentMethod: ALLOWED_PAYMENT_METHODS.has(String(safeExpense.paymentMethod || "").trim())
      ? String(safeExpense.paymentMethod || "").trim()
      : DEFAULT_PAYMENT_METHOD,
    note: String(safeExpense.note || "").trim(),
    createdAt: normalizeIsoDate(safeExpense.createdAt, new Date(date)),
    isFixed: Boolean(safeExpense.isFixed),
  };
};
const createDefaultPlannerState = () => ({
  schemaVersion: PLANNER_SCHEMA_VERSION,
  incomeBase: 0,
  incomeExtra: 0,
  savingsGoalAmount: DEFAULT_GOAL_AMOUNT,
  savingsGoalLabel: DEFAULT_GOAL_LABEL,
  expenses: [],
  filters: buildDefaultPlannerFilters(),
});
const normalizePlannerState = (value = {}) => {
  const safePlannerState = safeObject(value);
  const fallbackIncome = Number.isFinite(Number(safePlannerState.income)) ? Number(safePlannerState.income) : 0;

  return {
    schemaVersion: PLANNER_SCHEMA_VERSION,
    incomeBase: normalizeNumericValue(safePlannerState.incomeBase ?? fallbackIncome, 0),
    incomeExtra: normalizeNumericValue(safePlannerState.incomeExtra, 0),
    savingsGoalAmount: normalizePositiveNumericValue(safePlannerState.savingsGoalAmount, DEFAULT_GOAL_AMOUNT),
    savingsGoalLabel: String(safePlannerState.savingsGoalLabel || "").trim() || DEFAULT_GOAL_LABEL,
    expenses: Array.isArray(safePlannerState.expenses) ? safePlannerState.expenses.map((expense) => normalizePlannerExpense(expense)) : [],
    filters: normalizePlannerFilters(safePlannerState.filters),
  };
};
const createEmptyStore = () => ({
  users: [],
});
const normalizeUserRecord = (value = {}) => {
  const safeUserRecord = safeObject(value);
  const normalizedPlannerState =
    Object.prototype.hasOwnProperty.call(safeUserRecord, "planner") && safeUserRecord.planner
      ? normalizePlannerState(safeUserRecord.planner)
      : undefined;

  return {
    fullName: normalizeFullName(safeUserRecord.fullName),
    email: normalizeEmail(safeUserRecord.email),
    password: String(safeUserRecord.password || ""),
    ...(normalizedPlannerState ? { planner: normalizedPlannerState } : {}),
  };
};
const normalizeStore = (value = {}) => {
  const safeStore = safeObject(value);

  return {
    users: Array.isArray(safeStore.users)
      ? safeStore.users
          .map((user) => normalizeUserRecord(user))
          .filter((user) => user.fullName && user.email && user.password)
      : [],
  };
};
const parseBasicAuthCredentials = (authorizationHeader = "") => {
  const [scheme, encodedCredentials] = String(authorizationHeader || "").trim().split(/\s+/, 2);

  if (!/^Basic$/i.test(scheme) || !encodedCredentials) {
    return null;
  }

  const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString("utf8");
  const separatorIndex = decodedCredentials.indexOf(":");

  if (separatorIndex < 0) {
    return null;
  }

  return {
    email: normalizeEmail(decodedCredentials.slice(0, separatorIndex)),
    password: decodedCredentials.slice(separatorIndex + 1),
  };
};
const findUserByEmail = (email) => store.users.find((candidate) => candidate.email === email);
const respondWithUnauthorized = (res, message = "Authentication required") => {
  res.set("WWW-Authenticate", 'Basic realm="planner"');
  return res.status(401).json({ error: message });
};
const authenticatePlannerRequest = async (req, res, next) => {
  const credentials = parseBasicAuthCredentials(req.headers.authorization);

  if (!credentials?.email || !credentials.password) {
    return respondWithUnauthorized(res);
  }

  const matchingUsers = store.users.filter((candidate) => candidate.email === credentials.email);

  for (const user of matchingUsers) {
    if (await bcrypt.compare(credentials.password, user.password)) {
      req.authenticatedUser = user;
      return next();
    }
  }

  return respondWithUnauthorized(res, "Invalid email or password");
};

const PORT = resolvePort(process.env.PORT);
const ALLOWED_ORIGINS = new Set([
  ...DEFAULT_ALLOWED_ORIGINS.map((origin) => stripTrailingSlash(origin)),
  ...readAllowedOrigins(process.env.ALLOWED_ORIGINS),
]);

const corsOptions = {
  origin(origin, callback) {
    const normalizedOrigin = stripTrailingSlash(origin);

    if (!normalizedOrigin || ALLOWED_ORIGINS.has(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${normalizedOrigin} is not allowed by CORS.`));
  },
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept", "Authorization"],
  optionsSuccessStatus: 204,
};

let store = createEmptyStore();

const persistStore = async () => {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });

  const payload = JSON.stringify(store, null, 2);

  await fs.writeFile(DATA_FILE, payload, "utf8");
};

const loadStore = async () => {
  try {
    const rawStore = await fs.readFile(DATA_FILE, "utf8");
    store = normalizeStore(rawStore ? JSON.parse(rawStore) : {});
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    store = createEmptyStore();
    await persistStore();
  }
};

process.on("uncaughtException", (error) => {
  console.error("[backend] Uncaught exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[backend] Unhandled rejection:", reason);
  process.exit(1);
});

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    port: PORT,
    storage: DATA_FILE,
  });
});

// REGISTER
app.post("/register", async (req, res) => {
  const normalizedFullName = normalizeFullName(req.body?.fullName);
  const normalizedEmail = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");

  if (!normalizedFullName || !normalizedEmail || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    fullName: normalizedFullName,
    email: normalizedEmail,
    password: hashedPassword,
  };

  store.users.push(user);
  await persistStore();

  res.json({
    user: {
      fullName: user.fullName,
      email: user.email,
    },
  });
});

// LOGIN
app.post("/login", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const user = findUserByEmail(email);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(400).json({ error: "Wrong password" });
  }

  res.json({
    user: {
      fullName: user.fullName,
      email: user.email,
    },
  });
});

// PLANNER
app.get("/planner", authenticatePlannerRequest, (req, res) => {
  const plannerState = req.authenticatedUser?.planner
    ? normalizePlannerState(req.authenticatedUser.planner)
    : createDefaultPlannerState();

  res.json(plannerState);
});

app.put("/planner", authenticatePlannerRequest, async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({ error: "Planner state must be an object" });
  }

  const plannerState = normalizePlannerState(req.body);
  req.authenticatedUser.planner = plannerState;
  await persistStore();

  res.json(plannerState);
});

app.use((error, req, res, next) => {
  if (error?.message && /not allowed by CORS/i.test(error.message)) {
    return res.status(403).json({ error: error.message });
  }

  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  if (error) {
    console.error("[backend] Request error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  return next();
});

const startServer = async () => {
  console.log("[backend] Booting backend...");
  console.log(`[backend] Requested port: ${PORT}`);
  console.log(`[backend] Allowed origins: ${Array.from(ALLOWED_ORIGINS).join(", ")}`);
  console.log(`[backend] Data file: ${DATA_FILE}`);

  await loadStore();

  console.log(`[backend] Loaded ${store.users.length} persisted user(s).`);

  const server = app.listen(PORT, () => {
    console.log(`[backend] Server running on http://localhost:${PORT}`);
    console.log("[backend] Available routes: GET /health, POST /register, POST /login, GET /planner, PUT /planner");
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`[backend] Port ${PORT} is already in use.`);
    } else {
      console.error("[backend] Server failed to start:", error);
    }

    process.exit(1);
  });
};

startServer().catch((error) => {
  console.error("[backend] Failed to initialize backend:", error);
  process.exit(1);
});
