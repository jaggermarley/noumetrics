import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const { user, token } = await login(email, password)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
      },
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, success: false },
      { status: 401 }
    )
  }
}

