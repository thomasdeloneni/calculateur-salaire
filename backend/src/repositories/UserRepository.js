/**
 * UserRepository - Database operations for User
 * @class UserRepository
 * @implements IUserRepository
 */
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

class UserRepository {
  constructor() {
    this.tableName = 'users';
  }

  /**
   * Find user by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const [rows] = await db.query(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT * FROM ${this.tableName} WHERE email = ?`,
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Create new user
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async create(userData) {
    const id = uuidv4();
    const { email, password_hash, first_name, last_name } = userData;

    await db.query(
      `INSERT INTO ${this.tableName} (id, email, password_hash, first_name, last_name) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, email, password_hash, first_name || null, last_name || null]
    );

    return this.findById(id);
  }

  /**
   * Update user
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async update(id, updateData) {
    const { first_name, last_name, email } = updateData;

    const updates = [];
    const values = [];

    if (first_name !== undefined) {
      updates.push('first_name = ?');
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push('last_name = ?');
      values.push(last_name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await db.query(
      `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  /**
   * Delete user
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const [result] = await db.query(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Update Stripe customer ID
   * @param {string} userId
   * @param {string} stripeCustomerId
   * @returns {Promise<boolean>}
   */
  async updateStripeCustomerId(userId, stripeCustomerId) {
    const [result] = await db.query(
      `UPDATE ${this.tableName} SET stripe_customer_id = ? WHERE id = ?`,
      [stripeCustomerId, userId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Update Stripe subscription ID
   * @param {string} userId
   * @param {string} stripeSubscriptionId
   * @returns {Promise<boolean>}
   */
  async updateStripeSubscriptionId(userId, stripeSubscriptionId) {
    const [result] = await db.query(
      `UPDATE ${this.tableName} SET stripe_subscription_id = ? WHERE id = ?`,
      [stripeSubscriptionId, userId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Update subscription status
   * @param {string} userId
   * @param {string} status
   * @returns {Promise<boolean>}
   */
  async updateSubscriptionStatus(userId, status) {
    const [result] = await db.query(
      `UPDATE ${this.tableName} SET subscription_status = ? WHERE id = ?`,
      [status, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = UserRepository;
