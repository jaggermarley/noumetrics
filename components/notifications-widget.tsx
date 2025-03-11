"use client"

import { useState, useEffect } from "react"
import { GlowCard } from "@/components/ui/glow-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, MessagesSquare, Calendar, CheckCheck } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  type: string
  read: boolean
  user: {
    name: string
    avatar: string
  }
}

interface NotificationsWidgetProps {
  unreadCount?: number
}

export function NotificationsWidget({ unreadCount = 0 }: NotificationsWidgetProps) {
  const { toast } = useToast()
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([])
  const [readAll, setReadAll] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications')
        const data = await response.json()
        
        if (data.success) {
          // Transformar os dados para o formato esperado pelo componente
          const formattedNotifications = data.notifications.map((notification: any) => ({
            id: notification.id,
            title: notification.title,
            description: notification.description,
            time: formatTimeAgo(notification.createdAt),
            type: notification.type,
            read: notification.read,
            user: {
              name: "Sistema",
              avatar: "/placeholder.svg?height=32&width=32",
            },
          }))
          
          setActiveNotifications(formattedNotifications)
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar as notificações",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as notificações",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [toast])

  const markAllAsRead = async () => {
    try {
      setReadAll(true)
      
      // Marcar todas as notificações como lidas no estado local
      setActiveNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      
      // Marcar todas as notificações como lidas no servidor
      for (const notification of activeNotifications.filter(n => !n.read)) {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: notification.id }),
        })
      }
      
      toast({
        title: "Sucesso",
        description: "Todas as notificações foram marcadas como lidas",
      })
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível marcar as notificações como lidas",
        variant: "destructive"
      })
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
      case "campaign":
        return <MessagesSquare className="h-4 w-4 text-blue-500" />
      case "calendar":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "report":
      default:
        return <Bell className="h-4 w-4 text-accent" />
    }
  }

  // Função para formatar a data relativa
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return "Agora mesmo"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `Há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `Há ${days} ${days === 1 ? 'dia' : 'dias'}`
    }
  }

  if (isLoading) {
    return (
      <GlowCard hover="scale" shadow="md" className="overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Bell className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold">Notificações</h3>
            </div>
          </div>
          <div className="flex items-center justify-center h-40">
            <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent spinner"></div>
          </div>
        </div>
      </GlowCard>
    )
  }

  return (
    <GlowCard hover="scale" shadow="md" className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Bell className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold">Notificações</h3>
            {unreadCount > 0 && <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="h-8 rounded-lg gap-1 text-xs hover:bg-accent/10 hover:text-accent transition-colors duration-300"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar como lidas
          </Button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {activeNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma notificação encontrada
              </div>
            ) : (
              activeNotifications.slice(0, 3).map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 rounded-xl flex items-start gap-3 ${notification.read ? "bg-transparent" : "bg-blue-50/50 dark:bg-blue-900/10"}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                    <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <div className="flex items-center gap-2">
                        {getIcon(notification.type)}
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 rounded-lg text-sm hover:bg-accent/10 hover:text-accent transition-colors duration-300"
          onClick={() => window.location.href = '/notifications'}
        >
          Ver todas
        </Button>
      </div>
    </GlowCard>
  )
}

