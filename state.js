(function () {
  const { generateId } = window.aleclvExpenseTrackerUtils;

  const STORAGE_KEY = "aleclv-salary-planner-state";
  const BACKUP_STORAGE_KEY = "aleclv-salary-planner-state:startup-backup";
  const COMPAT_STORAGE_KEYS = ["aleclv-expense-tracker-state", "aleclv-finance-state"];
  const SCHEMA_VERSION = 5;
  const MONTH_FILTER_PATTERN = /^\d{4}-\d{2}$/;
  const DEFAULT_FILTERS = {
    month: "2026-03",
    category: "all",
    paymentMethod: "all",
    expenseType: "all",
    sort: "newest",
    search: "",
  };
  const SORT_OPTIONS = new Set(["newest", "oldest", "highest", "lowest"]);
  const STORAGE_STATE_KEYS = [
    "schemaVersion",
    "incomeBase",
    "incomeExtra",
    "income",
    "savingsGoalAmount",
    "savingsGoalLabel",
    "expenses",
    "filters",
  ];
  const DEFAULT_GOAL_AMOUNT = 740000;
  const DEFAULT_GOAL_LABEL = "Meta mensual de inversion";
  const CATEGORY_ALIASES = {
    Food: "Supermercado",
    Transport: "Transporte",
    Housing: "Casa/Servicios",
    Utilities: "Casa/Servicios",
    Subscriptions: "Suscripciones",
    Software: "Facultad",
    Lifestyle: "Gimnasio",
    Leisure: "Salidas",
    Travel: "Otros",
    Other: "Otros",
    "Casa y Servicios": "Casa/Servicios",
    "Casa / Servicios": "Casa/Servicios",
    Auto: "Auto/Moto",
    Moto: "Auto/Moto",
    Inversion: "Inversion",
    "Inversión": "Inversion",
    Otro: "Otros",
    Otra: "Otros",
  };
  const TITLE_MIGRATIONS = {
    "Whole Foods Market": "Supermercado",
    "Blue Bottle Coffee": "Salida cafe",
    "Chevron Station": "YPF",
    Dropbox: "Internet",
    Equinox: "Gimnasio",
    "AMC Lincoln Square": "Salidas",
    "Trader Joe's": "Supermercado",
    "Con Edison": "Luz",
    Spotify: "Spotify",
    Uber: "Transporte",
    "Hudson Residential": "Alquiler",
    "Delta Air Lines": "Pasajes",
  };
  const FIXED_EXPENSE_HINTS = new Set([
    "Casa/Servicios",
    "Gimnasio",
    "Facultad",
    "Suscripciones",
    "Auto/Moto",
    "Inversion",
  ]);
  const PAYMENT_METHODS = ["Efectivo", "Debito", "Credito", "Transferencia"];

  const cloneValue = (value) => {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value));
  };

  const normalizeToken = (value = "") =>
    String(value)
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const roundCurrency = (value) =>
    Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

  const normalizeAmount = (value, scaleFactor = 1) => {
    const amountValue = Number(value);
    return Number.isFinite(amountValue) ? roundCurrency(amountValue * scaleFactor) : 0;
  };

  const normalizeGoalAmount = (value, scaleFactor = 1) => {
    const normalizedAmount = normalizeAmount(value, scaleFactor);
    return normalizedAmount > 0 ? normalizedAmount : DEFAULT_GOAL_AMOUNT;
  };

  const normalizeGoalLabel = (value) => {
    const label = String(value || "").trim();
    return ["Meta mensual de acciones", "Meta mensual de inversion"].includes(label) ? DEFAULT_GOAL_LABEL : label;
  };

  const normalizeMonthFilter = (value) => {
    const normalizedValue = String(value || "").trim();
    return MONTH_FILTER_PATTERN.test(normalizedValue) ? normalizedValue : DEFAULT_FILTERS.month;
  };

  const normalizeCategory = (value) => {
    const rawCategory = String(value || "").trim();
    return CATEGORY_ALIASES[rawCategory] || rawCategory || "Otros";
  };

  const normalizePaymentMethod = (value) => {
    const rawValue = normalizeToken(value);

    if (!rawValue) {
      return "Transferencia";
    }

    if (/efectivo/i.test(rawValue)) {
      return "Efectivo";
    }

    if (/deb/i.test(rawValue)) {
      return "Debito";
    }

    if (/cred|visa|master|amex/i.test(rawValue)) {
      return "Credito";
    }

    if (/transfer|bank|autopay|automatic|auto/i.test(rawValue)) {
      return "Transferencia";
    }

    return PAYMENT_METHODS.includes(rawValue) ? rawValue : "Credito";
  };

  const normalizeExpenseTypeFilter = (value) => {
    const normalizedValue = String(value || "").trim();
    return ["all", "fixed", "variable"].includes(normalizedValue)
      ? normalizedValue
      : DEFAULT_FILTERS.expenseType;
  };

  const normalizeSortFilter = (value) => {
    const normalizedValue = String(value || "").trim();
    return SORT_OPTIONS.has(normalizedValue) ? normalizedValue : DEFAULT_FILTERS.sort;
  };

  const normalizeFilters = (filters = {}) => ({
    month: normalizeMonthFilter(filters.month),
    category: String(filters.category || "").trim() || DEFAULT_FILTERS.category,
    paymentMethod: String(filters.paymentMethod || "").trim() || DEFAULT_FILTERS.paymentMethod,
    expenseType: normalizeExpenseTypeFilter(filters.expenseType),
    sort: normalizeSortFilter(filters.sort),
    search: String(filters.search || "").trim(),
  });

  const shouldPromoteIncomeMigration = (expense = {}) => {
    const amount = Number(expense.amount);
    const searchableText = normalizeToken(`${expense.title || ""} ${expense.note || ""}`);

    return Number.isFinite(amount) && amount < 0 && /(freelance|ingreso|extra|reintegro|sueldo)/i.test(searchableText);
  };

  const normalizeTitle = (value, category) => {
    const rawTitle = String(value || "").trim();

    if (TITLE_MIGRATIONS[rawTitle]) {
      return TITLE_MIGRATIONS[rawTitle];
    }

    if (rawTitle) {
      return rawTitle;
    }

    switch (category) {
      case "Supermercado":
        return "Supermercado";
      case "Transporte":
        return "Transporte";
      case "Casa/Servicios":
        return "Servicio";
      case "Suscripciones":
        return "Suscripcion";
      case "Salud":
        return "Farmacia";
      case "Auto/Moto":
        return "Auto";
      default:
        return "Salida";
    }
  };

  const inferFixedExpense = (expense) => {
    if (typeof expense.isFixed === "boolean") {
      return expense.isFixed;
    }

    const category = normalizeCategory(expense.category);
    const title = normalizeToken(normalizeTitle(expense.title, category));

    if (FIXED_EXPENSE_HINTS.has(category)) {
      return true;
    }

    return /(alquiler|internet|luz|agua|seguro|gym|gimnasio|spotify|netflix|facultad)/i.test(title);
  };

  const needsCompatMigration = (expense = {}) => {
    const category = String(expense.category || "").trim();
    const title = String(expense.title || "").trim();
    const paymentMethod = String(expense.paymentMethod || "").trim();

    return (
      Object.prototype.hasOwnProperty.call(CATEGORY_ALIASES, category) ||
      Object.prototype.hasOwnProperty.call(TITLE_MIGRATIONS, title) ||
      /Visa ending|Mastercard ending|Apple Pay|Autopay|Bank transfer/i.test(paymentMethod)
    );
  };

  const getCompatScaleFactor = (expenses = []) => {
    const maxAmount = expenses.reduce((maxValue, expense) => {
      const parsedAmount = Number(expense?.amount);
      return Number.isFinite(parsedAmount) ? Math.max(maxValue, parsedAmount) : maxValue;
    }, 0);

    return maxAmount > 0 && maxAmount < 10000 ? 1000 : 1;
  };

  const normalizeExpense = (expense = {}, options = {}) => {
    const { migrationMode = false, scaleFactor = 1 } = options;
    const parsedDate = expense.date ? new Date(expense.date) : new Date();
    const parsedCreatedAt = expense.createdAt ? new Date(expense.createdAt) : parsedDate;
    const dateValue = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    const createdAtValue = Number.isNaN(parsedCreatedAt.getTime()) ? dateValue : parsedCreatedAt;
    const category = normalizeCategory(expense.category);
    const title = normalizeTitle(expense.title, category);

    return {
      id: expense.id || generateId(),
      title,
      amount: normalizeAmount(expense.amount, migrationMode ? scaleFactor : 1),
      category,
      date: dateValue.toISOString(),
      paymentMethod: normalizePaymentMethod(expense.paymentMethod),
      note: String(expense.note || "").trim(),
      createdAt: createdAtValue.toISOString(),
      isFixed: inferFixedExpense({
        ...expense,
        category,
        title,
      }),
    };
  };

  const createInitialState = () => ({
    schemaVersion: SCHEMA_VERSION,
    incomeBase: 2100000,
    incomeExtra: 250000,
    savingsGoalAmount: DEFAULT_GOAL_AMOUNT,
    savingsGoalLabel: DEFAULT_GOAL_LABEL,
    expenses: [
      normalizeExpense({
        title: "Supermercado",
        amount: 186450,
        category: "Supermercado",
        date: "2026-03-18T19:10:00",
        paymentMethod: "Debito",
        note: "Compra quincenal y articulos de limpieza.",
        createdAt: "2026-03-18T19:10:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "YPF",
        amount: 58200,
        category: "Transporte",
        date: "2026-03-17T08:05:00",
        paymentMethod: "Debito",
        note: "Nafta para la semana.",
        createdAt: "2026-03-17T08:05:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "Farmacia",
        amount: 24850,
        category: "Salud",
        date: "2026-03-16T14:42:00",
        paymentMethod: "Debito",
        note: "Medicamentos y crema.",
        createdAt: "2026-03-16T14:42:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "Spotify",
        amount: 3499,
        category: "Suscripciones",
        date: "2026-03-15T06:00:00",
        paymentMethod: "Credito",
        note: "Plan familiar.",
        createdAt: "2026-03-15T06:00:00",
        isFixed: true,
      }),
      normalizeExpense({
        title: "Netflix",
        amount: 12699,
        category: "Suscripciones",
        date: "2026-03-14T06:10:00",
        paymentMethod: "Credito",
        note: "Suscripcion mensual.",
        createdAt: "2026-03-14T06:10:00",
        isFixed: true,
      }),
      normalizeExpense({
        title: "Gimnasio",
        amount: 42000,
        category: "Gimnasio",
        date: "2026-03-13T09:00:00",
        paymentMethod: "Transferencia",
        note: "Cuota mensual.",
        createdAt: "2026-03-13T09:00:00",
        isFixed: true,
      }),
      normalizeExpense({
        title: "Internet",
        amount: 31200,
        category: "Casa/Servicios",
        date: "2026-03-12T11:00:00",
        paymentMethod: "Transferencia",
        note: "Abono hogar.",
        createdAt: "2026-03-12T11:00:00",
        isFixed: true,
      }),
      normalizeExpense({
        title: "Luz",
        amount: 68900,
        category: "Casa/Servicios",
        date: "2026-03-11T08:20:00",
        paymentMethod: "Transferencia",
        note: "Factura de electricidad.",
        createdAt: "2026-03-11T08:20:00",
        isFixed: true,
      }),
      normalizeExpense({
        title: "Agua",
        amount: 21900,
        category: "Casa/Servicios",
        date: "2026-03-10T08:15:00",
        paymentMethod: "Transferencia",
        note: "Servicio mensual.",
        createdAt: "2026-03-10T08:15:00",
        isFixed: true,
      }),
      normalizeExpense({
        title: "Seguro auto",
        amount: 85400,
        category: "Auto/Moto",
        date: "2026-03-09T07:40:00",
        paymentMethod: "Debito",
        note: "Seguro contra terceros.",
        createdAt: "2026-03-09T07:40:00",
        isFixed: true,
      }),
      normalizeExpense({
        title: "Facultad",
        amount: 145000,
        category: "Facultad",
        date: "2026-03-08T12:30:00",
        paymentMethod: "Transferencia",
        note: "Cuota del mes.",
        createdAt: "2026-03-08T12:30:00",
        isFixed: true,
      }),
      normalizeExpense({
        title: "Shell",
        amount: 47600,
        category: "Auto/Moto",
        date: "2026-03-07T20:10:00",
        paymentMethod: "Credito",
        note: "Carga para viaje corto.",
        createdAt: "2026-03-07T20:10:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "Supermercado",
        amount: 134500,
        category: "Supermercado",
        date: "2026-03-06T18:24:00",
        paymentMethod: "Debito",
        note: "Compra semanal.",
        createdAt: "2026-03-06T18:24:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "Cena con amigos",
        amount: 36800,
        category: "Salidas",
        date: "2026-03-04T23:10:00",
        paymentMethod: "Credito",
        note: "Salida del sabado.",
        createdAt: "2026-03-04T23:10:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "Transferencia broker",
        amount: 120000,
        category: "Inversion",
        date: "2026-03-03T13:10:00",
        paymentMethod: "Transferencia",
        note: "Aporte del mes.",
        createdAt: "2026-03-03T13:10:00",
        isFixed: true,
      }),
    ],
    filters: cloneValue(DEFAULT_FILTERS),
  });

  const normalizeState = (state = {}) => {
    const sourceExpenses = Array.isArray(state.expenses) ? state.expenses : [];
    const migratedIncome = sourceExpenses.reduce(
      (accumulator, expense) => {
        if (shouldPromoteIncomeMigration(expense)) {
          accumulator.incomeExtra += Math.abs(Number(expense.amount) || 0);
          return accumulator;
        }

        accumulator.expenses.push(expense);
        return accumulator;
      },
      { incomeExtra: 0, expenses: [] }
    );
    const sanitizedExpenses = migratedIncome.expenses;
    const migrationMode =
      Number(state.schemaVersion) !== SCHEMA_VERSION &&
      sanitizedExpenses.some((expense) => needsCompatMigration(expense));
    const migrationScaleFactor = migrationMode ? getCompatScaleFactor(sanitizedExpenses) : 1;
    const fallbackIncome = Number.isFinite(Number(state.income)) ? Number(state.income) : 0;
    const incomeBase = state.incomeBase ?? fallbackIncome;
    const incomeExtra = (state.incomeExtra ?? 0) + migratedIncome.incomeExtra;
    const savingsGoalAmount = state.savingsGoalAmount ?? DEFAULT_GOAL_AMOUNT;
    const savingsGoalLabel = normalizeGoalLabel(state.savingsGoalLabel);

    return {
      schemaVersion: SCHEMA_VERSION,
      incomeBase: normalizeAmount(incomeBase, migrationMode ? migrationScaleFactor : 1),
      incomeExtra: normalizeAmount(incomeExtra, migrationMode ? migrationScaleFactor : 1),
      savingsGoalAmount: normalizeGoalAmount(savingsGoalAmount, migrationMode ? migrationScaleFactor : 1),
      savingsGoalLabel,
      expenses: sanitizedExpenses.map((expense) =>
        normalizeExpense(expense, {
          migrationMode,
          scaleFactor: migrationScaleFactor,
        })
      ),
      filters: normalizeFilters({
        ...DEFAULT_FILTERS,
        ...(state.filters || {}),
      }),
    };
  };

  const mergeState = (currentState, patch = {}) => ({
    ...currentState,
    ...patch,
    schemaVersion: SCHEMA_VERSION,
    filters: patch.filters
      ? {
          ...currentState.filters,
          ...patch.filters,
        }
      : currentState.filters,
  });

  const hasStorage = () => {
    try {
      return typeof window.localStorage !== "undefined";
    } catch (error) {
      return false;
    }
  };

  const readPersistedState = (storageKey) => {
    const rawState = window.localStorage.getItem(storageKey);

    if (!rawState) {
      return null;
    }

    const parsedState = JSON.parse(rawState);
    const hasKnownKeys =
      parsedState &&
      typeof parsedState === "object" &&
      STORAGE_STATE_KEYS.some((key) => Object.prototype.hasOwnProperty.call(parsedState, key));

    return hasKnownKeys ? parsedState : null;
  };

  const clearCompatState = () => {
    COMPAT_STORAGE_KEYS.forEach((storageKey) => {
      try {
        window.localStorage.removeItem(storageKey);
      } catch (error) {
        return null;
      }
    });
  };

  const saveState = (state = appState) => {
    const normalizedState = normalizeState(state);

    if (!hasStorage()) {
      return cloneValue(normalizedState);
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedState));
      clearCompatState();
    } catch (error) {
      return cloneValue(normalizedState);
    }

    return cloneValue(normalizedState);
  };

  const backupPersistedStateOnce = () => {
    if (!hasStorage()) {
      return;
    }

    try {
      if (window.localStorage.getItem(BACKUP_STORAGE_KEY)) {
        return;
      }

      const sourceKey = [STORAGE_KEY, ...COMPAT_STORAGE_KEYS].find((storageKey) => {
        const rawState = window.localStorage.getItem(storageKey);
        return typeof rawState === "string" && rawState.length > 0;
      });

      if (!sourceKey) {
        return;
      }

      const rawState = window.localStorage.getItem(sourceKey);

      if (!rawState) {
        return;
      }

      window.localStorage.setItem(BACKUP_STORAGE_KEY, rawState);
    } catch (error) {
      return;
    }
  };

  const loadState = () => {
    if (!hasStorage()) {
      return null;
    }

    try {
      const persistedState =
        readPersistedState(STORAGE_KEY) ||
        COMPAT_STORAGE_KEYS.map((storageKey) => readPersistedState(storageKey)).find(Boolean);

      if (!persistedState) {
        return null;
      }

      return normalizeState(persistedState);
    } catch (error) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
        clearCompatState();
      } catch (storageError) {
        return null;
      }

      return null;
    }
  };

  const initializeState = () => {
    backupPersistedStateOnce();
    const persistedState = loadState();

    if (persistedState) {
      saveState(persistedState);
      return persistedState;
    }

    const seededState = normalizeState(createInitialState());
    saveState(seededState);
    return seededState;
  };

  let appState = initializeState();

  const getSampleState = () => normalizeState(createInitialState());
  const getState = () => cloneValue(appState);
  const setState = (nextState) => {
    appState = normalizeState(nextState);
    saveState(appState);
    return getState();
  };
  const updateState = (updater) => {
    const currentState = getState();
    const patch = typeof updater === "function" ? updater(currentState) : updater;

    if (!patch || typeof patch !== "object") {
      return currentState;
    }

    return setState(mergeState(currentState, patch));
  };

  const stateApi = {
    getSampleState,
    getState,
    setState,
    updateState,
  };
  const storageApi = {
    STORAGE_KEY,
    saveState,
    loadState,
  };

  window.aleclvExpenseTrackerState = stateApi;
  window.aleclvExpenseTrackerStorage = storageApi;
})();
