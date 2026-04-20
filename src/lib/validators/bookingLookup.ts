import { z } from 'zod'

export const bookingLookupSchema = z.object({
  reference: z.string().min(1, 'Booking reference is required'),
  email: z.string().email('Invalid email address'),
})

export type BookingLookupData = z.infer<typeof bookingLookupSchema>
