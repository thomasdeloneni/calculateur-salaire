/**
 * User entity - Domain model
 * @class User
 * @description Represents a user in the system - Single Responsibility
 */
class User {
  constructor(id, email, password_hash, created_at, updated_at, firstName = null, lastName = null, stripeCustomerId = null, stripeSubscriptionId = null, subscriptionStatus = 'inactive') {
    this.id = id;
    this.email = email;
    this.password_hash = password_hash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.stripeCustomerId = stripeCustomerId;
    this.stripeSubscriptionId = stripeSubscriptionId;
    this.subscriptionStatus = subscriptionStatus;
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
      row.updated_at,
      row.first_name,
      row.last_name,
      row.stripe_customer_id,
      row.stripe_subscription_id,
      row.subscription_status
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
      firstName: this.firstName,
      lastName: this.lastName,
      stripeCustomerId: this.stripeCustomerId,
      stripeSubscriptionId: this.stripeSubscriptionId,
      subscriptionStatus: this.subscriptionStatus,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;
