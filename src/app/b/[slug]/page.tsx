'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Cake, ChefHat, Star, MapPin, Phone, Mail, ArrowRight } from 'lucide-react'

interface BusinessData {
  id: string
  name: string
  slug: string
  description: string | null
  primaryColor: string
  address: string | null
  city: string | null
  state: string | null
  phone: string | null
  email: string
  settings: {
    allowOnlineBooking: boolean
    allowCustomOrders: boolean
    allowCatering: boolean
  } | null
  reviews: Array<{
    id: string
    customerName: string
    rating: number
    comment: string
    isFeatured: boolean
  }>
  galleryItems: Array<{
    id: string
    title: string
    imageUrl: string
    category: string
    isFeatured: boolean
  }>
  services: Array<{
    id: string
    name: string
    description: string | null
    price: number
    imageUrl: string | null
  }>
}

export default function BusinessPublicPage() {
  const params = useParams()
  const slug = params.slug as string
  const [business, setBusiness] = useState<BusinessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchBusiness()
  }, [slug])

  const fetchBusiness = async () => {
    try {
      const res = await fetch(`/api/business/${slug}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setBusiness(data.business)
        } else {
          setNotFound(true)
        }
      } else {
        setNotFound(true)
      }
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-300 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Business Not Found</h1>
          <p className="text-muted">This business page doesn&apos;t exist or is no longer active.</p>
        </div>
      </div>
    )
  }

  const color = business.primaryColor || '#D4A5B8'
  const featuredReviews = business.reviews.filter(r => r.isFeatured)
  const featuredGallery = business.galleryItems.filter(g => g.isFeatured)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-5 text-center" style={{ background: `linear-gradient(135deg, ${color}15 0%, white 50%, ${color}10 100%)` }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight mb-4">
            {business.name}
          </h1>
          {business.description && (
            <p className="text-lg text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
              {business.description}
            </p>
          )}

          {/* Location & Contact */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted mb-8">
            {business.city && business.state && (
              <div className="flex items-center gap-1.5">
                <MapPin size={16} /> {business.city}, {business.state}
              </div>
            )}
            {business.phone && (
              <div className="flex items-center gap-1.5">
                <Phone size={16} /> {business.phone}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Mail size={16} /> {business.email}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {business.settings?.allowOnlineBooking && (
              <Link
                href={`/b/${slug}/book`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors"
                style={{ backgroundColor: color }}
              >
                <Calendar size={18} /> Book an Event
              </Link>
            )}
            {business.settings?.allowCustomOrders && (
              <Link
                href={`/b/${slug}/order`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 transition-colors"
                style={{ borderColor: color, color }}
              >
                <Cake size={18} /> Custom Order
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      {business.services.length > 0 && (
        <section className="py-16 px-5 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-charcoal text-center mb-10">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {business.services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-charcoal mb-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-muted mb-3">{service.description}</p>
                  )}
                  <p className="font-bold text-charcoal">
                    ${service.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {featuredGallery.length > 0 && (
        <section className="py-16 px-5 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-charcoal text-center mb-10">Our Work</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredGallery.map((item) => (
                <div key={item.id} className="aspect-square rounded-xl overflow-hidden bg-gray-200">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {featuredReviews.length > 0 && (
        <section className="py-16 px-5 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-charcoal text-center mb-10">What Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="text-charcoal text-sm mb-3">&ldquo;{review.comment}&rdquo;</p>
                  <p className="text-xs text-muted font-medium">{review.customerName}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer */}
      <section className="py-16 px-5 text-center" style={{ background: `linear-gradient(135deg, ${color}20 0%, white 100%)` }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-charcoal mb-4">Ready to book?</h2>
          <p className="text-muted mb-6">Let us make your next event unforgettable.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {business.settings?.allowOnlineBooking && (
              <Link
                href={`/b/${slug}/book`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors"
                style={{ backgroundColor: color }}
              >
                Book Now <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white py-8 px-5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-display text-lg font-bold">{business.name}</p>
          <p className="text-sm text-gray-400 mt-1">Powered by BookBites</p>
        </div>
      </footer>
    </div>
  )
}
