/**
 * @interface ITokenService
 * @description Service interface for JWT token operations - Single Responsibility (ISP)
 */
class ITokenService {
  /**
   * Generate JWT token
   * @param {Object} payload
   * @returns {string}
   */
  generate(payload) {
    throw new Error('Method not implemented');
  }

  /**
   * Verify JWT token
   * @param {string} token
   * @returns {Object|null}
   */
  verify(token) {
    throw new Error('Method not implemented');
  }
}

module.exports = ITokenService;
