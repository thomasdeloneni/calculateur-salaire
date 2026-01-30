/**
 * CalculatorService - Salary calculation business logic
 */
const SalaryResult = require('../models/SalaryResult');

class CalculatorService {
  /**
   * Calculate salary based on input parameters and user config
   * @param {Object} input
   * @param {Object} config
   * @returns {SalaryResult}
   */
  calculate(input, config = null) {
    // Use default config if none provided
    const cfg = config || {
      days_per_month: 4.22,
      hours_per_day: 8.0,
      expense_per_day: 3.69,
      salary_multiplier: 9.5,
      expense_multiplier: 1.0
    };

    const { days_presence, days_expense = 0 } = input;

    // Calculate hours_total: days_presence * hours_per_day
    const hours_total = days_presence * cfg.hours_per_day;

    // Calculate salary_base: (hours_total / days_per_month) * salary_multiplier
    // Or: days_presence * hours_per_day * salary_multiplier / days_per_month
    const salary_base = (hours_total / cfg.days_per_month) * cfg.salary_multiplier;

    // Calculate expense_total: days_expense * expense_per_day * expense_multiplier
    const expense_total = (days_expense || 0) * cfg.expense_per_day * cfg.expense_multiplier;

    // Calculate grand_total: salary_base + expense_total
    const grand_total = salary_base + expense_total;

    return new SalaryResult(
      days_presence,
      days_expense,
      Math.round(hours_total * 100) / 100,
      Math.round(salary_base * 100) / 100,
      Math.round(expense_total * 100) / 100,
      Math.round(grand_total * 100) / 100
    );
  }

  /**
   * Calculate with defaults for preview (no config needed)
   * @param {number} days_presence
   * @param {number} days_expense
   * @returns {Object}
   */
  previewCalculate(days_presence, days_expense = 0) {
    const result = this.calculate({ days_presence, days_expense });
    return result.toJSON();
  }
}

module.exports = CalculatorService;
