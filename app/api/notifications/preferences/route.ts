import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth-server'
import { getNotificationPreferences } from '@/lib/notifications/service'
import { prisma } from '@/utils/prisma/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const preferences = await getNotificationPreferences(userId)
    
    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Erro ao buscar preferências:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    
    const updatedPreferences = await prisma.notificationPreferences.upsert({
      where: { userId },
      update: {
        ...body,
        quietHours: body.quietHours ? JSON.stringify(body.quietHours) : undefined,
        updatedAt: new Date(),
      },
      create: {
        userId,
        enableInApp: body.enableInApp ?? true,
        enablePush: body.enablePush ?? true,
        enableEmail: body.enableEmail ?? false,
        budgetAlerts: body.budgetAlerts ?? true,
        transactionAlerts: body.transactionAlerts ?? true,
        securityAlerts: body.securityAlerts ?? true,
        marketingAlerts: body.marketingAlerts ?? false,
        quietHours: body.quietHours ? JSON.stringify(body.quietHours) : null,
      },
    })

    const responseData = {
      userId: updatedPreferences.userId,
      enableInApp: updatedPreferences.enableInApp,
      enablePush: updatedPreferences.enablePush,
      enableEmail: updatedPreferences.enableEmail,
      budgetAlerts: updatedPreferences.budgetAlerts,
      transactionAlerts: updatedPreferences.transactionAlerts,
      securityAlerts: updatedPreferences.securityAlerts,
      marketingAlerts: updatedPreferences.marketingAlerts,
      quietHours: updatedPreferences.quietHours 
        ? JSON.parse(updatedPreferences.quietHours)
        : { enabled: false, startTime: '22:00', endTime: '08:00' },
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Erro ao atualizar preferências:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
