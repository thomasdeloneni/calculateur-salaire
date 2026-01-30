/**
 * Calculation entity - Domain model
 * @class Calculation
 * @description Represents a salary calculation record - Single Responsibility
 */
class Calculation {
  constructor(
    id = null,
    user_id,
    input_days,
    input_expense_days,
    hours_total,
    salary_total,
    expense_total,
    grand_total,
    created_at = null
  ) {
    this.id = id;
    this.user_id = user_id;
    this.input_days = input_days;
    this.input_expense_days = input_expense_days;
    this.hours_total = hours_total;
    this.salary_total = salary_total;
    this.expense_total = expense_total;
    this.grand_total = grand_total;
    this.created_at = created_at || new Date();
  }

  /**
   * Create Calculation from database row
   * @param {Object} row
   * @returns {Calculation}
   */
  static fromRow(row) {
    return new Calculation(
      row.id,
      row.user_id,
      parseFloat(row.input_days),
      parseFloat(row.input_expense_days),
      parseFloat(row.hours_total),
      parseFloat(row.salary_total),
      parseFloat(row.expense_total),
      parseFloat(row.grand_total),
      row.created_at
    );
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      days_presence: this.input_days,
      days_expense: this.input_expense_days,
      hours_total: this.hours_total,
      salary_base: this.salary_total,
      expense_total: this.expense_total,
      grand_total: this.grand_total,
      created_at: this.created_at
    };
  }
}

module.exports = Calculation;
