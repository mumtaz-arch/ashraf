import prisma from "@/lib/prisma"
import { BookingStatus } from "@prisma/client"
import { REFERENCE_CODE_PREFIX, REFERENCE_CODE_LENGTH } from "@/constants"

/**
 * Generate a unique booking reference code (e.g. PA-A3F9K2)
 */
function generateReferenceCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < REFERENCE_CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${REFERENCE_CODE_PREFIX}-${code}`
}

/**
 * Ensure the generated reference code is unique in the database.
 */
async function getUniqueReferenceCode(): Promise<string> {
  let code = generateReferenceCode()
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const existing = await prisma.booking.findUnique({
      where: { referenceCode: code },
      select: { id: true },
    })
    if (!existing) return code
    code = generateReferenceCode()
    attempts++
  }

  throw new Error("Failed to generate unique reference code")
}

interface CreateBookingInput {
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceId: string
  slotId: string
  bookingDate: Date
  startTime: string
  customerNote?: string
}

/**
 * Create a new booking with pending status.
 * Validates the slot is still available before creating.
 */
export async function createBooking(input: CreateBookingInput) {
  const referenceCode = await getUniqueReferenceCode()

  // Use a transaction to check slot availability and create booking atomically
  return prisma.$transaction(async (tx) => {
    // Check slot exists and is not blocked
    const slot = await tx.availabilitySlot.findUnique({
      where: { id: input.slotId },
      include: {
        bookings: {
          where: {
            status: {
              in: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
            },
          },
          select: { id: true, status: true },
        },
      },
    })

    if (!slot) {
      throw new Error("Selected time slot does not exist")
    }

    if (slot.isBlocked) {
      throw new Error("Selected time slot is no longer available")
    }

    // Check for confirmed bookings on this slot
    const hasConfirmed = slot.bookings.some(
      (b) => b.status === BookingStatus.CONFIRMED
    )
    if (hasConfirmed) {
      throw new Error("This time slot has already been booked")
    }

    // Validate the service exists and is active
    const service = await tx.service.findUnique({
      where: { id: input.serviceId },
      select: { id: true, isActive: true, name: true },
    })

    if (!service || !service.isActive) {
      throw new Error("Selected service is not available")
    }

    // Create the booking
    const booking = await tx.booking.create({
      data: {
        referenceCode,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail || null,
        serviceId: input.serviceId,
        slotId: input.slotId,
        bookingDate: input.bookingDate,
        startTime: input.startTime,
        customerNote: input.customerNote || null,
        status: BookingStatus.PENDING,
      },
      include: {
        service: { select: { name: true } },
      },
    })

    return {
      id: booking.id,
      referenceCode: booking.referenceCode,
      status: booking.status,
      customerName: booking.customerName,
      bookingDate: booking.bookingDate.toISOString().split("T")[0],
      startTime: booking.startTime,
      serviceName: booking.service.name,
    }
  })
}
