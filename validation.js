(function () {
  const createValidationApi = ({ t } = {}) => {
    const translate = typeof t === "function" ? t : () => "";

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
      const buildStableImportedDate = (year, month, day) => {
        const normalizedYear = Number(year);
        const normalizedMonth = Number(month);
        const normalizedDay = Number(day);
        const parsedDate = new Date(normalizedYear, normalizedMonth - 1, normalizedDay, 12);

        if (
          Number.isNaN(parsedDate.getTime())
          || parsedDate.getFullYear() !== normalizedYear
          || parsedDate.getMonth() !== normalizedMonth - 1
          || parsedDate.getDate() !== normalizedDay
        ) {
          return null;
        }

        return `${normalizedYear}-${String(normalizedMonth).padStart(2, "0")}-${String(normalizedDay).padStart(2, "0")}T12:00:00`;
      };

      if (!rawValue) {
        return null;
      }

      const yearMonthDayMatch = rawValue.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);

      if (yearMonthDayMatch) {
        const [, year, month, day] = yearMonthDayMatch;
        return buildStableImportedDate(year, month, day);
      }

      const dayMonthYearMatch = rawValue.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

      if (dayMonthYearMatch) {
        const [, day, month, year] = dayMonthYearMatch;
        return buildStableImportedDate(year, month, day);
      }

      const parsedDate = new Date(rawValue);
      return Number.isNaN(parsedDate.getTime())
        ? null
        : buildStableImportedDate(parsedDate.getFullYear(), parsedDate.getMonth() + 1, parsedDate.getDate());
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
    const validateExpensePayload = (payload) => {
      if (!payload.title || payload.title.trim().length < 2) {
        return translate("validation.description");
      }

      if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
        return translate("validation.amount");
      }

      if (!payload.category) {
        return translate("validation.category");
      }

      if (!payload.date || Number.isNaN(new Date(payload.date).getTime())) {
        return translate("validation.date");
      }

      if (!payload.paymentMethod) {
        return translate("validation.paymentMethod");
      }

      return "";
    };
    const validateIncomePayload = (incomeBase, incomeExtra) => {
      if (!Number.isFinite(incomeBase) || incomeBase < 0) {
        return translate("validation.incomeBase");
      }

      if (!Number.isFinite(incomeExtra) || incomeExtra < 0) {
        return translate("validation.incomeExtra");
      }

      return "";
    };
    const validateGoalPayload = (goalAmount) => {
      if (!Number.isFinite(goalAmount) || goalAmount <= 0) {
        return translate("validation.goalAmount");
      }

      return "";
    };

    return {
      isValidImportState,
      parseExpensesFromCsv,
      validateExpensePayload,
      validateIncomePayload,
      validateGoalPayload,
    };
  };

  window.aleclvExpenseTrackerValidation = {
    createValidationApi,
  };
})();
