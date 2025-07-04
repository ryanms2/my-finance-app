"use client"

import { useState } from "react"
import { Bell, Check, X, AlertTriangle, TrendingUp, CreditCard, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  type: "transfer" | "budget" | "goal" | "payment" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "transfer",
    title: "Transferência Realizada",
    message: "R$ 1.000,00 transferidos da Conta Corrente para Poupança",
    timestamp: "2025-01-28T10:30:00",
    read: false,
    priority: "medium",
  },
  {
    id: "2",
    type: "budget",
    title: "Alerta de Orçamento",
    message: "Você já utilizou 85% do orçamento de Alimentação",
    timestamp: "2025-01-28T09:15:00",
    read: false,
    priority: "high",
  },
  {
    id: "3",
    type: "goal",
    title: "Meta Atingida!",
    message: "Parabéns! Você atingiu sua meta de economia mensal",
    timestamp: "2025-01-27T18:45:00",
    read: true,
    priority: "medium",
  },
  {
    id: "4",
    type: "payment",
    title: "Vencimento Próximo",
    message: "Fatura do cartão de crédito vence em 3 dias",
    timestamp: "2025-01-27T08:00:00",
    read: false,
    priority: "high",
  },
  {
    id: "5",
    type: "system",
    title: "Upgrade Disponível",
    message: "Desbloqueie recursos premium com 50% de desconto",
    timestamp: "2025-01-26T14:20:00",
    read: true,
    priority: "low",
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "transfer":
      return <CreditCard className="h-4 w-4 text-blue-400" />
    case "budget":
      return <AlertTriangle className="h-4 w-4 text-orange-400" />
    case "goal":
      return <TrendingUp className="h-4 w-4 text-green-400" />
    case "payment":
      return <Calendar className="h-4 w-4 text-red-400" />
    default:
      return <Bell className="h-4 w-4 text-gray-400" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "border-l-red-500"
    case "medium":
      return "border-l-orange-500"
    default:
      return "border-l-blue-500"
  }
}

export function NotificationsDropdown() {
  const [notificationList, setNotificationList] = useState(notifications)
  const unreadCount = notificationList.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((notification) => notification.id !== id))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Agora"
    if (diffInHours < 24) return `${diffInHours}h atrás`
    return `${Math.floor(diffInHours / 24)}d atrás`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-gray-900 border-gray-800" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-gray-800" />
        <ScrollArea className="h-96">
          {notificationList.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-gray-800/50 border-l-2 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? "bg-gray-800/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? "text-white" : "text-gray-300"}`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(notification.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
