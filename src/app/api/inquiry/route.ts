import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { inquirySchema } from '@/lib/validators/inquiry'
import { sendInquiryNotificationToAdmin, sendInquiryConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validation = inquirySchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const { name, email, phone, eventType, eventDate, guestCount, packageInterest, budget, message } = validation.data

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        eventType,
        eventDate: new Date(eventDate),
        guestCount: guestCount || null,
        packageInterest: packageInterest || null,
        budget: budget || null,
        message: message || null,
        status: 'new',
        source: 'website',
      },
    })

    // Send email notifications (non-blocking)
    try {
      await Promise.all([
        sendInquiryNotificationToAdmin({
          name,
          email,
          eventType,
          eventDate: new Date(eventDate),
          message: message || undefined,
        }),
        sendInquiryConfirmation({ name, email }),
      ])
    } catch (emailError) {
      console.error('Email notification error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        leadId: lead.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Inquiry submission error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit inquiry',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
