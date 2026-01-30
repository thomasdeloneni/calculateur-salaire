/**
 * RegisterUserDTO - Data Transfer Object for user registration
 * @class RegisterUserDTO
 * @description Validates and encapsulates registration data - Single Responsibility
 */
class RegisterUserDTO {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  /**
   * Validate the DTO
   * @returns {{isValid: boolean, errors: string[]}}
   */
  validate() {
    const errors = [];

    if (!this.email || typeof this.email !== 'string') {
      errors.push('Email is required');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Email is invalid');
    }

    if (!this.password || typeof this.password !== 'string') {
      errors.push('Password is required');
    } else if (this.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = RegisterUserDTO;
