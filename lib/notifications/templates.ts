import { NotificationTemplate, NotificationType } from './types'

// Templates para diferentes tipos de notificação
export const notificationTemplates: Record<NotificationType, NotificationTemplate> = {
  TRANSACTION_CREATED: {
    type: 'TRANSACTION_CREATED',
    title: (data) => `Nova transação: ${data.type === 'income' ? 'Receita' : 'Despesa'}`,
    message: (data) => `${data.type === 'income' ? '+' : '-'}R$ ${data.amount} - ${data.description}`,
    channels: ['in_app'],
    priority: 'low',
  },

  TRANSACTION_UPDATED: {
    type: 'TRANSACTION_UPDATED',
    title: () => 'Transação atualizada',
    message: (data) => `Transação "${data.description}" foi modificada`,
    channels: ['in_app'],
    priority: 'low',
  },

  TRANSACTION_DELETED: {
    type: 'TRANSACTION_DELETED',
    title: () => 'Transação excluída',
    message: (data) => `Transação "${data.description}" foi removida`,
    channels: ['in_app'],
    priority: 'low',
  },

  BUDGET_EXCEEDED: {
    type: 'BUDGET_EXCEEDED',
    title: () => '🚨 Orçamento excedido!',
    message: (data) => `Você excedeu seu orçamento de ${data.categoryName} em R$ ${data.exceededAmount}`,
    channels: ['in_app', 'push', 'email'],
    priority: 'high',
    expiresInHours: 24,
  },

  BUDGET_WARNING: {
    type: 'BUDGET_WARNING',
    title: () => '⚠️ Atenção: Orçamento próximo do limite',
    message: (data) => `Você já gastou ${data.percentage}% do orçamento de ${data.categoryName}`,
    channels: ['in_app', 'push'],
    priority: 'medium',
    expiresInHours: 12,
  },

  BUDGET_ACHIEVEMENT: {
    type: 'BUDGET_ACHIEVEMENT',
    title: () => '🎉 Parabéns! Meta atingida',
    message: (data) => `Você manteve-se dentro do orçamento de ${data.categoryName} este mês!`,
    channels: ['in_app', 'push'],
    priority: 'low',
    expiresInHours: 48,
  },

  GOAL_ACHIEVED: {
    type: 'GOAL_ACHIEVED',
    title: () => '🏆 Meta de economia atingida!',
    message: (data) => `Parabéns! Você atingiu sua meta de R$ ${data.goalAmount}`,
    channels: ['in_app', 'push', 'email'],
    priority: 'medium',
    expiresInHours: 72,
  },

  PAYMENT_DUE: {
    type: 'PAYMENT_DUE',
    title: (data) => `💳 Vencimento em ${data.daysUntilDue} dias`,
    message: (data) => `${data.description} vence em ${data.dueDate}`,
    channels: ['in_app', 'push', 'email'],
    priority: 'high',
    expiresInHours: 1,
  },

  TRANSFER_COMPLETED: {
    type: 'TRANSFER_COMPLETED',
    title: () => '✅ Transferência realizada',
    message: (data) => `R$ ${data.amount} transferidos de ${data.fromAccount} para ${data.toAccount}`,
    channels: ['in_app', 'push'],
    priority: 'medium',
    expiresInHours: 6,
  },

  ACCOUNT_LOW_BALANCE: {
    type: 'ACCOUNT_LOW_BALANCE',
    title: () => '⚠️ Saldo baixo',
    message: (data) => `Sua conta ${data.accountName} está com saldo baixo: R$ ${data.balance}`,
    channels: ['in_app', 'push'],
    priority: 'medium',
    expiresInHours: 12,
  },

  SECURITY_ALERT: {
    type: 'SECURITY_ALERT',
    title: () => '🔒 Alerta de segurança',
    message: (data) => `${data.message}`,
    channels: ['in_app', 'push', 'email'],
    priority: 'urgent',
    expiresInHours: 1,
  },

  SYSTEM_UPDATE: {
    type: 'SYSTEM_UPDATE',
    title: () => '📱 Atualização disponível',
    message: (data) => `Nova versão disponível: ${data.version} - ${data.features}`,
    channels: ['in_app'],
    priority: 'low',
    expiresInHours: 168, // 1 semana
  },

  WELCOME: {
    type: 'WELCOME',
    title: () => '👋 Bem-vindo ao MyFinance!',
    message: () => 'Complete seu perfil e comece a organizar suas finanças',
    channels: ['in_app'],
    priority: 'medium',
    expiresInHours: 72,
  },
}

// Função para obter o ícone baseado no tipo
export function getNotificationIcon(type: NotificationType): string {
  const iconMap: Record<NotificationType, string> = {
    TRANSACTION_CREATED: '💰',
    TRANSACTION_UPDATED: '✏️',
    TRANSACTION_DELETED: '🗑️',
    BUDGET_EXCEEDED: '🚨',
    BUDGET_WARNING: '⚠️',
    BUDGET_ACHIEVEMENT: '🎉',
    GOAL_ACHIEVED: '🏆',
    PAYMENT_DUE: '💳',
    TRANSFER_COMPLETED: '✅',
    ACCOUNT_LOW_BALANCE: '⚠️',
    SECURITY_ALERT: '🔒',
    SYSTEM_UPDATE: '📱',
    WELCOME: '👋',
  }
  
  return iconMap[type] || '🔔'
}

// Função para obter a cor baseada na prioridade
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
      return 'border-l-red-600 bg-red-50/10'
    case 'high':
      return 'border-l-red-500 bg-red-50/5'
    case 'medium':
      return 'border-l-orange-500 bg-orange-50/5'
    case 'low':
    default:
      return 'border-l-blue-500 bg-blue-50/5'
  }
}
