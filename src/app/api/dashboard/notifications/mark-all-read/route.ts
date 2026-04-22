import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PUT /api/dashboard/notifications/mark-all-read
export async function PUT() {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.businessNotification.updateMany({
      where: { businessId: session.businessId, isRead: false },
      data: { isRead: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mark-all-read error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
