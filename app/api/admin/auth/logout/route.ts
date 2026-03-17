import { NextResponse } from "next/server"
import { logoutAdmin } from "@/lib/auth"
import type { ApiResponse } from "@/types"

export async function POST() {
  try {
    await logoutAdmin()
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout failed:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Logout failed" },
      { status: 500 }
    )
  }
}
