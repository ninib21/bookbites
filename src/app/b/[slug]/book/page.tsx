'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, Cake, ChefHat, ArrowRight, ArrowLeft, Check, Loader2, MapPin, Users, FileText } from 'lucide-react'

interface BusinessData {
  id: string
  name: string
  slug: string
  primaryColor: string
  settings: {
    allowOnlineBooking: boolean
    allowCustomOrders: boolean
    allowCatering: boolean
    requireDeposit: boolean
    depositPercentage: number
  } | null
  services: Array<{ id: string; name: string; price: number; description: string | null }>
  packages: Array<{ id: string; name: string; price: number; description: string; features: string; pricingType: string }>
}

const STEPS = [
  { id: 1, label: 'Service Type' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Your Info' },
  { id: 4, label: 'Review' },
]

export default function BookingFlowPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [business, setBusiness] = useState<BusinessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Service type
  const [serviceType, setServiceType] = useState<'event' | 'custom_order' | 'catering'>('event')

  // Step 2: Event details
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [selectedPackageId, setSelectedPackageId] = useState('')
  const [eventType, setEventType] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [venue, setVenue] = useState('')
  const [customizations, setCustomizations] = useState('')

  // Step 3: Customer info
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerNotes, setCustomerNotes] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    fetchBusiness()
  }, [slug])

  const fetchBusiness = async () => {
    try {
      const res = await fetch(`/api/business/${slug}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setBusiness({
            ...data.business,
            packages: data.packages || [],
          })
        }
      }
    } catch (err) {
      console.error('Failed to fetch business:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessSlug: slug,
          serviceType,
          selectedServiceId: selectedServiceId || undefined,
          selectedPackageId: selectedPackageId || undefined,
          eventType,
          eventDate,
          eventTime: eventTime || undefined,
          guestCount: parseInt(guestCount) || 0,
          venue: venue || undefined,
          customizations: customizations || undefined,
          customerName,
          customerEmail,
          customerPhone: customerPhone || undefined,
          customerNotes: customerNotes || undefined,
          agreedToTerms,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Booking failed.')
        setSubmitting(false)
        return
      }

      router.push(`/b/${slug}/book/success?ref=${data.reference}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-300" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Business Not Found</h1>
          <p className="text-muted">This booking page doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  const color = business.primaryColor || '#D4A5B8'

  const canProceed = () => {
    if (currentStep === 1) return true
    if (currentStep === 2) {
      if (serviceType === 'event') return eventType && eventDate && guestCount
      return true
    }
    if (currentStep === 3) return customerName && customerEmail
    if (currentStep === 4) return agreedToTerms
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-charcoal">{business.name}</h1>
          <span className="text-sm text-muted">Book Now</span>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${currentStep >= step.id ? 'text-charcoal' : 'text-gray-400'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep > step.id ? 'bg-green-500 text-white' :
                    currentStep === step.id ? 'text-white' : 'bg-gray-200 text-gray-400'
                  }`} style={currentStep === step.id ? { backgroundColor: color } : {}}>
                    {currentStep > step.id ? <Check size={14} /> : step.id}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${currentStep > step.id ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Service Type */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-charcoal">What are you looking for?</h2>
            <p className="text-sm text-muted">Select the type of service you need.</p>

            {business.settings?.allowOnlineBooking && (
              <div
                onClick={() => setServiceType('event')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  serviceType === 'event' ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={serviceType === 'event' ? { borderColor: color, backgroundColor: `${color}10` } : {}}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={serviceType === 'event' ? { backgroundColor: color, color: 'white' } : { backgroundColor: '#f3f4f6' }}>
                    <Calendar size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal">Event Booking</h3>
                    <p className="text-sm text-muted mt-0.5">Weddings, baby showers, birthdays, corporate events</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    serviceType === 'event' ? '' : 'border-gray-300'
                  }`} style={serviceType === 'event' ? { borderColor: color, backgroundColor: color } : {}}>
                    {serviceType === 'event' && <Check size={14} className="text-white" />}
                  </div>
                </div>
              </div>
            )}

            {business.settings?.allowCustomOrders && (
              <div
                onClick={() => setServiceType('custom_order')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  serviceType === 'custom_order' ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={serviceType === 'custom_order' ? { borderColor: color, backgroundColor: `${color}10` } : {}}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={serviceType === 'custom_order' ? { backgroundColor: color, color: 'white' } : { backgroundColor: '#f3f4f6' }}>
                    <Cake size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal">Custom Order</h3>
                    <p className="text-sm text-muted mt-0.5">Custom cakes, treats, candy tables, and specialty items</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center`} style={serviceType === 'custom_order' ? { borderColor: color, backgroundColor: color } : { borderColor: '#d1d5db' }}>
                    {serviceType === 'custom_order' && <Check size={14} className="text-white" />}
                  </div>
                </div>
              </div>
            )}

            {business.settings?.allowCatering && (
              <div
                onClick={() => setServiceType('catering')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  serviceType === 'catering' ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={serviceType === 'catering' ? { borderColor: color, backgroundColor: `${color}10` } : {}}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={serviceType === 'catering' ? { backgroundColor: color, color: 'white' } : { backgroundColor: '#f3f4f6' }}>
                    <ChefHat size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal">Catering</h3>
                    <p className="text-sm text-muted mt-0.5">Full-service catering for your event</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center`} style={serviceType === 'catering' ? { borderColor: color, backgroundColor: color } : { borderColor: '#d1d5db' }}>
                    {serviceType === 'catering' && <Check size={14} className="text-white" />}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-charcoal">Event Details</h2>
            <p className="text-sm text-muted">Tell us about your event.</p>

            {/* Package selection */}
            {business.packages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Select a Package</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {business.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPackageId === pkg.id ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'
                      }`}
                      style={selectedPackageId === pkg.id ? { borderColor: color } : {}}
                    >
                      <h4 className="font-semibold text-charcoal text-sm">{pkg.name}</h4>
                      <p className="text-xs text-muted mt-1 line-clamp-2">{pkg.description}</p>
                      <p className="font-bold text-sm mt-2">${pkg.price.toFixed(2)}{pkg.pricingType === 'per_person' ? '/person' : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service selection */}
            {business.services.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Select a Service</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <option value="">Choose a service...</option>
                  {business.services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} - ${s.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Event Type *</label>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                  <option value="">Select...</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Engagement Party">Engagement Party</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Event Date *</label>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Event Time</label>
                <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Guest Count *</label>
                <input type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)}
                  placeholder="50" min="1"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Venue / Location</label>
              <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)}
                placeholder="Event venue name or address"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Customizations / Special Requests</label>
              <textarea value={customizations} onChange={(e) => setCustomizations(e.target.value)}
                rows={3} placeholder="Any special requests, dietary needs, or customizations..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
            </div>
          </div>
        )}

        {/* Step 3: Customer Info */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-charcoal">Your Information</h2>
            <p className="text-sm text-muted">How can we reach you?</p>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name *</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Email *</label>
              <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Phone</label>
              <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Additional Notes</label>
              <textarea value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)}
                rows={3} placeholder="Anything else you'd like us to know..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-charcoal">Review Your Booking</h2>
            <p className="text-sm text-muted">Please review the details before submitting.</p>

            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              <div className="p-4 flex justify-between">
                <span className="text-sm text-muted">Service Type</span>
                <span className="text-sm font-medium text-charcoal capitalize">{serviceType.replace('_', ' ')}</span>
              </div>
              {eventType && (
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-muted">Event Type</span>
                  <span className="text-sm font-medium text-charcoal">{eventType}</span>
                </div>
              )}
              {eventDate && (
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-muted">Event Date</span>
                  <span className="text-sm font-medium text-charcoal">{new Date(eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
              {eventTime && (
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-muted">Event Time</span>
                  <span className="text-sm font-medium text-charcoal">{eventTime}</span>
                </div>
              )}
              {guestCount && (
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-muted">Guest Count</span>
                  <span className="text-sm font-medium text-charcoal">{guestCount}</span>
                </div>
              )}
              {venue && (
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-muted">Venue</span>
                  <span className="text-sm font-medium text-charcoal">{venue}</span>
                </div>
              )}
              <div className="p-4 flex justify-between">
                <span className="text-sm text-muted">Name</span>
                <span className="text-sm font-medium text-charcoal">{customerName}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-sm text-muted">Email</span>
                <span className="text-sm font-medium text-charcoal">{customerEmail}</span>
              </div>
              {customerPhone && (
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-muted">Phone</span>
                  <span className="text-sm font-medium text-charcoal">{customerPhone}</span>
                </div>
              )}
            </div>

            {business.settings?.requireDeposit && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>{business.settings.depositPercentage}% deposit</strong> required to confirm your booking.
                  Payment details will be provided after submission.
                </p>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-muted">
                I agree to the booking terms and conditions. I understand that submitting this form
                does not guarantee availability, and the business will confirm my booking.
              </span>
            </label>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 text-charcoal font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: canProceed() ? color : '#d1d5db' }}
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !agreedToTerms}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: agreedToTerms ? color : '#d1d5db' }}
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <>Submit Booking <Check size={16} /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
