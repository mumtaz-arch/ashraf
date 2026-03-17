import { NextRequest, NextResponse } from "next/server"
import { loginAdmin } from "@/lib/auth"
import type { ApiResponse } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      )
    }

    const admin = await loginAdmin(email, password)
    if (!admin) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Login successful",
      data: admin,
    })
  } catch (error) {
    console.error("Login failed:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Login failed" },
      { status: 500 }
    )
  }
}
