import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bookingLookupSchema } from '@/lib/validators/bookingLookup'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validation = bookingLookupSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const { reference, email } = validation.data

    // Look up booking by reference and email
    const booking = await prisma.booking.findFirst({
      where: {
        reference,
        customerEmail: email,
      },
      include: {
        BookingEvent: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { 
          error: 'Booking not found',
          message: 'No booking found with that reference and email'
        },
        { status: 404 }
      )
    }

    // Return booking details (exclude sensitive fields)
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
        packageName: booking.packageName,
        customerName: booking.customerName,
        createdAt: booking.createdAt,
        BookingEvent: booking.BookingEvent,
      },
    })
  } catch (error) {
    console.error('Booking lookup error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to lookup booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
