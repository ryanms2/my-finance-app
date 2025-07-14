import { notificationHelpers, notificationManager } from '@/lib/notifications/manager'
import { createNotification } from '@/lib/notifications/service'

/**
 * Funções de teste para demonstrar o uso do sistema de notificações
 * 
 * IMPORTANT: Estas funções são apenas para demonstração e testes.
 * Em produção, as notificações devem ser enviadas através dos 
 * server actions ou eventos do sistema.
 */

export class NotificationTestHelpers {
  /**
   * Testa envio de notificação de transação
   */
  static async testTransactionNotification(userId: string) {
    return await notificationHelpers.transactionCreated(userId, {
      type: 'expense',
      amount: 150.50,
      description: 'Compra no supermercado',
    })
  }

  /**
   * Testa notificação de orçamento excedido
   */
  static async testBudgetExceededNotification(userId: string) {
    return await notificationHelpers.budgetExceeded(userId, {
      category: { name: 'Alimentação' }
    }, 250.75)
  }

  /**
   * Testa notificação de transferência
   */
  static async testTransferNotification(userId: string) {
    return await notificationHelpers.transferCompleted(userId, {
      amount: 1000,
      fromAccount: { name: 'Conta Corrente' },
      toAccount: { name: 'Poupança' },
    })
  }

  /**
   * Testa notificação de segurança
   */
  static async testSecurityAlert(userId: string) {
    return await notificationHelpers.securityAlert(
      userId,
      'Login detectado de novo dispositivo'
    )
  }

  /**
   * Testa notificação de boas-vindas
   */
  static async testWelcomeNotification(userId: string) {
    return await notificationHelpers.welcome(userId)
  }

  /**
   * Testa notificação customizada
   */
  static async testCustomNotification(userId: string) {
    return await createNotification(userId, 'GOAL_ACHIEVED', {
      goalAmount: '5000.00',
    })
  }

  /**
   * Testa múltiplas notificações
   */
  static async testMultipleNotifications(userId: string) {
    const notifications = [
      notificationHelpers.transactionCreated(userId, {
        type: 'income',
        amount: 3000,
        description: 'Salário',
      }),
      notificationHelpers.budgetWarning(userId, {
        category: { name: 'Entretenimento' }
      }, 85),
      notificationHelpers.transferCompleted(userId, {
        amount: 500,
        fromAccount: { name: 'Conta Corrente' },
        toAccount: { name: 'Investimentos' },
      }),
    ]

    return await Promise.allSettled(notifications)
  }

  /**
   * Testa notificação para múltiplos usuários
   */
  static async testNotificationToMultipleUsers(userIds: string[]) {
    return await notificationManager.sendNotificationToUsers(
      userIds,
      'SYSTEM_UPDATE',
      {
        version: '2.1.0',
        features: 'Novo sistema de notificações implementado!'
      }
    )
  }

  /**
   * Simula cenário real de uso
   */
  static async simulateRealScenario(userId: string) {
    console.log('🚀 Iniciando simulação de cenário real...')
    
    // 1. Usuário faz login - notificação de boas-vindas
    await this.testWelcomeNotification(userId)
    console.log('✅ Notificação de boas-vindas enviada')

    // Aguardar 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 2. Usuário cria uma transação
    await this.testTransactionNotification(userId)
    console.log('✅ Notificação de transação enviada')

    // Aguardar 3 segundos
    await new Promise(resolve => setTimeout(resolve, 3000))

    // 3. Orçamento está quase no limite
    await notificationHelpers.budgetWarning(userId, {
      category: { name: 'Alimentação' }
    }, 90)
    console.log('✅ Aviso de orçamento enviado')

    // Aguardar 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 4. Usuário excede o orçamento
    await this.testBudgetExceededNotification(userId)
    console.log('🚨 Alerta de orçamento excedido enviado')

    // Aguardar 5 segundos
    await new Promise(resolve => setTimeout(resolve, 5000))

    // 5. Usuário faz uma transferência
    await this.testTransferNotification(userId)
    console.log('✅ Notificação de transferência enviada')

    console.log('🎉 Simulação concluída!')
  }
}

/**
 * Exemplo de uso em uma API route de teste
 * 
 * GET /api/test/notifications?userId=user_id&scenario=real
 */
export async function testNotificationsAPI(
  userId: string,
  scenario: string = 'single'
) {
  try {
    switch (scenario) {
      case 'real':
        return await NotificationTestHelpers.simulateRealScenario(userId)
      
      case 'multiple':
        return await NotificationTestHelpers.testMultipleNotifications(userId)
      
      case 'budget':
        return await NotificationTestHelpers.testBudgetExceededNotification(userId)
      
      case 'security':
        return await NotificationTestHelpers.testSecurityAlert(userId)
      
      case 'welcome':
        return await NotificationTestHelpers.testWelcomeNotification(userId)
      
      default:
        return await NotificationTestHelpers.testTransactionNotification(userId)
    }
  } catch (error) {
    console.error('Erro no teste de notificações:', error)
    throw error
  }
}

/**
 * Hook personalizado para testes no frontend
 */
export function useNotificationTests() {
  const runTest = async (userId: string, testType: string) => {
    try {
      const response = await fetch(`/api/test/notifications?userId=${userId}&scenario=${testType}`)
      return await response.json()
    } catch (error) {
      console.error('Erro ao executar teste:', error)
      throw error
    }
  }

  return { runTest }
}
