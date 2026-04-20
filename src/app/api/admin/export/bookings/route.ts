import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Export bookings as CSV
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const where = status && status !== 'all' ? { status } : {}
    
    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Create CSV content
    const headers = [
      'Reference',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Event Type',
      'Event Date',
      'Event Time',
      'Venue',
      'Guest Count',
      'Package',
      'Total Price',
      'Payment Method',
      'Payment Status',
      'Booking Status',
      'Created At',
    ]
    
    const rows = bookings.map((booking: any) => [
      booking.reference,
      booking.customerName,
      booking.customerEmail,
      booking.customerPhone || '',
      booking.eventType,
      new Date(booking.eventDate).toLocaleDateString(),
      booking.eventTime || '',
      booking.venue || '',
      booking.guestCount,
      booking.packageName,
      booking.totalPrice || '',
      booking.paymentMethod,
      booking.paymentStatus,
      booking.status,
      new Date(booking.createdAt).toLocaleDateString(),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(','))
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="bookings_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export bookings error:', error)
    return NextResponse.json(
      { error: 'Failed to export bookings' },
      { status: 500 }
    )
  }
}
