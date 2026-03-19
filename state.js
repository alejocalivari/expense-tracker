(function () {
  const { generateId } = window.aleclvFinanceUtils;

  const STORAGE_KEY = "aleclv-finance-state";
  const SCHEMA_VERSION = 2;
  const DEFAULT_FILTERS = {
    month: "2026-03",
    category: "all",
    search: "",
  };
  const MONTH_FILTER_PATTERN = /^\d{4}-\d{2}$/;
  const STORAGE_STATE_KEYS = ["schemaVersion", "income", "expenses", "filters"];
  const LEGACY_CATEGORY_MAP = {
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
  };
  const LEGACY_TITLE_MAP = {
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
  const CATEGORY_ALIASES = {
    "Casa / Servicios": "Casa/Servicios",
    "Casa y Servicios": "Casa/Servicios",
    Auto: "Auto/Moto",
    Moto: "Auto/Moto",
    Salud: "Salud",
    Otro: "Otros",
    Otra: "Otros",
  };
  const FIXED_EXPENSE_HINTS = new Set([
    "Casa/Servicios",
    "Gimnasio",
    "Facultad",
    "Suscripciones",
    "Auto/Moto",
    "Inversión",
  ]);
  const LEGACY_CATEGORY_NAMES = new Set(Object.keys(LEGACY_CATEGORY_MAP));
  const LEGACY_TITLES = new Set(Object.keys(LEGACY_TITLE_MAP));
  const PAYMENT_METHODS = ["Efectivo", "Débito", "Crédito", "Transferencia"];

  const cloneValue = (value) => {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value));
  };

  const normalizeMonthFilter = (value) => {
    const normalizedValue = String(value || "").trim();
    return MONTH_FILTER_PATTERN.test(normalizedValue) ? normalizedValue : DEFAULT_FILTERS.month;
  };

  const normalizeCategoryFilter = (value) => {
    const normalizedValue = String(value || "").trim();
    return normalizedValue || DEFAULT_FILTERS.category;
  };

  const normalizeSearchFilter = (value) => String(value || "").trim();

  const normalizeFilters = (filters = {}) => ({
    month: normalizeMonthFilter(filters.month),
    category: normalizeCategoryFilter(filters.category),
    search: normalizeSearchFilter(filters.search),
  });

  const normalizeCategory = (value) => {
    const rawCategory = String(value || "").trim();
    const mappedCategory = LEGACY_CATEGORY_MAP[rawCategory] || CATEGORY_ALIASES[rawCategory] || rawCategory;

    return mappedCategory || "Otros";
  };

  const normalizeTitle = (value, category) => {
    const rawTitle = String(value || "").trim();

    if (LEGACY_TITLE_MAP[rawTitle]) {
      return LEGACY_TITLE_MAP[rawTitle];
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
        return "Gasto";
    }
  };

  const normalizePaymentMethod = (value) => {
    const rawValue = String(value || "").trim();

    if (!rawValue) {
      return "Transferencia";
    }

    if (PAYMENT_METHODS.includes(rawValue)) {
      return rawValue;
    }

    if (/efectivo/i.test(rawValue)) {
      return "Efectivo";
    }

    if (/deb/i.test(rawValue)) {
      return "Débito";
    }

    if (/transfer|bank|autopay|automatic|auto/i.test(rawValue)) {
      return "Transferencia";
    }

    return "Crédito";
  };

  const inferFixedExpense = (expense) => {
    if (typeof expense.isFixed === "boolean") {
      return expense.isFixed;
    }

    const category = normalizeCategory(expense.category);
    const title = normalizeTitle(expense.title, category).toLowerCase();

    if (FIXED_EXPENSE_HINTS.has(category)) {
      return true;
    }

    return /(alquiler|internet|luz|agua|seguro|gym|gimnasio|spotify|netflix|facultad)/i.test(title);
  };

  const isLegacyExpense = (expense = {}) => {
    const category = String(expense.category || "").trim();
    const title = String(expense.title || "").trim();
    const paymentMethod = String(expense.paymentMethod || "").trim();

    return (
      LEGACY_CATEGORY_NAMES.has(category) ||
      LEGACY_TITLES.has(title) ||
      /Visa ending|Mastercard ending|Apple Pay|Autopay|Bank transfer/i.test(paymentMethod)
    );
  };

  const getLegacyScaleFactor = (expenses = []) => {
    const maxAmount = expenses.reduce((maxValue, expense) => {
      const parsedAmount = Number(expense?.amount);
      return Number.isFinite(parsedAmount) ? Math.max(maxValue, parsedAmount) : maxValue;
    }, 0);

    return maxAmount > 0 && maxAmount < 10000 ? 1000 : 1;
  };

  const normalizeAmount = (value, scaleFactor = 1) => {
    const amountValue = Number(value);
    const normalizedAmount = Number.isFinite(amountValue) ? amountValue * scaleFactor : 0;
    return Math.round((normalizedAmount + Number.EPSILON) * 100) / 100;
  };

  const normalizeExpense = (expense = {}, options = {}) => {
    const {
      legacyMode = false,
      scaleFactor = 1,
    } = options;
    const parsedDate = expense.date ? new Date(expense.date) : new Date();
    const parsedCreatedAt = expense.createdAt ? new Date(expense.createdAt) : parsedDate;
    const dateValue = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    const createdAtValue = Number.isNaN(parsedCreatedAt.getTime()) ? dateValue : parsedCreatedAt;
    const category = normalizeCategory(expense.category);
    const title = normalizeTitle(expense.title, category);

    return {
      id: expense.id || generateId(),
      title,
      amount: normalizeAmount(expense.amount, legacyMode ? scaleFactor : 1),
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
    income: 2350000,
    expenses: [
      normalizeExpense({
        title: "Supermercado",
        amount: 186450,
        category: "Supermercado",
        date: "2026-03-18T19:10:00",
        paymentMethod: "Débito",
        note: "Compra quincenal y artículos de limpieza.",
        createdAt: "2026-03-18T19:10:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "YPF",
        amount: 58200,
        category: "Transporte",
        date: "2026-03-17T08:05:00",
        paymentMethod: "Débito",
        note: "Nafta para la semana.",
        createdAt: "2026-03-17T08:05:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "Farmacia",
        amount: 24850,
        category: "Salud",
        date: "2026-03-16T14:42:00",
        paymentMethod: "Débito",
        note: "Medicamentos y crema.",
        createdAt: "2026-03-16T14:42:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "Spotify",
        amount: 3499,
        category: "Suscripciones",
        date: "2026-03-15T06:00:00",
        paymentMethod: "Crédito",
        note: "Plan familiar.",
        createdAt: "2026-03-15T06:00:00",
        isFixed: true,
      }),
      normalizeExpense({
        title: "Netflix",
        amount: 12699,
        category: "Suscripciones",
        date: "2026-03-14T06:10:00",
        paymentMethod: "Crédito",
        note: "Suscripción mensual.",
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
        paymentMethod: "Débito",
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
        paymentMethod: "Crédito",
        note: "Carga para viaje corto.",
        createdAt: "2026-03-07T20:10:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "Supermercado",
        amount: 134500,
        category: "Supermercado",
        date: "2026-03-06T18:24:00",
        paymentMethod: "Débito",
        note: "Compra semanal.",
        createdAt: "2026-03-06T18:24:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "Cena con amigos",
        amount: 36800,
        category: "Salidas",
        date: "2026-03-04T23:10:00",
        paymentMethod: "Crédito",
        note: "Salida del sábado.",
        createdAt: "2026-03-04T23:10:00",
        isFixed: false,
      }),
      normalizeExpense({
        title: "Transferencia broker",
        amount: 120000,
        category: "Inversión",
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
    const legacyMode = Number(state.schemaVersion) !== SCHEMA_VERSION && sourceExpenses.some((expense) => isLegacyExpense(expense));
    const legacyScaleFactor = legacyMode ? getLegacyScaleFactor(sourceExpenses) : 1;

    return {
      schemaVersion: SCHEMA_VERSION,
      income: Number.isFinite(Number(state.income))
        ? normalizeAmount(state.income, legacyMode ? legacyScaleFactor : 1)
        : 0,
      expenses: sourceExpenses.map((expense) =>
        normalizeExpense(expense, {
          legacyMode,
          scaleFactor: legacyScaleFactor,
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

  const saveState = (state = appState) => {
    const normalizedState = normalizeState(state);

    if (!hasStorage()) {
      return cloneValue(normalizedState);
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedState));
    } catch (error) {
      return cloneValue(normalizedState);
    }

    return cloneValue(normalizedState);
  };

  const loadState = () => {
    if (!hasStorage()) {
      return null;
    }

    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY);

      if (!rawState) {
        return null;
      }

      const parsedState = JSON.parse(rawState);
      const hasKnownKeys =
        parsedState &&
        typeof parsedState === "object" &&
        STORAGE_STATE_KEYS.some((key) => Object.prototype.hasOwnProperty.call(parsedState, key));

      if (!hasKnownKeys) {
        window.localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return normalizeState(parsedState);
    } catch (error) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (storageError) {
        return null;
      }

      return null;
    }
  };

  const initializeState = () => {
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

  const getDemoState = () => normalizeState(createInitialState());

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

  window.aleclvFinanceState = {
    getDemoState,
    getState,
    setState,
    updateState,
  };

  window.aleclvFinanceStorage = {
    STORAGE_KEY,
    saveState,
    loadState,
  };
})();
