import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPaymentConfirmationToClient } from '@/lib/email'

// POST - Confirm payment received
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Get current booking
    const currentBooking = await prisma.booking.findUnique({
      where: { id },
    })

    if (!currentBooking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    if (currentBooking.paymentStatus !== 'submitted') {
      return NextResponse.json(
        { success: false, message: 'Payment is not in submitted status' },
        { status: 400 }
      )
    }

    // Update booking
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        paymentStatus: 'approved',
        status: 'confirmed',
        paymentReviewedAt: new Date(),
        BookingEvent: {
          create: {
            type: 'payment_approved',
            note: 'Payment approved by admin. Booking is now fully secured.',
          },
        },
      },
      include: {
        BookingEvent: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    // Send confirmation email to client
    try {
      await sendPaymentConfirmationToClient({
        reference: booking.reference,
        name: booking.customerName,
        email: booking.customerEmail,
        amount: booking.totalPrice || undefined,
      })
    } catch (emailError) {
      console.error('Failed to send payment confirmation email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed successfully. Client has been notified.',
      booking,
    })
  } catch (error) {
    console.error('Confirm payment error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
