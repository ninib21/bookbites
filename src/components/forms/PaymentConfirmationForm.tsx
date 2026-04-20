'use client'

import { FormEvent, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import PaymentStatusBadge from '@/components/booking/PaymentStatusBadge'

type Props = {
  bookingId: string
  currentPaymentStatus?: string
  currentPaymentMethod?: string | null
  currentPaymentReference?: string | null
}

type ApiResponse = {
  success: boolean
  message: string
  booking?: {
    id: string
    paymentStatus: string
    paymentMethod: string | null
    paymentReference: string | null
    paymentReviewNote: string | null
    paymentSubmittedAt: string | null
  }
}

export default function PaymentConfirmationForm({
  bookingId,
  currentPaymentStatus = 'pending',
  currentPaymentMethod = '',
  currentPaymentReference = '',
}: Props) {
  const [paymentMethod, setPaymentMethod] = useState(currentPaymentMethod || '')
  const [paymentReference, setPaymentReference] = useState(currentPaymentReference || '')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState(currentPaymentStatus)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isLocked = useMemo(() => {
    return status === 'approved'
  }, [status])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setLoading(true)
      setMessage('')
      setError('')

      const response = await fetch('/api/booking/payment-submitted', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, paymentMethod, paymentReference, note }),
      })

      const result: ApiResponse = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to submit payment confirmation.')
      }

      setStatus(result.booking?.paymentStatus || 'submitted')
      setMessage(result.message)
      setNote('')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Unable to submit payment confirmation.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-charcoal mb-2">Payment Confirmation</h3>
            <p className="text-muted text-sm leading-relaxed max-w-lg">
              After sending your deposit, submit your payment details below so the owner can review and approve it.
            </p>
          </div>
          <PaymentStatusBadge status={status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={loading || isLocked}
              required
              className="form-select"
            >
              <option value="">Select a payment method</option>
              <option value="Cash App">Cash App</option>
              <option value="Chime">Chime</option>
              <option value="Apple Pay">Apple Pay</option>
            </select>
          </div>
          <div>
            <label className="form-label">Payment Reference</label>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="Transaction name, last 4, or short payment note"
              disabled={loading || isLocked}
              required
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="form-label">Additional Note</label>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Example: Sent under Jane Doe at 3:15 PM"
            disabled={loading || isLocked}
            className="form-input resize-y"
          />
        </div>

        {message && <p className="text-green-700 font-semibold text-sm">{message}</p>}
        {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}

        <div>
          <Button type="submit" size="lg" disabled={loading || isLocked}>
            {loading ? 'Submitting...' : isLocked ? 'Payment Already Approved' : 'I Sent My Payment'}
          </Button>
        </div>
      </form>
    </div>
  )
}
