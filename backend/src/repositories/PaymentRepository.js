/**
 * Payment Repository
 * Handles database operations for payments
 */
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

class PaymentRepository {
  /**
   * Create a new payment record
   */
  async create(paymentData) {
    const id = uuidv4();
    const {
      userId,
      stripePaymentId,
      amount,
      currency = 'eur',
      status = 'pending',
      description = null
    } = paymentData;

    const query = `
      INSERT INTO payments (id, user_id, stripe_payment_id, amount, currency, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await db.execute(query, [id, userId, stripePaymentId, amount, currency, status, description]);
      return { success: true, id };
    } catch (error) {
      console.error('Error creating payment:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Find payment by Stripe payment ID
   */
  async findByStripePaymentId(stripePaymentId) {
    const query = 'SELECT * FROM payments WHERE stripe_payment_id = ?';
    
    try {
      const [rows] = await db.execute(query, [stripePaymentId]);
      if (rows.length === 0) {
        return { success: false, error: 'Payment not found' };
      }
      return { success: true, payment: this.mapToPayment(rows[0]) };
    } catch (error) {
      console.error('Error finding payment:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Find all payments for a user
   */
  async findByUserId(userId) {
    const query = 'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC';
    
    try {
      const [rows] = await db.execute(query, [userId]);
      return { success: true, payments: rows.map(row => this.mapToPayment(row)) };
    } catch (error) {
      console.error('Error finding payments by user:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update payment status
   */
  async updateStatus(stripePaymentId, status) {
    const query = 'UPDATE payments SET status = ?, updated_at = NOW() WHERE stripe_payment_id = ?';
    
    try {
      await db.execute(query, [status, stripePaymentId]);
      return { success: true };
    } catch (error) {
      console.error('Error updating payment status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Map database row to payment object
   */
  mapToPayment(row) {
    return {
      id: row.id,
      userId: row.user_id,
      stripePaymentId: row.stripe_payment_id,
      amount: parseFloat(row.amount),
      currency: row.currency,
      status: row.status,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = PaymentRepository;
