/**
 * @interface IConfigRepository
 * @description Repository interface for user configuration data access - Single Responsibility
 */
class IConfigRepository {
  /**
   * Get config by user ID
   * @param {number} userId
   * @returns {Promise<UserConfig|null>}
   */
  async findByUserId(userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Create default config for user
   * @param {number} userId
   * @returns {Promise<UserConfig>}
   */
  async createDefault(userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Update config
   * @param {number} userId
   * @param {Partial<UserConfig>} data
   * @returns {Promise<UserConfig>}
   */
  async update(userId, data) {
    throw new Error('Method not implemented');
  }
}

module.exports = IConfigRepository;
