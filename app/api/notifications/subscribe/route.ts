import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { registerPushSubscription } from '@/lib/notifications/push'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { subscription, userAgent } = await request.json()
    
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Dados de subscription inválidos' },
        { status: 400 }
      )
    }

    const success = await registerPushSubscription(
      session.user.id,
      subscription,
      userAgent
    )
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Erro ao registrar subscription' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erro ao registrar push subscription:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
