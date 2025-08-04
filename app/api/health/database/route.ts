import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    await prisma.$connect()
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database health check failed:', error)
    
    return NextResponse.json(
      { 
        status: 'unhealthy',
        database: 'disconnected',
        error: 'Database connection failed',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}
