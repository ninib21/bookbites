import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// PATCH - Update package
const updatePackageSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(1000).optional(),
  price: z.number().min(0).optional(),
  features: z.array(z.string()).optional(),
  image: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Parse features if it's a string
    if (typeof body.features === 'string') {
      body.features = body.features.split('\n').filter((f: string) => f.trim())
    }
    
    // Convert price to number if provided
    if (body.price !== undefined) {
      body.price = parseFloat(body.price)
    }
    if (body.sortOrder !== undefined) {
      body.sortOrder = parseInt(body.sortOrder) || 0
    }
    
    const parsed = updatePackageSchema.parse(body)

    // If slug is being updated, check for duplicates
    if (parsed.slug) {
      const existing = await prisma.package.findFirst({
        where: {
          slug: parsed.slug,
          NOT: { id },
        },
      })

      if (existing) {
        return NextResponse.json(
          { success: false, message: 'A package with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Convert features array to JSON string if provided
    const updateData: any = { ...parsed }
    if (parsed.features) {
      updateData.features = JSON.stringify(parsed.features)
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Package updated successfully',
      package: pkg,
    })
  } catch (error) {
    console.error('PATCH /api/admin/packages/[id] error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid data', errors: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update package' },
      { status: 500 }
    )
  }
}

// DELETE - Delete package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.package.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    })
  } catch (error) {
    console.error('DELETE /api/admin/packages/[id] error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete package' },
      { status: 500 }
    )
  }
}
