import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { serviceUpdateSchema } from "@/lib/validations/service"
import type { ApiResponse } from "@/types"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()

    const parsed = serviceUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors as Record<string, string[]> },
        { status: 400 }
      )
    }

    const service = await prisma.service.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Service updated",
      data: { ...service, price: Number(service.price) },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Failed to update service:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to update service" },
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

    const service = await prisma.service.findUnique({
      where: { id },
      include: { bookings: { select: { id: true }, take: 1 } },
    })

    if (!service) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Service not found" },
        { status: 404 }
      )
    }

    if (service.bookings.length > 0) {
      // Soft-delete: deactivate instead of hard-deleting
      await prisma.service.update({
        where: { id },
        data: { isActive: false },
      })
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Service deactivated (has existing bookings)",
      })
    }

    await prisma.service.delete({ where: { id } })

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Service deleted",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Failed to delete service:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to delete service" },
      { status: 500 }
    )
  }
}
