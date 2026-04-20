'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import PaymentSubmissionForm from '@/components/booking/PaymentSubmissionForm'
import PaymentStatusBadge from '@/components/booking/PaymentStatusBadge'
import { Search } from 'lucide-react'

export default function BookingLookupForm() {
  const [bookingRef, setBookingRef] = useState('')
  const [email, setEmail] = useState('')
  const [booking, setBooking] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBooking(null)
    setLoading(true)

    try {
      const response = await fetch('/api/booking/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: bookingRef, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Booking not found')
      }

      setBooking(data.booking)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleLookup}>
        <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-cream rounded-xl flex items-center justify-center text-primary-300">
              <Search size={18} strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal">Look Up Your Booking</h3>
          </div>
          <p className="text-muted text-sm mb-6">
            Enter your booking reference and email to check the status of your booking.
          </p>

          <div className="space-y-5">
            <div>
              <label htmlFor="bookingRef" className="form-label">Booking Reference *</label>
              <input
                type="text"
                id="bookingRef"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                required
                placeholder="e.g., BK-12345"
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="form-input"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading} className="mt-6">
            {loading ? 'Looking Up...' : 'Look Up Booking'}
          </Button>
        </div>
      </form>

      {error && (
        <div className="p-5 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-red-600 font-semibold text-sm">{error}</p>
        </div>
      )}

      {booking && (
        <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-xl font-bold text-charcoal">Booking Found</h3>
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>

          <div className="flex flex-col gap-4 mb-6 p-5 bg-cream/50 rounded-xl">
            {[
              { label: 'Reference', value: booking.reference },
              { label: 'Event Date', value: new Date(booking.eventDate).toLocaleDateString() },
              { label: 'Package', value: booking.package },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center">
                <span className="text-sm text-muted">{row.label}:</span>
                <span className="text-sm font-semibold text-charcoal">{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted">Payment:</span>
              <PaymentStatusBadge status={booking.paymentStatus} />
            </div>
          </div>

          <div className="flex gap-4 flex-wrap items-center">
            {booking.paymentStatus === 'pending' && (
              <Button onClick={() => setShowPaymentForm(true)} variant="primary">
                I&apos;ve Sent My Payment
              </Button>
            )}
            {booking.paymentStatus === 'submitted' && (
              <span className="px-4 py-2.5 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm font-semibold">
                Payment submitted — awaiting confirmation
              </span>
            )}
            {booking.paymentStatus === 'approved' && (
              <span className="px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-semibold">
                Payment approved — booking confirmed
              </span>
            )}
            {booking.paymentStatus === 'declined' && (
              <span className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm font-semibold">
                Payment declined — please resubmit
              </span>
            )}
            <Button href="/contact" variant="secondary">Contact Us</Button>
          </div>
        </div>
      )}

      {booking && showPaymentForm && booking.paymentStatus === 'pending' && (
        <PaymentSubmissionForm
          reference={booking.reference}
          onSuccess={() => {
            setShowPaymentForm(false)
            setBooking({ ...booking, paymentStatus: 'submitted' })
          }}
        />
      )}
    </div>
  )
}
