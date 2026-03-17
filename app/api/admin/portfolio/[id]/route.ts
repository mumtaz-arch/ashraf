import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const updatePortfolioItemSchema = z.object({
  title: z.string().min(1).optional(),
  titleEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  imageUrl: z.string().url().optional(),
  category: z.string().optional(),
  orientation: z.string().optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = updatePortfolioItemSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const item = await prisma.portfolioItem.update({
      where: { id },
      data: validated.data,
    })

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    console.error("Failed to update item:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update item" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.portfolioItem.delete({
      where: { id },
    })
    return NextResponse.json({ success: true, message: "Item deleted" })
  } catch (error) {
    console.error("Failed to delete item:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete item" },
      { status: 500 }
    )
  }
}
