'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  RefreshCw, 
  Home, 
  AlertTriangle, 
  Bug, 
  Coffee, 
  Heart,
  Zap
} from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const [retryCount, setRetryCount] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [coffeeClicks, setCoffeeClicks] = useState(0)
  const [showCoffeeEgg, setShowCoffeeEgg] = useState(false)

  // Easter egg do café
  const handleCoffeeClick = () => {
    setCoffeeClicks(prev => prev + 1)
    if (coffeeClicks >= 4) {
      setShowCoffeeEgg(true)
      setTimeout(() => setShowCoffeeEgg(false), 4000)
    }
  }

  // Reset coffee clicks after showing easter egg
  useEffect(() => {
    if (showCoffeeEgg) {
      setCoffeeClicks(0)
    }
  }, [showCoffeeEgg])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    reset()
  }

  const errorMessages = [
    "Ops! Algo deu errado com suas finanças... digitais! 💸",
    "O erro apareceu mais rápido que uma compra por impulso! 🛒",
    "Houston, temos um problema! (Mas não é com seu orçamento) 🚀",
    "Este erro custou R$ 0,00 - pelo menos isso não afetou seu saldo! 💰"
  ]

  const [currentMessage] = useState(() => 
    errorMessages[Math.floor(Math.random() * errorMessages.length)]
  )

  const errorAdvice = [
    "💡 Enquanto consertamos isso, que tal revisar seus gastos do mês?",
    "🎯 Tempo perfeito para planejar sua próxima meta de economia!",
    "📊 Aproveite para dar uma olhada nos seus relatórios financeiros!",
    "💪 Erros acontecem, mas sua disciplina financeira não para!"
  ]

  const [currentAdvice] = useState(() => 
    errorAdvice[Math.floor(Math.random() * errorAdvice.length)]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Error icon and title */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle className="h-12 w-12 text-red-400" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Zap className="h-8 w-8 text-yellow-400 animate-bounce" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Oops! Algo deu errado
            </h1>

            <p className="text-xl text-gray-300">
              {currentMessage}
            </p>
          </div>

          {/* Main error card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              {/* Error message */}
              <Alert className="border-red-800 bg-red-900/20">
                <Bug className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {error.message || "Um erro inesperado aconteceu"}
                </AlertDescription>
              </Alert>

              {/* Advice card */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800">
                <p className="text-blue-200">
                  {currentAdvice}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar Novamente {retryCount > 0 && `(${retryCount})`}
                </Button>

                <Button
                  onClick={() => window.location.href = '/dashboard'}
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700 hover:text-white"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao Dashboard
                </Button>

                <Button
                  onClick={handleCoffeeClick}
                  variant="outline"
                  className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
                >
                  <Coffee className="mr-2 h-4 w-4" />
                  Precisa de café?
                </Button>
              </div>

              {/* Coffee easter egg */}
              {showCoffeeEgg && (
                <div className="animate-bounce bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg p-4 border border-orange-500/50">
                  <div className="text-center space-y-2">
                    <Coffee className="h-8 w-8 mx-auto text-orange-400 animate-spin" />
                    <p className="text-orange-200 font-semibold">
                      ☕ Café virtual servido! ☕
                    </p>
                    <p className="text-orange-300 text-sm">
                      Energias renovadas! Agora você pode conquistar suas metas financeiras! 💪
                    </p>
                  </div>
                </div>
              )}

              {/* Technical details toggle */}
              <div className="border-t border-gray-700 pt-4">
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-300"
                >
                  {showDetails ? 'Ocultar' : 'Mostrar'} detalhes técnicos
                </Button>

                {showDetails && (
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg text-left">
                    <p className="text-xs text-gray-400 font-mono break-all">
                      <strong>Erro:</strong> {error.message}
                    </p>
                    {error.digest && (
                      <p className="text-xs text-gray-400 font-mono mt-2">
                        <strong>ID:</strong> {error.digest}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      <strong>Stack:</strong> {error.stack?.slice(0, 200)}...
                    </p>
                  </div>
                )}
              </div>

              {/* Fun stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center space-y-1">
                  <div className="text-2xl">💻</div>
                  <div className="text-xs text-gray-400">Bugs encontrados</div>
                  <div className="text-lg font-bold text-red-400">1</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl">☕</div>
                  <div className="text-xs text-gray-400">Cafés solicitados</div>
                  <div className="text-lg font-bold text-orange-400">{coffeeClicks}</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl">🔄</div>
                  <div className="text-xs text-gray-400">Tentativas</div>
                  <div className="text-lg font-bold text-green-400">{retryCount}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer message */}
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <span>Feito com</span>
            <Heart className="h-4 w-4 text-red-400 animate-pulse" />
            <span>e muitos bugs para sua diversão</span>
          </div>
        </div>
      </div>
    </div>
  )
}
