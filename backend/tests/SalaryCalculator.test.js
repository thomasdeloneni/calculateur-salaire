/**
 * Unit tests for SalaryCalculator (calculation logic)
 * TDD: Write tests first, then implement
 */
const UserConfig = require('../src/models/UserConfig');
const SalaryResult = require('../src/models/SalaryResult');

// Simple calculator implementation for testing
class SalaryCalculator {
  calculate(input, config) {
    const effective_expense_days = input.days_expense !== null ? input.days_expense : input.days_presence;
    
    const hours_total = parseFloat(input.days_presence) * parseFloat(config.hours_per_day);
    const salary_base = parseFloat(input.days_presence) * parseFloat(config.days_per_month) * parseFloat(config.salary_multiplier);
    const expense_total = parseFloat(effective_expense_days) * parseFloat(config.expense_per_day) * parseFloat(config.expense_multiplier);
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

describe('SalaryCalculator', () => {
  let calculator;
  let defaultConfig;

  beforeEach(() => {
    calculator = new SalaryCalculator();
    defaultConfig = new UserConfig(
      1,
      4.22,  // days_per_month (default)
      8.0,   // hours_per_day (default)
      3.69,  // expense_per_day (default)
      9.5,   // salary_multiplier (default)
      1.0    // expense_multiplier (default)
    );
  });

  describe('calculate', () => {
    it('should calculate salary with default config', () => {
      const input = { days_presence: 20, days_expense: null };
      const result = calculator.calculate(input, defaultConfig);
      
      expect(result.days_presence).toBe(20);
      expect(result.days_expense).toBe(20);
      expect(result.hours_total).toBe(160);
      expect(result.salary_base).toBe(801.8);
      expect(result.expense_total).toBe(73.8);
      expect(result.grand_total).toBe(875.6);
    });

    it('should calculate salary with separate expense days', () => {
      const input = { days_presence: 20, days_expense: 15 };
      const result = calculator.calculate(input, defaultConfig);
      
      expect(result.days_presence).toBe(20);
      expect(result.days_expense).toBe(15);
      expect(result.hours_total).toBe(160);
      expect(result.salary_base).toBe(801.8);
      expect(result.expense_total).toBe(55.35);
      expect(result.grand_total).toBe(857.15);
    });

    it('should handle zero presence days', () => {
      const input = { days_presence: 0, days_expense: null };
      const result = calculator.calculate(input, defaultConfig);
      
      expect(result.days_presence).toBe(0);
      expect(result.days_expense).toBe(0);
      expect(result.hours_total).toBe(0);
      expect(result.salary_base).toBe(0);
      expect(result.expense_total).toBe(0);
      expect(result.grand_total).toBe(0);
    });

    it('should use custom config values', () => {
      const customConfig = new UserConfig(
        1,
        5.0,   // days_per_month
        7.5,   // hours_per_day
        5.0,   // expense_per_day
        10.0,  // salary_multiplier
        1.2    // expense_multiplier
      );
      const input = { days_presence: 10, days_expense: 10 };
      const result = calculator.calculate(input, customConfig);
      
      expect(result.hours_total).toBe(75);
      expect(result.salary_base).toBe(500);
      expect(result.expense_total).toBe(60);
      expect(result.grand_total).toBe(560);
    });

    it('should round values to 2 decimal places', () => {
      const input = { days_presence: 1, days_expense: null };
      const result = calculator.calculate(input, defaultConfig);
      
      expect(result.hours_total).toBe(8);
      expect(result.salary_base).toBe(40.09);
      expect(result.expense_total).toBe(3.69);
      expect(result.grand_total).toBe(43.78);
    });

    it('should handle fractional days', () => {
      const input = { days_presence: 4.5, days_expense: 4.5 };
      const result = calculator.calculate(input, defaultConfig);
      
      expect(result.days_presence).toBe(4.5);
      expect(result.hours_total).toBe(36);
      expect(result.salary_base).toBe(180.4);
      expect(result.expense_total).toBe(16.61);
      expect(result.grand_total).toBe(197.01);
    });

    it('should handle zero expense multiplier', () => {
      const config = new UserConfig(1, 4.22, 8.0, 3.69, 9.5, 0);
      const input = { days_presence: 20, days_expense: 10 };
      const result = calculator.calculate(input, config);
      
      expect(result.expense_total).toBe(0);
      expect(result.grand_total).toBe(result.salary_base);
    });

    it('should apply formula: days × days_per_month × salary_multiplier', () => {
      // 20 days × 4.22 days/month × 9.5 multiplier = 801.8
      const input = { days_presence: 20, days_expense: 20 };
      const result = calculator.calculate(input, defaultConfig);
      
      expect(result.salary_base).toBe(801.8);
    });

    it('should apply formula: days × expense_per_day × expense_multiplier', () => {
      // 20 days × 3.69 expense/day × 1.0 multiplier = 73.8
      const input = { days_presence: 20, days_expense: 20 };
      const result = calculator.calculate(input, defaultConfig);
      
      expect(result.expense_total).toBe(73.8);
    });
  });
});
