'use client'

import PageHero from '@/components/global/PageHero'
import SectionShell from '@/components/global/SectionShell'
import InquiryForm from '@/components/forms/InquiryForm'
import { Calendar, Mail, Phone, CheckCircle } from 'lucide-react'
import { packages } from '@/data/packages'

export default function InquirePage() {
  return (
    <div>
      <PageHero
        title="Get a Free Quote"
        subtitle="Tell us about your event and we'll create a custom sweet experience"
      />

      <SectionShell background="white" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <InquiryForm />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Quick Contact */}
            <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft">
              <h3 className="font-display text-xl font-bold text-charcoal mb-5">Quick Contact</h3>
              <div className="flex flex-col gap-4">
                {[
                  { icon: Mail, value: 'hello@prettypartysweets.com' },
                  { icon: Phone, value: '(555) 214-7789' },
                  { icon: Calendar, value: 'Response within 1–2 business days' },
                ].map((item) => (
                  <div key={item.value} className="flex items-center gap-3 text-sm text-muted">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-100 to-cream rounded-lg flex items-center justify-center text-primary-300 flex-shrink-0">
                      <item.icon size={16} strokeWidth={1.5} />
                    </div>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Packages */}
            <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-8 shadow-soft">
              <h3 className="font-display text-xl font-bold text-charcoal mb-5">Our Packages</h3>
              <div className="flex flex-col gap-5">
                {packages.map((pkg) => (
                  <div key={pkg.name} className="pb-5 border-b border-[#E8D5D5]/30 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-charcoal">{pkg.name}</h4>
                    <div className="text-2xl font-bold text-primary-300 my-1">{pkg.price}</div>
                    <p className="text-sm text-muted leading-relaxed">{pkg.description}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted italic text-center mt-4">
                Need something custom? We can create a package just for you!
              </p>
            </div>

            {/* What Happens Next */}
            <div className="bg-gradient-to-br from-primary-50 via-cream to-primary-100/50 rounded-2xl border border-primary-100/50 p-8">
              <h3 className="font-display text-xl font-bold text-charcoal mb-5">What Happens Next?</h3>
              <ol className="space-y-3">
                {[
                  'Submit your inquiry with event details',
                  "We'll review and contact you within 1–2 business days",
                  'Receive a custom quote tailored to your needs',
                  'Confirm your booking with a deposit',
                  'We create your sweet experience!',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-charcoal/80">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-primary-300 flex-shrink-0 text-xs font-bold shadow-soft">
                      {i + 1}
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  )
}
