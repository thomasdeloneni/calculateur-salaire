/**
 * SalaryInputDTO - Data Transfer Object for salary calculation input
 * @class SalaryInputDTO
 * @description Validates and encapsulates calculation input data - Single Responsibility
 */
class SalaryInputDTO {
  constructor(days_presence, days_expense = null) {
    this.days_presence = days_presence;
    this.days_expense = days_expense;
  }

  /**
   * Validate the DTO
   * @returns {{isValid: boolean, errors: string[]}}
   */
  validate() {
    const errors = [];

    if (this.days_presence === undefined || this.days_presence === null) {
      errors.push('days_presence is required');
    } else if (typeof this.days_presence !== 'number' || this.days_presence < 0) {
      errors.push('days_presence must be a non-negative number');
    }

    if (this.days_expense !== null && this.days_expense !== undefined) {
      if (typeof this.days_expense !== 'number' || this.days_expense < 0) {
        errors.push('days_expense must be a non-negative number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = SalaryInputDTO;
