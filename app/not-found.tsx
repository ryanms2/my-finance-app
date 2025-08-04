'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Coins, TrendingUp, Wallet, PiggyBank } from 'lucide-react'

export default function NotFoundPage() {
  const router = useRouter()
  const [floatingCoins, setFloatingCoins] = useState<{ id: number; x: number; y: number; delay: number }[]>([])
  const [clickCount, setClickCount] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  // Gerar moedas flutuantes
  useEffect(() => {
    const coins = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }))
    setFloatingCoins(coins)
  }, [])

  // Easter egg ao clicar no erro 404
  const handleErrorClick = () => {
    setClickCount(prev => prev + 1)
    if (clickCount >= 4) {
      setShowEasterEgg(true)
      setTimeout(() => setShowEasterEgg(false), 3000)
    }
  }

  const messages = [
    "Ops! Parece que suas moedas fugiram para esta página...",
    "Esta página está mais perdida que dinheiro no sofá! 🛋️",
    "404: Página não encontrada, mas sua disciplina financeira ainda está aqui! 💪",
    "Parece que você investiu na página errada... 📈"
  ]

  const [currentMessage] = useState(() => 
    messages[Math.floor(Math.random() * messages.length)]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Floating coins animation */}
      {floatingCoins.map((coin) => (
        <div
          key={coin.id}
          className="absolute opacity-20 text-yellow-400 animate-bounce"
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            animationDelay: `${coin.delay}s`,
            animationDuration: '3s'
          }}
        >
          <Coins className="h-8 w-8" />
        </div>
      ))}

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Main error display */}
          <div className="space-y-4">
            <div 
              className="inline-block cursor-pointer transition-transform hover:scale-105"
              onClick={handleErrorClick}
            >
              <h1 className="text-9xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
                404
              </h1>
            </div>
            
            {showEasterEgg && (
              <div className="animate-bounce">
                <PiggyBank className="h-16 w-16 mx-auto text-pink-500 animate-spin" />
                <p className="text-pink-400 text-sm mt-2">
                  🎉 Você encontrou o porquinho perdido! Ele guardava todas as páginas! 🎉
                </p>
              </div>
            )}
          </div>

          {/* Message card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <Wallet className="h-16 w-16 text-purple-500" />
                    <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                      !
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white">
                  Página Não Encontrada
                </h2>

                <p className="text-gray-400 text-lg">
                  {currentMessage}
                </p>

                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-sm text-gray-300">
                    <span className="text-green-400 font-semibold">💡 Dica:</span> 
                    {" "}Que tal aproveitar para verificar seus gastos no dashboard? 
                    Suas finanças não podem se perder como esta página! 📊
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700 hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>

                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Ir para Dashboard
                </Button>

                <Button
                  onClick={() => router.push('/transactions')}
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Ver Transações
                </Button>
              </div>

              {/* Fun stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-blue-400">∞</div>
                  <div className="text-xs text-gray-400">Páginas possíveis</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-green-400">1</div>
                  <div className="text-xs text-gray-400">Página perdida</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-purple-400">{clickCount}</div>
                  <div className="text-xs text-gray-400">Cliques no 404</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional help text */}
          <p className="text-gray-500 text-sm">
            Se você acredita que isso é um erro, que tal investir em nos contatar? 📧
          </p>
        </div>
      </div>
    </div>
  )
}
