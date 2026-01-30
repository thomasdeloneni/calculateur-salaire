/**
 * User entity - Domain model
 * @class User
 * @description Represents a user in the system - Single Responsibility
 */
class User {
  constructor(id, email, password_hash, created_at, updated_at) {
    this.id = id;
    this.email = email;
    this.password_hash = password_hash;
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
  }

  /**
   * Create User from database row
   * @param {Object} row
   * @returns {User}
   */
  static fromRow(row) {
    return new User(
      row.id,
      row.email,
      row.password_hash,
      row.created_at,
      row.updated_at
    );
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;
