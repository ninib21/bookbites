'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from '@/lib/animations'
import Button from '@/components/ui/Button'
import { packages } from '@/data/packages'
import { Check } from 'lucide-react'

export type BookingFormData = {
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  eventTime: string
  venue: string
  guestCount: number
  selectedPackage: string
  customizations: string
  paymentMethod: 'deposit' | 'full'
  agreedToTerms: boolean
}

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    guestCount: 0,
    selectedPackage: '',
    customizations: '',
    paymentMethod: 'deposit',
    agreedToTerms: false,
  })

  const [submitted, setSubmitted] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!formRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current?.querySelectorAll('.form-section') ?? [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: formRef.current, start: 'top 85%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking')
      }

      setBookingRef(data.reference)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center flex flex-col gap-6 py-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-5xl font-bold text-primary-300">✓</span>
        </div>
        <h3 className="font-display text-2xl font-bold text-charcoal">Booking Submitted!</h3>
        <p className="text-lg font-semibold text-primary-300 bg-cream rounded-xl py-3 px-6 mx-auto">
          Reference: {bookingRef}
        </p>
        <p className="text-muted">Your booking request has been received. We&apos;ll review and confirm within 24 hours.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button href="/booking/lookup" variant="secondary">Track Booking</Button>
          <Button href="/" variant="primary">Back to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" ref={formRef}>
      {/* Customer Information */}
      <div className="form-section p-6 bg-cream/50 rounded-2xl space-y-5">
        <h3 className="font-display text-lg font-semibold text-primary-400">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="form-label">Full Name *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" className="form-input" />
          </div>
          <div>
            <label htmlFor="email" className="form-label">Email *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="form-input" />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="form-label">Phone *</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="(123) 456-7890" className="form-input" />
        </div>
      </div>

      {/* Event Details */}
      <div className="form-section p-6 bg-cream/50 rounded-2xl space-y-5">
        <h3 className="font-display text-lg font-semibold text-primary-400">Event Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="eventType" className="form-label">Event Type *</label>
            <select id="eventType" name="eventType" value={formData.eventType} onChange={handleChange} required className="form-select">
              <option value="">Select event type</option>
              <option value="Birthday">Birthday Party</option>
              <option value="Wedding">Wedding</option>
              <option value="Baby Shower">Baby Shower</option>
              <option value="Corporate">Corporate Event</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Graduation">Graduation</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="guestCount" className="form-label">Number of Guests *</label>
            <input type="number" id="guestCount" name="guestCount" value={formData.guestCount || ''} onChange={handleChange} required placeholder="Approximate number" min="1" className="form-input" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="eventDate" className="form-label">Event Date *</label>
            <input type="date" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleChange} required className="form-input" />
          </div>
          <div>
            <label htmlFor="eventTime" className="form-label">Event Time</label>
            <input type="time" id="eventTime" name="eventTime" value={formData.eventTime} onChange={handleChange} className="form-input" />
          </div>
        </div>
        <div>
          <label htmlFor="venue" className="form-label">Event Venue / Address *</label>
          <input type="text" id="venue" name="venue" value={formData.venue} onChange={handleChange} required placeholder="Full address or venue name" className="form-input" />
        </div>
      </div>

      {/* Package Selection */}
      <div className="form-section p-6 bg-cream/50 rounded-2xl space-y-5">
        <h3 className="font-display text-lg font-semibold text-primary-400">Select Package</h3>
        <div className="flex flex-col gap-3">
          {packages.map((pkg) => (
            <label
              key={pkg.name}
              className={`flex gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                formData.selectedPackage === pkg.name
                  ? 'border-primary-300 bg-cream'
                  : 'border-[#E8D5D5] bg-white hover:border-mauve-light'
              }`}
            >
              <input
                type="radio"
                name="selectedPackage"
                value={pkg.name}
                checked={formData.selectedPackage === pkg.name}
                onChange={handleChange}
                required
                className="mt-1 accent-[#D4A5B8]"
              />
              <div>
                <h4 className="text-base font-semibold text-charcoal">{pkg.name}</h4>
                <div className="text-xl font-bold text-primary-300 my-1">{pkg.price}</div>
                <p className="text-sm text-muted">{pkg.description}</p>
              </div>
            </label>
          ))}
        </div>
        <div>
          <label htmlFor="customizations" className="form-label">Customizations / Special Requests</label>
          <textarea id="customizations" name="customizations" value={formData.customizations} onChange={handleChange} rows={4} placeholder="Any specific requirements, theme ideas, or special requests..." className="form-input resize-y" />
        </div>
      </div>

      {/* Payment */}
      <div className="form-section p-6 bg-cream/50 rounded-2xl space-y-5">
        <h3 className="font-display text-lg font-semibold text-primary-400">Payment Option</h3>
        <div className="flex flex-col gap-3">
          {[
            { value: 'deposit' as const, title: 'Pay Deposit (50%)', desc: 'Secure your booking with a deposit. Balance due 1 week before event.' },
            { value: 'full' as const, title: 'Pay in Full', desc: 'Pay the full amount now and avoid any future payments.' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                formData.paymentMethod === opt.value
                  ? 'border-primary-300 bg-cream'
                  : 'border-[#E8D5D5] bg-white hover:border-mauve-light'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={opt.value}
                checked={formData.paymentMethod === opt.value}
                onChange={handleChange}
                required
                className="mt-1 accent-[#D4A5B8]"
              />
              <div>
                <h4 className="text-base font-semibold text-charcoal">{opt.title}</h4>
                <p className="text-sm text-muted mt-1">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
        <label className="flex items-center gap-3 cursor-pointer text-sm text-muted">
          <input
            type="checkbox"
            name="agreedToTerms"
            checked={formData.agreedToTerms}
            onChange={handleChange}
            required
            className="w-4 h-4 rounded border-[#E8D5D5] accent-[#D4A5B8]"
          />
          <span>
            I agree to the <a href="/policies/terms" target="_blank" className="text-primary-300 underline">Terms of Service</a> and{' '}
            <a href="/policies/refund" target="_blank" className="text-primary-300 underline">Refund Policy</a> *
          </span>
        </label>
      </div>

      <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Booking Request'}
      </Button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 font-semibold text-sm">{error}</p>
        </div>
      )}
    </form>
  )
}
