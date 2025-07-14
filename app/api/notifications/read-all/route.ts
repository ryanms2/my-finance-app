import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { markAllNotificationsAsRead } from '@/lib/notifications/service'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const success = await markAllNotificationsAsRead()
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Erro ao marcar notificações como lidas' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
