'use client'

import { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

export type InquiryFormData = {
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  guestCount: string
  inquiryType: string
  message: string
  agreedToContact: boolean
}

type InquiryFormProps = {
  onCancel?: () => void
  onSuccess?: () => void
  compact?: boolean
}

const inquiryTypes = [
  'General Inquiry',
  'Booking Request',
  'Package Information',
  'Custom Quote',
  'Event Consultation',
]

const eventTypes = [
  'Birthday Party',
  'Wedding',
  'Baby Shower',
  'Corporate Event',
  'Anniversary',
  'Graduation',
  'Holiday Party',
  'Other',
]

export default function InquiryForm({ onCancel, onSuccess, compact = false }: InquiryFormProps) {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    inquiryType: '',
    message: '',
    agreedToContact: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addToast } = useToast()

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
      const cleanedData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        eventType: formData.eventType,
        eventDate: formData.eventDate || undefined,
        guestCount: formData.guestCount ? parseInt(formData.guestCount) : undefined,
        packageInterest: formData.inquiryType || undefined,
        budget: undefined,
        message: formData.message || undefined,
      }

      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          const errorMessages = data.details.map((err: { message: string }) => err.message).join(', ')
          throw new Error(errorMessages || data.error || 'Failed to submit inquiry')
        }
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      // Show toast
      addToast({
        type: 'success',
        title: 'Your inquiry has been sent',
        message: "We'll get back to you within 1–2 business days.",
      })

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      addToast({
        type: 'error',
        title: 'Submission failed',
        message: err instanceof Error ? err.message : 'Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Optional"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Inquiry Type *</label>
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select inquiry type</option>
                {inquiryTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="agreedToContact"
                checked={formData.agreedToContact}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-[#E8D5D5] text-primary-300 focus:ring-primary-200 accent-[#D4A5B8]"
              />
              <span className="text-sm text-muted leading-snug">
                I agree to be contacted about my inquiry.
              </span>
            </label>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Event Type *</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select event type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Event Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="form-input pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-md border-2 border-[#E8D5D5] text-charcoal font-semibold text-sm hover:bg-cream transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-md bg-primary-300 text-white font-semibold text-sm hover:bg-primary-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Inquiry'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm font-semibold">{error}</p>
          </div>
        )}
      </form>
    )
  }

  // Full-page version (for /inquire page)
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="p-6 bg-cream rounded-md space-y-5">
        <h3 className="text-lg font-semibold text-primary-400">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="form-input"
            />
          </div>
        </div>
        <div>
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            className="form-input"
          />
        </div>
      </div>

      <div className="p-6 bg-cream rounded-md space-y-5">
        <h3 className="text-lg font-semibold text-primary-400">Event Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Event Type *</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select event type</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Event Date *</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Number of Guests</label>
            <input
              type="number"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleChange}
              placeholder="Approximate number"
              min="1"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Inquiry Type</label>
            <select
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select inquiry type</option>
              {inquiryTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 bg-cream rounded-md space-y-5">
        <h3 className="text-lg font-semibold text-primary-400">Additional Details</h3>
        <div>
          <label className="form-label">Tell Us About Your Event</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Share your vision, theme ideas, special requests..."
            className="form-input resize-y"
          />
        </div>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            name="agreedToContact"
            checked={formData.agreedToContact}
            onChange={handleChange}
            className="mt-1 w-4 h-4 rounded border-[#E8D5D5] text-primary-300 focus:ring-primary-200 accent-[#D4A5B8]"
          />
          <span className="text-sm text-muted">I agree to be contacted about my inquiry.</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full min-h-[56px] px-7 py-4 text-base font-semibold rounded-md bg-primary-300 text-white shadow-soft hover:bg-primary-400 hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {loading ? 'Submitting...' : 'Submit Inquiry'}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      )}
    </form>
  )
}
