import { BookingStatus } from "@prisma/client"

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  RESCHEDULED: "Rescheduled",
}

export const REFERENCE_CODE_PREFIX = "PA"
export const REFERENCE_CODE_LENGTH = 6

export const SITE_NAME = "Ashraf"
export const SITE_DESCRIPTION =
  "Professional photography booking made simple. Browse packages, pick your date, and book your session in minutes."
