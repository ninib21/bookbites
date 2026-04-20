'use client'

import PageHero from '@/components/global/PageHero'
import SectionShell from '@/components/global/SectionShell'
import BookingLookupForm from '@/components/forms/BookingLookupForm'
import { HelpCircle, Mail, Phone } from 'lucide-react'

export default function BookingLookupPage() {
  return (
    <div>
      <PageHero
        title="Track Your Booking"
        subtitle="Enter your booking reference to check the status"
      />

      <SectionShell background="white" spacing="lg">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          <BookingLookupForm />

          <div className="bg-gradient-to-br from-primary-50 via-cream to-primary-100/50 rounded-2xl border border-primary-100/50 p-8 text-center">
            <div className="w-14 h-14 mx-auto bg-white rounded-2xl flex items-center justify-center text-primary-300 shadow-soft mb-4">
              <HelpCircle size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal mb-2">Need Help?</h3>
            <p className="text-muted text-sm mb-5">Can&apos;t find your booking or have questions? We&apos;re here to help!</p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-center gap-2.5 text-sm text-muted">
                <Mail size={16} className="text-primary-300" />
                <span>hello@prettypartysweets.com</span>
              </div>
              <div className="flex items-center justify-center gap-2.5 text-sm text-muted">
                <Phone size={16} className="text-primary-300" />
                <span>(555) 214-7789</span>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  )
}
