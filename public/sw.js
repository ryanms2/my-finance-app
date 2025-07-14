// Service Worker para Push Notifications
const CACHE_NAME = 'myfinance-v1'

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado')
  self.skipWaiting()
})

// Ativar service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado')
  event.waitUntil(self.clients.claim())
})

// Interceptar push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification recebida')
  
  if (!event.data) {
    console.log('Push notification sem dados')
    return
  }

  try {
    const data = event.data.json()
    console.log('Dados da push notification:', data)

    const options = {
      body: data.body || data.message,
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/badge-72x72.png',
      tag: data.tag || `notification-${Date.now()}`,
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      silent: false,
      vibrate: [200, 100, 200],
      timestamp: Date.now(),
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'MyFinance', options)
    )
  } catch (error) {
    console.error('Erro ao processar push notification:', error)
    
    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('MyFinance', {
        body: 'Você tem uma nova notificação',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
      })
    )
  }
})

// Manipular cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada:', event.notification)
  
  event.notification.close()
  
  const data = event.notification.data || {}
  let urlToOpen = '/'

  // Determinar URL baseada na ação ou dados
  if (event.action === 'open' && data.actionUrl) {
    urlToOpen = data.actionUrl
  } else if (data.actionUrl) {
    urlToOpen = data.actionUrl
  } else if (data.type) {
    // Mapear tipos para URLs específicas
    switch (data.type) {
      case 'TRANSACTION_CREATED':
      case 'TRANSACTION_UPDATED':
      case 'TRANSACTION_DELETED':
        urlToOpen = '/transactions'
        break
      case 'BUDGET_EXCEEDED':
      case 'BUDGET_WARNING':
      case 'BUDGET_ACHIEVEMENT':
        urlToOpen = '/budgets'
        break
      case 'TRANSFER_COMPLETED':
        urlToOpen = '/wallets'
        break
      case 'PAYMENT_DUE':
        urlToOpen = '/transactions'
        break
      default:
        urlToOpen = '/dashboard'
    }
  }

  // Abrir ou focar na janela
  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Verificar se já existe uma janela aberta
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            data: data,
            url: urlToOpen
          })
          return client.focus()
        }
      }
      
      // Se não há janela aberta, abrir uma nova
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen)
      }
    })
  )
})

// Manipular fechamento de notificações
self.addEventListener('notificationclose', (event) => {
  console.log('Notificação fechada:', event.notification)
  
  // Opcional: enviar analytics sobre notificações fechadas
  const data = event.notification.data || {}
  
  // Enviar evento para analytics (se necessário)
  if (data.id) {
    // fetch('/api/analytics/notification-closed', { ... })
  }
})

// Background sync (para funcionalidades offline futuras)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Implementar sincronização em background
    console.log('Executando sincronização em background')
  } catch (error) {
    console.error('Erro na sincronização em background:', error)
  }
}

// Manipular mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('Mensagem recebida no SW:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Cache para recursos estáticos (opcional)
self.addEventListener('fetch', (event) => {
  // Implementar cache strategies se necessário
  // Por enquanto, deixar passar todas as requests
})
