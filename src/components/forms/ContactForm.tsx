'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      addToast({
        type: 'success',
        title: 'Message Sent!',
        message: "We'll get back to you within 1–2 business days.",
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 flex flex-col gap-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="font-display text-2xl font-bold text-charcoal">Message Sent!</h3>
        <p className="text-muted">Thank you for contacting us. We&apos;ll get back to you within 1–2 business days.</p>
        <Button href="/" variant="primary">
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="form-label">Full Name *</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className="form-input" />
        </div>
        <div>
          <label htmlFor="email" className="form-label">Email *</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="form-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="form-label">Phone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 214-7789" className="form-input" />
        </div>
        <div>
          <label htmlFor="subject" className="form-label">Subject *</label>
          <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="form-select">
            <option value="">Select a subject</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Quote Request">Quote Request</option>
            <option value="Event Booking">Event Booking</option>
            <option value="Custom Order">Custom Order</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="form-label">Message *</label>
        <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} placeholder="Tell us about your event or question..." className="form-input resize-y" />
      </div>

      <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </Button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 font-semibold text-sm">{error}</p>
        </div>
      )}
    </form>
  )
}
