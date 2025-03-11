import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const reports = await prisma.report.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ reports, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, success: false },
      { status: 401 }
    )
  }
}

