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
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = { businessId: session.businessId }
    if (status && status !== 'ALL') where.status = status
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { customerEmail: { contains: search } },
        { reference: { contains: search } },
      ]
    }

    const orders = await prisma.customOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        reference: true,
        customerName: true,
        customerEmail: true,
        orderType: true,
        status: true,
        total: true,
        pickupDate: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: orders.map((o: any) => ({
        ...o,
        pickupDate: o.pickupDate?.toISOString() || null,
        createdAt: o.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
