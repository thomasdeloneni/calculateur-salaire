/**
 * @interface ICalculationRepository
 * @description Repository interface for calculation data access - Single Responsibility
 */
class ICalculationRepository {
  /**
   * Save calculation
   * @param {Calculation} calculation
   * @returns {Promise<Calculation>}
   */
  async save(calculation) {
    throw new Error('Method not implemented');
  }

  /**
   * Get calculations by user ID
   * @param {number} userId
   * @param {number} limit
   * @returns {Promise<Calculation[]>}
   */
  async findByUserId(userId, limit = 50) {
    throw new Error('Method not implemented');
  }
}

module.exports = ICalculationRepository;
