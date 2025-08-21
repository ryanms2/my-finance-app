'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [errorTitle, setErrorTitle] = useState('Erro de autenticação')
  const [errorDescription, setErrorDescription] = useState('Ocorreu um erro durante a autenticação.')

  useEffect(() => {
    if (error) {
      console.log('Erro recebido:', error)
      
      switch(error) {
        case 'CredentialsSignin':
          setErrorTitle('Credenciais inválidas')
          setErrorDescription('Conta não encontrada ou senha incorreta. Verifique suas credenciais ou crie uma nova conta.')
          break;
        case 'OAuthAccountNotLinked':
          setErrorTitle('Conta já vinculada')
          setErrorDescription('Esta conta já está vinculada a outro provedor de autenticação.')
          break;
        case 'SessionRequired':
          setErrorTitle('Autenticação necessária')
          setErrorDescription('Você precisa estar autenticado para acessar esta página.')
          break;
        default:
          setErrorTitle('Erro inesperado')
          setErrorDescription('Ocorreu um erro inesperado durante a autenticação. Tente novamente mais tarde.')
      }
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/auth/signin" 
          className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao login
        </Link>
        
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-red-600/20 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center text-white">
              {errorTitle}
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              {errorDescription}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 text-center text-gray-300">
            <p>Se o problema persistir, por favor entre em contato com o suporte.</p>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              asChild
            >
              <Link href="/auth/signin">Tentar novamente</Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
              asChild
            >
              <Link href="/auth/register">Criar nova conta</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
