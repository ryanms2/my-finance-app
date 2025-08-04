import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth-server'
import { unregisterPushSubscription } from '@/lib/notifications/push'

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { endpoint } = await request.json()
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint é obrigatório' },
        { status: 400 }
      )
    }

    // Cancelar a inscrição de push notifications
    const success = await unregisterPushSubscription(userId, endpoint)
    
    if (success) {
      return NextResponse.json({ 
        success: true,
        message: 'Push notifications desabilitadas com sucesso',
        endpoint 
      })
    } else {
      return NextResponse.json(
        { error: 'Erro ao desabilitar push notifications' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erro ao cancelar inscrição de notificações:', error)
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Endpoint para cancelar inscrição de notificações',
    method: 'POST obrigatório',
    body: {
      endpoint: 'string (obrigatório) - endpoint da push subscription a ser removida'
    }
  })
}
