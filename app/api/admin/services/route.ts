import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { serviceCreateSchema } from "@/lib/validations/service"
import type { ApiResponse } from "@/types"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await requireAdmin()

    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { bookings: true } },
      },
    })

    const data = services.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description,
      price: Number(s.price),
      durationMinutes: s.durationMinutes,
      isActive: s.isActive,
      bookingCount: s._count.bookings,
      createdAt: s.createdAt.toISOString(),
    }))

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Found ${data.length} service(s)`,
      data,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Failed to fetch services:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to fetch services" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()

    const parsed = serviceCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors as Record<string, string[]> },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        ...parsed.data,
        isActive: parsed.data.isActive ?? true,
      },
    })

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Service created",
        data: { ...service, price: Number(service.price) },
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
    console.error("Failed to create service:", error)
    const message = (error as Error)?.message?.includes("Unique constraint")
      ? "A service with this slug already exists"
      : "Failed to create service"
    return NextResponse.json<ApiResponse>(
      { success: false, message },
      { status: 422 }
    )
  }
}
