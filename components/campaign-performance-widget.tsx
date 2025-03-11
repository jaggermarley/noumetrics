"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"

interface Campaign {
  id: string
  name: string
  platform: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  status: string
}

interface CampaignPerformanceWidgetProps {
  campaigns?: Campaign[]
}

export function CampaignPerformanceWidget({ campaigns = [] }: CampaignPerformanceWidgetProps) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (activeTab === "all") return true
    return campaign.platform.toLowerCase() === activeTab.toLowerCase()
  })

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      case "instagram":
        return "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
      case "google":
        return "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  // Calcular CTR e CPC para cada campanha
  const campaignsWithMetrics = filteredCampaigns.map(campaign => {
    const ctr = campaign.clicks > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0
    const cpc = campaign.clicks > 0 ? campaign.spent / campaign.clicks : 0
    const progress = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0
    
    return {
      ...campaign,
      ctr: ctr.toFixed(2),
      cpc: cpc.toFixed(2),
      progress: Math.round(progress)
    }
  })

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-4 p-1 rounded-lg bg-gray-100 dark:bg-gray-800/50">
          <TabsTrigger value="all" className="rounded-md">
            Todas
          </TabsTrigger>
          <TabsTrigger value="facebook" className="rounded-md">
            Facebook
          </TabsTrigger>
          <TabsTrigger value="instagram" className="rounded-md">
            Instagram
          </TabsTrigger>
          <TabsTrigger value="google" className="rounded-md">
            Google
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                {campaignsWithMetrics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma campanha encontrada
                  </div>
                ) : (
                  campaignsWithMetrics.map((campaign) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`rounded-lg px-2 py-0.5 ${getPlatformColor(campaign.platform)}`}
                            >
                              {campaign.platform}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Budget: R$ {campaign.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                        <Badge variant={campaign.status === "active" ? "default" : "secondary"} className="rounded-lg">
                          {campaign.status === "active" ? "Ativo" : "Pausado"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Impressões</p>
                          <p className="text-sm font-medium">{campaign.impressions.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Cliques</p>
                          <p className="text-sm font-medium">{campaign.clicks.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">CTR</p>
                          <p className="text-sm font-medium">{campaign.ctr}%</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Orçamento usado</span>
                          <span className="font-medium">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2 bg-gray-100 dark:bg-gray-800" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  )
}

