import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const createPortfolioItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL"),
  category: z.string().min(1, "Category is required"),
  orientation: z.string().optional().default("square"),
  isActive: z.boolean().optional().default(true),
})

export async function GET() {
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch items" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = createPortfolioItemSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const item = await prisma.portfolioItem.create({
      data: validated.data,
    })

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    console.error("Failed to create item:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create portfolio item" },
      { status: 500 }
    )
  }
}
