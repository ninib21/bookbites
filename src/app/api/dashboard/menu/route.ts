import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/dashboard/menu
export async function GET() {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.menuItem.findMany({
      where: { businessId: session.businessId },
      include: { category: { select: { name: true } } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })

    return NextResponse.json({
      success: true,
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category?.name || 'General',
        isAvailable: item.isAvailable,
        image: item.imageUrl,
        sortOrder: item.sortOrder,
        tags: item.dietaryFlags,
      })),
    })
  } catch (error) {
    console.error('Menu GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 })
  }
}

// POST /api/dashboard/menu
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, category, isAvailable, tags } = body

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }

    // Find or create the menu category
    let categoryId: string | undefined
    if (category) {
      const existing = await prisma.menuCategory.findFirst({
        where: { businessId: session.businessId, name: category },
      })
      if (existing) {
        categoryId = existing.id
      } else {
        const newCat = await prisma.menuCategory.create({
          data: { businessId: session.businessId, name: category },
        })
        categoryId = newCat.id
      }
    }

    // If no category, find or create "General"
    if (!categoryId) {
      const general = await prisma.menuCategory.findFirst({
        where: { businessId: session.businessId, name: 'General' },
      })
      if (general) {
        categoryId = general.id
      } else {
        const newCat = await prisma.menuCategory.create({
          data: { businessId: session.businessId, name: 'General' },
        })
        categoryId = newCat.id
      }
    }

    const item = await prisma.menuItem.create({
      data: {
        categoryId,
        businessId: session.businessId,
        name,
        description: description || '',
        price: parseFloat(price),
        isActive: true,
        isAvailable: isAvailable !== false,
        dietaryFlags: tags || null,
        sortOrder: 0,
      },
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Menu POST error:', error)
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 })
  }
}
