import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bookingSchema } from '@/lib/validators/booking'
import { sendBookingNotificationToAdmin, sendBookingConfirmationToClient } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validation = bookingSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const { 
      name, 
      email, 
      phone, 
      eventType, 
      eventDate, 
      eventTime, 
      venue, 
      guestCount, 
      selectedPackage, 
      customizations,
      paymentMethod,
      agreedToTerms 
    } = validation.data

    // Generate unique booking reference
    const reference = 'BK-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase()

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        reference,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        eventType,
        eventDate: new Date(eventDate),
        eventTime: eventTime || null,
        venue,
        guestCount,
        packageName: selectedPackage,
        customizations: customizations || null,
        paymentMethod,
        status: 'pending',
        paymentStatus: 'awaiting_payment',
        agreedToTerms,
        // TODO: Calculate prices based on package
        totalPrice: null,
        depositAmount: null,
        balanceAmount: null,
      },
    })

    // Send email notifications (non-blocking)
    try {
      await Promise.all([
        sendBookingNotificationToAdmin({
          reference,
          customerName: name,
          customerEmail: email,
          eventType,
          eventDate: new Date(eventDate),
          packageName: selectedPackage,
        }),
        sendBookingConfirmationToClient({
          reference,
          name,
          email,
          eventType,
          eventDate: new Date(eventDate),
          packageName: selectedPackage,
        }),
      ])
    } catch (emailError) {
      console.error('Email notification error:', emailError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Booking submitted successfully',
        reference: booking.reference,
        bookingId: booking.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Booking submission error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
