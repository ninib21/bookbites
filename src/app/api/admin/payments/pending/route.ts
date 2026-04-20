import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const pendingPayments = await prisma.booking.findMany({
      where: {
        paymentStatus: 'submitted',
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        BookingEvent: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    })

    return NextResponse.json({
      success: true,
      count: pendingPayments.length,
      bookings: pendingPayments,
    })
  } catch (error) {
    console.error('GET /api/admin/payments/pending failed:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to fetch pending payments.',
      },
      { status: 500 }
    )
  }
}
