import { PrismaClient } from '@prisma/client'

// Explicit model delegates to prevent IDE stale-cache false positives.
// The generated Prisma client has these properties at runtime;
// this type ensures the IDE always sees them even if its
// language server caches an outdated version of the types.
interface PrismaModelDelegates {
  business: any
  businessUser: any
  businessSession: any
  businessSettings: any
  service: any
  businessBooking: any
  businessBookingEvent: any
  customOrder: any
  businessPackage: any
  menuCategory: any
  menuItem: any
  cateringProfile: any
  client: any
  invoice: any
  businessGalleryItem: any
  businessReview: any
  businessLead: any
  businessNotification: any
  verificationToken: any
}

type TypedPrismaClient = PrismaClient & PrismaModelDelegates

const globalForPrisma = globalThis as unknown as {
  prisma: TypedPrismaClient | undefined
}

export const prisma: TypedPrismaClient = globalForPrisma.prisma ?? new PrismaClient() as TypedPrismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

