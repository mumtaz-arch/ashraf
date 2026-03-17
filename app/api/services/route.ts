import { NextResponse } from "next/server"
import { getActiveServices } from "@/lib/services/service"
import type { ApiResponse, ServiceItem } from "@/types"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const services = await getActiveServices()

    const data: ServiceItem[] = services.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description,
      price: Number(s.price),
      durationMinutes: s.durationMinutes,
      isActive: s.isActive,
    }))

    return NextResponse.json<ApiResponse<ServiceItem[]>>({
      success: true,
      message: "Services retrieved successfully",
      data,
    })
  } catch (error) {
    console.error("Failed to fetch services:", error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to fetch services",
      },
      { status: 500 }
    )
  }
}
