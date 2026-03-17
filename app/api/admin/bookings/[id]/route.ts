import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { BookingStatus } from "@prisma/client"
import type { ApiResponse } from "@/types"

export const dynamic = "force-dynamic"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        slot: true,
      },
    })

    if (!booking) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Booking retrieved",
      data: {
        ...booking,
        bookingDate: booking.bookingDate.toISOString().split("T")[0],
        service: {
          ...booking.service,
          price: Number(booking.service.price),
        },
        slot: {
          ...booking.slot,
          date: booking.slot.date.toISOString().split("T")[0],
        },
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Failed to fetch booking:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to fetch booking" },
      { status: 500 }
    )
  }
}

const VALID_TRANSITIONS: Record<string, BookingStatus[]> = {
  PENDING: [BookingStatus.CONFIRMED, BookingStatus.REJECTED, BookingStatus.CANCELLED],
  CONFIRMED: [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.RESCHEDULED],
  REJECTED: [],
  CANCELLED: [],
  COMPLETED: [],
  RESCHEDULED: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const { status, adminNote } = body

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { status: true, slotId: true },
    })

    if (!booking) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Booking not found" },
        { status: 404 }
      )
    }

    // Validate status transition
    if (status) {
      const allowed = VALID_TRANSITIONS[booking.status] || []
      if (!allowed.includes(status)) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: `Cannot transition from ${booking.status} to ${status}`,
          },
          { status: 400 }
        )
      }

      // If confirming, revalidate slot availability
      if (status === BookingStatus.CONFIRMED) {
        const conflicting = await prisma.booking.findFirst({
          where: {
            slotId: booking.slotId,
            status: BookingStatus.CONFIRMED,
            id: { not: id },
          },
        })
        if (conflicting) {
          return NextResponse.json<ApiResponse>(
            { success: false, message: "This slot already has a confirmed booking" },
            { status: 409 }
          )
        }
      }
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (adminNote !== undefined) updateData.adminNote = adminNote

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { service: { select: { name: true } } },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Booking ${status ? `updated to ${status}` : "updated"}`,
      data: {
        id: updated.id,
        referenceCode: updated.referenceCode,
        status: updated.status,
        adminNote: updated.adminNote,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Failed to update booking:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to update booking" },
      { status: 500 }
    )
  }
}
