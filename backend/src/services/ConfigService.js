/**
 * ConfigService - User configuration business logic
 */
const ConfigRepository = require('../repositories/ConfigRepository');
const UserConfig = require('../models/UserConfig');

class ConfigService {
  constructor() {
    this.configRepository = new ConfigRepository();
  }

  /**
   * Get user config
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getConfig(userId) {
    const config = await this.configRepository.findByUserId(userId);
    if (!config) {
      // Create default config if not exists
      const newConfig = await this.configRepository.create({
        user_id: userId,
        days_per_month: 4.22,
        hours_per_day: 8.0,
        expense_per_day: 3.69,
        salary_multiplier: 9.5,
        expense_multiplier: 1.0
      });
      return new UserConfig(
        newConfig.user_id,
        newConfig.days_per_month,
        newConfig.hours_per_day,
        newConfig.expense_per_day,
        newConfig.salary_multiplier,
        newConfig.expense_multiplier,
        newConfig.created_at,
        newConfig.updated_at
      ).toJSON();
    }

    return new UserConfig(
      config.user_id,
      config.days_per_month,
      config.hours_per_day,
      config.expense_per_day,
      config.salary_multiplier,
      config.expense_multiplier,
      config.created_at,
      config.updated_at
    ).toJSON();
  }

  /**
   * Update user config
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateConfig(userId, updateData) {
    const { days_per_month, hours_per_day, expense_per_day, salary_multiplier, expense_multiplier } = updateData;

    // Validate values
    if (days_per_month !== undefined && (days_per_month <= 0 || days_per_month > 31)) {
      throw new Error('days_per_month must be between 0 and 31');
    }
    if (hours_per_day !== undefined && (hours_per_day <= 0 || hours_per_day > 24)) {
      throw new Error('hours_per_day must be between 0 and 24');
    }
    if (expense_per_day !== undefined && expense_per_day < 0) {
      throw new Error('expense_per_day must be non-negative');
    }
    if (salary_multiplier !== undefined && salary_multiplier <= 0) {
      throw new Error('salary_multiplier must be positive');
    }
    if (expense_multiplier !== undefined && expense_multiplier <= 0) {
      throw new Error('expense_multiplier must be positive');
    }

    // Check if config exists
    const existingConfig = await this.configRepository.findByUserId(userId);
    
    if (!existingConfig) {
      // Create new config
      const newConfig = await this.configRepository.create({
        user_id: userId,
        days_per_month: days_per_month || 4.22,
        hours_per_day: hours_per_day || 8.0,
        expense_per_day: expense_per_day || 3.69,
        salary_multiplier: salary_multiplier || 9.5,
        expense_multiplier: expense_multiplier || 1.0
      });
      return new UserConfig(
        newConfig.user_id,
        newConfig.days_per_month,
        newConfig.hours_per_day,
        newConfig.expense_per_day,
        newConfig.salary_multiplier,
        newConfig.expense_multiplier,
        newConfig.created_at,
        newConfig.updated_at
      ).toJSON();
    }

    // Update existing config
    const updatedConfig = await this.configRepository.update(userId, {
      days_per_month,
      hours_per_day,
      expense_per_day,
      salary_multiplier,
      expense_multiplier
    });

    return new UserConfig(
      updatedConfig.user_id,
      updatedConfig.days_per_month,
      updatedConfig.hours_per_day,
      updatedConfig.expense_per_day,
      updatedConfig.salary_multiplier,
      updatedConfig.expense_multiplier,
      updatedConfig.created_at,
      updatedConfig.updated_at
    ).toJSON();
  }

  /**
   * Reset config to defaults
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async resetConfig(userId) {
    return this.updateConfig(userId, {
      days_per_month: 4.22,
      hours_per_day: 8.0,
      expense_per_day: 3.69,
      salary_multiplier: 9.5,
      expense_multiplier: 1.0
    });
  }
}

module.exports = ConfigService;
