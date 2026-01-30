/**
 * CalculationRepository - Database access layer for calculations
 * Single Responsibility: Only handles calculation data access
 * Follows Repository Pattern
 */
const pool = require('../config/database');
const Calculation = require('../models/Calculation');

class CalculationRepository {
  constructor(dbPool = pool) {
    this.dbPool = dbPool;
  }

  /**
   * Save calculation
   * @param {Calculation} calculation
   * @returns {Promise<Calculation>}
   */
  async save(calculation) {
    const [result] = await this.dbPool.execute(
      `INSERT INTO calculations 
       (user_id, input_days, input_expense_days, hours_total, salary_total, expense_total, grand_total) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        calculation.user_id,
        calculation.input_days,
        calculation.input_expense_days,
        calculation.hours_total,
        calculation.salary_total,
        calculation.expense_total,
        calculation.grand_total
      ]
    );
    
    return new Calculation(
      result.insertId,
      calculation.user_id,
      calculation.input_days,
      calculation.input_expense_days,
      calculation.hours_total,
      calculation.salary_total,
      calculation.expense_total,
      calculation.grand_total,
      new Date()
    );
  }

  /**
   * Get calculations by user ID
   * @param {number} userId
   * @param {number} limit
   * @returns {Promise<Calculation[]>}
   */
  async findByUserId(userId, limit = 50) {
    const [rows] = await this.dbPool.execute(
      'SELECT * FROM calculations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    );
    
    return rows.map(row => Calculation.fromRow(row));
  }
}

module.exports = CalculationRepository;
