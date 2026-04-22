/**
 * Global Type Definitions - BookBites Vertical SaaS
 *
 * Shared TypeScript types used across the multi-tenant application.
 */

// Re-export Prisma types for convenience
export type {
  Business,
  BusinessSettings,
  BusinessUser,
  BusinessSession,
  VerificationToken,
  Service,
  BusinessPackage,
  BusinessBooking,
  BusinessBookingEvent,
  CustomOrder,
  OrderItem,
  MenuCategory,
  MenuItem,
  CateringProfile,
  Client,
  ClientCommunication,
  BusinessGalleryItem,
  BusinessReview,
  BusinessLead,
  Invoice,
  InvoiceLineItem,
  BusinessNotification,
  ContactMessage,
  SiteSetting,
  SubscriptionPlan,
} from '@prisma/client'

// ─── API Response types ───────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  error: string
  details?: string
}

// ─── Pagination types ─────────────────────────────────────────────

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Form status types ────────────────────────────────────────────

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

// ─── Business enum-like types (string enums for SQLite compat) ────

export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF'

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DECLINED'

export type PaymentStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'DECLINED'
  | 'REFUNDED'

export type PaymentMethod = 'MANUAL' | 'CARD' | 'CASHAPP' | 'CRYPTO' | 'APPLE_PAY'

export type OrderStatus =
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'READY'
  | 'PICKED_UP'
  | 'DELIVERED'
  | 'CANCELLED'

export type InvoiceStatus =
  | 'DRAFT'
  | 'SENT'
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'OVERDUE'
  | 'CANCELLED'

export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE'
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'TRIALING'

export type ClientTag = 'VIP' | 'REPEAT' | 'CORPORATE' | 'NEW' | 'LEAD'

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST'

// ─── Navigation types ─────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon?: string
  children?: NavItem[]
}

// ─── Dashboard session type ───────────────────────────────────────

export interface BusinessSessionData {
  userId: string
  email: string
  name: string | null
  role: UserRole
  businessId: string
  businessName: string
  businessSlug: string
  subscriptionTier: SubscriptionTier
}

// ─── Onboarding wizard types ──────────────────────────────────────

export interface OnboardingStep1Data {
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  description: string
}

export interface OnboardingStep2Data {
  allowOnlineBooking: boolean
  allowCustomOrders: boolean
  allowCatering: boolean
}

export interface OnboardingStep3Data {
  paymentMethods: PaymentMethod[]
  cashAppTag?: string
  cryptoWalletAddress?: string
}
