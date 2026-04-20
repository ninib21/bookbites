import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Export leads as CSV
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const where = status && status !== 'all' ? { status } : {}
    
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Event Type', 'Event Date', 'Guest Count', 'Package Interest', 'Budget', 'Status', 'Created At']
    
    const rows = leads.map((lead: any) => [
      lead.name,
      lead.email,
      lead.phone || '',
      lead.eventType,
      new Date(lead.eventDate).toLocaleDateString(),
      lead.guestCount || '',
      lead.packageInterest || '',
      lead.budget || '',
      lead.status,
      new Date(lead.createdAt).toLocaleDateString(),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(','))
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export leads error:', error)
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    )
  }
}
