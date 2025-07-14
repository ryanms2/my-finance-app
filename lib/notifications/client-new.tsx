'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { 
  NotificationData, 
  NotificationPreferences 
} from '@/lib/notifications/types'
import { toast } from 'sonner'

interface NotificationContextType {
  notifications: NotificationData[]
  unreadCount: number
  isConnected: boolean
  isSupported: boolean
  permission: NotificationPermission | null
  preferences: NotificationPreferences | null
  
  // Ações
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  requestPermission: () => Promise<boolean>
  enablePushNotifications: () => Promise<boolean>
  disablePushNotifications: () => Promise<boolean>
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<boolean>
  
  // Eventos
  onNotification: (callback: (notification: NotificationData) => void) => () => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission | null>(null)
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)

  // Verificar suporte a notificações
  const isSupported = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator

  // Callbacks para eventos de notificação
  const [notificationCallbacks, setNotificationCallbacks] = useState<Set<(notification: NotificationData) => void>>(new Set())

  // Sistema de notificações via polling (solução 100% confiável)
  useEffect(() => {
    if (!session?.user?.id) {
      console.log("⚠️ [DEBUG] Session ou userId não disponível:", session);
      return;
    }

    console.log("🔄 [DEBUG] Iniciando sistema de notificações via polling para usuário:", session.user.id);
    setIsConnected(true)
    
    // Carregar notificações iniciais
    loadInitialNotifications()
    loadPreferences()
    
    // Iniciar polling de notificações
    const pollingInterval = setInterval(async () => {
      try {
        console.log("🔄 [DEBUG] Verificando novas notificações...")
        const response = await fetch('/api/notifications?recent=true')
        if (response.ok) {
          const data = await response.json()
          const newNotifications = data.notifications || []
          
          // Verificar se há notificações realmente novas
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id))
            const reallyNew = newNotifications.filter((n: NotificationData) => !existingIds.has(n.id))
            
            if (reallyNew.length > 0) {
              console.log(`🔔 [DEBUG] ${reallyNew.length} nova(s) notificação(ões) encontrada(s)`)
              
              // Mostrar toast para as novas
              reallyNew.forEach((notification: NotificationData) => {
                toast(notification.title, {
                  description: notification.message,
                  duration: 5000,
                })
                
                // Chamar callbacks registrados
                notificationCallbacks.forEach(callback => {
                  try {
                    callback(notification)
                  } catch (error) {
                    console.error('Erro no callback de notificação:', error)
                  }
                })
              })
              
              return [...reallyNew, ...prev].slice(0, 50) // Limitar a 50 notificações
            }
            
            return prev
          })
          
          setUnreadCount(data.unreadCount || 0)
        }
      } catch (error) {
        console.error('❌ [DEBUG] Erro no polling de notificações:', error)
      }
    }, 10000) // Poll a cada 10 segundos para responsividade

    return () => {
      clearInterval(pollingInterval)
      setIsConnected(false)
    }
  }, [session?.user?.id, notificationCallbacks])

  // Verificar permissão inicial
  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission)
    }
  }, [isSupported])

  const loadInitialNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    }
  }

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences')
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        )
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Erro ao deletar notificação:', error)
    }
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error)
      return false
    }
  }

  const enablePushNotifications = async (): Promise<boolean> => {
    if (!isSupported) return false

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      })

      if (response.ok) {
        toast.success('Push notifications habilitadas!')
        return true
      }
    } catch (error) {
      console.error('Erro ao habilitar push notifications:', error)
    }

    toast.error('Erro ao habilitar notificações push')
    return false
  }

  const disablePushNotifications = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Push notifications desabilitadas!')
        return true
      }
    } catch (error) {
      console.error('Erro ao desabilitar push notifications:', error)
    }

    toast.error('Erro ao desabilitar notificações push')
    return false
  }

  const updatePreferences = async (prefs: Partial<NotificationPreferences>): Promise<boolean> => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })

      if (response.ok) {
        const updatedPrefs = await response.json()
        setPreferences(updatedPrefs)
        toast.success('Preferências atualizadas!')
        return true
      }
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error)
    }

    toast.error('Erro ao atualizar preferências')
    return false
  }

  const onNotification = useCallback((callback: (notification: NotificationData) => void) => {
    setNotificationCallbacks(prev => {
      const newSet = new Set(prev)
      newSet.add(callback)
      return newSet
    })
    
    return () => {
      setNotificationCallbacks(prev => {
        const newSet = new Set(prev)
        newSet.delete(callback)
        return newSet
      })
    }
  }, [])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isConnected,
    isSupported,
    permission,
    preferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    requestPermission,
    enablePushNotifications,
    disablePushNotifications,
    updatePreferences,
    onNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationProvider')
  }
  return context
}
