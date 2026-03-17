import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    let profile = await prisma.photographerProfile.findFirst()
    
    if (!profile) {
      profile = await prisma.photographerProfile.create({
        data: {
          name: "Ashraf",
          title: "Fotografer Profesional",
          titleEn: "Professional Photographer",
          bio: "Halo! Saya Ashraf, fotografer profesional yang berdedikasi untuk mengabadikan momen spesial Anda dengan kualitas terbaik.",
          bioEn: "Hello! I am Ashraf, a professional photographer dedicated to capturing your special moments with top-tier quality.",
          imageUrl: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=300&h=300",
        },
      })
    }

    return NextResponse.json({ success: true, data: profile })
  } catch (error) {
    console.error("Failed to fetch profile:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}
