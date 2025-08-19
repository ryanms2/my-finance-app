import { 
  NotificationData, 
  NotificationType, 
  NotificationChannel 
} from './types'
import { createNotification } from './service'
import { sendPushNotification } from './push'
import { getNotificationPreferences } from './service'
import { prisma } from '@/utils/prisma/prisma'

/**
 * Sistema central de envio de notificações
 * Coordena entre diferentes canais (in-app, push, email)
 */
export class NotificationManager {
  /**
   * Envia notificação através de todos os canais apropriados
   */
  async sendNotification(
    userId: string,
    type: NotificationType,
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      // 1. Criar notificação no banco de dados
      const notification = await createNotification(userId, type, data)
      if (!notification) {
        return false
      }

      // 2. Buscar preferências do usuário
      const preferences = await getNotificationPreferences(userId)
      if (!preferences) {
        return false
      }

      // 3. Verificar se o tipo de notificação está habilitado
      if (!this.isNotificationTypeEnabled(type, preferences)) {
        return false
      }

      // 4. Verificar quiet hours
      if (this.isInQuietHours(preferences)) {
        if (notification.priority !== 'urgent') {
          return false
        }
      }

      const results: boolean[] = []

      // 5. Enviar através dos canais habilitados
      for (const channel of notification.channels) {
        switch (channel) {
          case 'in_app':
            if (preferences.enableInApp) {
              // A notificação já foi salva no banco, o polling do frontend vai pegá-la
              results.push(true)
            }
            break

          case 'push':
            if (preferences.enablePush) {
              const success = await sendPushNotification(userId, notification)
              results.push(success)
            }
            break

          case 'email':
            // Canal de email removido - sem configuração de email por enquanto
            console.log('Canal de email desabilitado - configuração removida')
            break

          default:
            console.warn(`Canal de notificação desconhecido: ${channel}`)
        }
      }

      // Retorna true se pelo menos um canal teve sucesso
      return results.some(result => result === true)
    } catch (error) {
      console.error('Erro no NotificationManager.sendNotification:', error)
      return false
    }
  }

  /**
   * Envia notificação para múltiplos usuários
   */
  async sendNotificationToUsers(
    userIds: string[],
    type: NotificationType,
    data?: Record<string, any>
  ): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    const results = await Promise.allSettled(
      userIds.map(userId => this.sendNotification(userId, type, data))
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
   * Verifica se o tipo de notificação está habilitado
   */
  private isNotificationTypeEnabled(
    type: NotificationType,
    preferences: any
  ): boolean {
    switch (type) {
      case 'BUDGET_EXCEEDED':
      case 'BUDGET_WARNING':
      case 'BUDGET_ACHIEVEMENT':
        return preferences.budgetAlerts

      case 'TRANSACTION_CREATED':
      case 'TRANSACTION_UPDATED':
      case 'TRANSACTION_DELETED':
      case 'TRANSFER_COMPLETED':
        return preferences.transactionAlerts

      case 'SECURITY_ALERT':
        return preferences.securityAlerts

      case 'SYSTEM_UPDATE':
        return preferences.marketingAlerts

      default:
        return true // Outros tipos sempre habilitados
    }
  }

  /**
   * Verifica se está no período de quiet hours
   */
  private isInQuietHours(preferences: any): boolean {
    if (!preferences.quietHours?.enabled) {
      return false
    }

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const [startHour, startMin] = preferences.quietHours.startTime.split(':').map(Number)
    const [endHour, endMin] = preferences.quietHours.endTime.split(':').map(Number)
    
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin

    if (startTime <= endTime) {
      // Mesmo dia (ex: 22:00 - 08:00 do próximo dia)
      return currentTime >= startTime && currentTime <= endTime
    } else {
      // Atravessa meia-noite (ex: 22:00 - 08:00)
      return currentTime >= startTime || currentTime <= endTime
    }
  }

  /**
   * Envia notificação por email usando Resend
   */
  private async sendEmailNotification(
    userId: string,
    notification: NotificationData
  ): Promise<boolean> {
    // Canal de email removido - sem configuração de email por enquanto
    console.log('Função sendEmailNotification desabilitada - configuração de email removida');
    return false;
  }
}

// Instância singleton
export const notificationManager = new NotificationManager()

/**
 * Funções de conveniência para tipos específicos de notificação
 */
export const notificationHelpers = {
  // Transações
  async transactionCreated(userId: string, transaction: any) {
    return notificationManager.sendNotification(userId, 'TRANSACTION_CREATED', {
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
    })
  },

  async transactionUpdated(userId: string, transaction: any) {
    return notificationManager.sendNotification(userId, 'TRANSACTION_UPDATED', {
      description: transaction.description,
    })
  },

  async transactionDeleted(userId: string, transaction: any) {
    return notificationManager.sendNotification(userId, 'TRANSACTION_DELETED', {
      description: transaction.description,
    })
  },

  // Orçamentos
  async budgetExceeded(userId: string, budget: any, exceededAmount: number) {
    return notificationManager.sendNotification(userId, 'BUDGET_EXCEEDED', {
      categoryName: budget.category.name,
      exceededAmount: exceededAmount.toFixed(2),
    })
  },

  async budgetWarning(userId: string, budget: any, percentage: number) {
    return notificationManager.sendNotification(userId, 'BUDGET_WARNING', {
      categoryName: budget.category.name,
      percentage: Math.round(percentage),
    })
  },

  async budgetAchievement(userId: string, budget: any) {
    return notificationManager.sendNotification(userId, 'BUDGET_ACHIEVEMENT', {
      categoryName: budget.category.name,
    })
  },

  // Transferências
  async transferCompleted(userId: string, transfer: any) {
    return notificationManager.sendNotification(userId, 'TRANSFER_COMPLETED', {
      amount: transfer.amount.toFixed(2),
      fromAccount: transfer.fromAccount.name,
      toAccount: transfer.toAccount.name,
    })
  },

  // Saldo baixo
  async lowBalance(userId: string, account: any) {
    return notificationManager.sendNotification(userId, 'ACCOUNT_LOW_BALANCE', {
      accountName: account.name,
      balance: account.balance.toFixed(2),
    })
  },

  // Segurança
  async securityAlert(userId: string, message: string) {
    return notificationManager.sendNotification(userId, 'SECURITY_ALERT', {
      message,
    })
  },

  // Bem-vindo
  async welcome(userId: string) {
    return notificationManager.sendNotification(userId, 'WELCOME')
  },
}
