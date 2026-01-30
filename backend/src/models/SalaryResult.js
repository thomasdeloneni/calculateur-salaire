/**
 * SalaryResult - Domain model for calculation result
 * @class SalaryResult
 * @description Represents the result of a salary calculation - Single Responsibility
 */
class SalaryResult {
  constructor(
    days_presence,
    days_expense,
    hours_total,
    salary_base,
    expense_total,
    grand_total
  ) {
    this.days_presence = days_presence;
    this.days_expense = days_expense;
    this.hours_total = hours_total;
    this.salary_base = salary_base;
    this.expense_total = expense_total;
    this.grand_total = grand_total;
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      days_presence: this.days_presence,
      days_expense: this.days_expense,
      hours_total: this.hours_total,
      salary_base: this.salary_base,
      expense_total: this.expense_total,
      grand_total: this.grand_total
    };
  }
}

module.exports = SalaryResult;
