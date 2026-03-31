(function () {
  const AUTH_SESSION_STORAGE_KEY = "auth-session";
  const AUTH_API_BASE_URL = "http://localhost:3000";
  const AUTH_ROUTE_KEYS = new Set(["login", "register"]);
  const DEFAULT_AUTH_ROUTE = "login";
  const NOTICE_TONES = ["auth-notice--info", "auth-notice--success", "auth-notice--error"];
  const FEEDBACK_TONES = ["is-success", "is-error"];
  const BASE_TITLE = "Cashflow Salary Tracker";

  const body = document.body;
  const authShell = document.querySelector("[data-auth-shell]");

  if (!body || !authShell) {
    return;
  }

  const authNotice = document.querySelector("[data-auth-notice]");
  const authViews = Array.from(document.querySelectorAll("[data-auth-view]"));
  const authNavLinks = Array.from(document.querySelectorAll("[data-auth-nav]"));
  const authForms = {
    login: document.querySelector('[data-auth-form="login"]'),
    register: document.querySelector('[data-auth-form="register"]'),
  };
  const authFeedback = {
    login: document.querySelector('[data-auth-form-feedback="login"]'),
    register: document.querySelector('[data-auth-form-feedback="register"]'),
  };
  const submitButtons = {
    login: document.querySelector('[data-auth-submit="login"]'),
    register: document.querySelector('[data-auth-submit="register"]'),
  };
  const forgotPasswordLinks = Array.from(document.querySelectorAll("[data-auth-forgot]"));
  const logoutButton = document.querySelector("[data-auth-logout]");
  const profileAvatar = document.querySelector("[data-profile-avatar]");
  const profileName = document.querySelector("[data-profile-name]");
  const profileMeta = document.querySelector("[data-profile-meta]");

  const canUseLocalStorage = () => {
    try {
      return typeof window.localStorage !== "undefined";
    } catch (error) {
      return false;
    }
  };

  const readJson = (storageKey) => {
    if (!canUseLocalStorage()) {
      return null;
    }

    try {
      const rawValue = window.localStorage.getItem(storageKey);
      return rawValue ? JSON.parse(rawValue) : null;
    } catch (error) {
      return null;
    }
  };

  const writeJson = (storageKey, value) => {
    if (!canUseLocalStorage()) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(value));
  };

  const removeStorageItem = (storageKey) => {
    if (!canUseLocalStorage()) {
      return;
    }

    window.localStorage.removeItem(storageKey);
  };

  const wait = (delayMs) => new Promise((resolve) => window.setTimeout(resolve, delayMs));

  const normalizeName = (value = "") => String(value).trim().replace(/\s+/g, " ");

  const createInitials = (name = "", email = "") => {
    const nameTokens = normalizeName(name).split(" ").filter(Boolean);

    if (nameTokens.length >= 2) {
      return `${nameTokens[0][0] || ""}${nameTokens[1][0] || ""}`.toUpperCase();
    }

    if (nameTokens.length === 1) {
      return `${nameTokens[0].slice(0, 2)}`.toUpperCase();
    }

    return `${String(email).trim().slice(0, 2) || "CF"}`.toUpperCase();
  };

  const readSession = () => readJson(AUTH_SESSION_STORAGE_KEY);

  const saveSession = (user) => {
    writeJson(AUTH_SESSION_STORAGE_KEY, user);
  };

  const normalizeUser = (user = {}) => {
    const normalizedEmail = String(user.email || "").trim().toLowerCase();
    const normalizedName = normalizeName(user.fullName || user.name || normalizedEmail || "Cashflow User");

    return {
      ...user,
      fullName: normalizedName,
      email: normalizedEmail,
    };
  };

  const requestAuth = async (endpoint, payload) => {
    let response;

    try {
      response = await window.fetch(`${AUTH_API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      throw new Error("Unable to reach the server.");
    }

    let data = null;

    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.error || "Authentication request failed.");
    }

    if (!data || typeof data !== "object" || !data.user || typeof data.user !== "object") {
      throw new Error("Invalid server response.");
    }

    return normalizeUser(data.user);
  };

  const authService = {
    register(payload) {
      return requestAuth("/register", {
        fullName: normalizeName(payload.fullName),
        email: String(payload.email || "").trim().toLowerCase(),
        password: String(payload.password || ""),
      });
    },
    login(payload) {
      return requestAuth("/login", {
        email: String(payload.email || "").trim().toLowerCase(),
        password: String(payload.password || ""),
      });
    },
    logout() {
      removeStorageItem(AUTH_SESSION_STORAGE_KEY);
      return Promise.resolve();
    },
  };

  const getRouteFromHash = () => {
    const rawHash = String(window.location.hash || "").replace(/^#/, "").trim().toLowerCase();
    return AUTH_ROUTE_KEYS.has(rawHash) ? rawHash : DEFAULT_AUTH_ROUTE;
  };

  const updateDocumentTitle = (isAuthenticated, route = DEFAULT_AUTH_ROUTE) => {
    if (isAuthenticated) {
      document.title = BASE_TITLE;
      return;
    }

    document.title = `${route === "register" ? "Register" : "Login"} | ${BASE_TITLE}`;
  };

  const setNotice = (tone, message) => {
    if (!authNotice) {
      return;
    }

    authNotice.classList.remove(...NOTICE_TONES);
    authNotice.classList.add(`auth-notice--${tone}`);
    authNotice.textContent = message;
  };

  const clearFeedback = (routeKey) => {
    const feedbackElement = authFeedback[routeKey];

    if (!feedbackElement) {
      return;
    }

    feedbackElement.textContent = "";
    feedbackElement.classList.remove(...FEEDBACK_TONES);
  };

  const setFeedback = (routeKey, tone, message) => {
    const feedbackElement = authFeedback[routeKey];

    if (!feedbackElement) {
      return;
    }

    feedbackElement.textContent = message;
    feedbackElement.classList.remove(...FEEDBACK_TONES);

    if (tone === "success") {
      feedbackElement.classList.add("is-success");
      return;
    }

    if (tone === "error") {
      feedbackElement.classList.add("is-error");
    }
  };

  const setFieldError = (form, fieldName, message = "") => {
    const field = form?.querySelector(`[data-auth-field="${fieldName}"]`);
    const input = form?.elements?.namedItem(fieldName);
    const errorElement = form?.querySelector(`[data-field-error="${fieldName}"]`);
    const hasError = Boolean(message);

    field?.classList.toggle("field--invalid", hasError);

    if (input && typeof input.setAttribute === "function") {
      input.setAttribute("aria-invalid", hasError ? "true" : "false");
    }

    if (errorElement) {
      errorElement.textContent = message;
    }
  };

  const readFormValues = (form) => Object.fromEntries(new FormData(form).entries());

  const getEmailError = (value) => {
    const normalizedValue = String(value || "").trim();

    if (!normalizedValue) {
      return "Email is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)) {
      return "Enter a valid email address.";
    }

    return "";
  };

  const getPasswordError = (value) => {
    if (!String(value || "").trim()) {
      return "Password is required.";
    }

    if (String(value).length < 8) {
      return "Use at least 8 characters.";
    }

    return "";
  };

  const validateForm = (routeKey, values) => {
    const errors = {};

    if (routeKey === "register") {
      if (normalizeName(values.fullName).length < 2) {
        errors.fullName = "Enter your full name.";
      }

      errors.email = getEmailError(values.email);
      errors.password = getPasswordError(values.password);

      if (!String(values.confirmPassword || "").trim()) {
        errors.confirmPassword = "Please confirm your password.";
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords must match.";
      }

      return errors;
    }

    errors.email = getEmailError(values.email);
    errors.password = getPasswordError(values.password);
    return errors;
  };

  const syncFormErrors = (form, routeKey, errors) => {
    const fieldNames = routeKey === "register"
      ? ["fullName", "email", "password", "confirmPassword"]
      : ["email", "password"];

    fieldNames.forEach((fieldName) => {
      setFieldError(form, fieldName, errors[fieldName] || "");
    });
  };

  const clearFormErrors = (routeKey) => {
    syncFormErrors(authForms[routeKey], routeKey, {});
  };

  const setButtonLoadingState = (routeKey, isLoading) => {
    const button = submitButtons[routeKey];

    if (!button) {
      return;
    }

    const labelElement = button.querySelector("[data-auth-submit-label]");
    const defaultLabel = routeKey === "register" ? "Create account" : "Sign in";
    const loadingLabel = routeKey === "register" ? "Creating account..." : "Signing in...";

    button.disabled = isLoading;
    button.dataset.loading = isLoading ? "true" : "false";

    if (labelElement) {
      labelElement.textContent = isLoading ? loadingLabel : defaultLabel;
    }
  };

  const hydrateProfile = (user = {}) => {
    const safeName = normalizeName(user.fullName) || "Cashflow User";
    const safeEmail = String(user.email || "").trim().toLowerCase() || "Personal workspace";
    const safeInitials = createInitials(safeName, safeEmail);

    body.dataset.authProfileMeta = safeEmail;

    if (profileAvatar) {
      profileAvatar.textContent = safeInitials;
    }

    if (profileName) {
      profileName.textContent = safeName;
    }

    if (profileMeta) {
      profileMeta.textContent = safeEmail;
    }
  };

  const revealDashboard = (user) => {
    hydrateProfile(user);
    body.classList.remove("auth-locked");
    body.classList.add("auth-authenticated");
    updateDocumentTitle(true);

    if (window.history?.replaceState) {
      window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}`);
    }
  };

  const showAuthShell = (routeKey) => {
    body.classList.add("auth-locked");
    body.classList.remove("auth-authenticated", "sidebar-open");
    updateDocumentTitle(false, routeKey);
  };

  const setActiveRoute = (routeKey, options = {}) => {
    const nextRoute = AUTH_ROUTE_KEYS.has(routeKey) ? routeKey : DEFAULT_AUTH_ROUTE;
    const shouldReplaceHistory = Boolean(options.replaceHistory);

    authViews.forEach((view) => {
      const isActive = view.dataset.authView === nextRoute;
      view.hidden = !isActive;
    });

    authNavLinks.forEach((link) => {
      const isActive = link.dataset.authNav === nextRoute;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    clearFeedback("login");
    clearFeedback("register");
    clearFormErrors("login");
    clearFormErrors("register");
    updateDocumentTitle(false, nextRoute);

    if (shouldReplaceHistory && window.history?.replaceState) {
      window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}#${nextRoute}`);
    }
  };

  const focusFirstField = (routeKey) => {
    const firstInput = authForms[routeKey]?.querySelector(".field__control");
    firstInput?.focus();
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();
    setNotice("info", "Password reset will be connected later.");
  };

  const bindFieldValidation = (routeKey, form) => {
    if (!form) {
      return;
    }

    const handleValidation = (event) => {
      const target = event.target;

      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      const values = readFormValues(form);
      const errors = validateForm(routeKey, values);
      setFieldError(form, target.name, errors[target.name] || "");

      if (routeKey === "register" && (target.name === "password" || target.name === "confirmPassword")) {
        setFieldError(form, "confirmPassword", errors.confirmPassword || "");
      }
    };

    form.addEventListener("blur", handleValidation, true);
    form.addEventListener("input", handleValidation);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    clearFeedback("login");

    const form = authForms.login;
    const values = readFormValues(form);
    const errors = validateForm("login", values);
    syncFormErrors(form, "login", errors);

    if (Object.values(errors).some(Boolean)) {
      setFeedback("login", "error", "Check the highlighted fields.");
      setNotice("error", "Check the highlighted fields.");
      return;
    }

    setButtonLoadingState("login", true);
    setNotice("info", "Signing in...");

    try {
      const user = await authService.login(values);
      saveSession(user);
      setFeedback("login", "success", "Opening your workspace...");
      setNotice("success", "Signed in.");
      await wait(250);
      revealDashboard(user);
    } catch (error) {
      const message = error?.message || "Unable to sign in right now.";
      setFeedback("login", "error", message);
      setNotice("error", message);
    } finally {
      setButtonLoadingState("login", false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    clearFeedback("register");

    const form = authForms.register;
    const values = readFormValues(form);
    const errors = validateForm("register", values);
    syncFormErrors(form, "register", errors);

    if (Object.values(errors).some(Boolean)) {
      setFeedback("register", "error", "Check the highlighted fields.");
      setNotice("error", "Check the highlighted fields.");
      return;
    }

    setButtonLoadingState("register", true);
    setNotice("info", "Creating account...");

    try {
      const user = await authService.register(values);
      saveSession(user);
      setFeedback("register", "success", "Opening your workspace...");
      setNotice("success", "Account created.");
      await wait(250);
      revealDashboard(user);
    } catch (error) {
      const message = error?.message || "Unable to create your account right now.";
      setFeedback("register", "error", message);
      setNotice("error", message);
    } finally {
      setButtonLoadingState("register", false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    showAuthShell("login");
    setActiveRoute("login", { replaceHistory: true });
    setNotice("info", "Signed out.");
    focusFirstField("login");
  };

  bindFieldValidation("login", authForms.login);
  bindFieldValidation("register", authForms.register);

  authForms.login?.addEventListener("submit", handleLoginSubmit);
  authForms.register?.addEventListener("submit", handleRegisterSubmit);
  forgotPasswordLinks.forEach((link) => link.addEventListener("click", handleForgotPassword));
  logoutButton?.addEventListener("click", handleLogout);

  authNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const routeKey = link.dataset.authNav || DEFAULT_AUTH_ROUTE;
      window.setTimeout(() => setActiveRoute(routeKey), 0);
    });
  });

  window.addEventListener("hashchange", () => {
    if (body.classList.contains("auth-locked")) {
      setActiveRoute(getRouteFromHash());
    }
  });

  const session = readSession();

  if (session) {
    revealDashboard(normalizeUser(session));
  } else {
    const initialRoute = getRouteFromHash();
    showAuthShell(initialRoute);
    setActiveRoute(initialRoute, { replaceHistory: !window.location.hash });
    focusFirstField(initialRoute);
  }
})();
