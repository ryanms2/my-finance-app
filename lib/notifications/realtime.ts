import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { NotificationData, RealTimeNotificationEvent } from './types'

let io: SocketIOServer | null = null

/**
 * Inicializa o servidor Socket.IO
 */
export function initializeSocketIO(httpServer: HTTPServer): SocketIOServer {
  if (io) {
    return io
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  // Configurar Redis adapter se disponível
  if (process.env.REDIS_URL) {
    const pubClient = createClient({ url: process.env.REDIS_URL })
    const subClient = pubClient.duplicate()

    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      io!.adapter(createAdapter(pubClient, subClient))
      console.log('Socket.IO configurado com Redis adapter')
    }).catch((error) => {
      console.error('Erro ao conectar com Redis:', error)
    })
  }

  // Middleware de autenticação
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization
      
      // Validar token de autenticação aqui
      // Por simplicidade, vamos usar um token simples
      if (!token) {
        return next(new Error('Token de autenticação necessário'))
      }

      // Anexar userId ao socket
      const userId = socket.handshake.auth.userId
      if (!userId) {
        return next(new Error('ID do usuário necessário'))
      }

      socket.data.userId = userId
      next()
    } catch (error) {
      next(new Error('Falha na autenticação'))
    }
  })

  // Eventos de conexão
  io.on('connection', (socket) => {
    const userId = socket.data.userId
    console.log(`Usuário ${userId} conectado via Socket.IO`)

    // Entrar no room do usuário
    socket.join(`user:${userId}`)

    // Eventos personalizados
    socket.on('join-room', (room: string) => {
      socket.join(room)
      console.log(`Usuário ${userId} entrou no room: ${room}`)
    })

    socket.on('leave-room', (room: string) => {
      socket.leave(room)
      console.log(`Usuário ${userId} saiu do room: ${room}`)
    })

    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() })
    })

    socket.on('disconnect', (reason) => {
      console.log(`Usuário ${userId} desconectado: ${reason}`)
    })
  })

  console.log('Socket.IO inicializado')
  return io
}

/**
 * Envia notificação em tempo real para um usuário
 */
export function sendRealTimeNotification(
  userId: string,
  notification: NotificationData
): boolean {
  if (!io) {
    console.warn('Socket.IO não inicializado')
    return false
  }

  try {
    const event: RealTimeNotificationEvent = {
      type: 'notification',
      data: notification,
      userId,
      timestamp: Date.now(),
    }

    // Enviar para o room específico do usuário
    io.to(`user:${userId}`).emit('notification', event)
    
    console.log(`Notificação em tempo real enviada para usuário ${userId}`)
    return true
  } catch (error) {
    console.error('Erro ao enviar notificação em tempo real:', error)
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
  if (!io) {
    console.warn('Socket.IO não inicializado')
    return { success: 0, failed: userIds.length }
  }

  let success = 0
  let failed = 0

  userIds.forEach((userId) => {
    try {
      const notificationData: NotificationData = {
        ...notification,
        userId,
      }

      const event: RealTimeNotificationEvent = {
        type: 'notification',
        data: notificationData,
        userId,
        timestamp: Date.now(),
      }

      io!.to(`user:${userId}`).emit('notification', event)
      success++
    } catch (error) {
      console.error(`Erro ao enviar notificação para usuário ${userId}:`, error)
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
  if (!io) {
    console.warn('Socket.IO não inicializado')
    return false
  }

  try {
    io.emit('broadcast', {
      type: 'notification',
      data: notification,
      timestamp: Date.now(),
    })

    console.log('Broadcast de notificação enviado')
    return true
  } catch (error) {
    console.error('Erro ao enviar broadcast:', error)
    return false
  }
}

/**
 * Obtém estatísticas do Socket.IO
 */
export function getSocketIOStats() {
  if (!io) {
    return null
  }

  return {
    connectedClients: io.sockets.sockets.size,
    rooms: Array.from(io.sockets.adapter.rooms.keys()),
  }
}

/**
 * Desconecta um usuário específico
 */
export function disconnectUser(userId: string): boolean {
  if (!io) {
    return false
  }

  try {
    const sockets = io.sockets.in(`user:${userId}`)
    sockets.disconnectSockets()
    
    console.log(`Usuário ${userId} desconectado forçadamente`)
    return true
  } catch (error) {
    console.error(`Erro ao desconectar usuário ${userId}:`, error)
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
  if (!io) {
    console.warn('Socket.IO não inicializado')
    return false
  }

  try {
    io.to(`user:${userId}`).emit(eventName, {
      ...data,
      timestamp: Date.now(),
    })

    return true
  } catch (error) {
    console.error(`Erro ao enviar evento customizado ${eventName}:`, error)
    return false
  }
}
