'use server'

import { auth } from '@/app/auth'
import { prisma } from '@/utils/prisma/prisma'
import { 
  NotificationData, 
  NotificationType, 
  NotificationChannel,
  NotificationPriority,
  PushSubscription as PushSubscriptionType,
  NotificationPreferences
} from './types'
import { notificationTemplates } from './templates'
import { revalidatePath } from 'next/cache'

/**
 * Helper para revalidar todas as páginas que podem ser afetadas por notificações/transações
 */
function revalidateFinancePages() {
  revalidatePath('/dashboard')
  revalidatePath('/transactions')
  revalidatePath('/wallets')
  revalidatePath('/budgets')
  revalidatePath('/(main)', 'layout')
}

/**
 * Cria uma nova notificação
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  data?: Record<string, any>
): Promise<NotificationData | null> {
  try {
    const template = notificationTemplates[type]
    if (!template) {
      throw new Error(`Template não encontrado para o tipo: ${type}`)
    }

    const title = template.title(data || {})
    const message = template.message(data || {})
    const expiresAt = template.expiresInHours 
      ? new Date(Date.now() + template.expiresInHours * 60 * 60 * 1000)
      : null

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        priority: template.priority,
        channels: JSON.stringify(template.channels),
        data: data ? JSON.stringify(data) : null,
        expiresAt,
      },
    })

    const notificationData: NotificationData = {
      id: notification.id,
      userId: notification.userId,
      type: notification.type as NotificationType,
      title: notification.title,
      message: notification.message,
      priority: notification.priority as NotificationPriority,
      channels: JSON.parse(notification.channels) as NotificationChannel[],
      data: notification.data ? JSON.parse(notification.data) : undefined,
      read: notification.read,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      expiresAt: notification.expiresAt || undefined,
      actionUrl: notification.actionUrl || undefined,
      actionText: notification.actionText || undefined,
    }

    return notificationData
  } catch (error) {
    console.error('Erro ao criar notificação:', error)
    return null
  }
}

/**
 * Busca notificações de um usuário
 */
export async function getUserNotifications(
  userId: string, // Tornar obrigatório, pois agora sempre passamos do endpoint
  options?: {
    limit?: number
    offset?: number
    unreadOnly?: boolean
    types?: NotificationType[]
  }
): Promise<NotificationData[]> {
  try {
    if (!userId) {
      return []
    }

    const { limit = 50, offset = 0, unreadOnly = false, types } = options || {}

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false }),
        ...(types && { type: { in: types } }),
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset,
    })

    return notifications.map(notification => ({
      id: notification.id,
      userId: notification.userId,
      type: notification.type as NotificationType,
      title: notification.title,
      message: notification.message,
      priority: notification.priority as NotificationPriority,
      channels: JSON.parse(notification.channels) as NotificationChannel[],
      data: notification.data ? JSON.parse(notification.data) : undefined,
      read: notification.read,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      expiresAt: notification.expiresAt || undefined,
      actionUrl: notification.actionUrl || undefined,
      actionText: notification.actionText || undefined,
    }))
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return []
  }
}

/**
 * Marca notificação como lida
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user?.id) return false

    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
      data: {
        read: true,
        updatedAt: new Date(),
      },
    })

    revalidateFinancePages()
    return true
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error)
    return false
  }
}

/**
 * Marca todas as notificações como lidas
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user?.id) return false

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: {
        read: true,
        updatedAt: new Date(),
      },
    })

    revalidateFinancePages()
    return true
  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error)
    return false
  }
}

/**
 * Deleta uma notificação
 */
export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user?.id) return false

    await prisma.notification.delete({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
    })

    revalidateFinancePages()
    return true
  } catch (error) {
    console.error('Erro ao deletar notificação:', error)
    return false
  }
}

/**
 * Deleta notificações expiradas
 */
export async function cleanupExpiredNotifications(): Promise<number> {
  try {
    const result = await prisma.notification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })

    return result.count
  } catch (error) {
    console.error('Erro ao limpar notificações expiradas:', error)
    return 0
  }
}

/**
 * Conta notificações não lidas
 */
export async function getUnreadNotificationCount(userId?: string): Promise<number> {
  try {
    if (!userId) {
      const session = await auth()
      if (!session?.user?.id) return 0
      userId = session.user.id
    }

    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
    })

    return count
  } catch (error) {
    console.error('Erro ao contar notificações não lidas:', error)
    return 0
  }
}

/**
 * Salva push subscription
 */
export async function savePushSubscription(
  subscription: Omit<PushSubscriptionType, 'id' | 'userId' | 'createdAt'>
): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user?.id) return false

    await prisma.pushSubscription.upsert({
      where: {
        userId_endpoint: {
          userId: session.user.id,
          endpoint: subscription.endpoint,
        },
      },
      update: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
        userAgent: subscription.userAgent,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.p256dh,
        auth: subscription.auth,
        userAgent: subscription.userAgent,
        isActive: true,
      },
    })

    return true
  } catch (error) {
    console.error('Erro ao salvar push subscription:', error)
    return false
  }
}

/**
 * Busca preferências de notificação do usuário
 */
export async function getNotificationPreferences(userId?: string): Promise<NotificationPreferences | null> {
  try {
    if (!userId) {
      const session = await auth()
      if (!session?.user?.id) return null
      userId = session.user.id
    }

    const preferences = await prisma.notificationPreferences.findUnique({
      where: { userId },
    })

    if (!preferences) {
      // Criar preferências padrão
      const defaultPreferences = await prisma.notificationPreferences.create({
        data: {
          userId,
          enableInApp: true,
          enablePush: true,
          enableEmail: false,
          budgetAlerts: true,
          transactionAlerts: true,
          securityAlerts: true,
          marketingAlerts: false,
        },
      })

      return {
        userId: defaultPreferences.userId,
        enableInApp: defaultPreferences.enableInApp,
        enablePush: defaultPreferences.enablePush,
        enableEmail: defaultPreferences.enableEmail,
        budgetAlerts: defaultPreferences.budgetAlerts,
        transactionAlerts: defaultPreferences.transactionAlerts,
        securityAlerts: defaultPreferences.securityAlerts,
        marketingAlerts: defaultPreferences.marketingAlerts,
        quietHours: defaultPreferences.quietHours 
          ? JSON.parse(defaultPreferences.quietHours)
          : { enabled: false, startTime: '22:00', endTime: '08:00' },
      }
    }

    return {
      userId: preferences.userId,
      enableInApp: preferences.enableInApp,
      enablePush: preferences.enablePush,
      enableEmail: preferences.enableEmail,
      budgetAlerts: preferences.budgetAlerts,
      transactionAlerts: preferences.transactionAlerts,
      securityAlerts: preferences.securityAlerts,
      marketingAlerts: preferences.marketingAlerts,
      quietHours: preferences.quietHours 
        ? JSON.parse(preferences.quietHours)
        : { enabled: false, startTime: '22:00', endTime: '08:00' },
    }
  } catch (error) {
    console.error('Erro ao buscar preferências de notificação:', error)
    return null
  }
}
