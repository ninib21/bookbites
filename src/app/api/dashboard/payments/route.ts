import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/dashboard/payments
export async function GET() {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await prisma.businessBooking.findMany({
      where: { businessId: session.businessId, totalPrice: { not: null } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reference: true,
        customerName: true,
        paymentMethod: true,
        paymentStatus: true,
        createdAt: true,
        totalPrice: true,
      },
      take: 50,
    })

    const payments = bookings.map((b: any) => ({
      id: b.id,
      reference: b.reference,
      amount: b.totalPrice || 0,
      method: b.paymentMethod,
      status: b.paymentStatus,
      createdAt: b.createdAt.toISOString(),
      bookingRef: b.reference,
      clientName: b.customerName,
    }))

    return NextResponse.json({ success: true, payments })
  } catch (error) {
    console.error('Payments GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
  }
}
