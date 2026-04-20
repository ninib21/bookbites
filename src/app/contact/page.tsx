'use client'

import PageHero from '@/components/global/PageHero'
import SectionShell from '@/components/global/SectionShell'
import ContactForm from '@/components/forms/ContactForm'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { siteInfo } from '@/data/nav'

export default function ContactPage() {
  return (
    <div>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch — we'd love to hear from you!"
      />

      <SectionShell background="white" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl font-bold text-charcoal mb-6">
              Send Us a Message
            </h2>
            <ContactForm />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-5">
            {[
              { icon: Mail, label: 'Email', value: siteInfo.email, color: 'from-primary-200 to-primary-100' },
              { icon: Phone, label: 'Phone', value: siteInfo.phone, color: 'from-cream to-primary-50' },
              { icon: MapPin, label: 'Location', value: siteInfo.location, color: 'from-primary-100 to-cream' },
              { icon: Clock, label: 'Business Hours', value: siteInfo.hours.weekday, color: 'from-primary-50 to-primary-100' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 p-5 bg-gradient-to-br from-white to-cream/50 rounded-2xl border border-[#E8D5D5]/50 shadow-soft">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-primary-300 flex-shrink-0`}>
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal text-sm">{item.label}</h3>
                  <p className="text-muted text-sm mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    </div>
  )
}
