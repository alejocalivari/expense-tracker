(function () {
  let hasRegistered = false;

  const forEachNode = (nodes, callback) => {
    Array.from(nodes || []).forEach(callback);
  };

  const bindIfFunction = (element, eventName, handler) => {
    if (element && typeof handler === "function") {
      element.addEventListener(eventName, handler);
    }
  };

  const registerAppEventListeners = (config = {}) => {
    if (hasRegistered) {
      return false;
    }

    const dom = config.dom || window.aleclvExpenseTrackerDom;

    if (!dom) {
      return false;
    }

    hasRegistered = true;

    bindIfFunction(dom.fab, "click", config.onFabClick);

    if (typeof config.onOpenExpenseClick === "function") {
      forEachNode(dom.openExpenseButtons, (button) => button.addEventListener("click", config.onOpenExpenseClick));
    }

    if (typeof config.onOpenIncomeClick === "function") {
      forEachNode(dom.openIncomeButtons, (button) => button.addEventListener("click", config.onOpenIncomeClick));
    }

    if (typeof config.onOpenGoalClick === "function") {
      forEachNode(dom.openGoalButtons, (button) => button.addEventListener("click", config.onOpenGoalClick));
    }

    if (typeof config.onOpenInvestmentClick === "function") {
      forEachNode(dom.openInvestmentButtons, (button) => button.addEventListener("click", config.onOpenInvestmentClick));
    }

    if (typeof config.onOpenFiltersClick === "function") {
      forEachNode(dom.openFilterButtons, (button) => button.addEventListener("click", config.onOpenFiltersClick));
    }

    if (typeof config.onOpenImportJsonClick === "function") {
      forEachNode(dom.openImportJsonButtons, (button) => button.addEventListener("click", config.onOpenImportJsonClick));
    }

    if (typeof config.onOpenImportCsvClick === "function") {
      forEachNode(dom.openImportCsvButtons, (button) => button.addEventListener("click", config.onOpenImportCsvClick));
    }

    if (typeof config.onOpenExportClick === "function") {
      forEachNode(dom.openExportButtons, (button) => button.addEventListener("click", config.onOpenExportClick));
    }

    if (typeof config.onOpenRestoreClick === "function") {
      forEachNode(dom.modalRestoreButtons, (button) => button.addEventListener("click", config.onOpenRestoreClick));
    }

    if (typeof config.onModalCloseClick === "function") {
      forEachNode(dom.modalCloseTriggers, (trigger) => trigger.addEventListener("click", config.onModalCloseClick));
    }

    if (typeof config.onLanguageOptionClick === "function") {
      forEachNode(dom.languageOptionButtons, (button) =>
        button.addEventListener("click", () => config.onLanguageOptionClick(button.dataset.languageOption))
      );
    }

    bindIfFunction(dom.importJsonInput, "change", config.onImportJsonSelection);
    bindIfFunction(dom.importCsvInput, "change", config.onImportCsvSelection);

    bindIfFunction(dom.expenseForm, "submit", config.onExpenseFormSubmit);
    bindIfFunction(dom.expenseForm, "input", config.onExpenseFormInput);
    bindIfFunction(dom.expenseForm, "change", config.onExpenseFormChange);

    bindIfFunction(dom.incomeForm, "submit", config.onIncomeFormSubmit);
    bindIfFunction(dom.incomeForm, "input", config.onIncomeFormInput);
    bindIfFunction(dom.incomeForm, "change", config.onIncomeFormChange);

    bindIfFunction(dom.goalForm, "submit", config.onGoalFormSubmit);
    bindIfFunction(dom.goalForm, "input", config.onGoalFormInput);
    bindIfFunction(dom.goalForm, "change", config.onGoalFormChange);

    bindIfFunction(dom.confirmDeleteButton, "click", config.onConfirmDeleteClick);
    bindIfFunction(dom.confirmRestoreButton, "click", config.onConfirmRestoreClick);
    bindIfFunction(dom.clearFiltersButton, "click", config.onClearFiltersClick);
    bindIfFunction(dom.exportJsonButton, "click", config.onExportJsonClick);
    bindIfFunction(dom.exportCsvButton, "click", config.onExportCsvClick);

    if (typeof config.onCalendarShiftClick === "function") {
      forEachNode(dom.calendarShiftButtons, (button) =>
        button.addEventListener("click", () => config.onCalendarShiftClick(Number(button.dataset.calendarShift || 0)))
      );
    }

    bindIfFunction(dom.searchInput, "input", config.onSearchInput);
    bindIfFunction(dom.filterMonthInput, "change", config.onFilterMonthChange);
    bindIfFunction(dom.filterCategoryInput, "change", config.onFilterCategoryChange);
    bindIfFunction(dom.filterPaymentMethodInput, "change", config.onFilterPaymentMethodChange);
    bindIfFunction(dom.filterExpenseTypeInput, "change", config.onFilterExpenseTypeChange);
    bindIfFunction(dom.filterSortInput, "change", config.onFilterSortChange);
    bindIfFunction(dom.filterForm, "submit", config.onFilterFormSubmit);

    bindIfFunction(dom.expenseList, "click", config.onExpenseListClick);
    bindIfFunction(dom.calendarGrid, "click", config.onCalendarGridClick);
    bindIfFunction(dom.categoryLegend, "mouseover", config.onCategoryLegendMouseOver);
    bindIfFunction(dom.categoryLegend, "mouseleave", config.onCategoryLegendMouseLeave);
    bindIfFunction(dom.categoryLegend, "focusin", config.onCategoryLegendFocusIn);
    bindIfFunction(dom.categoryLegend, "focusout", config.onCategoryLegendFocusOut);
    bindIfFunction(dom.menuToggle, "click", config.onMenuToggleClick);
    bindIfFunction(dom.backdrop, "click", config.onBackdropClick);

    if (typeof config.onNavItemClick === "function") {
      forEachNode(dom.navItems, (item) => item.addEventListener("click", () => config.onNavItemClick(item.dataset.navItem)));
    }

    if (typeof config.onWindowResize === "function") {
      window.addEventListener("resize", config.onWindowResize);
    }

    if (typeof config.onWindowKeyDown === "function") {
      window.addEventListener("keydown", config.onWindowKeyDown);
    }

    if (typeof config.onWindowLoad === "function") {
      window.addEventListener("load", config.onWindowLoad);
    }

    if (typeof config.onServiceWorkerLoad === "function") {
      window.addEventListener("load", config.onServiceWorkerLoad);
    }

    return true;
  };

  window.aleclvExpenseTrackerEvents = {
    registerAppEventListeners,
  };
})();
