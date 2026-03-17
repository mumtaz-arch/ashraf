import { NextRequest, NextResponse } from "next/server"
import { getAvailableSlots } from "@/lib/services/availability"
import type { ApiResponse, AvailableSlot } from "@/types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid or missing date parameter. Use format: YYYY-MM-DD",
        },
        { status: 400 }
      )
    }

    const date = new Date(dateParam + "T00:00:00.000Z")

    if (isNaN(date.getTime())) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid date" },
        { status: 400 }
      )
    }

    const slots = await getAvailableSlots(date)

    const data: AvailableSlot[] = slots.map((s) => ({
      id: s.id,
      date: s.date.toISOString().split("T")[0],
      startTime: s.startTime,
      endTime: s.endTime,
    }))

    return NextResponse.json<ApiResponse<AvailableSlot[]>>({
      success: true,
      message: `Found ${data.length} available slot(s)`,
      data,
    })
  } catch (error) {
    console.error("Failed to fetch availability:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to fetch availability" },
      { status: 500 }
    )
  }
}
