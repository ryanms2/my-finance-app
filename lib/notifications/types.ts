// Tipos para o sistema de notificações

export type NotificationType = 
  | 'TRANSACTION_CREATED'
  | 'TRANSACTION_UPDATED'
  | 'TRANSACTION_DELETED'
  | 'BUDGET_EXCEEDED'
  | 'BUDGET_WARNING'
  | 'BUDGET_ACHIEVEMENT'
  | 'GOAL_ACHIEVED'
  | 'PAYMENT_DUE'
  | 'TRANSFER_COMPLETED'
  | 'ACCOUNT_LOW_BALANCE'
  | 'SECURITY_ALERT'
  | 'SYSTEM_UPDATE'
  | 'WELCOME'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export type NotificationChannel = 
  | 'in_app'    // Notificação dentro do app
  | 'push'      // Push notification do browser
  | 'email'     // Email
  | 'sms'       // SMS (futuro)

export interface NotificationData {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  channels: NotificationChannel[]
  data?: Record<string, any> // Dados adicionais específicos do tipo
  read: boolean
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
  actionUrl?: string
  actionText?: string
}

export interface NotificationTemplate {
  type: NotificationType
  title: (data: any) => string
  message: (data: any) => string
  channels: NotificationChannel[]
  priority: NotificationPriority
  expiresInHours?: number
}

export interface PushSubscription {
  id: string
  userId: string
  endpoint: string
  p256dh: string
  auth: string
  userAgent?: string
  createdAt: Date
  isActive: boolean
}

export interface NotificationPreferences {
  userId: string
  enableInApp: boolean
  enablePush: boolean
  enableEmail: boolean
  budgetAlerts: boolean
  transactionAlerts: boolean
  securityAlerts: boolean
  marketingAlerts: boolean
  quietHours: {
    enabled: boolean
    startTime: string // "22:00"
    endTime: string   // "08:00"
  }
}

export interface RealTimeNotificationEvent {
  type: 'notification'
  data: NotificationData
  userId: string
  timestamp: number
}

export interface NotificationStats {
  total: number
  unread: number
  byType: Record<NotificationType, number>
  byPriority: Record<NotificationPriority, number>
}
