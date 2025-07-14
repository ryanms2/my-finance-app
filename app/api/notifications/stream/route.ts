import { NextRequest } from 'next/server'
import { auth } from '@/app/auth'
import { registerSSEConnection, unregisterSSEConnection } from '@/lib/notifications/sse-manager'

export async function GET(request: NextRequest) {
  console.log('🔄 [DEBUG] === ENDPOINT SSE CHAMADO ===')
  console.log('🔄 [DEBUG] Request URL:', request.url)
  console.log('🔄 [DEBUG] Request headers:', Object.fromEntries(request.headers.entries()))
  
  try {
    const session = await auth()
    console.log('🔄 [DEBUG] Session obtida:', session ? 'SIM' : 'NÃO')
    
    if (!session?.user?.id) {
      console.error('❌ [DEBUG] Usuário não autenticado para SSE - Session:', session)
      return new Response('Unauthorized', { status: 401 })
    }

    const userId = session.user.id
    console.log('✅ [DEBUG] Usuário autenticado para SSE:', userId)

  // Configurar Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      console.log('🔄 [DEBUG] Stream SSE iniciado para usuário:', userId)
      
      // Armazenar a conexão
      const encoder = new TextEncoder()
      const connection = {
        write: async (data: string) => {
          try {
            controller.enqueue(encoder.encode(data))
            console.log('📤 [DEBUG] Dados SSE enviados para', userId, ':', data.slice(0, 100) + '...')
          } catch (error) {
            console.error('❌ [DEBUG] Erro ao enviar SSE:', error)
            throw error
          }
        },
        close: () => {
          try {
            controller.close()
            console.log('🛑 [DEBUG] Stream SSE fechado para usuário:', userId)
          } catch (error) {
            // Stream já fechado
          }
        }
      }
      
      // Registrar conexão ativa
      registerSSEConnection(userId, connection)

      // Enviar mensagem inicial
      connection.write(`data: ${JSON.stringify({ 
        type: 'connected', 
        userId,
        timestamp: Date.now() 
      })}\n\n`)

      // Heartbeat a cada 30 segundos
      const heartbeat = setInterval(() => {
        try {
          connection.write(`data: ${JSON.stringify({ 
            type: 'heartbeat', 
            timestamp: Date.now() 
          })}\n\n`)
        } catch (error) {
          console.error('❌ [DEBUG] Erro no heartbeat SSE:', error)
          clearInterval(heartbeat)
          unregisterSSEConnection(userId)
        }
      }, 30000)

      // Cleanup quando conexão fecha
      request.signal.addEventListener('abort', () => {
        console.log('🛑 [DEBUG] Conexão SSE abortada para usuário:', userId)
        clearInterval(heartbeat)
        unregisterSSEConnection(userId)
        connection.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
  } catch (error) {
    console.error('❌ [DEBUG] Erro geral no endpoint SSE:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
