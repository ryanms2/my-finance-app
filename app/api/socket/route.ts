import { NextRequest, NextResponse } from 'next/server'

// Endpoint simples para verificar status
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    status: 'info', 
    message: 'Socket.IO requer servidor customizado em Next.js. Usando polling como fallback.',
    timestamp: new Date().toISOString()
  })
}
