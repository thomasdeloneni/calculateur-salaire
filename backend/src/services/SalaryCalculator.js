/**
 * SalaryCalculator - Service for salary calculations
 * Single Responsibility: Only handles salary calculation logic
 * Open/Closed: New calculation methods can be added without modifying this class
 */
const ISalaryCalculator = require('../interfaces/ISalaryCalculator');
const SalaryResult = require('../models/SalaryResult');

class SalaryCalculator extends ISalaryCalculator {
  /**
   * Calculate salary based on input and config
   * @param {Object} input - { days_presence, days_expense }
   * @param {UserConfig} config
   * @returns {SalaryResult}
   */
  calculate(input, config) {
    const effective_expense_days = input.days_expense !== null ? input.days_expense : input.days_presence;
    
    // Calculate hours: days × hours_per_day
    const hours_total = parseFloat(input.days_presence) * parseFloat(config.hours_per_day);

    // Calculate salary base: days × days_per_month × salary_multiplier
    const salary_base = parseFloat(input.days_presence) * 
                        parseFloat(config.days_per_month) * 
                        parseFloat(config.salary_multiplier);

    // Calculate expense total: days × expense_per_day × expense_multiplier
    const expense_total = parseFloat(effective_expense_days) * 
                          parseFloat(config.expense_per_day) * 
                          parseFloat(config.expense_multiplier);

    // Calculate grand total
    const grand_total = salary_base + expense_total;

    return new SalaryResult(
      parseFloat(input.days_presence),
      parseFloat(effective_expense_days),
      Math.round(hours_total * 100) / 100,
      Math.round(salary_base * 100) / 100,
      Math.round(expense_total * 100) / 100,
      Math.round(grand_total * 100) / 100
    );
  }
}

module.exports = SalaryCalculator;
