(function () {
  const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);
  const stripTrailingSlash = (value = "") => String(value).trim().replace(/\/+$/, "");
  const readMetaContent = (name) => document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") || "";
  const existingConfig =
    window.aleclvExpenseTrackerConfig && typeof window.aleclvExpenseTrackerConfig === "object"
      ? window.aleclvExpenseTrackerConfig
      : {};
  const isLocalEnvironment =
    window.location.protocol === "file:" || LOCAL_HOSTS.has(window.location.hostname);
  const configuredApiBaseUrl = stripTrailingSlash(
    existingConfig.apiBaseUrl ||
      readMetaContent("app-api-base-url") ||
      readMetaContent("auth-api-base-url")
  );

  window.aleclvExpenseTrackerConfig = {
    ...existingConfig,
    apiBaseUrl: configuredApiBaseUrl || (isLocalEnvironment ? "http://localhost:3000" : ""),
    isLocalEnvironment,
  };
})();
