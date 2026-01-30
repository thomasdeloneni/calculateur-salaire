/**
 * @interface ISalaryCalculator
 * @description Service interface for salary calculations - Single Responsibility (ISP)
 */
class ISalaryCalculator {
  /**
   * Calculate salary based on input and config
   * @param {SalaryInput} input
   * @param {UserConfig} config
   * @returns {SalaryResult}
   */
  calculate(input, config) {
    throw new Error('Method not implemented');
  }
}

module.exports = ISalaryCalculator;
