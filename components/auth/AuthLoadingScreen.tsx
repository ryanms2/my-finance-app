'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'

export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white flex items-center justify-center">
              <Lock className="h-5 w-5 mr-2 text-purple-400" />
              Autenticando
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Verificando suas credenciais
            </CardDescription>
          </CardHeader>
          
          <CardContent className="py-8 flex flex-col items-center justify-center">
            <div className="relative h-16 w-16">
              {/* Círculos animados para efeito de carregamento */}
              <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 border-r-purple-400 border-b-blue-500 border-l-blue-400 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-purple-500 border-b-transparent border-l-blue-500 animate-spin animate-delay-150"></div>
              <div className="absolute inset-4 rounded-full border-2 border-t-blue-400 border-r-transparent border-b-purple-400 border-l-transparent animate-spin animate-delay-300 animate-reverse"></div>
            </div>
            
            <p className="mt-6 text-gray-300 text-sm animate-pulse">
              Acesso seguro em processamento...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
