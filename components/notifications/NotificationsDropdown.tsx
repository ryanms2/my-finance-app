"use client"

import { useState } from "react"
import { Bell, Check, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/lib/notifications/client"
import { getNotificationIcon, getPriorityColor } from "@/lib/notifications/templates"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

export function NotificationsDropdown() {
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications()

  const [isLoading, setIsLoading] = useState(false)

  const handleMarkAsRead = async (notificationId: string) => {
    setIsLoading(true)
    await markAsRead(notificationId)
    setIsLoading(false)
  }

  const handleMarkAllAsRead = async () => {
    setIsLoading(true)
    await markAllAsRead()
    setIsLoading(false)
  }

  const handleDeleteNotification = async (notificationId: string) => {
    setIsLoading(true)
    await deleteNotification(notificationId)
    setIsLoading(false)
  }

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: ptBR 
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {!isConnected && (
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange-500" 
                 title="Desconectado" />
          )}
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
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notificações</h3>
            {!isConnected && (
              <span className="text-xs text-orange-400">⚡ Offline</span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              disabled={isLoading}
              className="text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <DropdownMenuSeparator className="bg-gray-800" />

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-gray-800/50 border-l-2 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? "bg-gray-800/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-lg">
                      {getNotificationIcon(notification.type)}
                    </div>
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
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={isLoading}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteNotification(notification.id)}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                      {notification.actionUrl && notification.actionText && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 h-6 text-xs"
                          onClick={() => window.open(notification.actionUrl, '_self')}
                        >
                          {notification.actionText}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator className="bg-gray-800" />
        
        <Link href={"/settings"}>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Configurações de Notificação
          </DropdownMenuItem>
        </Link>
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
