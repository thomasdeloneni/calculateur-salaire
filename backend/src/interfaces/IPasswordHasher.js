/**
 * @interface IPasswordHasher
 * @description Service interface for password hashing - Single Responsibility (ISP)
 */
class IPasswordHasher {
  /**
   * Hash a password
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hash(password) {
    throw new Error('Method not implemented');
  }

  /**
   * Verify password against hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  async verify(password, hash) {
    throw new Error('Method not implemented');
  }
}

module.exports = IPasswordHasher;
