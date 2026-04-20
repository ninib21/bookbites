import { z } from 'zod'

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  eventType: z.string().min(1, 'Event type is required'),
  eventDate: z.string().refine((val) => {
    const date = new Date(val)
    return date > new Date()
  }, 'Event date must be in the future'),
  guestCount: z.coerce.number().min(1).optional(),
  packageInterest: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type InquiryFormData = z.infer<typeof inquirySchema>
