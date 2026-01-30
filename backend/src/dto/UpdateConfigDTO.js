/**
 * UpdateConfigDTO - Data Transfer Object for updating user configuration
 * @class UpdateConfigDTO
 * @description Validates and encapsulates config update data - Single Responsibility
 */
class UpdateConfigDTO {
  constructor(data) {
    this.days_per_month = data.days_per_month;
    this.hours_per_day = data.hours_per_day;
    this.expense_per_day = data.expense_per_day;
    this.salary_multiplier = data.salary_multiplier;
    this.expense_multiplier = data.expense_multiplier;
  }

  /**
   * Validate the DTO
   * @returns {{isValid: boolean, errors: string[]}}
   */
  validate() {
    const errors = [];

    if (this.days_per_month !== undefined) {
      if (typeof this.days_per_month !== 'number' || this.days_per_month <= 0) {
        errors.push('days_per_month must be a positive number');
      }
    }

    if (this.hours_per_day !== undefined) {
      if (typeof this.hours_per_day !== 'number' || this.hours_per_day <= 0) {
        errors.push('hours_per_day must be a positive number');
      }
    }

    if (this.expense_per_day !== undefined) {
      if (typeof this.expense_per_day !== 'number' || this.expense_per_day < 0) {
        errors.push('expense_per_day must be a non-negative number');
      }
    }

    if (this.salary_multiplier !== undefined) {
      if (typeof this.salary_multiplier !== 'number' || this.salary_multiplier <= 0) {
        errors.push('salary_multiplier must be a positive number');
      }
    }

    if (this.expense_multiplier !== undefined) {
      if (typeof this.expense_multiplier !== 'number' || this.expense_multiplier < 0) {
        errors.push('expense_multiplier must be a non-negative number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = UpdateConfigDTO;
