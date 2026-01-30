/**
 * HistoryService - Calculation history business logic
 */
const CalculationRepository = require('../repositories/CalculationRepository');
const CalculatorService = require('./CalculatorService');

class HistoryService {
  constructor() {
    this.calculationRepository = new CalculationRepository();
    this.calculatorService = new CalculatorService();
  }

  /**
   * Get calculation history for a user
   * @param {string} userId
   * @param {Object} options
   * @returns {Promise<Array>}
   */
  async getHistory(userId, options = {}) {
    const { limit = 50, offset = 0 } = options;
    const calculations = await this.calculationRepository.findByUserId(userId, {
      limit,
      offset,
      order: 'DESC'
    });
    return calculations;
  }

  /**
   * Save a calculation to history
   * @param {string} userId
   * @param {Object} input
   * @param {Object} config
   * @returns {Promise<Object>}
   */
  async saveCalculation(userId, input, config = null) {
    // Calculate result
    const result = this.calculatorService.calculate(input, config);

    // Save to database
    const calculation = await this.calculationRepository.create({
      user_id: userId,
      days_presence: input.days_presence,
      days_expense: input.days_expense,
      hours_total: result.hours_total,
      salary_base: result.salary_base,
      expense_total: result.expense_total,
      grand_total: result.grand_total
    });

    return calculation;
  }

  /**
   * Get a single calculation by ID
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getCalculation(id, userId) {
    const calculation = await this.calculationRepository.findById(id);
    if (!calculation) {
      throw new Error('Calculation not found');
    }
    if (calculation.user_id !== userId) {
      throw new Error('Not authorized to view this calculation');
    }
    return calculation;
  }

  /**
   * Delete a calculation
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async deleteCalculation(id, userId) {
    const calculation = await this.calculationRepository.findById(id);
    if (!calculation) {
      throw new Error('Calculation not found');
    }
    if (calculation.user_id !== userId) {
      throw new Error('Not authorized to delete this calculation');
    }
    return this.calculationRepository.delete(id);
  }

  /**
   * Clear all history for a user
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async clearHistory(userId) {
    return this.calculationRepository.deleteAllByUserId(userId);
  }
}

module.exports = HistoryService;
