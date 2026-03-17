import { BookingStatus } from "@prisma/client"

// ─── API Response Types ──────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

// ─── Service Types ───────────────────────────────────

export interface ServiceItem {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  durationMinutes: number
  isActive: boolean
}

// ─── Availability Types ──────────────────────────────

export interface AvailableSlot {
  id: string
  date: string       // ISO date string
  startTime: string  // "HH:mm"
  endTime: string    // "HH:mm"
}

// ─── Booking Types ───────────────────────────────────

export interface BookingRequest {
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceId: string
  slotId: string
  bookingDate: string  // "YYYY-MM-DD"
  startTime: string    // "HH:mm"
  customerNote?: string
}

export interface BookingResult {
  id: string
  referenceCode: string
  status: BookingStatus
  customerName: string
  bookingDate: string
  startTime: string
  serviceName: string
}
