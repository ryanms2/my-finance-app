import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { unregisterPushSubscription } from '@/lib/notifications/push'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { endpoint } = await request.json()
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint é obrigatório' },
        { status: 400 }
      )
    }

    const success = await unregisterPushSubscription(session.user.id, endpoint)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Erro ao remover subscription' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erro ao remover push subscription:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
