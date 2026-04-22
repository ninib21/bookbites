import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, eventType, eventDate, guestCount, message } = body

    if (!name || !email || !eventType) {
      return NextResponse.json({ error: 'Name, email, and event type are required' }, { status: 400 })
    }

    // In the new SaaS model, inquiries need a business context
    // For the landing site contact form, we store as a ContactMessage
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: `Inquiry: ${eventType}`,
        message: [
          `Event Type: ${eventType}`,
          eventDate ? `Event Date: ${eventDate}` : '',
          guestCount ? `Guest Count: ${guestCount}` : '',
          phone ? `Phone: ${phone}` : '',
          '',
          message || '',
        ].filter(Boolean).join('\n'),
        status: 'unread',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully',
      id: contactMessage.id,
    }, { status: 201 })
  } catch (error) {
    console.error('Inquiry submission error:', error)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
