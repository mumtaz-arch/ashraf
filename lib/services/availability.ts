import prisma from "@/lib/prisma"
import { BookingStatus } from "@prisma/client"

/**
 * Get available (non-blocked, non-confirmed) slots for a given date.
 */
export async function getAvailableSlots(date: Date) {
  // Get all non-blocked slots for this date
  const slots = await prisma.availabilitySlot.findMany({
    where: {
      date,
      isBlocked: false,
    },
    include: {
      bookings: {
        where: {
          status: BookingStatus.CONFIRMED,
        },
        select: { id: true },
      },
    },
    orderBy: { startTime: "asc" },
  })

  // Filter out slots that already have a confirmed booking
  return slots
    .filter((slot) => slot.bookings.length === 0)
    .map(({ bookings: _bookings, ...slot }) => slot)
}
