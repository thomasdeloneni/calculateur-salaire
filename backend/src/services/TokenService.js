/**
 * TokenService - JWT token generation and verification
 * @class TokenService
 * @implements ITokenService
 */
const jwt = require('jsonwebtoken');

class TokenService {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  /**
   * Generate a JWT token
   * @param {Object} payload
   * @returns {string}
   */
  generate(payload) {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn
    });
  }

  /**
   * Verify a JWT token
   * @param {string} token
   * @returns {Object|null}
   */
  verify(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }

  /**
   * Decode a token without verification
   * @param {string} token
   * @returns {Object|null}
   */
  decode(token) {
    return jwt.decode(token);
  }
}

module.exports = TokenService;
