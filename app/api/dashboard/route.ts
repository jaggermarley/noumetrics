import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    // Buscar as campanhas da empresa do usuário
    const campaigns = await prisma.campaign.findMany({
      where: {
        company: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      },
    })

    // Calcular métricas
    const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
    const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)
    const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)
    const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0)
    const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0)
    
    // Calcular ROI (simplificado)
    const roi = totalSpent > 0 ? ((totalConversions * 100) / totalSpent) : 0

    // Buscar notificações não lidas
    const unreadNotifications = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false,
      },
    })

    return NextResponse.json({
      metrics: {
        impressions: totalImpressions,
        clicks: totalClicks,
        conversions: totalConversions,
        roi: Math.round(roi),
        spent: totalSpent,
        budget: totalBudget,
        unreadNotifications,
      },
      campaigns,
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, success: false },
      { status: 401 }
    )
  }
}

