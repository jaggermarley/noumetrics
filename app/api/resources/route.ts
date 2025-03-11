import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const whereClause = category && category !== 'Todos' 
      ? { category } 
      : {}

    const resources = await prisma.resource.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ resources, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, success: false },
      { status: 401 }
    )
  }
}

