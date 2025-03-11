"use client"

import { useState, useEffect } from "react"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Glow } from "@/components/ui/glow"
import { GlowCard } from "@/components/ui/glow-card"
import { ArrowDownRight, ArrowUpRight, DollarSign, Eye, FileText, Plus, RefreshCw, Search, TargetIcon, Users } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { DailyTrafficChart } from "@/components/daily-traffic-chart"
import { CampaignPerformanceWidget } from "@/components/campaign-performance-widget"
import { NotificationsWidget } from "@/components/notifications-widget"
import { RecentPostsWidget } from "@/components/recent-posts-widget"
import { BouncesWidget } from "@/components/bounces-widget"
import { ConversionsWidget } from "@/components/conversions-widget"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      roi: 0,
      unreadNotifications: 0
    },
    campaigns: []
  })

  useEffect(() => {
    // Buscar dados do dashboard
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        
        if (data.success) {
          setDashboardData(data)
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do dashboard",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do dashboard",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Glow
            variant="accent"
            size="lg"
            glow="always"
            glowColor="accent"
            className="h-12 w-12 rounded-full flex items-center justify-center"
          >
            <div className="h-8 w-8 rounded-full border-4 border-white border-t-transparent spinner"></div>
          </Glow>
          <p className="text-sm text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Olá, João! 👋</h1>
          <p className="text-muted-foreground">Confira o desempenho das suas campanhas</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar..." className="w-[200px] pl-9 rounded-xl" />
          </div>
          <Button
            size="icon"
            variant="outline"
            className="rounded-xl hover:bg-accent/10 hover:text-accent transition-colors duration-300"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="rounded-xl gap-2 h-9 bg-accent hover:bg-accent/90 transition-colors duration-300"
          >
            <Plus className="h-4 w-4" />
            Nova Campanha
          </Button>
        </div>
      </div>

      {/* Main content */}
      <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
        {/* Recent posts - Moved to first position */}
        <motion.div variants={item}>
          <RecentPostsWidget />
        </motion.div>

        {/* Stats cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlowStatCard
            title="Impressões Totais"
            value={dashboardData.metrics.impressions.toLocaleString()}
            change="+20.1%"
            trend="up"
            icon={Eye}
            colorClass="bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400"
            glowColor="blue"
          />
          <GlowStatCard
            title="Conversões"
            value={dashboardData.metrics.conversions.toLocaleString()}
            change="+12.5%"
            trend="up"
            icon={TargetIcon}
            colorClass="bg-green-50 text-green-500 dark:bg-green-900/20 dark:text-green-400"
            glowColor="green"
          />
          <GlowStatCard
            title="Custo por Conversão"
            value={`R$ ${(dashboardData.metrics.spent / dashboardData.metrics.conversions || 0).toFixed(2)}`}
            change="-8.1%"
            trend="down"
            icon={DollarSign}
            colorClass="bg-red-50 text-accent dark:bg-red-900/20 dark:text-accent"
            glowColor="accent"
          />
          <GlowStatCard
            title="ROI"
            value={`${dashboardData.metrics.roi}%`}
            change="+5.2%"
            trend="up"
            icon={Users}
            colorClass="bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400"
            glowColor="purple"
          />
        </motion.div>

        {/* Charts and widgets row 1 */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GlowCard className="lg:col-span-2 overflow-hidden" hover="scale" shadow="md">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Tráfego Diário</h3>
                    <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-lg px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +18.2%
                  </Badge>
                </div>
              </div>
              <DailyTrafficChart />
            </CardContent>
          </GlowCard>

          <NotificationsWidget unreadCount={dashboardData.metrics.unreadNotifications} />
        </motion.div>

        {/* Charts and widgets row 2 */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GlowCard className="lg:col-span-2 overflow-hidden" hover="scale" shadow="md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Campanhas Ativas</h3>
                  <p className="text-sm text-muted-foreground">Desempenho das principais campanhas</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg gap-2 hover:bg-accent/10 hover:text-accent transition-colors duration-300"
                >
                  <FileText className="h-4 w-4" />
                  Relatório
                </Button>
              </div>
              <CampaignPerformanceWidget campaigns={dashboardData.campaigns} />
            </CardContent>
          </GlowCard>

          <div className="grid grid-cols-1 gap-4">
            <ConversionsWidget />
            <BouncesWidget />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Glow Stat card component
function GlowStatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  colorClass,
  glowColor,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: any
  colorClass: string
  glowColor: "accent" | "blue" | "purple" | "green"
}) {
  return (
    <GlowCard hover="scale" shadow="md" className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          <Glow
            variant="accent"
            size="sm"
            glow="always"
            glowColor={glowColor}
            className={`rounded-xl p-2 ${colorClass}`}
          >
            <Icon className="h-5 w-5" />
          </Glow>
        </div>
        <div className="mt-4 flex items-center gap-1">
          {trend === "up" ? (
            <Badge
              variant="outline"
              className="rounded-lg px-2 py-0 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
            >
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {change}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="rounded-lg px-2 py-0 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
            >
              <ArrowDownRight className="h-3 w-3 mr-1" />
              {change}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-1">do mês passado</span>
        </div>
      </CardContent>
    </GlowCard>
  )
}

