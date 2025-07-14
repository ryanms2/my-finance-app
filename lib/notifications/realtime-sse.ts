import { NotificationData } from './types'
import { sendSSENotification } from './sse-manager'

/**
 * Sistema de notificações em tempo real usando Server-Sent Events (SSE)
 * Substitui Socket.IO para funcionar nativamente com Next.js
 */

/**
 * Envia notificação em tempo real via SSE
 */
export function sendRealTimeNotification(
  userId: string,
  notification: NotificationData
): boolean {
  try {
    console.log(`🔄 [DEBUG] Enviando notificação SSE para usuário ${userId}:`, notification.title)
    
    // Enviar via SSE
    sendSSENotification(userId, notification).then((success) => {
      if (success) {
        console.log(`✅ [DEBUG] Notificação SSE enviada com sucesso para usuário ${userId}`)
      } else {
        console.log(`⚠️ [DEBUG] Falha ao enviar notificação SSE para usuário ${userId}`)
      }
    }).catch((error) => {
      console.error('❌ [DEBUG] Erro ao enviar notificação SSE:', error)
    })

    // Retornar true otimisticamente
    return true
  } catch (error) {
    console.error('❌ [DEBUG] Erro ao enviar notificação SSE:', error)
    return false
  }
}

/**
 * Envia notificação para múltiplos usuários
 */
export function sendRealTimeNotificationToUsers(
  userIds: string[],
  notification: Omit<NotificationData, 'userId'>
): { success: number; failed: number } {
  let success = 0
  let failed = 0

  userIds.forEach((userId) => {
    try {
      const notificationData: NotificationData = {
        ...notification,
        userId,
      }

      const result = sendRealTimeNotification(userId, notificationData)
      if (result) {
        success++
      } else {
        failed++
      }
    } catch (error) {
      console.error(`❌ [DEBUG] Erro ao enviar notificação para usuário ${userId}:`, error)
      failed++
    }
  })

  return { success, failed }
}

/**
 * Envia broadcast para todos os usuários conectados
 */
export function sendBroadcastNotification(
  notification: Omit<NotificationData, 'userId'>
): boolean {
  try {
    console.log('🔄 [DEBUG] Broadcast SSE não implementado ainda')
    // TODO: Implementar broadcast via SSE se necessário
    return false
  } catch (error) {
    console.error('❌ [DEBUG] Erro ao enviar broadcast SSE:', error)
    return false
  }
}

/**
 * Obtém estatísticas do sistema
 */
export function getSocketIOStats() {
  // Manter compatibilidade com interface existente
  return {
    connectedClients: 0, // SSE não rastreia facilmente
    rooms: [],
  }
}

/**
 * Desconecta um usuário específico
 */
export function disconnectUser(userId: string): boolean {
  try {
    console.log(`🔄 [DEBUG] Disconnect SSE para usuário ${userId} não implementado`)
    // TODO: Implementar se necessário
    return false
  } catch (error) {
    console.error(`❌ [DEBUG] Erro ao desconectar usuário ${userId}:`, error)
    return false
  }
}

/**
 * Envia evento personalizado para um usuário
 */
export function sendCustomEvent(
  userId: string,
  eventName: string,
  data: any
): boolean {
  try {
    console.log(`🔄 [DEBUG] Enviando evento personalizado SSE: ${eventName} para usuário ${userId}`)
    
    const notification: NotificationData = {
      id: `custom-${Date.now()}`,
      userId,
      type: 'SYSTEM_UPDATE' as any,
      title: eventName,
      message: JSON.stringify(data),
      data,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      channels: ['in_app'],
      priority: 'medium'
    }

    return sendRealTimeNotification(userId, notification)
  } catch (error) {
    console.error(`❌ [DEBUG] Erro ao enviar evento customizado ${eventName}:`, error)
    return false
  }
}
