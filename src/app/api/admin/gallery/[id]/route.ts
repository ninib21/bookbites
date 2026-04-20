import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// PATCH - Update gallery item
const updateGallerySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  imageUrl: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateGallerySchema.parse(body)

    const item = await prisma.galleryItem.update({
      where: { id },
      data: parsed,
    })

    return NextResponse.json({
      success: true,
      message: 'Gallery item updated successfully',
      item,
    })
  } catch (error) {
    console.error('PATCH /api/admin/gallery/[id] error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid data', errors: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update gallery item' },
      { status: 500 }
    )
  }
}

// DELETE - Delete gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.galleryItem.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully',
    })
  } catch (error) {
    console.error('DELETE /api/admin/gallery/[id] error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete gallery item' },
      { status: 500 }
    )
  }
}
