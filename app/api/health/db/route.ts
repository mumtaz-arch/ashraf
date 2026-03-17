import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Run a minimal raw query
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
    })
  } catch (error) {
    console.error('Database health check failed:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
