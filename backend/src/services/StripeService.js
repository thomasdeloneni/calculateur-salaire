/**
 * Stripe Payment Service
 * Handles payment processing, subscription management, and webhook handling
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

class StripeService {
  constructor() {
    this.stripe = stripe;
  }

  /**
   * Create a new customer in Stripe
   */
  async createCustomer(email, name, metadata = {}) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          ...metadata,
          source: 'assistant-salary-calculator'
        }
      });
      return { success: true, customer };
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(customerId, priceId, successUrl, cancelUrl) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        billing_address_collection: 'auto'
      });
      return { success: true, session };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a one-time payment session
   */
  async createOneTimePayment(customerId, amount, currency, description, metadata = {}) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: description,
                metadata: metadata
              },
              unit_amount: amount // amount in cents
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata
      });
      return { success: true, session };
    } catch (error) {
      console.error('Error creating one-time payment:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Retrieve checkout session
   */
  async getCheckoutSession(sessionId) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return { success: true, session };
    } catch (error) {
      console.error('Error retrieving checkout session:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(customerId, priceId) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });
      return { success: true, subscription };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      return { success: true, subscription };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return { success: true, subscription };
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(customerId, returnUrl) {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      });
      return { success: true, session };
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhookEvent(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { success: true, received: true };
    } catch (error) {
      console.error('Error handling webhook:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle checkout completed event
   */
  async handleCheckoutCompleted(session) {
    console.log('Checkout completed:', session.id);
    // This is where you would update the user's subscription status in your database
    // emit events, send confirmation emails, etc.
  }

  /**
   * Handle subscription created event
   */
  async handleSubscriptionCreated(subscription) {
    console.log('Subscription created:', subscription.id);
  }

  /**
   * Handle subscription updated event
   */
  async handleSubscriptionUpdated(subscription) {
    console.log('Subscription updated:', subscription.id);
  }

  /**
   * Handle subscription deleted event
   */
  async handleSubscriptionDeleted(subscription) {
    console.log('Subscription deleted:', subscription.id);
  }

  /**
   * Handle invoice payment succeeded
   */
  async handleInvoicePaymentSucceeded(invoice) {
    console.log('Invoice payment succeeded:', invoice.id);
  }

  /**
   * Handle invoice payment failed
   */
  async handleInvoicePaymentFailed(invoice) {
    console.log('Invoice payment failed:', invoice.id);
  }

  /**
   * List all products
   */
  async listProducts() {
    try {
      const products = await this.stripe.products.list({ active: true });
      return { success: true, products: products.data };
    } catch (error) {
      console.error('Error listing products:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * List all prices for a product
   */
  async listPrices(productId) {
    try {
      const prices = await this.stripe.prices.list({
        product: productId,
        active: true
      });
      return { success: true, prices: prices.data };
    } catch (error) {
      console.error('Error listing prices:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a product (for admin use)
   */
  async createProduct(name, description) {
    try {
      const product = await this.stripe.products.create({
        name,
        description
      });
      return { success: true, product };
    } catch (error) {
      console.error('Error creating product:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a price for a product (for admin use)
   */
  async createPrice(productId, amount, currency, interval) {
    try {
      const price = await this.stripe.prices.create({
        product: productId,
        unit_amount: amount,
        currency,
        recurring: {
          interval
        }
      });
      return { success: true, price };
    } catch (error) {
      console.error('Error creating price:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = StripeService;
