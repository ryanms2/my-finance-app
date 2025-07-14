/**
 * Sistema global de gerenciamento de conexões SSE
 */

interface SSEConnection {
  write: (data: string) => Promise<void>
  close: () => void
}

// Map global para conexões ativas
export const sseConnections = new Map<string, SSEConnection>()

/**
 * Registra uma nova conexão SSE
 */
export function registerSSEConnection(userId: string, connection: SSEConnection) {
  sseConnections.set(userId, connection)
  console.log(`✅ [DEBUG] Conexão SSE registrada para usuário: ${userId}`)
  console.log(`📋 [DEBUG] Total de conexões ativas: ${sseConnections.size}`)
}

/**
 * Remove uma conexão SSE
 */
export function unregisterSSEConnection(userId: string) {
  sseConnections.delete(userId)
  console.log(`🛑 [DEBUG] Conexão SSE removida para usuário: ${userId}`)
  console.log(`📋 [DEBUG] Total de conexões ativas: ${sseConnections.size}`)
}

/**
 * Envia notificação via SSE
 */
export async function sendSSENotification(userId: string, notification: any): Promise<boolean> {
  try {
    console.log(`🔄 [DEBUG] Tentando enviar notificação SSE para usuário: ${userId}`)
    
    const connection = sseConnections.get(userId)
    
    if (!connection) {
      console.warn(`⚠️ [DEBUG] Conexão SSE não encontrada para usuário: ${userId}`)
      console.log(`📋 [DEBUG] Conexões ativas disponíveis:`, Array.from(sseConnections.keys()))
      return false
    }

    const data = JSON.stringify({
      type: 'notification',
      data: notification,
      timestamp: Date.now()
    })
    
    await connection.write(`data: ${data}\n\n`)
    console.log(`✅ [DEBUG] Notificação SSE enviada com sucesso para usuário: ${userId}`)
    return true
  } catch (error) {
    console.error(`❌ [DEBUG] Erro ao enviar notificação SSE:`, error)
    sseConnections.delete(userId)
    return false
  }
}

/**
 * Obtém estatísticas das conexões SSE
 */
export function getSSEStats() {
  return {
    activeConnections: sseConnections.size,
    userIds: Array.from(sseConnections.keys())
  }
}
