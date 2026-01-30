/**
 * Pricing Page Component
 * Displays subscription plans and handles checkout
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/payment/plans`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setPlans(data.data.plans);
      } else {
        setError('Failed to load plans');
      }
    } catch (err) {
      setError('Failed to load plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    setProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirect=/pricing');
        return;
      }

      const priceId = plan.prices.eur.monthly?.id || plan.prices.eur.yearly?.id;
      
      const response = await fetch(`${API_URL}/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ priceId })
      });

      const data = await response.json();

      if (data.status === 'success' && data.data.url) {
        window.location.href = data.data.url;
      } else {
        setError(data.message || 'Failed to create checkout session');
      }
    } catch (err) {
      setError('Failed to initiate checkout');
      console.error('Error creating checkout session:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Get the most out of your salary calculations
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
                plan.id === 'yearly' ? 'border-indigo-500' : 'border-transparent'
              }`}
            >
              {plan.id === 'yearly' && (
                <div className="bg-indigo-500 text-white text-center py-2 text-sm font-medium">
                  Best Value - Save 17%
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.id === 'monthly' ? '€9.90' : '€99'}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {plan.id === 'monthly' ? '/month' : '/year'}
                  </span>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-green-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={processing}
                  className={`mt-8 w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    plan.id === 'yearly'
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {processing ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            All plans include a 14-day money-back guarantee.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
