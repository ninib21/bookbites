import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/dashboard/invoices
export async function GET() {
  try {
    const session = await getSession()
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invoices = await prisma.invoice.findMany({
      where: { businessId: session.businessId },
      orderBy: { createdAt: 'desc' },
      include: { client: { select: { name: true } } },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      invoices: invoices.map((inv: any) => ({
        id: inv.id,
        number: inv.invoiceNumber,
        clientName: inv.client?.name || inv.billToName,
        amount: inv.total,
        status: inv.status,
        dueDate: inv.dueDate?.toISOString() || '',
        createdAt: inv.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Invoices GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}
