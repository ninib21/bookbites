import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    const where: any = { businessId: session.businessId, isActive: true }
    if (tag && tag !== 'ALL') {
      where.tags = { contains: tag }
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ]
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        tags: true,
        source: true,
        lifetimeValue: true,
        totalBookings: true,
        totalOrders: true,
        lastContactAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: clients.map((c: any) => ({
        ...c,
        lastContactAt: c.lastContactAt?.toISOString() || null,
        createdAt: c.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Clients fetch error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
