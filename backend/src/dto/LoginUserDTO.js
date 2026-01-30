/**
 * LoginUserDTO - Data Transfer Object for user login
 * @class LoginUserDTO
 * @description Validates and encapsulates login data - Single Responsibility
 */
class LoginUserDTO {
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
    }

    if (!this.password || typeof this.password !== 'string') {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = LoginUserDTO;
