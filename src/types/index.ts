/**
 * Global Type Definitions
 * 
 * This file exports shared TypeScript types used across the application.
 * Types specific to a single component/module should remain co-located.
 */

// Re-export Prisma types for convenience
export type {
  Booking,
  BookingEvent,
  ContactMessage,
  GalleryItem,
  Lead,
  Package,
  Review,
  SiteSetting,
  AdminUser,
} from '@prisma/client'

// API Response types
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

// Pagination types
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

// Form status types
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

// Payment types
export type PaymentMethod = 'cashapp' | 'chime' | 'applepay' | 'deposit'
export type PaymentStatus = 'pending' | 'awaiting_payment' | 'submitted' | 'approved' | 'declined'

// Booking types
export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled'

// Navigation types
export interface NavItem {
  label: string
  href: string
  icon?: string
  children?: NavItem[]
}
