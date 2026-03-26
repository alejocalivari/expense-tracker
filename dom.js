(function () {
  const body = document.body;
  const topbar = document.querySelector(".topbar");
  const openIncomeButtons = document.querySelectorAll("[data-open-income]");
  const openGoalButtons = document.querySelectorAll("[data-open-goal]");
  const openInvestmentButtons = document.querySelectorAll("[data-open-investment]");
  const openExpenseButtons = document.querySelectorAll("[data-open-expense]");
  const modalRestoreButtons = document.querySelectorAll("[data-modal-restore-sample]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const backdrop = document.querySelector("[data-backdrop]");
  const navItems = document.querySelectorAll("[data-nav-item]");
  const openFilterButtons = document.querySelectorAll("[data-open-filters]");
  const openImportJsonButtons = document.querySelectorAll("[data-open-import-json]");
  const openImportCsvButtons = document.querySelectorAll("[data-open-import-csv]");
  const openExportButtons = document.querySelectorAll("[data-open-export]");
  const importJsonInput = document.querySelector("[data-import-json-input]");
  const importCsvInput = document.querySelector("[data-import-csv-input]");
  const languageSwitch = document.querySelector("[data-language-switch]");
  const languageOptionButtons = document.querySelectorAll("[data-language-option]");
  const exchangeRateNote = document.querySelector("[data-exchange-rate-note]");
  const searchInput = document.querySelector("[data-search-input]");
  const topbarActions = document.querySelector("[data-topbar-actions]");
  const topbarEyebrow = document.querySelector("[data-topbar-eyebrow]");
  const topbarSearch = document.querySelector("[data-topbar-search]");
  const topbarFilters = document.querySelector("[data-topbar-filters]");
  const dashboardMain = document.querySelector("[data-dashboard-main]");
  const expenseList = document.querySelector("[data-expense-list]");
  const expenseResults = document.querySelector("[data-expense-results]");
  const insightList = document.querySelector("[data-insight-list]");
  const fab = document.querySelector(".fab");
  const fabLabel = document.querySelector(".fab__label");
  const modal = document.querySelector("[data-modal]");
  const modalPanels = document.querySelectorAll("[data-modal-panel]");
  const modalCloseButton = document.querySelector(".app-modal__close");
  const modalCloseTriggers = document.querySelectorAll("[data-modal-close]");
  const modalEyebrow = document.querySelector("[data-modal-eyebrow]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalCopy = document.querySelector("[data-modal-copy]");
  const expenseForm = document.querySelector("[data-expense-form]");
  const incomeForm = document.querySelector("[data-income-form]");
  const goalForm = document.querySelector("[data-goal-form]");
  const formFeedback = document.querySelector("[data-form-feedback]");
  const incomeFeedback = document.querySelector("[data-income-feedback]");
  const goalFeedback = document.querySelector("[data-goal-feedback]");
  const formSubmit = document.querySelector("[data-form-submit]");
  const incomeBaseInput = document.querySelector("[data-income-base-input]");
  const incomeExtraInput = document.querySelector("[data-income-extra-input]");
  const incomeTotalPreview = document.querySelector("[data-income-total-preview]");
  const incomeMonthLabel = document.querySelector("[data-income-month-label]");
  const goalAmountInput = document.querySelector("[data-goal-amount-input]");
  const goalLabelInput = document.querySelector("[data-goal-label-input]");
  const goalAmountPreview = document.querySelector("[data-goal-amount-preview]");
  const goalLabelPreview = document.querySelector("[data-goal-label-preview]");
  const confirmDeleteButton = document.querySelector("[data-confirm-delete]");
  const confirmTitle = document.querySelector("[data-confirm-title]");
  const confirmDate = document.querySelector("[data-confirm-date]");
  const confirmCopy = document.querySelector("[data-confirm-copy]");
  const confirmAmount = document.querySelector("[data-confirm-amount]");
  const filterForm = document.querySelector("[data-filter-form]");
  const filterMonthInput = document.querySelector("[data-filter-month]");
  const filterCategoryInput = document.querySelector("[data-filter-category]");
  const filterPaymentMethodInput = document.querySelector("[data-filter-payment-method]");
  const filterExpenseTypeInput = document.querySelector("[data-filter-expense-type]");
  const filterSortInput = document.querySelector("[data-filter-sort]");
  const filterSearchPreview = document.querySelector("[data-filter-search-preview]");
  const filterResultsCopy = document.querySelector("[data-filter-results-copy]");
  const clearFiltersButton = document.querySelector("[data-clear-filters]");
  const exportJsonButton = document.querySelector("[data-export-json]");
  const exportCsvButton = document.querySelector("[data-export-csv]");
  const exportSummary = document.querySelector("[data-export-summary]");
  const exportFilename = document.querySelector("[data-export-filename]");
  const exportCopy = document.querySelector("[data-export-copy]");
  const confirmRestoreButton = document.querySelector("[data-confirm-restore]");
  const toast = document.querySelector("[data-toast]");
  const donutChart = document.querySelector("[data-donut-chart]");
  const categoryLegend = document.querySelector("[data-category-legend]");
  const lineActualPath = document.querySelector("[data-line-actual]");
  const lineTargetPath = document.querySelector("[data-line-target]");
  const lineAreaPath = document.querySelector("[data-line-area]");
  const linePoints = document.querySelector("[data-line-points]");
  const lineAxis = document.querySelector("[data-line-axis]");
  const calendarGrid = document.querySelector("[data-calendar-grid]");
  const calendarYearLabel = document.querySelector("[data-calendar-year]");
  const calendarCopy = document.querySelector("[data-calendar-copy]");
  const calendarSummaryNote = document.querySelector("[data-calendar-summary-note]");
  const calendarShiftButtons = document.querySelectorAll("[data-calendar-shift]");

  const viewSections = {
    resumen: document.querySelector('[data-view="resumen"]'),
    flujo: document.querySelector('[data-view="flujo"]'),
    ingreso: document.querySelector('[data-view="ingreso"]'),
    actividad: document.querySelector('[data-view="actividad"]'),
    calendario: document.querySelector('[data-view="calendario"]'),
  };

  const kpiElements = {
    incomeTotal: document.querySelector('[data-kpi="incomeTotal"]'),
    totalSpent: document.querySelector('[data-kpi="totalSpent"]'),
    investedThisMonth: document.querySelector('[data-kpi="investedThisMonth"]'),
    savingsCapacity: document.querySelector('[data-kpi="savingsCapacity"]'),
    dailyAverage: document.querySelector('[data-kpi="dailyAverage"]'),
    goalProgress: document.querySelector('[data-kpi="goalProgress"]'),
  };

  const kpiDeltaElements = {
    incomeTotal: document.querySelector('[data-kpi-delta="incomeTotal"]'),
    totalSpent: document.querySelector('[data-kpi-delta="totalSpent"]'),
    investedThisMonth: document.querySelector('[data-kpi-delta="investedThisMonth"]'),
    savingsCapacity: document.querySelector('[data-kpi-delta="savingsCapacity"]'),
    dailyAverage: document.querySelector('[data-kpi-delta="dailyAverage"]'),
    goalProgress: document.querySelector('[data-kpi-delta="goalProgress"]'),
  };

  const kpiCaptionElements = {
    incomeTotal: document.querySelector('[data-kpi-caption="incomeTotal"]'),
    totalSpent: document.querySelector('[data-kpi-caption="totalSpent"]'),
    investedThisMonth: document.querySelector('[data-kpi-caption="investedThisMonth"]'),
    savingsCapacity: document.querySelector('[data-kpi-caption="savingsCapacity"]'),
    dailyAverage: document.querySelector('[data-kpi-caption="dailyAverage"]'),
    goalProgress: document.querySelector('[data-kpi-caption="goalProgress"]'),
  };

  const kpiSecondaryElements = {
    savingsCapacity: document.querySelector('[data-kpi-secondary="savingsCapacity"]'),
  };

  const kpiBarElements = {
    savingsCapacity: document.querySelector('[data-kpi-bar="savingsCapacity"]'),
  };

  const kpiCardElements = {
    savingsCapacity: document.querySelector('[data-kpi-card="savingsCapacity"]'),
  };

  const heroCardElement = document.querySelector('[data-capacity-card="hero"]');

  const yearSummaryElements = {
    income: document.querySelector('[data-year-summary="income"]'),
    spent: document.querySelector('[data-year-summary="spent"]'),
    invested: document.querySelector('[data-year-summary="invested"]'),
    average: document.querySelector('[data-year-summary="average"]'),
  };

  const summaryElements = {
    sidebarFreeCash: document.querySelector('[data-summary="sidebar-free-cash"]'),
    sidebarAvailableToSave: document.querySelector('[data-summary="sidebar-available-to-save"]'),
    heroLiquidityFinal: document.querySelector('[data-summary="hero-liquidity-final"]'),
    heroIncome: document.querySelector('[data-summary="hero-income"]'),
    heroSpent: document.querySelector('[data-summary="hero-spent"]'),
    heroInvested: document.querySelector('[data-summary="hero-invested"]'),
    flowIncome: document.querySelector('[data-summary="flow-income"]'),
    flowSpent: document.querySelector('[data-summary="flow-spent"]'),
    flowAvailable: document.querySelector('[data-summary="flow-available"]'),
    flowInvested: document.querySelector('[data-summary="flow-invested"]'),
    flowLiquidityFinal: document.querySelector('[data-summary="flow-liquidity-final"]'),
    kpiAvailableBeforeInvesting: document.querySelector('[data-summary="kpi-available-before-investing"]'),
    chartTotalSpent: document.querySelector('[data-summary="chart-total-spent"]'),
    goalAmount: document.querySelector('[data-summary="goal-amount"]'),
    goalSaved: document.querySelector('[data-summary="goal-saved"]'),
    goalGapValue: document.querySelector('[data-summary="goal-gap-value"]'),
    goalExceeded: document.querySelector('[data-summary="goal-exceeded"]'),
    incomeTotal: document.querySelector('[data-summary="income-total"]'),
    incomeBase: document.querySelector('[data-summary="income-base"]'),
    incomeExtra: document.querySelector('[data-summary="income-extra"]'),
    incomeBalance: document.querySelector('[data-summary="income-balance"]'),
    incomeAvailableToSave: document.querySelector('[data-summary="income-available-to-save"]'),
    incomeCapacityAmount: document.querySelector('[data-summary="income-capacity-amount"]'),
    incomeSpent: document.querySelector('[data-summary="income-spent"]'),
    incomeGoalAmount: document.querySelector('[data-summary="income-goal-amount"]'),
    incomeGoalSaved: document.querySelector('[data-summary="income-goal-saved"]'),
    incomeGoalGap: document.querySelector('[data-summary="income-goal-gap"]'),
  };

  const textElements = {
    periodTitle: document.querySelector("[data-period-title]"),
    periodPill: document.querySelector("[data-period-pill]"),
    sidebarSavingsCapacity: document.querySelector('[data-summary-text="sidebar-savings-capacity"]'),
    heroLiquidityCopy: document.querySelector('[data-summary-text="hero-liquidity-copy"]'),
    heroRiskReason: document.querySelector('[data-summary-text="hero-risk-reason"]'),
    heroDifferenceNote: document.querySelector('[data-summary-text="hero-difference-note"]'),
    heroBalanceNote: document.querySelector('[data-summary-text="hero-balance-note"]'),
    heroCaption: document.querySelector('[data-summary-text="hero-caption"]'),
    categoryCountPill: document.querySelector('[data-summary-text="category-count-pill"]'),
    goalHeading: document.querySelector('[data-summary-text="goal-heading"]'),
    goalNote: document.querySelector('[data-summary-text="goal-note"]'),
    goalProgressText: document.querySelector('[data-summary-text="goal-progress-text"]'),
    comparisonNote: document.querySelector('[data-summary-text="comparison-note"]'),
    incomeCaption: document.querySelector('[data-summary-text="income-caption"]'),
    incomeUsageLabel: document.querySelector("[data-income-usage-label]"),
    incomeUsageCopy: document.querySelector('[data-summary-text="income-usage-copy"]'),
    incomeGoalLabel: document.querySelector('[data-summary-text="income-goal-label"]'),
    incomeGoalGapLabel: document.querySelector('[data-summary-text="income-goal-gap-label"]'),
    incomeGoalCopy: document.querySelector('[data-summary-text="income-goal-copy"]'),
    incomeResultCopy: document.querySelector('[data-summary-text="income-result-copy"]'),
  };

  const heroDifferenceCardElement = summaryElements.heroInvested?.closest(".hero-card__meta-item");

  const comparisonElements = {
    totalSpentCopy: document.querySelector('[data-comparison="totalSpent-copy"]'),
    totalSpentValue: document.querySelector('[data-comparison="totalSpent-value"]'),
    remainingBalanceCopy: document.querySelector('[data-comparison="remainingBalance-copy"]'),
    remainingBalanceValue: document.querySelector('[data-comparison="remainingBalance-value"]'),
    investedCopy: document.querySelector('[data-comparison="invested-copy"]'),
    investedValue: document.querySelector('[data-comparison="invested-value"]'),
    categoryShiftCopy: document.querySelector('[data-comparison="categoryShift-copy"]'),
    categoryShiftValue: document.querySelector('[data-comparison="categoryShift-value"]'),
  };

  const labelElements = {
    goalGap: document.querySelector('[data-summary-label="goal-gap-label"]'),
  };

  const barElements = {
    sidebarSavingsCapacity: document.querySelector('[data-summary-bar="sidebar-savings-capacity"]'),
    goalProgress: document.querySelector('[data-summary-bar="goal-progress"]'),
  };

  const statusElements = {
    sidebar: document.querySelector('[data-summary-status="sidebar"]'),
    hero: document.querySelector('[data-summary-status="hero"]'),
    goal: document.querySelector('[data-summary-status="goal"]'),
    line: document.querySelector('[data-summary-status="line"]'),
  };

  const stackedSegments = document.querySelectorAll(".stacked-bar__segment");

  window.aleclvExpenseTrackerDom = {
    body,
    topbar,
    openIncomeButtons,
    openGoalButtons,
    openInvestmentButtons,
    openExpenseButtons,
    modalRestoreButtons,
    menuToggle,
    backdrop,
    navItems,
    openFilterButtons,
    openImportJsonButtons,
    openImportCsvButtons,
    openExportButtons,
    importJsonInput,
    importCsvInput,
    languageSwitch,
    languageOptionButtons,
    exchangeRateNote,
    searchInput,
    topbarActions,
    topbarEyebrow,
    topbarSearch,
    topbarFilters,
    dashboardMain,
    expenseList,
    expenseResults,
    insightList,
    fab,
    fabLabel,
    modal,
    modalPanels,
    modalCloseButton,
    modalCloseTriggers,
    modalEyebrow,
    modalTitle,
    modalCopy,
    expenseForm,
    incomeForm,
    goalForm,
    formFeedback,
    incomeFeedback,
    goalFeedback,
    formSubmit,
    incomeBaseInput,
    incomeExtraInput,
    incomeTotalPreview,
    incomeMonthLabel,
    goalAmountInput,
    goalLabelInput,
    goalAmountPreview,
    goalLabelPreview,
    confirmDeleteButton,
    confirmTitle,
    confirmDate,
    confirmCopy,
    confirmAmount,
    filterForm,
    filterMonthInput,
    filterCategoryInput,
    filterPaymentMethodInput,
    filterExpenseTypeInput,
    filterSortInput,
    filterSearchPreview,
    filterResultsCopy,
    clearFiltersButton,
    exportJsonButton,
    exportCsvButton,
    exportSummary,
    exportFilename,
    exportCopy,
    confirmRestoreButton,
    toast,
    donutChart,
    categoryLegend,
    lineActualPath,
    lineTargetPath,
    lineAreaPath,
    linePoints,
    lineAxis,
    calendarGrid,
    calendarYearLabel,
    calendarCopy,
    calendarSummaryNote,
    calendarShiftButtons,
    viewSections,
    kpiElements,
    kpiDeltaElements,
    kpiCaptionElements,
    kpiSecondaryElements,
    kpiBarElements,
    kpiCardElements,
    heroCardElement,
    yearSummaryElements,
    summaryElements,
    textElements,
    heroDifferenceCardElement,
    comparisonElements,
    labelElements,
    barElements,
    statusElements,
    stackedSegments,
  };
})();
