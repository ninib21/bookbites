import { z } from 'zod'

export const bookingSchema = z.object({
  // Customer Info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be valid'),
  
  // Event Details
  eventType: z.string().min(1, 'Event type is required'),
  eventDate: z.string().refine((val) => {
    const date = new Date(val)
    return date > new Date()
  }, 'Event date must be in the future'),
  eventTime: z.string().optional(),
  venue: z.string().min(2, 'Venue is required'),
  guestCount: z.coerce.number().min(1, 'Guest count must be at least 1'),
  
  // Package Selection
  selectedPackage: z.string().min(1, 'Package selection is required'),
  customizations: z.string().optional(),
  
  // Payment
  paymentMethod: z.enum(['deposit', 'full']),
  agreedToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
})

export type BookingFormData = z.infer<typeof bookingSchema>
