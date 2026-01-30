/**
 * PasswordHasher - Service for hashing and verifying passwords
 * @class PasswordHasher
 * @implements IPasswordHasher
 */
const argon2 = require('argon2');

class PasswordHasher {
  /**
   * Hash a password
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hash(password) {
    try {
      return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1
      });
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Verify a password against a hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  async verify(password, hash) {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      return false;
    }
  }
}

module.exports = PasswordHasher;
