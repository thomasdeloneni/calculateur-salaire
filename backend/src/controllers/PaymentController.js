/**
 * Payment Controller
 * Handles all payment-related API endpoints
 */
const StripeService = require('../services/StripeService');
const UserRepository = require('../repositories/UserRepository');
const { authenticate } = require('../middleware/auth');

class PaymentController {
  constructor(stripeService = null) {
    this.stripeService = stripeService || new StripeService();
    this.userRepository = new UserRepository();
  }

  /**
   * Create a checkout session for subscription
   * POST /api/payment/create-checkout-session
   */
  async createCheckoutSession(req, res) {
    try {
      const { priceId, planType } = req.body;
      const userId = req.user.id;

      if (!priceId) {
        return res.status(400).json({
          status: 'error',
          message: 'Price ID is required'
        });
      }

      // Get user from database
      const user = await this.userRepository.findById(userId);

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Create or retrieve Stripe customer
      let customerId = user.stripe_customer_id;
      
      if (!customerId) {
        const customerResult = await this.stripeService.createCustomer(
          user.email,
          `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          { userId: user.id.toString() }
        );

        if (!customerResult.success) {
          return res.status(500).json({
            status: 'error',
            message: 'Failed to create customer',
            error: customerResult.error
          });
        }

        customerId = customerResult.customer.id;
        
        // Save customer ID to user
        await this.userRepository.updateStripeCustomerId(userId, customerId);
      }

      // Create checkout session
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const sessionResult = await this.stripeService.createCheckoutSession(
        customerId,
        priceId,
        `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        `${frontendUrl}/payment/cancel`
      );

      if (!sessionResult.success) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to create checkout session',
          error: sessionResult.error
        });
      }

      res.json({
        status: 'success',
        data: {
          sessionId: sessionResult.session.id,
          url: sessionResult.session.url
        }
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Create a one-time payment
   * POST /api/payment/one-time
   */
  async createOneTimePayment(req, res) {
    try {
      const { amount, currency = 'eur', description } = req.body;
      const userId = req.user.id;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Valid amount is required'
        });
      }

      const user = await this.userRepository.findById(userId);

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      const customerId = user.stripe_customer_id;
      if (!customerId) {
        return res.status(400).json({
          status: 'error',
          message: 'Please subscribe first to enable one-time payments'
        });
      }

      const sessionResult = await this.stripeService.createOneTimePayment(
        customerId,
        amount,
        currency,
        description || 'Assistant Salary Calculator Payment',
        { userId: userId.toString() }
      );

      if (!sessionResult.success) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to create payment session',
          error: sessionResult.error
        });
      }

      res.json({
        status: 'success',
        data: {
          sessionId: sessionResult.session.id,
          url: sessionResult.session.url
        }
      });
    } catch (error) {
      console.error('Error creating one-time payment:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Verify checkout session and activate subscription
   * GET /api/payment/verify-session/:sessionId
   */
  async verifySession(req, res) {
    try {
      const { sessionId } = req.params;

      const sessionResult = await this.stripeService.getCheckoutSession(sessionId);

      if (!sessionResult.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid session',
          error: sessionResult.error
        });
      }

      const session = sessionResult.session;

      res.json({
        status: 'success',
        data: {
          paymentStatus: session.payment_status,
          customerEmail: session.customer_details?.email,
          subscriptionId: session.subscription,
          amountTotal: session.amount_total,
          currency: session.currency
        }
      });
    } catch (error) {
      console.error('Error verifying session:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get user's subscription status
   * GET /api/payment/subscription
   */
  async getSubscription(req, res) {
    try {
      const userId = req.user.id;

      const user = await this.userRepository.findById(userId);

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      if (!user.stripe_subscription_id) {
        return res.json({
          status: 'success',
          data: {
            hasSubscription: false,
            subscription: null
          }
        });
      }

      const subscriptionResult = await this.stripeService.getSubscription(
        user.stripe_subscription_id
      );

      if (!subscriptionResult.success) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to retrieve subscription',
          error: subscriptionResult.error
        });
      }

      const subscription = subscriptionResult.subscription;

      res.json({
        status: 'success',
        data: {
          hasSubscription: subscription.status === 'active',
          subscription: {
            id: subscription.id,
            status: subscription.status,
            currentPeriodStart: subscription.current_period_start * 1000,
            currentPeriodEnd: subscription.current_period_end * 1000,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            planId: subscription.items.data[0]?.price.id,
            planName: subscription.items.data[0]?.price.product
          }
        }
      });
    } catch (error) {
      console.error('Error getting subscription:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Cancel subscription
   * POST /api/payment/cancel-subscription
   */
  async cancelSubscription(req, res) {
    try {
      const userId = req.user.id;

      const user = await this.userRepository.findById(userId);

      if (!user || !user.stripe_subscription_id) {
        return res.status(404).json({
          status: 'error',
          message: 'No active subscription found'
        });
      }

      const result = await this.stripeService.cancelSubscription(
        user.stripe_subscription_id
      );

      if (!result.success) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to cancel subscription',
          error: result.error
        });
      }

      // Update user subscription status in database
      await this.userRepository.updateSubscriptionStatus(userId, 'canceled');

      res.json({
        status: 'success',
        message: 'Subscription canceled successfully',
        data: {
          subscriptionId: result.subscription.id,
          cancelAt: result.subscription.canceled_at
        }
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Open billing portal
   * POST /api/payment/billing-portal
   */
  async openBillingPortal(req, res) {
    try {
      const userId = req.user.id;

      const user = await this.userRepository.findById(userId);

      if (!user || !user.stripe_customer_id) {
        return res.status(404).json({
          status: 'error',
          message: 'No billing account found'
        });
      }

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const result = await this.stripeService.createBillingPortalSession(
        user.stripe_customer_id,
        `${frontendUrl}/settings/billing`
      );

      if (!result.success) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to open billing portal',
          error: result.error
        });
      }

      res.json({
        status: 'success',
        data: {
          url: result.session.url
        }
      });
    } catch (error) {
      console.error('Error opening billing portal:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Handle Stripe webhooks
   * POST /api/payment/webhook
   */
  async handleWebhook(req, res) {
    try {
      const signature = req.headers['stripe-signature'];

      if (!signature) {
        return res.status(400).json({
          status: 'error',
          message: 'No signature provided'
        });
      }

      const result = await this.stripeService.handleWebhookEvent(
        req.body,
        signature
      );

      if (!result.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Webhook processing failed'
        });
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Webhook processing failed'
      });
    }
  }

  /**
   * Get available plans
   * GET /api/payment/plans
   */
  async getPlans(req, res) {
    try {
      // Return hardcoded plans for now - in production, fetch from Stripe
      const plans = [
        {
          id: 'monthly',
          name: 'Monthly Plan',
          description: 'Billed monthly',
          prices: {
            eur: {
              monthly: {
                id: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly',
                amount: 990,
                currency: 'eur'
              }
            }
          },
          features: [
            'Unlimited salary calculations',
            'Save calculation history',
            'Export to PDF',
            'Email support'
          ]
        },
        {
          id: 'yearly',
          name: 'Yearly Plan',
          description: 'Billed annually - Save 17%',
          prices: {
            eur: {
              yearly: {
                id: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly',
                amount: 9900,
                currency: 'eur'
              }
            }
          },
          features: [
            'Everything in Monthly',
            'Priority support',
            'Advanced analytics',
            'Team sharing (up to 3 users)'
          ]
        }
      ];

      res.json({
        status: 'success',
        data: { plans }
      });
    } catch (error) {
      console.error('Error getting plans:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }
}

module.exports = PaymentController;
