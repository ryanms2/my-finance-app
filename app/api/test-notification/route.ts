import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { notificationHelpers } from '@/lib/notifications/manager'

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 [DEBUG] Endpoint de teste de notificação chamado")
    
    const session = await auth()
    if (!session?.user?.id) {
      console.log("❌ [DEBUG] Usuário não autorizado")
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    console.log("👤 [DEBUG] Criando notificação de teste para usuário:", session.user.id)

    // Criar uma notificação de teste
    const result = await notificationHelpers.transactionCreated(session.user.id, {
      type: 'EXPENSE',
      amount: 50.00,
      description: 'Compra de teste via API'
    })

    console.log("📊 [DEBUG] Resultado da criação:", result)

    return NextResponse.json({
      success: result,
      message: result ? 'Notificação de teste criada!' : 'Falha ao criar notificação'
    })
  } catch (error) {
    console.error('❌ [DEBUG] Erro no endpoint de teste:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
