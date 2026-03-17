import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const items = await prisma.portfolioItem.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error("Failed to fetch portfolio:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch portfolio" },
      { status: 500 }
    )
  }
}
