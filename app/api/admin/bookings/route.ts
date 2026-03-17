import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import type { ApiResponse } from "@/types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { referenceCode: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search } },
      ]
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: { select: { name: true } },
        slot: { select: { startTime: true, endTime: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const data = bookings.map((b) => ({
      id: b.id,
      referenceCode: b.referenceCode,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      customerEmail: b.customerEmail,
      serviceName: b.service.name,
      bookingDate: b.bookingDate.toISOString().split("T")[0],
      startTime: b.slot.startTime,
      endTime: b.slot.endTime,
      status: b.status,
      createdAt: b.createdAt.toISOString(),
    }))

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Found ${data.length} booking(s)`,
      data,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Failed to fetch bookings:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
