import { NextRequest, NextResponse } from "next/server"
import { bookingFormSchema } from "@/lib/validations/booking"
import { createBooking } from "@/lib/services/booking"
import type { ApiResponse, BookingResult } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const parsed = bookingFormSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".")
        if (!fieldErrors[field]) fieldErrors[field] = []
        fieldErrors[field].push(issue.message)
      }

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Validation failed",
          errors: fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = parsed.data

    const result = await createBooking({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      serviceId: data.serviceId,
      slotId: data.slotId,
      bookingDate: new Date(data.bookingDate + "T00:00:00.000Z"),
      startTime: data.startTime,
      customerNote: data.customerNote,
    })

    return NextResponse.json<ApiResponse<BookingResult>>(
      {
        success: true,
        message: "Booking request submitted successfully",
        data: result,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create booking:", error)

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create booking"

    return NextResponse.json<ApiResponse>(
      { success: false, message },
      { status: 422 }
    )
  }
}
