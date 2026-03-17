import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title ID is required"),
  titleEn: z.string().optional(),
  bio: z.string().min(1, "Bio ID is required"),
  bioEn: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
})

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const validated = updateProfileSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    let profile = await prisma.photographerProfile.findFirst()

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found to update" },
        { status: 404 }
      )
    }

    const updated = await prisma.photographerProfile.update({
      where: { id: profile.id },
      data: validated.data,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("Failed to update profile:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    )
  }
}
