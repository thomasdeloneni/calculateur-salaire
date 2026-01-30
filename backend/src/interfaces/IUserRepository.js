/**
 * @interface IUserRepository
 * @description Repository interface for user data access - Single Responsibility
 */
class IUserRepository {
  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Find user by ID
   * @param {number} id
   * @returns {Promise<User|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Create new user
   * @param {User} user
   * @returns {Promise<User>}
   */
  async create(user) {
    throw new Error('Method not implemented');
  }
}

module.exports = IUserRepository;
