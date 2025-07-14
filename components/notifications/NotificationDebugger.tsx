'use client'

import { useNotifications } from "@/lib/notifications/client"
import { useEffect } from "react"

export function NotificationDebugger() {
  const { notifications, unreadCount, isConnected } = useNotifications()

  useEffect(() => {
    console.log("🔍 [DEBUG] NotificationDebugger montado")
    console.log("📊 [DEBUG] Estado atual:", { 
      notificationsCount: notifications.length, 
      unreadCount, 
      isConnected 
    })
  }, [notifications.length, unreadCount, isConnected])

  // Função para testar polling manual
  const testPolling = async () => {
    try {
      console.log("🧪 [DEBUG] Testando polling manual...")
      const response = await fetch('/api/notifications')
      console.log("📡 [DEBUG] Status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("📋 [DEBUG] Dados recebidos:", data)
      } else {
        const error = await response.text()
        console.log("❌ [DEBUG] Erro:", error)
      }
    } catch (error) {
      console.error("❌ [DEBUG] Erro no fetch:", error)
    }
  }

  // Função para criar notificação de teste
  const createTestNotification = async () => {
    try {
      console.log("🧪 [DEBUG] Criando notificação de teste...")
      const response = await fetch('/api/test-notification', {
        method: 'POST',
      })
      console.log("📡 [DEBUG] Status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("📋 [DEBUG] Resultado:", data)
      } else {
        const error = await response.text()
        console.log("❌ [DEBUG] Erro:", error)
      }
    } catch (error) {
      console.error("❌ [DEBUG] Erro no teste:", error)
    }
  }

  return (
    <div className="fixed top-20 right-4 bg-black/80 text-white p-4 rounded-lg z-50 space-y-2">
      <h3 className="text-sm font-bold">Debug Notificações</h3>
      <div className="text-xs space-y-1">
        <div>Notificações: {notifications.length}</div>
        <div>Não lidas: {unreadCount}</div>
        <div>Conectado: {isConnected ? 'Sim' : 'Não'}</div>
      </div>
      <div className="space-y-1">
        <button 
          onClick={testPolling}
          className="block w-full text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
        >
          Testar Polling
        </button>
        <button 
          onClick={createTestNotification}
          className="block w-full text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
        >
          Criar Teste
        </button>
      </div>
    </div>
  )
}
