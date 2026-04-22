import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PUT /api/dashboard/menu/[id] - Update menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const existing = await prisma.menuItem.findUnique({ where: { id } })
    if (!existing || existing.businessId !== session.businessId) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 })
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable }),
        ...(body.tags !== undefined && { dietaryFlags: body.tags }),
      },
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Menu item update error:', error)
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 })
  }
}

// DELETE /api/dashboard/menu/[id] - Delete menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.menuItem.findUnique({ where: { id } })
    if (!existing || existing.businessId !== session.businessId) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 })
    }

    await prisma.menuItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Menu item delete error:', error)
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 })
  }
}
