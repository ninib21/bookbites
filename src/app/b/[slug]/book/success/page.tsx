'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Calendar } from 'lucide-react'

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('ref')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-charcoal mb-2">Booking Submitted!</h1>
        <p className="text-muted mb-6">
          Your booking request has been received. The business will review and confirm your booking shortly.
        </p>

        {reference && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <p className="text-xs text-muted mb-1">Booking Reference</p>
            <p className="text-lg font-mono font-bold text-charcoal">{reference}</p>
          </div>
        )}

        <p className="text-sm text-muted mb-6">
          You&apos;ll receive a confirmation email at the address you provided.
          Please save your booking reference for future inquiries.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-300 text-white rounded-lg font-semibold hover:bg-primary-400 transition-colors"
        >
          <Calendar size={16} /> Back to Home
        </Link>
      </div>
    </div>
  )
}
