import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validators/contact'
import { sendContactNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validation = contactSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validation.data

    // Create contact message in database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'unread',
      },
    })

    // Send email notification to admin (non-blocking)
    try {
      await sendContactNotification({
        name,
        email,
        subject,
        message,
      })
    } catch (emailError) {
      console.error('Email notification error:', emailError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        messageId: contactMessage.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
