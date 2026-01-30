/**
 * Billing Settings Component
 * Manages subscription and billing information
 */
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function BillingSettings() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/payment/subscription`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setSubscription(data.data);
      } else {
        setError('Failed to load subscription');
      }
    } catch (err) {
      setError('Failed to load subscription');
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/payment/cancel-subscription`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setSuccess('Subscription canceled successfully');
        fetchSubscription();
      } else {
        setError(data.message || 'Failed to cancel subscription');
      }
    } catch (err) {
      setError('Failed to cancel subscription');
      console.error('Error canceling subscription:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenBillingPortal = async () => {
    setProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/payment/billing-portal`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data.url) {
        window.location.href = data.data.url;
      } else {
        setError(data.message || 'Failed to open billing portal');
      }
    } catch (err) {
      setError('Failed to open billing portal');
      console.error('Error opening billing portal:', err);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing & Subscription</h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      {subscription?.hasSubscription ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-green-800">Active Subscription</p>
              <p className="text-sm text-green-600">
                Your subscription renews on {formatDate(subscription.subscription?.currentPeriodEnd)}
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Active
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium text-gray-900">
                {subscription.subscription?.planName || 'Premium'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className="font-medium text-gray-900 capitalize">
                {subscription.subscription?.status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Period Ends</span>
              <span className="font-medium text-gray-900">
                {formatDate(subscription.subscription?.currentPeriodEnd)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleOpenBillingPortal}
              disabled={processing}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Manage Billing'}
            </button>
            <button
              onClick={handleCancelSubscription}
              disabled={processing || subscription.subscription?.cancelAtPeriodEnd}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {subscription.subscription?.cancelAtPeriodEnd ? 'Cancelation Pending' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No Active Subscription
          </h4>
          <p className="text-gray-600 mb-6">
            Upgrade to unlock all premium features
          </p>
          <a
            href="/pricing"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            View Plans
          </a>
        </div>
      )}
    </div>
  );
}

export default BillingSettings;
