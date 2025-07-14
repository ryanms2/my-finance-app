import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { getUserNotifications, getUnreadNotificationCount } from '@/lib/notifications/service'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // Buscar notificações usando o userId da session do servidor
    const [notifications, unreadCount] = await Promise.all([
      getUserNotifications(session.user.id, { limit, offset, unreadOnly }),
      getUnreadNotificationCount(session.user.id),
    ])

    return NextResponse.json({
      notifications,
      unreadCount,
      total: notifications.length,
    })
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
