import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/dashboard/services - List services for business
export async function GET() {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const services = await prisma.service.findMany({
      where: { businessId: session.businessId },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })

    return NextResponse.json({ success: true, services })
  } catch (error) {
    console.error('Services list error:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

// POST /api/dashboard/services - Create service
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, category, isActive, imageUrl, duration } = body

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        businessId: session.businessId,
        name,
        description: description || '',
        price: parseFloat(price),
        category: category || 'General',
        isActive: isActive !== false,
        imageUrl: imageUrl || null,
        duration: duration || 60,
        sortOrder: 0,
      },
    })

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('Service create error:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
