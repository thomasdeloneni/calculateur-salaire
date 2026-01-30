/**
 * ConfigRepository - Database operations for UserConfig
 * @class ConfigRepository
 * @implements IConfigRepository
 */
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

class ConfigRepository {
  constructor() {
    this.tableName = 'user_configs';
  }

  /**
   * Find config by user ID
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT * FROM ${this.tableName} WHERE user_id = ?`,
      [userId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Create new config
   * @param {Object} configData
   * @returns {Promise<Object>}
   */
  async create(configData) {
    const id = uuidv4();
    const { user_id, days_per_month, hours_per_day, expense_per_day, salary_multiplier, expense_multiplier } = configData;

    await db.query(
      `INSERT INTO ${this.tableName} (id, user_id, days_per_month, hours_per_day, expense_per_day, salary_multiplier, expense_multiplier) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, user_id, days_per_month || 4.22, hours_per_day || 8.0, expense_per_day || 3.69, salary_multiplier || 9.5, expense_multiplier || 1.0]
    );

    return this.findByUserId(user_id);
  }

  /**
   * Update config
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async update(userId, updateData) {
    const { days_per_month, hours_per_day, expense_per_day, salary_multiplier, expense_multiplier } = updateData;

    const updates = [];
    const values = [];

    if (days_per_month !== undefined) {
      updates.push('days_per_month = ?');
      values.push(days_per_month);
    }
    if (hours_per_day !== undefined) {
      updates.push('hours_per_day = ?');
      values.push(hours_per_day);
    }
    if (expense_per_day !== undefined) {
      updates.push('expense_per_day = ?');
      values.push(expense_per_day);
    }
    if (salary_multiplier !== undefined) {
      updates.push('salary_multiplier = ?');
      values.push(salary_multiplier);
    }
    if (expense_multiplier !== undefined) {
      updates.push('expense_multiplier = ?');
      values.push(expense_multiplier);
    }

    if (updates.length === 0) {
      return this.findByUserId(userId);
    }

    values.push(userId);

    await db.query(
      `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    return this.findByUserId(userId);
  }

  /**
   * Delete config
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async delete(userId) {
    const [result] = await db.query(
      `DELETE FROM ${this.tableName} WHERE user_id = ?`,
      [userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = ConfigRepository;
