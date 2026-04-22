'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Check, Crown, Loader2, X, Calendar } from 'lucide-react'

interface SubscriptionInfo {
  plan: string
  status: string
  currentPeriodEnd: string | null
  trialEnd: string | null
}

const plans = [
  {
    id: 'free',
    name: 'Starter',
    price: '$0',
    period: '',
    features: ['Up to 10 bookings/month', '5 menu items', 'Basic booking page', 'Manual payments', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/mo',
    features: ['Unlimited bookings', 'Unlimited menu items', 'Custom domain', 'Stripe payments', 'Client CRM', 'Invoice system', 'Priority support'],
    highlight: true,
  },
]

export default function BillingPage() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/dashboard/billing')
      if (res.ok) {
        const data = await res.json()
        if (data.success) setSubscription(data.subscription)
      }
    } catch (err) {
      console.error('Failed to fetch billing:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    try {
      const res = await fetch('/api/dashboard/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        setToast({ message: data.error || 'Failed to start checkout', type: 'error' })
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'error' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary-300" />
      </div>
    )
  }

  const currentPlan = subscription?.plan || 'free'

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
          <CreditCard size={28} className="text-primary-300" /> Billing
        </h1>
        <p className="text-sm text-muted mt-1">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-charcoal flex items-center gap-2">
              Current Plan: <span className="text-primary-300 capitalize">{currentPlan}</span>
              {currentPlan === 'pro' && <Crown size={16} className="text-yellow-500" />}
            </h3>
            {subscription?.trialEnd && (
              <p className="text-sm text-muted mt-1 flex items-center gap-1">
                <Calendar size={14} /> Trial ends {new Date(subscription.trialEnd).toLocaleDateString()}
              </p>
            )}
            {subscription?.currentPeriodEnd && currentPlan === 'pro' && (
              <p className="text-sm text-muted mt-1">
                Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            subscription?.status === 'active' ? 'bg-green-100 text-green-700' :
            subscription?.status === 'trialing' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {subscription?.status === 'active' ? 'Active' :
             subscription?.status === 'trialing' ? 'Trial' : 'Free'}
          </span>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-6 border-2 ${
              plan.id === currentPlan
                ? 'border-primary-300 bg-primary-50/30'
                : plan.highlight
                  ? 'border-primary-200 bg-white'
                  : 'border-gray-200 bg-white'
            }`}
          >
            {plan.id === currentPlan && (
              <span className="inline-block text-xs bg-primary-300 text-white px-3 py-1 rounded-full font-medium mb-3">
                Current Plan
              </span>
            )}
            <h3 className="font-semibold text-charcoal text-lg">{plan.name}</h3>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold text-charcoal">{plan.price}</span>
              <span className="text-muted">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <Check size={16} className="text-primary-300 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {plan.id !== currentPlan && (
              <button
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? 'bg-primary-300 text-white hover:bg-primary-400'
                    : 'border-2 border-gray-200 text-charcoal hover:border-primary-300'
                }`}
              >
                {plan.id === 'free' ? 'Downgrade' : 'Upgrade to ' + plan.name}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Billing History placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-charcoal mb-4">Billing History</h3>
        <p className="text-sm text-muted text-center py-6">
          No billing history yet. Upgrade to Pro to start your subscription.
        </p>
      </div>
    </div>
  )
}
