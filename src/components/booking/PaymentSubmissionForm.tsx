'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

type PaymentSubmissionFormProps = {
  reference: string
  onSuccess?: () => void
}

export default function PaymentSubmissionForm({ reference, onSuccess }: PaymentSubmissionFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/booking/payment-submitted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          paymentMethod,
          amount: amount ? parseFloat(amount) : undefined,
          notes: notes || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit payment notification.')
      }

      setSuccess(true)
      onSuccess?.()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft text-center">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-primary-100 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-primary-300" />
        </div>
        <h3 className="font-display text-xl font-bold text-charcoal mb-3">Payment Submitted!</h3>
        <p className="text-muted text-sm leading-relaxed">
          Thank you! We&apos;ve received your payment notification. The owner will review and
          confirm your payment within 24 hours. You&apos;ll receive an email confirmation once
          your payment is verified.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <h3 className="font-display text-xl font-bold text-charcoal mb-2">Mark Payment as Submitted</h3>
          <p className="text-muted text-sm leading-relaxed">
            After sending your payment via Cash App, Chime, or Apple Pay, let us know here
            so we can verify and confirm your booking.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm font-semibold">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="paymentMethod" className="form-label">Payment Method Used *</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select payment method</option>
            <option value="Cash App">Cash App</option>
            <option value="Chime">Chime</option>
            <option value="Apple Pay">Apple Pay</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="form-label">Amount Sent ($)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="form-input"
          />
          <small className="text-muted text-xs mt-1 block">Optional — helps us verify your payment</small>
        </div>

        <div>
          <label htmlFor="notes" className="form-label">Additional Notes</label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional details about your payment..."
            className="form-input resize-y"
          />
          <small className="text-muted text-xs mt-1 block">Optional — e.g., transaction ID, sender name, etc.</small>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Submitting...' : "I've Sent My Payment"}
        </Button>
      </form>
    </div>
  )
}
