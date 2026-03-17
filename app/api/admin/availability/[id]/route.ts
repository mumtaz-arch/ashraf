import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { availabilityUpdateSchema } from "@/lib/validations/availability"
import type { ApiResponse } from "@/types"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()

    const parsed = availabilityUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors as Record<string, string[]> },
        { status: 400 }
      )
    }

    const data = parsed.data
    const updateData: Record<string, unknown> = {}
    if (data.date) updateData.date = new Date(data.date + "T00:00:00.000Z")
    if (data.startTime) updateData.startTime = data.startTime
    if (data.endTime) updateData.endTime = data.endTime
    if (data.isBlocked !== undefined) updateData.isBlocked = data.isBlocked
    if (data.note !== undefined) updateData.note = data.note || null

    const slot = await prisma.availabilitySlot.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Slot updated",
      data: { ...slot, date: slot.date.toISOString().split("T")[0] },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Failed to update slot:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to update slot" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    // Check if slot has any bookings
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id },
      include: { bookings: { select: { id: true } } },
    })

    if (!slot) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Slot not found" },
        { status: 404 }
      )
    }

    if (slot.bookings.length > 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Cannot delete slot with existing bookings" },
        { status: 409 }
      )
    }

    await prisma.availabilitySlot.delete({ where: { id } })

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Slot deleted",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Failed to delete slot:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to delete slot" },
      { status: 500 }
    )
  }
}
