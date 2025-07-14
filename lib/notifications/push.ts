import webpush from 'web-push'
import { prisma } from '@/utils/prisma/prisma'
import { NotificationData, NotificationChannel } from './types'

// Configuração das chaves VAPID
const vapidDetails = {
  subject: process.env.VAPID_SUBJECT || 'mailto:your-email@example.com',
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
}

// Configurar webpush
if (vapidDetails.publicKey && vapidDetails.privateKey) {
  webpush.setVapidDetails(
    vapidDetails.subject,
    vapidDetails.publicKey,
    vapidDetails.privateKey
  )
}

/**
 * Envia push notification para um usuário
 */
export async function sendPushNotification(
  userId: string,
  notification: NotificationData
): Promise<boolean> {
  try {
    // Verificar se push notifications estão habilitadas para o usuário
    const preferences = await prisma.notificationPreferences.findUnique({
      where: { userId },
    })

    if (!preferences?.enablePush) {
      console.log(`Push notifications desabilitadas para usuário ${userId}`)
      return false
    }

    // Buscar todas as subscriptions ativas do usuário
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId,
        isActive: true,
      },
    })

    if (subscriptions.length === 0) {
      console.log(`Nenhuma subscription encontrada para usuário ${userId}`)
      return false
    }

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: {
        id: notification.id,
        type: notification.type,
        actionUrl: notification.actionUrl,
        timestamp: Date.now(),
      },
      actions: notification.actionUrl && notification.actionText ? [
        {
          action: 'open',
          title: notification.actionText,
        }
      ] : [],
      requireInteraction: notification.priority === 'urgent' || notification.priority === 'high',
      tag: `notification-${notification.id}`,
    })

    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            payload,
            {
              urgency: getPushUrgency(notification.priority),
              TTL: 24 * 60 * 60, // 24 horas
            }
          )
          return { success: true, endpoint: subscription.endpoint }
        } catch (error: any) {
          console.error(`Erro ao enviar push para ${subscription.endpoint}:`, error)
          
          // Se a subscription está inválida, desativá-la
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.update({
              where: { id: subscription.id },
              data: { isActive: false },
            })
          }
          
          return { success: false, endpoint: subscription.endpoint, error: error.message }
        }
      })
    )

    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length

    console.log(`Push notifications enviadas: ${successCount}/${subscriptions.length}`)
    return successCount > 0
  } catch (error) {
    console.error('Erro ao enviar push notification:', error)
    return false
  }
}

/**
 * Registra uma nova push subscription
 */
export async function registerPushSubscription(
  userId: string,
  subscription: PushSubscriptionJSON,
  userAgent?: string
): Promise<boolean> {
  try {
    if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      throw new Error('Dados de subscription inválidos')
    }

    await prisma.pushSubscription.upsert({
      where: {
        userId_endpoint: {
          userId,
          endpoint: subscription.endpoint,
        },
      },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent,
        isActive: true,
      },
    })

    return true
  } catch (error) {
    console.error('Erro ao registrar push subscription:', error)
    return false
  }
}

/**
 * Remove uma push subscription
 */
export async function unregisterPushSubscription(
  userId: string,
  endpoint: string
): Promise<boolean> {
  try {
    await prisma.pushSubscription.updateMany({
      where: {
        userId,
        endpoint,
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    })

    return true
  } catch (error) {
    console.error('Erro ao remover push subscription:', error)
    return false
  }
}

/**
 * Envia push notification para múltiplos usuários
 */
export async function sendPushNotificationToUsers(
  userIds: string[],
  notification: Omit<NotificationData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<{ success: number; failed: number }> {
  let success = 0
  let failed = 0

  const results = await Promise.allSettled(
    userIds.map(async (userId) => {
      const notificationData: NotificationData = {
        ...notification,
        id: `temp-${Date.now()}-${userId}`,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      return sendPushNotification(userId, notificationData)
    })
  )

  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      success++
    } else {
      failed++
    }
  })

  return { success, failed }
}

/**
 * Converte prioridade para urgência do push
 */
function getPushUrgency(priority: string): 'very-low' | 'low' | 'normal' | 'high' {
  switch (priority) {
    case 'urgent':
      return 'high'
    case 'high':
      return 'high'
    case 'medium':
      return 'normal'
    case 'low':
    default:
      return 'low'
  }
}

/**
 * Testa se as configurações de push estão corretas
 */
export async function testPushConfiguration(): Promise<boolean> {
  try {
    if (!vapidDetails.publicKey || !vapidDetails.privateKey) {
      console.error('Chaves VAPID não configuradas')
      return false
    }

    console.log('Configuração de push notifications OK')
    return true
  } catch (error) {
    console.error('Erro na configuração de push:', error)
    return false
  }
}
