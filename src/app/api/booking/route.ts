import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Legacy booking endpoint - redirects to the new multi-tenant flow
// For backwards compatibility with the old marketplace booking form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, eventType, eventDate, eventTime, venue, guestCount, selectedPackage, customizations, paymentMethod, agreedToTerms } = body

    if (!name || !email || !eventType || !eventDate || !guestCount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // This legacy endpoint creates bookings without a business context
    // In the new SaaS model, bookings must be associated with a business
    // Redirect users to the new booking flow at /b/[slug]/book
    return NextResponse.json({
      success: false,
      error: 'This endpoint is deprecated. Please use the business booking page at /b/[slug]/book',
    }, { status: 410 })
  } catch (error) {
    console.error('Booking submission error:', error)
    return NextResponse.json({ error: 'Failed to submit booking' }, { status: 500 })
  }
}
