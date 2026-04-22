import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const businessId = session.businessId

    // Parallel queries for dashboard stats
    const [
      totalBookings,
      pendingBookings,
      revenueResult,
      activeClients,
      recentBookings,
      notifications,
    ] = await Promise.all([
      prisma.businessBooking.count({ where: { businessId } }),
      prisma.businessBooking.count({ where: { businessId, status: 'PENDING' } }),
      prisma.businessBooking.aggregate({
        where: { businessId, paymentStatus: 'CONFIRMED' },
        _sum: { totalPrice: true },
      }),
      prisma.client.count({ where: { businessId, isActive: true } }),
      prisma.businessBooking.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          reference: true,
          customerName: true,
          eventType: true,
          eventDate: true,
          status: true,
          totalPrice: true,
        },
      }),
      prisma.businessNotification.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          message: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      totalBookings,
      pendingBookings,
      totalRevenue: revenueResult._sum.totalPrice || 0,
      activeClients,
      recentBookings: recentBookings.map((b: any) => ({
        ...b,
        eventDate: b.eventDate.toISOString(),
        totalPrice: b.totalPrice ? Number(b.totalPrice) : null,
      })),
      notifications: notifications.map((n: any) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
