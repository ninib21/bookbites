'use client'

import Link from 'next/link'
import PageHero from '@/components/global/PageHero'
import SectionShell from '@/components/global/SectionShell'
import Button from '@/components/ui/Button'
import PaymentInstructions from '@/components/booking/PaymentInstructions'
import { CheckCircle } from 'lucide-react'

export default function BookingSuccessPage() {
  return (
    <div>
      <PageHero
        title="Booking Request Received!"
        subtitle="Thank you for choosing Pretty Party Sweets"
      />

      <SectionShell background="white" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-container mx-auto items-start">
          {/* Success Card */}
          <div className="bg-white rounded-2xl border border-[#E8D5D5]/50 p-10 shadow-soft text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary-300" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-8">
              Your Booking is Being Processed
            </h2>

            <div className="text-left mb-8">
              <h3 className="font-display text-xl font-bold text-primary-300 mb-5">
                What Happens Next?
              </h3>
              <ol className="list-decimal list-inside space-y-4 text-charcoal/80">
                <li><strong className="text-charcoal">Review:</strong> We&apos;ll review your booking request and check availability</li>
                <li><strong className="text-charcoal">Confirmation:</strong> You&apos;ll receive a confirmation email within 24 hours</li>
                <li><strong className="text-charcoal">Payment:</strong> Complete your payment to secure your date</li>
                <li><strong className="text-charcoal">Preparation:</strong> We&apos;ll start creating your sweet experience!</li>
              </ol>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button href="/booking/lookup" variant="primary" size="lg">
                Track Your Booking
              </Button>
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[56px] px-7 py-4 rounded-md border-2 border-primary-300 text-primary-300 font-semibold hover:bg-cream transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <PaymentInstructions />
          </div>
        </div>
      </SectionShell>
    </div>
  )
}
