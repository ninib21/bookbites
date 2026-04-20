'use client'

import PageHero from '@/components/global/PageHero'
import SectionShell from '@/components/global/SectionShell'
import BookingForm from '@/components/forms/BookingForm'
import { Calendar, Shield, CreditCard, HelpCircle, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export default function BookingPage() {
  return (
    <div>
      <PageHero
        title="Book Your Event"
        subtitle="Ready to make your celebration sweet? Book your dessert experience today."
      />

      <SectionShell background="white" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
          {/* Form */}
          <div className="min-w-0">
            <BookingForm />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Booking Process */}
            <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft">
              <h3 className="font-display text-xl font-bold text-charcoal mb-5">
                Booking Process
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-sm text-muted">
                <li>Fill out the booking form</li>
                <li>We review and confirm availability</li>
                <li>Receive confirmation email</li>
                <li>Make payment (deposit or full)</li>
                <li>We prepare your sweet experience!</li>
              </ol>
            </div>

            {/* Why Book With Us */}
            <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft">
              <h3 className="font-display text-xl font-bold text-charcoal mb-5">
                Why Book With Us?
              </h3>
              <div className="flex flex-col gap-5">
                {[
                  { icon: Calendar, title: 'Flexible Scheduling', desc: 'Book weeks or months in advance' },
                  { icon: Shield, title: 'Secure Booking', desc: 'Your date is reserved with deposit' },
                  { icon: CreditCard, title: 'Payment Options', desc: 'Pay deposit now, balance later' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-cream rounded-xl flex items-center justify-center text-primary-300 flex-shrink-0">
                      <item.icon size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-charcoal">{item.title}</h4>
                      <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-br from-primary-50 via-cream to-primary-100/50 rounded-2xl border border-primary-100/50 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-300 shadow-soft">
                  <HelpCircle size={18} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-bold text-charcoal">Need Help?</h3>
              </div>
              <p className="text-muted text-sm mb-5 leading-relaxed">
                Have questions before booking? Contact us and we&apos;ll be happy to assist.
              </p>
              <div className="flex flex-col gap-2.5">
                <Link href="/contact" className="flex items-center gap-2 text-sm text-primary-300 font-semibold hover:text-primary-400 transition-colors">
                  <Mail size={14} /> Contact Us
                </Link>
                <Link href="/faq" className="flex items-center gap-2 text-sm text-primary-300 font-semibold hover:text-primary-400 transition-colors">
                  <Phone size={14} /> View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  )
}
