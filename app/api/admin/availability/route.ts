import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { availabilityCreateSchema } from "@/lib/validations/availability"
import type { ApiResponse } from "@/types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    const where: Record<string, unknown> = {}
    if (dateParam) {
      where.date = new Date(dateParam + "T00:00:00.000Z")
    }

    const slots = await prisma.availabilitySlot.findMany({
      where,
      include: {
        bookings: {
          select: { id: true, status: true, referenceCode: true, customerName: true },
        },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    })

    const data = slots.map((s) => ({
      id: s.id,
      date: s.date.toISOString().split("T")[0],
      startTime: s.startTime,
      endTime: s.endTime,
      isBlocked: s.isBlocked,
      note: s.note,
      bookings: s.bookings,
    }))

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Found ${data.length} slot(s)`,
      data,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Failed to fetch slots:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to fetch slots" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()

    const parsed = availabilityCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors as Record<string, string[]> },
        { status: 400 }
      )
    }

    const data = parsed.data

    const slot = await prisma.availabilitySlot.create({
      data: {
        date: new Date(data.date + "T00:00:00.000Z"),
        startTime: data.startTime,
        endTime: data.endTime,
        isBlocked: data.isBlocked ?? false,
        note: data.note ?? null,
      },
    })

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Slot created",
        data: { ...slot, date: slot.date.toISOString().split("T")[0] },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Failed to create slot:", error)
    const message = (error as Error)?.message?.includes("Unique constraint")
      ? "A slot with this date and time already exists"
      : "Failed to create slot"
    return NextResponse.json<ApiResponse>(
      { success: false, message },
      { status: 422 }
    )
  }
}
