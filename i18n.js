(function () {
  const DEFAULT_LANGUAGE = "es";
  const SUPPORTED_LANGUAGES = ["es", "en"];
  const DEFAULT_CURRENCY_BY_LANGUAGE = {
    es: "ARS",
    en: "USD",
  };

  const isSupportedLanguage = (value) => Object.prototype.hasOwnProperty.call(DEFAULT_CURRENCY_BY_LANGUAGE, value);
const translations = {
  es: {
    locale: "es-AR",
    currency: "ARS",
  },
  en: {
    locale: "en-US",
    currency: "USD",
  },
};
translations.es.views = {
  resumen: "Resumen",
  flujo: "Flujo",
  ingreso: "Ingreso",
  actividad: "Actividad",
  calendario: "Calendario",
};
translations.en.views = {
  resumen: "Summary",
  flujo: "Flow",
  ingreso: "Income",
  actividad: "Activity",
  calendario: "Calendar",
};

translations.es.topbar = {
  resumenEyebrow: "vision general",
  resumenTitle: "{month} - resumen mensual del salario",
  flujoEyebrow: "analisis del mes",
  flujoTitle: "flujo del mes",
  ingresoEyebrow: "control del mes",
  ingresoTitle: "plan de ingreso del mes",
  actividadEyebrow: "operaciones del mes",
  actividadTitle: "movimientos del mes",
  calendarioEyebrow: "planificacion anual",
  calendarioTitle: "plan anual por mes",
};
translations.en.topbar = {
  resumenEyebrow: "monthly overview",
  resumenTitle: "{month} - salary snapshot",
  flujoEyebrow: "month analysis",
  flujoTitle: "monthly flow",
  ingresoEyebrow: "month control",
  ingresoTitle: "monthly income plan",
  actividadEyebrow: "month activity",
  actividadTitle: "monthly movements",
  calendarioEyebrow: "annual planning",
  calendarioTitle: "annual month plan",
};

translations.es.search = {
  aria: "Buscar",
  placeholder: "Buscar descripcion, categoria, medio de pago o nota",
};
translations.en.search = {
  aria: "Search",
  placeholder: "Search description, category, payment method or note",
};

translations.es.sidebar = {
  primaryAria: "Principal",
  mobileAria: "Movil",
  brandEyebrow: "plan de dinero mensual",
  activeMonthEyebrow: "Mes activo",
  savingsCapacity: "Capacidad de ahorro",
  availableToSave: "Disponible para ahorrar",
  profileEyebrow: "Perfil",
  personalSpace: "Espacio personal",
};
translations.en.sidebar = {
  primaryAria: "Primary",
  mobileAria: "Mobile",
  brandEyebrow: "monthly money plan",
  activeMonthEyebrow: "Active month",
  savingsCapacity: "Savings capacity",
  availableToSave: "Available to save",
  profileEyebrow: "Profile",
  personalSpace: "Personal space",
};

translations.es.status = {
  noData: "Sin datos",
  noBase: "Sin base",
  noIncome: "Sin ingreso",
  atRisk: "En riesgo",
  comfortable: "Sobrado",
  controlled: "Controlado",
  tight: "Ajustado",
  onTrack: "Vas bien",
  inBalance: "En equilibrio",
  overspending: "Te estas pasando",
  goalMet: "Meta cumplida",
  onPace: "En ritmo",
  noContributions: "Sin aportes",
  stable: "Estable",
  currentAverage: "Promedio actual",
  editable: "Editable",
  noExpenses: "Sin gastos",
  withMovements: "Con movimientos",
  future: "Futuro",
  noGoal: "Sin meta",
};
translations.en.status = {
  noData: "No data",
  noBase: "No baseline",
  noIncome: "No income",
  atRisk: "At risk",
  comfortable: "Comfortable",
  controlled: "Controlled",
  tight: "Tight",
  onTrack: "You are on track",
  inBalance: "Balanced",
  overspending: "You are overspending",
  goalMet: "Goal met",
  onPace: "On pace",
  noContributions: "No contributions",
  stable: "Stable",
  currentAverage: "Current average",
  editable: "Editable",
  noExpenses: "No expenses",
  withMovements: "With movements",
  future: "Future",
  noGoal: "No goal",
};

translations.es.savingsCapacityStates = {
  neutral: "Sin ingreso",
  excellent: "Excelente",
  healthy: "Saludable",
  low: "Bajo",
};
translations.en.savingsCapacityStates = {
  neutral: "No income",
  excellent: "Excellent",
  healthy: "Healthy",
  low: "Low",
};
translations.es.hero = {
  eyebrow: "Liquidez final",
  title: "Disponible hasta proximo ingreso",
  ariaLabel: "Resumen de liquidez",
  dailySpend: "Gasto diario",
  dailyLimit: "Limite diario",
  difference: "Diferencia",
  closingPositive: "Cierre estimado: {amount}",
  closingNegative: "Vas a cerrar en negativo (-{amount})",
  deviationCost: "Costo de desviarte: {amount}",
  registerExpense: "Registrar gasto",
  riskLiquidity: "Liquidez negativa",
  riskDaily: "Gasto diario superior al limite",
  riskClosing: "Cierre mensual en negativo",
};
translations.en.hero = {
  eyebrow: "Final liquidity",
  title: "Available until next income",
  ariaLabel: "Liquidity summary",
  dailySpend: "Daily spend",
  dailyLimit: "Daily limit",
  difference: "Difference",
  closingPositive: "Closing projection: {amount}",
  closingNegative: "You will close negative (-{amount})",
  deviationCost: "Cost of drifting: {amount}",
  registerExpense: "Add expense",
  riskLiquidity: "Negative liquidity",
  riskDaily: "Daily spending is above the limit",
  riskClosing: "Monthly closing is negative",
};

translations.es.goal = {
  eyebrow: "Meta mensual",
  defaultLabel: "Meta mensual de inversion",
  noteDefault: "La meta solo suma los movimientos cargados en la categoria Inversion.",
  objective: "Objetivo",
  investedThisMonth: "Invertido este mes",
  progress: "Progreso de inversion",
  toInvest: "Te falta invertir",
  exceeded: "Excedente sobre la meta",
  comparisonLabel: "Comparacion con el mes anterior",
  comparisonSpent: "Gastos",
  comparisonAvailable: "Disponible antes de invertir",
  comparisonInvested: "Invertido",
  comparisonCategoryShift: "Cambio de categoria",
};
translations.en.goal = {
  eyebrow: "Monthly goal",
  defaultLabel: "Monthly investment goal",
  noteDefault: "The goal only adds movements recorded in the Investment category.",
  objective: "Target",
  investedThisMonth: "Invested this month",
  progress: "Investment progress",
  toInvest: "Still to invest",
  exceeded: "Above target",
  comparisonLabel: "Comparison with previous month",
  comparisonSpent: "Expenses",
  comparisonAvailable: "Available before investing",
  comparisonInvested: "Invested",
  comparisonCategoryShift: "Category shift",
};

translations.es.flow = {
  ariaLabel: "Flujo financiero del mes",
  eyebrow: "Flujo mensual",
  title: "Del ingreso a la liquidez final",
  note: "Una lectura lineal del mes para entender cuanto entro, cuanto salio, cuanto reservaste y cuanto te queda de verdad.",
  totalIncome: "Ingreso total",
  totalIncomeCopy: "Todo lo que entro este mes.",
  spent: "Gastos",
  spentCopy: "Tus gastos de vida del periodo.",
  availableBeforeInvesting: "Disponible antes de invertir",
  availableBeforeInvestingCopy: "Liquidez previa a cualquier aporte.",
  investment: "Inversion",
  investmentCopy: "Decision mensual registrada en la meta.",
  liquidityFinal: "Liquidez final",
  liquidityFinalCopy: "Lo que realmente tienes disponible hoy.",
};
translations.en.flow = {
  ariaLabel: "Financial flow of the month",
  eyebrow: "Monthly flow",
  title: "From income to final liquidity",
  note: "A simple month read so you can see what came in, what went out, what you set aside and what is truly left.",
  totalIncome: "Total income",
  totalIncomeCopy: "Everything that came in this month.",
  spent: "Expenses",
  spentCopy: "Your living expenses for the period.",
  availableBeforeInvesting: "Available before investing",
  availableBeforeInvestingCopy: "Liquidity before any contribution.",
  investment: "Investment",
  investmentCopy: "Monthly decision recorded in the goal.",
  liquidityFinal: "Final liquidity",
  liquidityFinalCopy: "What you truly have available today.",
};

translations.es.charts = {
  distributionEyebrow: "Distribucion",
  distributionTitle: "Gastos por categoria",
  totalExpenses: "Gastos totales",
  evolutionEyebrow: "Evolucion",
  evolutionTitle: "Ritmo del mes",
  actual: "Actual",
  projection: "Proyeccion",
  axisLabel: "Gastos acumulados del mes",
  readingEyebrow: "Lectura",
  readingTitle: "Claves del mes",
  indicators: "{count} indicadores",
  noCategories: "Sin categorias",
  noCategoriesCopy: "Carga gastos reales para ver la mezcla del mes.",
};
translations.en.charts = {
  distributionEyebrow: "Distribution",
  distributionTitle: "Expenses by category",
  totalExpenses: "Total expenses",
  evolutionEyebrow: "Trend",
  evolutionTitle: "Month pace",
  actual: "Actual",
  projection: "Projection",
  axisLabel: "Accumulated monthly expenses",
  readingEyebrow: "Reading",
  readingTitle: "Month highlights",
  indicators: "{count} indicators",
  noCategories: "No categories",
  noCategoriesCopy: "Add real expenses to see this month's mix.",
};

translations.es.insights = {
  incomeUse: "Uso del ingreso",
  savingsCapacity: "Capacidad de ahorro",
  dailyAverage: "Promedio diario",
  closingProjection: "Proyeccion de cierre",
  dominantCategory: "Categoria dominante",
  monthlyInvestment: "Inversion del mes",
  noCategory: "Sin categoria",
};
translations.en.insights = {
  incomeUse: "Income usage",
  savingsCapacity: "Savings capacity",
  dailyAverage: "Daily average",
  closingProjection: "Closing projection",
  dominantCategory: "Top category",
  monthlyInvestment: "Monthly investment",
  noCategory: "No category",
};

translations.es.income = {
  eyebrow: "Plan del ingreso",
  title: "Centro de control del mes",
  kpiAria: "Resumen del ingreso",
  totalIncome: "Ingreso total",
  basePlusExtra: "Base + extra",
  balance: "Saldo disponible",
  afterExpenses: "Despues de gastos",
  savingsCapacity: "Capacidad de ahorro",
  currentMargin: "Margen actual",
  monthUseBase: "Se usa como base para {month}.",
  compositionEyebrow: "Ingreso",
  compositionTitle: "Composicion del mes",
  baseIncome: "Ingreso base",
  extraIncome: "Ingreso extra",
  resultEyebrow: "Resultado",
  resultTitle: "Meta y margen real del mes",
  availableToSave: "Disponible para ahorrar",
  investedThisMonth: "Invertido este mes",
  actionsEyebrow: "Acciones del mes",
  actionsTitle: "Ajustes y aportes",
  editIncome: "Editar ingreso mensual",
  editGoal: "Editar meta mensual",
  registerInvestment: "Registrar inversion",
  languageLabel: "Idioma",
  exchangeNote: "Tipo de cambio USD: ExchangeRate-API",
};
translations.en.income = {
  eyebrow: "Income plan",
  title: "Month control center",
  kpiAria: "Income summary",
  totalIncome: "Total income",
  basePlusExtra: "Base + extra",
  balance: "Available balance",
  afterExpenses: "After expenses",
  savingsCapacity: "Savings capacity",
  currentMargin: "Current margin",
  monthUseBase: "Used as the base for {month}.",
  compositionEyebrow: "Income",
  compositionTitle: "Month composition",
  baseIncome: "Base income",
  extraIncome: "Extra income",
  resultEyebrow: "Result",
  resultTitle: "Goal and real margin this month",
  availableToSave: "Available to save",
  investedThisMonth: "Invested this month",
  actionsEyebrow: "Month actions",
  actionsTitle: "Adjustments and contributions",
  editIncome: "Edit monthly income",
  editGoal: "Edit monthly goal",
  registerInvestment: "Add investment",
  languageLabel: "Language",
  exchangeNote: "USD rate via ExchangeRate-API",
};

translations.es.activity = {
  eyebrow: "Operaciones",
  title: "Movimientos del mes",
  visibleResults: "{count} visible(s)",
  filters: "Filtros",
  importJson: "Importar JSON",
  importCsv: "Importar CSV",
  export: "Exportar",
};
translations.en.activity = {
  eyebrow: "Operations",
  title: "Monthly movements",
  visibleResults: "{count} visible",
  filters: "Filters",
  importJson: "Import JSON",
  importCsv: "Import CSV",
  export: "Export",
};

translations.es.calendar = {
  eyebrow: "Calendario",
  title: "Plan anual por mes",
  previousYear: "Año anterior",
  nextYear: "Año siguiente",
  incomeReference: "Ingreso anual de referencia",
  spentYear: "Gastos del año",
  investedYear: "Invertido del año",
  averageAvailable: "Promedio disponible para ahorrar",
};
translations.en.calendar = {
  eyebrow: "Calendar",
  title: "Annual month plan",
  previousYear: "Previous year",
  nextYear: "Next year",
  incomeReference: "Reference yearly income",
  spentYear: "Year expenses",
  investedYear: "Year invested",
  averageAvailable: "Average available to save",
};
translations.es.modal = {
  closeButton: "Cerrar modal",
  cancel: "Cancelar",
  saveExpense: "Guardar gasto",
  saveContribution: "Guardar aporte",
  saveIncome: "Guardar ingreso",
  saveGoal: "Guardar meta",
  formEyebrow: "Registrar movimiento",
  expenseTitle: "Registrar gasto",
  expenseCopy: "Carga un gasto real del mes sin salir del planner.",
  investmentEyebrow: "Registrar inversion",
  investmentTitle: "Registrar inversion",
  investmentCopy: "La categoria Inversion ya queda seleccionada para registrar un aporte real del mes.",
  editExpenseEyebrow: "Editar gasto",
  editExpenseTitle: "Editar gasto",
  editExpenseCopy: "Actualiza el gasto y el resumen del mes se recalcula al instante.",
  editInvestmentEyebrow: "Editar inversion",
  editInvestmentTitle: "Editar aporte",
  editInvestmentCopy: "Actualiza el aporte y el progreso de la meta se recalcula al instante.",
  description: "Descripcion",
  amount: "Monto",
  date: "Fecha",
  category: "Categoria",
  categoryPlaceholder: "Elegir categoria",
  paymentMethod: "Medio de pago",
  paymentMethodPlaceholder: "Elegir medio de pago",
  notes: "Notas",
  notesPlaceholder: "Detalle opcional del movimiento",
  movementType: "Tipo de movimiento",
  markFixed: "Marcar como fijo",
  fixedHelp: "Ideal para servicios, cuotas, suscripciones o pagos mensuales.",
  incomeEyebrow: "Ingreso mensual",
  incomeTitle: "Editar ingreso del mes",
  incomeCopy: "Separa tu ingreso base del extra para entender mejor cuanto margen real te queda.",
  incomeBase: "Ingreso base",
  incomeExtra: "Ingreso extra",
  incomeTotalCalculated: "Ingreso total calculado",
  incomeTotalEditCopy: "El total se actualiza al instante mientras editas ingreso base y extra.",
  goalEyebrow: "Meta mensual",
  goalTitle: "Editar objetivo mensual de inversion",
  goalCopy: "Define cuanto quieres invertir este mes. La meta solo avanza con movimientos cargados en la categoria Inversion.",
  goalAmount: "Monto objetivo",
  goalOptionalLabel: "Etiqueta opcional",
  goalSummary: "Resumen de meta",
  goalExample: "Ejemplo realista para este tracker: $740.000 ARS, equivalente aproximado a 500 USD. Solo suma aportes en Inversion.",
  deleteEyebrow: "Eliminar movimiento",
  deleteTitle: "Quitar este movimiento?",
  deleteNote: "El total del mes se actualiza al instante y esta accion no se puede deshacer.",
  deleteAction: "Eliminar movimiento",
  filtersEyebrow: "Vista",
  filtersTitle: "Filtros",
  filtersCopy: "El mes define el contexto del tablero y el resto de los filtros ajusta la lista visible y las exportaciones.",
  month: "Mes",
  expenseType: "Tipo de movimiento",
  sortBy: "Ordenar por",
  currentSearch: "Busqueda actual",
  restoreSample: "Restaurar datos de muestra",
  done: "Listo",
  exportEyebrow: "Exportacion",
  exportTitle: "Exportar movimientos visibles",
  exportCopy: "La exportacion respeta el mes, la busqueda y todos los filtros activos.",
  close: "Cerrar",
  exportJson: "Exportar JSON",
  exportCsv: "Exportar CSV",
  resetEyebrow: "Restaurar muestra",
  resetTitle: "Reemplazar tus datos actuales?",
  resetCopy: "Esto vuelve a cargar la muestra incluida con el planner y pisa el estado guardado en este navegador.",
  sampleData: "Datos de muestra",
  sampleDataCopy: "Se restablecen ingreso, movimientos, categorias, resumenes y filtros para seguir explorando el planner.",
  sampleDataHint: "Usalo si quieres volver a una base limpia sin perder la estructura realista de la interfaz.",
  restoreSampleAction: "Restaurar muestra",
};
translations.en.modal = {
  closeButton: "Close modal",
  cancel: "Cancel",
  saveExpense: "Save expense",
  saveContribution: "Save contribution",
  saveIncome: "Save income",
  saveGoal: "Save goal",
  formEyebrow: "Add movement",
  expenseTitle: "Add expense",
  expenseCopy: "Record a real expense for the month without leaving the planner.",
  investmentEyebrow: "Add investment",
  investmentTitle: "Add investment",
  investmentCopy: "The Investment category is preselected so you can record a real monthly contribution.",
  editExpenseEyebrow: "Edit expense",
  editExpenseTitle: "Edit expense",
  editExpenseCopy: "Update the expense and the monthly summary recalculates instantly.",
  editInvestmentEyebrow: "Edit investment",
  editInvestmentTitle: "Edit contribution",
  editInvestmentCopy: "Update the contribution and goal progress recalculates instantly.",
  description: "Description",
  amount: "Amount",
  date: "Date",
  category: "Category",
  categoryPlaceholder: "Choose category",
  paymentMethod: "Payment method",
  paymentMethodPlaceholder: "Choose payment method",
  notes: "Notes",
  notesPlaceholder: "Optional movement detail",
  movementType: "Movement type",
  markFixed: "Mark as fixed",
  fixedHelp: "Useful for utilities, installments, subscriptions or monthly payments.",
  incomeEyebrow: "Monthly income",
  incomeTitle: "Edit monthly income",
  incomeCopy: "Separate base and extra income to understand your real margin more clearly.",
  incomeBase: "Base income",
  incomeExtra: "Extra income",
  incomeTotalCalculated: "Calculated total income",
  incomeTotalEditCopy: "The total updates instantly while you edit base and extra income.",
  goalEyebrow: "Monthly goal",
  goalTitle: "Edit monthly investment target",
  goalCopy: "Define how much you want to invest this month. The goal only moves with transactions recorded in the Investment category.",
  goalAmount: "Target amount",
  goalOptionalLabel: "Optional label",
  goalSummary: "Goal summary",
  goalExample: "Realistic example for this tracker: ARS 740,000, roughly equal to USD 500. Only real Investment contributions count.",
  deleteEyebrow: "Delete movement",
  deleteTitle: "Remove this movement?",
  deleteNote: "The monthly total updates instantly and this action cannot be undone.",
  deleteAction: "Delete movement",
  filtersEyebrow: "View",
  filtersTitle: "Filters",
  filtersCopy: "The month defines dashboard context and the rest of the filters adjust the visible list and exports.",
  month: "Month",
  expenseType: "Movement type",
  sortBy: "Sort by",
  currentSearch: "Current search",
  restoreSample: "Restore sample data",
  done: "Done",
  exportEyebrow: "Export",
  exportTitle: "Export visible movements",
  exportCopy: "Export respects the active month, search and every current filter.",
  close: "Close",
  exportJson: "Export JSON",
  exportCsv: "Export CSV",
  resetEyebrow: "Restore sample",
  resetTitle: "Replace your current data?",
  resetCopy: "This reloads the built-in sample and overwrites the state saved in this browser.",
  sampleData: "Sample data",
  sampleDataCopy: "Income, movements, categories, summaries and filters are reset so you can keep exploring the planner.",
  sampleDataHint: "Use it if you want a clean base without losing the realistic interface structure.",
  restoreSampleAction: "Restore sample",
};

translations.es.filters = {
  allCategories: "Todas las categorias",
  allMethods: "Todos los medios",
  allMovementTypes: "Fijos y variables",
  onlyFixed: "Solo fijos",
  onlyVariable: "Solo variables",
  newest: "Mas recientes primero",
  oldest: "Mas antiguos primero",
  highest: "Monto mas alto",
  lowest: "Monto mas bajo",
  noSearch: "Sin busqueda aplicada",
  searchPreview: "Busqueda: \"{query}\"",
  resultsCopy: "{count} resultado(s) en {month}. Orden actual: {sort}.",
  clearFilters: "Limpiar filtros",
};
translations.en.filters = {
  allCategories: "All categories",
  allMethods: "All methods",
  allMovementTypes: "Fixed and variable",
  onlyFixed: "Fixed only",
  onlyVariable: "Variable only",
  newest: "Newest first",
  oldest: "Oldest first",
  highest: "Highest amount",
  lowest: "Lowest amount",
  noSearch: "No active search",
  searchPreview: "Search: \"{query}\"",
  resultsCopy: "{count} result(s) in {month}. Current sort: {sort}.",
  clearFilters: "Clear filters",
};

translations.es.exportState = {
  ready: "{count} movimiento(s) listos para exportar",
  copy: "Incluye filtros de {month}: {category}, {method}.",
  empty: "No hay movimientos visibles para exportar con los filtros actuales.",
  allCategories: "todas las categorias",
  allMethods: "todos los medios",
};
translations.en.exportState = {
  ready: "{count} movement(s) ready to export",
  copy: "Includes filters for {month}: {category}, {method}.",
  empty: "There are no visible movements to export with the current filters.",
  allCategories: "all categories",
  allMethods: "all payment methods",
};

translations.es.emptyState = {
  noExpensesTitle: "No hay gastos en {month}",
  noExpensesCopy: "Empieza cargando un gasto real o registra una inversion para medir por separado tu saldo disponible y el avance real de la meta.",
  noFilteredTitle: "No hay movimientos con estos filtros",
  noFilteredCopy: "Prueba limpiar categoria, medio de pago, tipo de movimiento o la busqueda para volver a ver resultados.",
  loadSample: "Cargar muestra",
  adjustFilters: "Ajustar filtros",
};
translations.en.emptyState = {
  noExpensesTitle: "No expenses in {month}",
  noExpensesCopy: "Start by recording a real expense or add an investment so you can track available balance and real goal progress separately.",
  noFilteredTitle: "No movements with these filters",
  noFilteredCopy: "Try clearing category, payment method, movement type or search to see results again.",
  loadSample: "Load sample",
  adjustFilters: "Adjust filters",
};
translations.es.movement = {
  expenseNoun: "gasto",
  expenseNounCap: "Gasto",
  investmentNoun: "aporte",
  investmentNounCap: "Aporte",
  editExpense: "Editar gasto",
  editInvestment: "Editar aporte",
  duplicateExpense: "Duplicar gasto",
  duplicateInvestment: "Duplicar aporte",
  deleteExpense: "Eliminar gasto",
  deleteInvestment: "Eliminar aporte",
  registeredExpense: "Gasto registrado.",
  registeredInvestment: "Aporte registrado.",
  updatedExpense: "Gasto actualizado.",
  updatedInvestment: "Aporte actualizado.",
  deletedExpense: "Gasto eliminado.",
  deletedInvestment: "Aporte eliminado.",
  duplicatedExpense: "Gasto duplicado.",
  duplicatedInvestment: "Aporte duplicado.",
  deleteExpenseCopy: "Vas a eliminar este gasto del registro mensual.",
  deleteInvestmentCopy: "Vas a eliminar este aporte del registro mensual.",
};
translations.en.movement = {
  expenseNoun: "expense",
  expenseNounCap: "Expense",
  investmentNoun: "contribution",
  investmentNounCap: "Contribution",
  editExpense: "Edit expense",
  editInvestment: "Edit contribution",
  duplicateExpense: "Duplicate expense",
  duplicateInvestment: "Duplicate contribution",
  deleteExpense: "Delete expense",
  deleteInvestment: "Delete contribution",
  registeredExpense: "Expense recorded.",
  registeredInvestment: "Contribution recorded.",
  updatedExpense: "Expense updated.",
  updatedInvestment: "Contribution updated.",
  deletedExpense: "Expense removed.",
  deletedInvestment: "Contribution removed.",
  duplicatedExpense: "Expense duplicated.",
  duplicatedInvestment: "Contribution duplicated.",
  deleteExpenseCopy: "You are about to remove this expense from the monthly record.",
  deleteInvestmentCopy: "You are about to remove this contribution from the monthly record.",
};

translations.es.validation = {
  description: "Agrega una descripcion clara.",
  amount: "Ingresa un monto mayor a cero.",
  category: "Elegi una categoria.",
  date: "Selecciona una fecha valida.",
  paymentMethod: "Elegi un medio de pago.",
  incomeBase: "Ingresa un monto valido para el ingreso base.",
  incomeExtra: "Ingresa un monto valido para el ingreso extra.",
  goalAmount: "Ingresa un objetivo mensual mayor a cero.",
};
translations.en.validation = {
  description: "Add a clear description.",
  amount: "Enter an amount greater than zero.",
  category: "Choose a category.",
  date: "Select a valid date.",
  paymentMethod: "Choose a payment method.",
  incomeBase: "Enter a valid amount for base income.",
  incomeExtra: "Enter a valid amount for extra income.",
  goalAmount: "Enter a monthly target greater than zero.",
};

translations.es.toast = {
  incomeUpdated: "Ingreso mensual actualizado.",
  goalUpdated: "Meta mensual actualizada.",
  noVisibleExpenses: "No hay movimientos visibles para exportar.",
  exportReady: "Exportacion {format} lista.",
  jsonImported: "Datos importados correctamente",
  jsonInvalid: "Archivo JSON invalido",
  csvImported: "Movimientos importados correctamente",
  csvInvalid: "Archivo CSV invalido",
  sampleRestored: "Muestra restaurada.",
  languageChangedEs: "Idioma cambiado a español",
  languageChangedEn: "Language changed to English",
};
translations.en.toast = {
  incomeUpdated: "Monthly income updated.",
  goalUpdated: "Monthly goal updated.",
  noVisibleExpenses: "There are no visible movements to export.",
  exportReady: "{format} export ready.",
  jsonImported: "Data imported successfully",
  jsonInvalid: "Invalid JSON file",
  csvImported: "Movements imported successfully",
  csvInvalid: "Invalid CSV file",
  sampleRestored: "Sample restored.",
  languageChangedEs: "Idioma cambiado a español",
  languageChangedEn: "Language changed to English",
};

translations.es.categories = {
  Supermercado: "Supermercado",
  Transporte: "Transporte",
  "Casa/Servicios": "Casa/Servicios",
  Gimnasio: "Gimnasio",
  Facultad: "Facultad",
  Suscripciones: "Suscripciones",
  Salidas: "Gastos",
  Salud: "Salud",
  "Auto/Moto": "Auto/Moto",
  Inversion: "Inversion",
  Otros: "Otros",
};
translations.en.categories = {
  Supermercado: "Groceries",
  Transporte: "Transport",
  "Casa/Servicios": "Home/Utilities",
  Gimnasio: "Gym",
  Facultad: "Studies",
  Suscripciones: "Subscriptions",
  Salidas: "Outings",
  Salud: "Health",
  "Auto/Moto": "Car/Bike",
  Inversion: "Investment",
  Otros: "Other",
};

translations.es.paymentMethods = {
  Efectivo: "Efectivo",
  Debito: "Debito",
  Credito: "Credito",
  Transferencia: "Transferencia",
};
translations.en.paymentMethods = {
  Efectivo: "Cash",
  Debito: "Debit",
  Credito: "Credit",
  Transferencia: "Transfer",
};

translations.es.frequency = {
  fixed: "Fijo",
  variable: "Variable",
};
translations.en.frequency = {
  fixed: "Fixed",
  variable: "Variable",
};

translations.es.movementTypes = {
  expense: "Gasto",
  investment: "Inversion",
  income: "Ingreso",
};
translations.en.movementTypes = {
  expense: "Expense",
  investment: "Investment",
  income: "Income",
};

translations.es.sort = {
  newest: "Mas recientes",
  oldest: "Mas antiguos",
  highest: "Monto mas alto",
  lowest: "Monto mas bajo",
};
translations.en.sort = {
  newest: "Newest",
  oldest: "Oldest",
  highest: "Highest amount",
  lowest: "Lowest amount",
};
const VIEW_TOPBAR_CONFIG = {
  resumen: {
    eyebrow: "vision general",
    getTitle: (metrics) => `${metrics.monthLabelLong} - resumen mensual del salario`,
    showSearch: false,
    showFilters: false,
    showIncomeAction: false,
  },
  flujo: {
    eyebrow: "analisis del mes",
    getTitle: () => "flujo del mes",
    showSearch: false,
    showFilters: false,
    showIncomeAction: false,
  },
  ingreso: {
    eyebrow: "control del mes",
    getTitle: () => "plan de ingreso del mes",
    showSearch: false,
    showFilters: false,
    showIncomeAction: false,
  },
  actividad: {
    eyebrow: "operaciones del mes",
    getTitle: () => "movimientos del mes",
    showSearch: true,
    showFilters: true,
    showIncomeAction: false,
  },
  calendario: {
    eyebrow: "planificacion anual",
    getTitle: () => "plan anual por mes",
    showSearch: false,
    showFilters: false,
    showIncomeAction: false,
  },
};
const CATEGORY_SWATCHES = [
  { className: "mint", color: "var(--accent)" },
  { className: "blue", color: "var(--accent-blue)" },
  { className: "amber", color: "var(--accent-amber)" },
  { className: "rose", color: "var(--accent-rose)" },
  { className: "slate", color: "var(--accent-slate)" },
];
const STATUS_PILL_CLASSES = ["status-pill--positive", "status-pill--neutral", "status-pill--negative"];
const KPI_FEEDBACK_CLASSES = ["kpi-card--positive", "kpi-card--neutral", "kpi-card--negative"];
const HERO_DIFFERENCE_STATE_CLASSES = ["hero-card__meta-item--positive", "hero-card__meta-item--neutral", "hero-card__meta-item--negative"];
const SAVINGS_CAPACITY_STATES = {
  neutral: { label: "Sin ingreso" },
  excellent: { label: "Excelente" },
  healthy: { label: "Saludable" },
  low: { label: "Bajo" },
};
const DEFAULT_GOAL_LABEL = "Meta mensual de inversion";

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

const canUseLocalStorage = () => {
  try {
    return typeof window.localStorage !== "undefined";
  } catch (error) {
    return false;
  }
};
const isSupportedLanguage = (value) => Object.prototype.hasOwnProperty.call(DEFAULT_CURRENCY_BY_LANGUAGE, value);
const resolveCurrencyFromLanguage = (language) => DEFAULT_CURRENCY_BY_LANGUAGE[language] || DEFAULT_CURRENCY_BY_LANGUAGE[DEFAULT_LANGUAGE];
const readPersistedLanguage = () => {
  if (!canUseLocalStorage()) {
    return DEFAULT_LANGUAGE;
  }

  try {
    const persistedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupportedLanguage(persistedLanguage)) {
      return persistedLanguage;
    }

    const persistedCurrency = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    return persistedCurrency === "USD" ? "en" : DEFAULT_LANGUAGE;
  } catch (error) {
    return DEFAULT_LANGUAGE;
  }
};
const readPersistedCurrency = (language = readPersistedLanguage()) => resolveCurrencyFromLanguage(language);
const readPersistedExchangeRate = () => {
  if (!canUseLocalStorage()) {
    return DEFAULT_EXCHANGE_RATE_USD_ARS;
  }

  try {
    const persistedRate = Number(window.localStorage.getItem(EXCHANGE_RATE_STORAGE_KEY));
    return Number.isFinite(persistedRate) && persistedRate > 0 ? persistedRate : DEFAULT_EXCHANGE_RATE_USD_ARS;
  } catch (error) {
    return DEFAULT_EXCHANGE_RATE_USD_ARS;
  }
};
const readPersistedExchangeRateTimestamp = () => {
  if (!canUseLocalStorage()) {
    return 0;
  }

  try {
    const persistedTimestamp = Number(window.localStorage.getItem(EXCHANGE_RATE_TIMESTAMP_STORAGE_KEY));
    return Number.isFinite(persistedTimestamp) ? persistedTimestamp : 0;
  } catch (error) {
    return 0;
  }
};
const persistLanguageSettings = (language) => {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, resolveCurrencyFromLanguage(language));
  } catch (error) {
    return;
  }
};
const persistExchangeRate = (rate) => {
  if (!canUseLocalStorage() || !(rate > 0)) {
    return;
  }

  try {
    window.localStorage.setItem(EXCHANGE_RATE_STORAGE_KEY, String(rate));
    window.localStorage.setItem(EXCHANGE_RATE_TIMESTAMP_STORAGE_KEY, String(Date.now()));
  } catch (error) {
    return;
  }
};
const isExchangeRateCacheFresh = (timestamp) => Number.isFinite(timestamp) && Date.now() - timestamp < EXCHANGE_RATE_CACHE_TTL_MS;
const isValidImportState = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  if (!Array.isArray(value.expenses)) {
    return false;
  }

  if (!value.filters || typeof value.filters !== "object" || Array.isArray(value.filters)) {
    return false;
  }

  const hasIncomeData = ["incomeBase", "income", "incomeExtra"].some((key) => Object.prototype.hasOwnProperty.call(value, key));
  const hasValidExpenses = value.expenses.every((expense) => expense && typeof expense === "object" && !Array.isArray(expense));

  return hasIncomeData && hasValidExpenses;
};
const normalizeImportToken = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
const splitCsvLine = (line = "") => {
  const values = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        currentValue += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (character === "," && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue.trim());
  return values;
};
const parseImportCsvAmount = (value) => {
  const rawValue = String(value || "").trim().replace(/\s/g, "").replace(/\$/g, "");

  if (!rawValue) {
    return null;
  }

  let normalizedValue = rawValue;

  if (normalizedValue.includes(",") && normalizedValue.includes(".")) {
    normalizedValue = normalizedValue.lastIndexOf(",") > normalizedValue.lastIndexOf(".")
      ? normalizedValue.replace(/\./g, "").replace(",", ".")
      : normalizedValue.replace(/,/g, "");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(normalizedValue)) {
    normalizedValue = normalizedValue.replace(/\./g, "");
  } else if (/^\d{1,3}(,\d{3})+$/.test(normalizedValue)) {
    normalizedValue = normalizedValue.replace(/,/g, "");
  } else if (normalizedValue.includes(",")) {
    normalizedValue = normalizedValue.replace(/\./g, "").replace(",", ".");
  }

  const parsedAmount = Number(normalizedValue);
  return Number.isFinite(parsedAmount) ? Math.abs(parsedAmount) : null;
};
const parseImportCsvDate = (value) => {
  const rawValue = String(value || "").trim();

  if (!rawValue) {
    return null;
  }

  const yearMonthDayMatch = rawValue.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);

  if (yearMonthDayMatch) {
    const [, year, month, day] = yearMonthDayMatch;
    const parsedDate = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T12:00:00`);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
  }

  const dayMonthYearMatch = rawValue.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

  if (dayMonthYearMatch) {
    const [, day, month, year] = dayMonthYearMatch;
    const parsedDate = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T12:00:00`);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
  }

  const parsedDate = new Date(rawValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
};
const parseImportCsvFrequency = (value) => {
  const normalizedValue = normalizeImportToken(value);

  if (!normalizedValue) {
    return undefined;
  }

  if (/^fij/.test(normalizedValue)) {
    return true;
  }

  if (/^vari/.test(normalizedValue)) {
    return false;
  }

  return undefined;
};
const buildExpenseFromCsvRow = (row) => {
  const movementType = normalizeImportToken(row.tipo);
  const parsedDate = parseImportCsvDate(row.fecha);
  const parsedAmount = parseImportCsvAmount(row.monto);

  if (!movementType || !parsedDate || parsedAmount === null) {
    return null;
  }

  const isIncomeMovement = /ingres/.test(movementType);
  const isInvestmentMovement = /inver|aport/.test(movementType);
  const isExpenseMovement = /gast/.test(movementType);

  if (!isIncomeMovement && !isInvestmentMovement && !isExpenseMovement) {
    return null;
  }

  const frequency = parseImportCsvFrequency(row.frecuencia);
  const description = String(row.descripcion || "").trim() || (isIncomeMovement ? "Ingreso importado" : "Movimiento importado");

  return {
    title: description,
    amount: isIncomeMovement ? -parsedAmount : parsedAmount,
    category: isInvestmentMovement ? "Inversion" : String(row.categoria || "").trim() || "Otros",
    date: parsedDate,
    paymentMethod: String(row.metodo || "").trim(),
    note: isIncomeMovement ? "Ingreso importado por CSV" : "",
    isFixed: typeof frequency === "boolean" ? frequency : undefined,
  };
};
const parseExpensesFromCsv = (contents) => {
  const lines = String(contents || "")
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return null;
  }

  const normalizedHeaders = splitCsvLine(lines[0]).map(normalizeImportToken);

  if (!["fecha", "tipo", "monto"].every((header) => normalizedHeaders.includes(header))) {
    return null;
  }

  const getValueByHeader = (values, headerName) => {
    const headerIndex = normalizedHeaders.indexOf(headerName);
    return headerIndex >= 0 ? values[headerIndex] || "" : "";
  };

  return lines.slice(1).reduce((expenses, line) => {
    const values = splitCsvLine(line);
    const importedExpense = buildExpenseFromCsvRow({
      fecha: getValueByHeader(values, "fecha"),
      tipo: getValueByHeader(values, "tipo"),
      categoria: getValueByHeader(values, "categoria"),
      descripcion: getValueByHeader(values, "descripcion"),
      monto: getValueByHeader(values, "monto"),
      metodo: getValueByHeader(values, "metodo"),
      frecuencia: getValueByHeader(values, "frecuencia"),
    });

    if (importedExpense) {
      expenses.push(importedExpense);
    }

    return expenses;
  }, []);
};

const isKnownView = (viewName) => Boolean(viewName && Object.prototype.hasOwnProperty.call(viewSections, viewName) && viewSections[viewName]);

const readPersistedActiveView = () => {
  if (!canUseLocalStorage()) {
    return DEFAULT_VIEW;
  }

  try {
    const persistedView = window.localStorage.getItem(ACTIVE_VIEW_STORAGE_KEY);
    return isKnownView(persistedView) ? persistedView : DEFAULT_VIEW;
  } catch (error) {
    return DEFAULT_VIEW;
  }
};

const persistActiveView = (viewName) => {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(ACTIVE_VIEW_STORAGE_KEY, isKnownView(viewName) ? viewName : DEFAULT_VIEW);
  } catch (error) {
    return;
  }
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

  let activeLanguage = DEFAULT_LANGUAGE;

  const setLanguage = (lang) => {
    if (isSupportedLanguage(lang)) {
      activeLanguage = lang;
    }
  };

  const getCurrentLanguage = () => activeLanguage;
  const getCurrentLocale = () => translations[getCurrentLanguage()]?.locale || translations[DEFAULT_LANGUAGE].locale;
  const getTranslationValue = (language, key) => key.split(".").reduce((accumulator, segment) => accumulator?.[segment], translations[language]);
  
  const interpolateText = (template, replacements = {}) =>
    String(template || "").replace(/\{(\w+)\}/g, (match, token) => (Object.prototype.hasOwnProperty.call(replacements, token) ? replacements[token] : match));
  
  const t = (key, replacements = {}) => {
    const language = getCurrentLanguage();
    const fallbackValue = getTranslationValue(DEFAULT_LANGUAGE, key);
    const translatedValue = getTranslationValue(language, key);
    const resolvedValue = typeof translatedValue === "string" ? translatedValue : typeof fallbackValue === "string" ? fallbackValue : key;
    return interpolateText(resolvedValue, replacements);
  };

  window.aleclvExpenseTrackerI18n = {
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    DEFAULT_CURRENCY_BY_LANGUAGE,
    isSupportedLanguage,
    setLanguage,
    getCurrentLanguage,
    getCurrentLocale,
    t
  };
})();
