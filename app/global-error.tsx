'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  RefreshCw, 
  Home, 
  AlertCircle, 
  Skull,
  Coffee,
  Lightbulb,
  Shield
} from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [panicLevel, setPanicLevel] = useState(1)
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(false)
  const [konamiCode, setKonamiCode] = useState<string[]>([])
  const [showKonamiEgg, setShowKonamiEgg] = useState(false)

  // Konami Code sequence: ↑↑↓↓←→←→BA
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newCode = [...konamiCode, event.code].slice(-10)
      setKonamiCode(newCode)
      
      if (newCode.join(',') === konamiSequence.join(',')) {
        setShowKonamiEgg(true)
        setTimeout(() => setShowKonamiEgg(false), 5000)
        setKonamiCode([])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konamiCode])

  // Increase panic level over time
  useEffect(() => {
    const timer = setInterval(() => {
      setPanicLevel(prev => Math.min(prev + 1, 5))
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  const getPanicEmoji = () => {
    switch (panicLevel) {
      case 1: return '😐'
      case 2: return '😟'
      case 3: return '😰'
      case 4: return '🤯'
      case 5: return '💀'
      default: return '😐'
    }
  }

  const getPanicMessage = () => {
    switch (panicLevel) {
      case 1: return "Tudo bem, apenas um pequeno problema..."
      case 2: return "Hmm, isso é mais sério do que pensávamos..."
      case 3: return "OK, agora estamos um pouco preocupados..."
      case 4: return "ALERTA VERMELHO! Isso é crítico!"
      case 5: return "MAYDAY! MAYDAY! Chame os desenvolvedores!"
      default: return "Status desconhecido"
    }
  }

  const emergencyTips = [
    "💾 Seus dados estão seguros - eles são mais protegidos que um cofre!",
    "🔄 Recarregar a página resolve 90% dos problemas (estatística inventada)",
    "☕ Um café sempre ajuda em situações de crise",
    "🧘 Respire fundo - suas finanças não foram para o espaço",
    "📱 Tente acessar pelo celular se estiver no computador"
  ]

  return (
    <html lang="pt-BR">
      <body className="m-0 p-0">
        <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-black text-white relative overflow-hidden">
          {/* Dramatic background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-red-500/5 animate-pulse"></div>
            {Array.from({ length: panicLevel }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-32 h-32 bg-red-500/10 rounded-full blur-2xl animate-ping`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              ></div>
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              {/* Panic indicator */}
              <div className="space-y-4">
                <div className="text-8xl animate-bounce">
                  {getPanicEmoji()}
                </div>
                
                <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
                  ERRO CRÍTICO
                </h1>

                <div className="flex items-center justify-center space-x-2 text-xl">
                  <Skull className="h-6 w-6 text-red-400 animate-bounce" />
                  <span className="text-red-300">{getPanicMessage()}</span>
                  <Skull className="h-6 w-6 text-red-400 animate-bounce" />
                </div>
              </div>

              {/* Konami code easter egg */}
              {showKonamiEgg && (
                <Card className="bg-gradient-to-r from-rainbow-500 to-purple-500 border-yellow-400 animate-pulse">
                  <CardContent className="p-6">
                    <div className="text-center space-y-2">
                      <div className="text-4xl">🎮</div>
                      <h3 className="text-xl font-bold text-yellow-200">CÓDIGO KONAMI ATIVADO!</h3>
                      <p className="text-yellow-300">
                        Você desbloqueou o modo desenvolvedor! 🚀
                      </p>
                      <p className="text-sm text-yellow-400">
                        Infelizmente, isso não conserta o erro... mas é legal! 😄
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Main error card */}
              <Card className="bg-gray-900/80 border-red-800 backdrop-blur-sm">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <AlertCircle className="h-8 w-8 text-red-400 animate-pulse" />
                    <h2 className="text-2xl font-bold text-red-300">
                      Falha Crítica do Sistema
                    </h2>
                  </div>

                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                    <p className="text-red-200 text-center">
                      Algo muito sério aconteceu. Isso não deveria ter acontecido, 
                      mas aconteceu. É como gastar todo o salário no primeiro dia do mês... 
                      mas pior! 💸
                    </p>
                  </div>

                  {/* Panic level indicator */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Nível de Pânico:</span>
                      <span className="text-lg font-bold text-red-400">{panicLevel}/5</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-red-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(panicLevel / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Emergency actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      onClick={reset}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Tentativa de Ressuscitação
                    </Button>

                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Reinicialização Completa
                    </Button>

                    <Button
                      onClick={() => window.location.href = '/'}
                      variant="outline"
                      className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Fuga para Casa
                    </Button>

                    <Button
                      onClick={() => setShowEmergencyHelp(!showEmergencyHelp)}
                      variant="outline"
                      className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                    >
                      <Lightbulb className="mr-2 h-4 w-4" />
                      SOS
                    </Button>
                  </div>

                  {/* Emergency help */}
                  {showEmergencyHelp && (
                    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 space-y-3">
                      <h3 className="font-bold text-blue-300 flex items-center">
                        <Coffee className="mr-2 h-4 w-4" />
                        Dicas de Emergência
                      </h3>
                      {emergencyTips.map((tip, index) => (
                        <p key={index} className="text-blue-200 text-sm">
                          {tip}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Technical details */}
                  <details className="bg-gray-800/50 rounded-lg p-4 cursor-pointer">
                    <summary className="font-semibold text-gray-300 mb-2">
                      Detalhes Técnicos (Para os Corajosos)
                    </summary>
                    <div className="text-xs text-gray-400 font-mono space-y-2">
                      <p><strong>Erro:</strong> {error.message}</p>
                      {error.digest && (
                        <p><strong>ID do Erro:</strong> {error.digest}</p>
                      )}
                      <p><strong>Timestamp:</strong> {new Date().toLocaleString('pt-BR')}</p>
                      <p><strong>Stack Trace:</strong></p>
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap bg-black/50 p-2 rounded">
                        {error.stack}
                      </pre>
                    </div>
                  </details>

                  {/* Fun footer */}
                  <div className="text-center text-gray-500 text-sm space-y-1 border-t border-gray-700 pt-4">
                    <p>💡 Dica: Tente o código Konami (↑↑↓↓←→←→BA) para um easter egg!</p>
                    <p>Seus dados financeiros estão mais seguros que um cofre suíço 🏦</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
