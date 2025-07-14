/**
 * Módulo para envio de notificações via Server-Sent Events (SSE)
 */

// Função para enviar notificação via SSE
export function sendSSENotification(userId: string, notification: any): boolean {
  try {
    console.log(`🔄 [DEBUG] Tentando enviar notificação SSE para usuário: ${userId}`)
    
    // Importar dinamicamente as conexões ativas
    import('../../../app/api/notifications/stream/route').then(({ activeConnections }) => {
      const connection = activeConnections.get(userId)
      
      if (!connection) {
        console.warn(`⚠️ [DEBUG] Conexão SSE não encontrada para usuário: ${userId}`)
        console.log(`📋 [DEBUG] Conexões ativas disponíveis:`, Array.from(activeConnections.keys()))
        return false
      }

      const data = JSON.stringify({
        type: 'notification',
        data: notification,
        timestamp: Date.now()
      })
      
      connection.write(`data: ${data}\n\n`).then(() => {
        console.log(`✅ [DEBUG] Notificação SSE enviada com sucesso para usuário: ${userId}`)
      }).catch((error) => {
        console.error(`❌ [DEBUG] Erro ao enviar notificação SSE:`, error)
        activeConnections.delete(userId)
      })
      
      return true
    }).catch((error) => {
      console.error('❌ [DEBUG] Erro ao importar activeConnections:', error)
    })

    // Retornar true otimisticamente
    return true
  } catch (error) {
    console.error(`❌ [DEBUG] Erro geral ao enviar notificação SSE:`, error)
    return false
  }
}
