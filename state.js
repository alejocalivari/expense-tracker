(function () {
  const { generateId } = window.aleclvFinanceUtils;
  const STORAGE_KEY = "aleclv-finance-state";

  /**
   * @typedef {Object} Expense
   * @property {string} id
   * @property {string} title
   * @property {number} amount
   * @property {string} category
   * @property {string} date
   * @property {string} paymentMethod
   * @property {string} note
   * @property {string} createdAt
   */

  const DEFAULT_FILTERS = {
    month: "2026-03",
    category: "all",
    search: "",
  };

  const DEFAULT_INVESTMENT_PROFILE = "balanced";

  const STORAGE_STATE_KEYS = ["income", "expenses", "filters", "selectedInvestmentProfile"];

  const cloneValue = (value) => {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value));
  };

  /**
   * @param {Partial<Expense>} expense
   * @returns {Expense}
   */
  const normalizeExpense = (expense = {}) => {
    const parsedDate = expense.date ? new Date(expense.date) : new Date();
    const parsedCreatedAt = expense.createdAt ? new Date(expense.createdAt) : parsedDate;
    const dateValue = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    const createdAtValue = Number.isNaN(parsedCreatedAt.getTime()) ? dateValue : parsedCreatedAt;
    const amountValue = Number(expense.amount);

    return {
      id: expense.id || generateId(),
      title: String(expense.title || "").trim(),
      amount: Number.isFinite(amountValue) ? amountValue : 0,
      category: String(expense.category || "Other"),
      date: dateValue.toISOString(),
      paymentMethod: String(expense.paymentMethod || ""),
      note: String(expense.note || ""),
      createdAt: createdAtValue.toISOString(),
    };
  };

  const createInitialState = () => ({
    income: 8450,
    expenses: [
      normalizeExpense({
        title: "Whole Foods Market",
        amount: 184.2,
        category: "Food",
        date: "2026-03-18T17:42:00",
        paymentMethod: "Visa ending 2408",
        note: "Groceries and pantry restock.",
        createdAt: "2026-03-18T17:42:00",
      }),
      normalizeExpense({
        title: "Blue Bottle Coffee",
        amount: 32.4,
        category: "Food",
        date: "2026-03-17T08:11:00",
        paymentMethod: "Apple Pay",
        note: "Morning coffee and pastry.",
        createdAt: "2026-03-17T08:11:00",
      }),
      normalizeExpense({
        title: "Chevron Station",
        amount: 214.8,
        category: "Transport",
        date: "2026-03-16T19:05:00",
        paymentMethod: "Visa ending 2408",
        note: "Fuel top-up before commute week.",
        createdAt: "2026-03-16T19:05:00",
      }),
      normalizeExpense({
        title: "Dropbox",
        amount: 19.99,
        category: "Software",
        date: "2026-03-15T09:00:00",
        paymentMethod: "Autopay",
        note: "Cloud storage renewal.",
        createdAt: "2026-03-15T09:00:00",
      }),
      normalizeExpense({
        title: "Equinox",
        amount: 185,
        category: "Lifestyle",
        date: "2026-03-14T06:14:00",
        paymentMethod: "Mastercard ending 1182",
        note: "Monthly membership charge.",
        createdAt: "2026-03-14T06:14:00",
      }),
      normalizeExpense({
        title: "AMC Lincoln Square",
        amount: 92,
        category: "Leisure",
        date: "2026-03-12T21:48:00",
        paymentMethod: "Visa ending 2408",
        note: "Movie tickets.",
        createdAt: "2026-03-12T21:48:00",
      }),
      normalizeExpense({
        title: "Trader Joe's",
        amount: 670.4,
        category: "Food",
        date: "2026-03-11T18:26:00",
        paymentMethod: "Debit ending 0314",
        note: "Weekly grocery refill.",
        createdAt: "2026-03-11T18:26:00",
      }),
      normalizeExpense({
        title: "Con Edison",
        amount: 124.18,
        category: "Utilities",
        date: "2026-03-10T07:15:00",
        paymentMethod: "Autopay",
        note: "Electric and gas bill.",
        createdAt: "2026-03-10T07:15:00",
      }),
      normalizeExpense({
        title: "Spotify",
        amount: 17.99,
        category: "Subscriptions",
        date: "2026-03-09T06:05:00",
        paymentMethod: "Visa ending 2408",
        note: "Family plan renewal.",
        createdAt: "2026-03-09T06:05:00",
      }),
      normalizeExpense({
        title: "Uber",
        amount: 327.2,
        category: "Transport",
        date: "2026-03-08T22:14:00",
        paymentMethod: "Apple Pay",
        note: "Ride back from client dinner.",
        createdAt: "2026-03-08T22:14:00",
      }),
      normalizeExpense({
        title: "Hudson Residential",
        amount: 1578,
        category: "Housing",
        date: "2026-03-05T09:00:00",
        paymentMethod: "Bank transfer",
        note: "Monthly rent transfer.",
        createdAt: "2026-03-05T09:00:00",
      }),
      normalizeExpense({
        title: "Delta Air Lines",
        amount: 1483.84,
        category: "Travel",
        date: "2026-03-04T13:20:00",
        paymentMethod: "Visa ending 2408",
        note: "Round-trip flight for conference travel.",
        createdAt: "2026-03-04T13:20:00",
      }),
    ],
    filters: cloneValue(DEFAULT_FILTERS),
    selectedInvestmentProfile: DEFAULT_INVESTMENT_PROFILE,
  });

  const normalizeState = (state = {}) => ({
    income: Number.isFinite(Number(state.income)) ? Number(state.income) : 0,
    expenses: Array.isArray(state.expenses) ? state.expenses.map((expense) => normalizeExpense(expense)) : [],
    filters: {
      ...DEFAULT_FILTERS,
      ...(state.filters || {}),
    },
    selectedInvestmentProfile:
      typeof state.selectedInvestmentProfile === "string" && state.selectedInvestmentProfile
        ? state.selectedInvestmentProfile
        : DEFAULT_INVESTMENT_PROFILE,
  });

  const mergeState = (currentState, patch = {}) => ({
    ...currentState,
    ...patch,
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
        return null;
      }

      return normalizeState(parsedState);
    } catch (error) {
      return null;
    }
  };

  const initializeState = () => {
    const persistedState = loadState();

    if (persistedState) {
      return persistedState;
    }

    const seededState = normalizeState(createInitialState());
    saveState(seededState);
    return seededState;
  };

  let appState = initializeState();

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
