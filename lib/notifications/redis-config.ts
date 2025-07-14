/**
 * Configuração opcional do Redis para Socket.IO
 * Este módulo gerencia a configuração do Redis adapter de forma dinâmica
 */

import type { Server as SocketIOServer } from 'socket.io'

/**
 * Configura o Redis adapter para Socket.IO se disponível
 */
export async function configureRedisAdapter(io: SocketIOServer): Promise<boolean> {
  // Verificar se Redis está configurado
  if (!process.env.REDIS_URL) {
    console.log('Socket.IO: Redis não configurado, usando adapter padrão')
    return false
  }

  try {
    // Importação dinâmica do Redis
    const { createClient } = await import('redis')
    const { createAdapter } = await import('@socket.io/redis-adapter')

    console.log('Socket.IO: Configurando Redis adapter...')

    const pubClient = createClient({ 
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
      }
    })
    
    const subClient = pubClient.duplicate()

    // Configurar event handlers de erro
    pubClient.on('error', (err) => {
      console.error('Redis pub client error:', err)
    })

    subClient.on('error', (err) => {
      console.error('Redis sub client error:', err)
    })

    // Conectar aos clientes Redis
    await Promise.all([
      pubClient.connect(),
      subClient.connect()
    ])

    // Configurar o adapter
    io.adapter(createAdapter(pubClient, subClient))
    
    console.log('✅ Socket.IO: Redis adapter configurado com sucesso')
    return true

  } catch (error) {
    console.warn('⚠️ Socket.IO: Falha ao configurar Redis adapter, usando adapter padrão')
    console.error('Erro detalhado:', error)
    return false
  }
}

/**
 * Testa a conectividade do Redis
 */
export async function testRedisConnection(): Promise<boolean> {
  if (!process.env.REDIS_URL) {
    return false
  }

  try {
    const { createClient } = await import('redis')
    const client = createClient({ url: process.env.REDIS_URL })
    
    await client.connect()
    await client.ping()
    await client.disconnect()
    
    console.log('✅ Redis: Conectividade testada com sucesso')
    return true
  } catch (error) {
    console.error('❌ Redis: Teste de conectividade falhou:', error)
    return false
  }
}

/**
 * Obtém informações sobre a configuração do Redis
 */
export function getRedisInfo() {
  return {
    configured: !!process.env.REDIS_URL,
    url: process.env.REDIS_URL ? '***configurado***' : 'não configurado',
  }
}
