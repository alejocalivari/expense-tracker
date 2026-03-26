(function () {
  const createFinancialEngine = (dependencies = {}) => {
    const {
      clamp,
      roundCurrency,
      isValidMonthKey,
      getLatestMonthKey,
      getMonthKey,
      getCurrentMonthKey,
      shiftMonthKey,
      getYearFromMonthKey,
      buildMonthKey,
      isFutureMonthKey,
      getDaysInMonth,
      getExpenseDate,
      getMonthLabel,
      getCalendarMonthLabel,
      defaultGoalLabel = "",
    } = dependencies;

    const resolveMonthLabel = (monthKey, options = {}) =>
      typeof getMonthLabel === "function" ? String(getMonthLabel(monthKey, options) || "") : String(monthKey || "");
    const resolveCalendarMonthLabel = (monthKey) =>
      typeof getCalendarMonthLabel === "function"
        ? String(getCalendarMonthLabel(monthKey) || "")
        : resolveMonthLabel(monthKey, { month: "short", year: undefined }).replace(".", "");

    const getSavingsCapacityPercent = (remainingBalance, totalIncome) => (totalIncome > 0 ? roundCurrency((remainingBalance / totalIncome) * 100) : 0);
    const getSavingsCapacityState = (percent, totalIncome) => {
      if (!(totalIncome > 0)) {
        return "neutral";
      }

      if (percent > 40) {
        return "excellent";
      }

      if (percent >= 20) {
        return "healthy";
      }

      return "low";
    };
    const getActiveMonthKey = (state) => (isValidMonthKey(state.filters.month) ? state.filters.month : getLatestMonthKey(state.expenses));
    const getTotalIncome = (state) => roundCurrency(Number(state.incomeBase || 0) + Number(state.incomeExtra || 0));
    const getExpensesForMonth = (expenses, monthKey) => expenses.filter((expense) => getMonthKey(expense.date) === monthKey);
    const getElapsedDaysForMonth = (monthKey, expenses) => {
      const daysInMonth = getDaysInMonth(monthKey);

      if (monthKey === getCurrentMonthKey()) {
        return clamp(new Date().getDate(), 1, daysInMonth);
      }

      if (monthKey < getCurrentMonthKey()) {
        return daysInMonth;
      }

      const latestDay = expenses.reduce((maxDay, expense) => {
        const parsed = getExpenseDate(expense);
        return Math.max(maxDay, parsed?.getDate() || 0);
      }, 0);

      return clamp(latestDay || 1, 1, daysInMonth);
    };

    const buildCategoryBreakdown = (expenses, totalSpent) => {
      const totals = expenses.reduce((accumulator, expense) => {
        const category = expense.category || "Otros";
        accumulator[category] = roundCurrency((accumulator[category] || 0) + Number(expense.amount || 0));
        return accumulator;
      }, {});

      return Object.entries(totals)
        .map(([category, total]) => ({
          category,
          total,
          share: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
        }))
        .sort((left, right) => right.total - left.total);
    };

    const buildLegendCategories = (breakdown) => {
      if (breakdown.length <= 5) {
        return breakdown;
      }

      const remaining = breakdown.slice(4);

      return [
        ...breakdown.slice(0, 4),
        {
          category: "Otros",
          total: roundCurrency(remaining.reduce((sum, item) => sum + item.total, 0)),
          share: remaining.reduce((sum, item) => sum + item.share, 0),
        },
      ];
    };

    const summarizeMonth = (expenses, incomeTotal, monthKey) => {
      const investmentTransactions = expenses.filter((expense) => expense.category === "Inversion");
      const spendingTransactions = expenses.filter((expense) => expense.category !== "Inversion");
      const totalSpent = roundCurrency(spendingTransactions.reduce((sum, expense) => sum + Number(expense.amount || 0), 0));
      const totalInvested = roundCurrency(investmentTransactions.reduce((sum, expense) => sum + Number(expense.amount || 0), 0));
      const fixedSpend = roundCurrency(spendingTransactions.filter((expense) => expense.isFixed).reduce((sum, expense) => sum + Number(expense.amount || 0), 0));
      const variableSpend = roundCurrency(Math.max(totalSpent - fixedSpend, 0));
      const investedThisMonth = totalInvested;
      const investmentTransactionsCount = investmentTransactions.length;
      const expenseTransactionCount = spendingTransactions.length;
      const remainingBalance = roundCurrency(incomeTotal - totalSpent);
      const liquidityFinal = roundCurrency(remainingBalance - investedThisMonth);
      const savingsCapacityAmount = roundCurrency(Math.max(remainingBalance, 0));
      const daysInMonth = getDaysInMonth(monthKey);
      const elapsedDays = getElapsedDaysForMonth(monthKey, expenses);
      const dailyAverage = roundCurrency(totalSpent / Math.max(elapsedDays, 1));
      const spentRatio = incomeTotal > 0 ? (totalSpent / incomeTotal) * 100 : 0;
      const savingsRate = incomeTotal > 0 ? (remainingBalance / incomeTotal) * 100 : 0;
      const largestExpense = spendingTransactions.reduce((largest, expense) => {
        if (!largest || Number(expense.amount || 0) > Number(largest.amount || 0)) {
          return expense;
        }

        return largest;
      }, null);
      const categoryBreakdown = buildCategoryBreakdown(spendingTransactions, totalSpent);

      return {
        monthKey,
        monthLabelLong: resolveMonthLabel(monthKey),
        monthLabelShort: resolveMonthLabel(monthKey, { month: "short", year: undefined }).replace(".", ""),
        monthLabelShortYear: resolveMonthLabel(monthKey, { month: "short", year: "numeric" }).replace(".", ""),
        expenses,
        spendingTransactions,
        investmentTransactions,
        transactionCount: expenses.length,
        expenseTransactionCount,
        totalSpent,
        totalInvested,
        fixedSpend,
        variableSpend,
        fixedShare: totalSpent > 0 ? (fixedSpend / totalSpent) * 100 : 0,
        variableShare: totalSpent > 0 ? (variableSpend / totalSpent) * 100 : 0,
        investedThisMonth,
        investmentTransactionsCount,
        remainingBalance,
        liquidityFinal,
        savingsCapacityAmount,
        dailyAverage,
        spentRatio,
        savingsRate,
        largestExpense,
        categoryBreakdown,
        topCategory: categoryBreakdown[0] || null,
        activeCategoryCount: categoryBreakdown.length,
        daysInMonth,
        elapsedDays,
        projectedMonthlySpend: totalSpent > 0 ? roundCurrency((totalSpent / Math.max(elapsedDays, 1)) * daysInMonth) : 0,
        projectedInvestmentAmount: investedThisMonth > 0 ? roundCurrency((investedThisMonth / Math.max(elapsedDays, 1)) * daysInMonth) : 0,
      };
    };

    const calculatePercentChange = (currentValue, previousValue, hasBaseline) => {
      if (!hasBaseline || !Number.isFinite(previousValue) || previousValue === 0) {
        return null;
      }

      return ((currentValue - previousValue) / previousValue) * 100;
    };

    const compareMetric = (currentValue, previousValue, hasBaseline) => ({
      current: currentValue,
      previous: previousValue,
      difference: roundCurrency(currentValue - previousValue),
      percent: calculatePercentChange(currentValue, previousValue, hasBaseline),
    });

    const getTopCategoryShift = (currentBreakdown, previousBreakdown) => {
      const categories = new Set([
        ...currentBreakdown.map((item) => item.category),
        ...previousBreakdown.map((item) => item.category),
      ]);

      let winner = null;

      categories.forEach((category) => {
        const currentTotal = currentBreakdown.find((item) => item.category === category)?.total || 0;
        const previousTotal = previousBreakdown.find((item) => item.category === category)?.total || 0;
        const difference = roundCurrency(currentTotal - previousTotal);

        if (!winner || Math.abs(difference) > Math.abs(winner.difference)) {
          winner = {
            category,
            currentTotal,
            previousTotal,
            difference,
          };
        }
      });

      return winner;
    };

    const computeMetrics = (state) => {
      const activeMonthKey = getActiveMonthKey(state);
      const previousMonthKey = shiftMonthKey(activeMonthKey, -1);
      const totalIncome = getTotalIncome(state);
      const goalAmount = roundCurrency(Number(state.savingsGoalAmount || 0));
      const goalLabel = String(state.savingsGoalLabel || "").trim() || defaultGoalLabel;
      const currentMonth = summarizeMonth(getExpensesForMonth(state.expenses, activeMonthKey), totalIncome, activeMonthKey);
      const previousMonth = summarizeMonth(getExpensesForMonth(state.expenses, previousMonthKey), totalIncome, previousMonthKey);
      const hasPreviousData = previousMonth.transactionCount > 0;
      const goalProgressPercent = goalAmount > 0 ? roundCurrency(Math.max((currentMonth.investedThisMonth / goalAmount) * 100, 0)) : 0;
      const goalRemainingAmount = goalAmount > 0 && currentMonth.investedThisMonth < goalAmount ? roundCurrency(goalAmount - currentMonth.investedThisMonth) : 0;
      const goalExceededAmount = goalAmount > 0 && currentMonth.investedThisMonth >= goalAmount ? roundCurrency(currentMonth.investedThisMonth - goalAmount) : 0;
      const isGoalMet = goalAmount > 0 && currentMonth.investedThisMonth >= goalAmount;
      const savingsCapacityPercent = getSavingsCapacityPercent(currentMonth.remainingBalance, totalIncome);
      const savingsCapacityState = getSavingsCapacityState(savingsCapacityPercent, totalIncome);

      return {
        ...currentMonth,
        activeMonthKey,
        previousMonthKey,
        previousMonth,
        previousMonthLabel: previousMonth.monthLabelShort || resolveMonthLabel(previousMonthKey, { month: "short", year: undefined }).replace(".", ""),
        hasPreviousData,
        incomeBase: Number(state.incomeBase || 0),
        incomeExtra: Number(state.incomeExtra || 0),
        totalIncome,
        savingsCapacityAmount: currentMonth.savingsCapacityAmount,
        savingsCapacityPercent,
        savingsCapacityBarPercent: clamp(savingsCapacityPercent, 0, 100),
        savingsCapacityState,
        goalAmount,
        goalLabel,
        goalProgressPercent,
        goalProgressBarPercent: clamp(goalProgressPercent, 0, 100),
        goalRemainingAmount,
        goalExceededAmount,
        isGoalMet,
        comparisons: {
          totalSpent: compareMetric(currentMonth.totalSpent, previousMonth.totalSpent, hasPreviousData),
          remainingBalance: compareMetric(currentMonth.remainingBalance, previousMonth.remainingBalance, hasPreviousData),
          investedThisMonth: compareMetric(currentMonth.investedThisMonth, previousMonth.investedThisMonth, hasPreviousData),
          dailyAverage: compareMetric(currentMonth.dailyAverage, previousMonth.dailyAverage, hasPreviousData),
        },
        topCategoryShift: hasPreviousData ? getTopCategoryShift(currentMonth.categoryBreakdown, previousMonth.categoryBreakdown) : null,
      };
    };

    const buildYearContext = (state, metrics) => {
      const activeYear = getYearFromMonthKey(metrics.activeMonthKey);
      const months = Array.from({ length: 12 }, (_, index) => {
        const monthKey = buildMonthKey(activeYear, index + 1);
        const monthSummary = summarizeMonth(getExpensesForMonth(state.expenses, monthKey), metrics.totalIncome, monthKey);
        const goalProgressPercent = metrics.goalAmount > 0 ? roundCurrency(Math.max((monthSummary.investedThisMonth / metrics.goalAmount) * 100, 0)) : 0;

        return {
          ...monthSummary,
          shortLabel: resolveCalendarMonthLabel(monthKey),
          goalProgressPercent,
          goalProgressBarPercent: clamp(goalProgressPercent, 0, 100),
          hasData: monthSummary.transactionCount > 0,
          isActive: monthKey === metrics.activeMonthKey,
          isFuture: isFutureMonthKey(monthKey),
          isGoalMet: metrics.goalAmount > 0 && monthSummary.investedThisMonth >= metrics.goalAmount,
        };
      });
      const monthsWithData = months.filter((month) => month.hasData);
      const totalSpent = roundCurrency(months.reduce((sum, month) => sum + month.totalSpent, 0));
      const totalInvested = roundCurrency(months.reduce((sum, month) => sum + month.investedThisMonth, 0));
      const totalFree = roundCurrency(monthsWithData.reduce((sum, month) => sum + month.savingsCapacityAmount, 0));

      return {
        activeYear,
        months,
        monthsWithDataCount: monthsWithData.length,
        yearIncomeReference: metrics.totalIncome > 0 ? roundCurrency(metrics.totalIncome * 12) : 0,
        totalSpent,
        totalInvested,
        averageMonthlyFree: monthsWithData.length ? roundCurrency(totalFree / monthsWithData.length) : 0,
      };
    };

    return {
      getSavingsCapacityPercent,
      getSavingsCapacityState,
      getActiveMonthKey,
      getTotalIncome,
      getExpensesForMonth,
      getElapsedDaysForMonth,
      buildCategoryBreakdown,
      buildLegendCategories,
      summarizeMonth,
      calculatePercentChange,
      compareMetric,
      getTopCategoryShift,
      computeMetrics,
      buildYearContext,
    };
  };

  window.aleclvExpenseTrackerFinancialEngine = {
    createFinancialEngine,
  };
})();
