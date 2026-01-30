/**
 * CalculationService - Business logic for salary calculations
 * Single Responsibility: Only handles calculation logic
 * Dependency Injection: Receives dependencies via constructor
 */
const Calculation = require('../models/Calculation');
const SalaryInputDTO = require('../dto/SalaryInputDTO');

class CalculationService {
  /**
   * @param {IConfigRepository} configRepository
   * @param {ICalculationRepository} calculationRepository
   * @param {ISalaryCalculator} salaryCalculator
   */
  constructor(configRepository, calculationRepository, salaryCalculator) {
    this.configRepository = configRepository;
    this.calculationRepository = calculationRepository;
    this.salaryCalculator = salaryCalculator;
  }

  /**
   * Calculate salary
   * @param {number} userId
   * @param {Object} input - { days_presence, days_expense }
   * @returns {Promise<Object>}
   */
  async calculate(userId, input) {
    // Validate input
    const dto = new SalaryInputDTO(input.days_presence, input.days_expense);
    const validation = dto.validate();
    
    if (!validation.isValid) {
      const error = new Error(validation.errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    // Get user config
    let config = await this.configRepository.findByUserId(userId);
    
    // Use default config if not exists
    if (!config) {
      config = await this.configRepository.createDefault(userId);
    }

    // Calculate salary
    const result = this.salaryCalculator.calculate(input, config);

    // Save calculation
    const calculation = new Calculation(
      null,
      userId,
      result.days_presence,
      result.days_expense,
      result.hours_total,
      result.salary_base,
      result.expense_total,
      result.grand_total
    );
    
    await this.calculationRepository.save(calculation);

    return result.toJSON();
  }

  /**
   * Get calculation history
   * @param {number} userId
   * @returns {Promise<Object[]>}
   */
  async getHistory(userId, limit = 50) {
    const calculations = await this.calculationRepository.findByUserId(userId, limit);
    return calculations.map(calc => calc.toJSON());
  }
}

module.exports = CalculationService;
