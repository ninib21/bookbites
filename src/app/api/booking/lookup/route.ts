import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Lookup a booking by reference + email (public, for client status check)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference, email } = body

    if (!reference || !email) {
      return NextResponse.json({ error: 'Reference and email are required' }, { status: 400 })
    }

    const booking = await prisma.businessBooking.findFirst({
      where: {
        reference,
        customerEmail: email,
      },
      include: {
        events: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'No booking found with that reference and email' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      booking: {
        reference: booking.reference,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        eventDate: booking.eventDate,
        eventTime: booking.eventTime,
        eventType: booking.eventType,
        venue: booking.venue,
        guestCount: booking.guestCount,
        customerName: booking.customerName,
        totalPrice: booking.totalPrice,
        depositAmount: booking.depositAmount,
        balanceAmount: booking.balanceAmount,
        createdAt: booking.createdAt,
        events: booking.events,
      },
    })
  } catch (error) {
    console.error('Booking lookup error:', error)
    return NextResponse.json({ error: 'Failed to lookup booking' }, { status: 500 })
  }
}
