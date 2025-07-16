import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { markNotificationAsRead } from '@/lib/notifications/service'

interface Params {
  id: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const success = await markNotificationAsRead(id)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Notificação não encontrada ou não autorizado' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
