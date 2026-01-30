/**
 * UserConfig entity - Domain model
 * @class UserConfig
 * @description Represents user configuration for calculations - Single Responsibility
 */
class UserConfig {
  constructor(
    user_id,
    days_per_month = 4.22,
    hours_per_day = 8.0,
    expense_per_day = 3.69,
    salary_multiplier = 9.5,
    expense_multiplier = 1.0,
    created_at = null,
    updated_at = null
  ) {
    this.user_id = user_id;
    this.days_per_month = days_per_month;
    this.hours_per_day = hours_per_day;
    this.expense_per_day = expense_per_day;
    this.salary_multiplier = salary_multiplier;
    this.expense_multiplier = expense_multiplier;
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
  }

  /**
   * Create UserConfig from database row
   * @param {Object} row
   * @returns {UserConfig}
   */
  static fromRow(row) {
    return new UserConfig(
      row.user_id,
      parseFloat(row.days_per_month),
      parseFloat(row.hours_per_day),
      parseFloat(row.expense_per_day),
      parseFloat(row.salary_multiplier),
      parseFloat(row.expense_multiplier),
      row.created_at,
      row.updated_at
    );
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      days_per_month: this.days_per_month,
      hours_per_day: this.hours_per_day,
      expense_per_day: this.expense_per_day,
      salary_multiplier: this.salary_multiplier,
      expense_multiplier: this.expense_multiplier
    };
  }
}

module.exports = UserConfig;
