"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, AlertCircle, CheckCircle, User, Mail, InfoIcon } from "lucide-react"
import { updateUserProfile } from "@/lib/data"

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileFormProps {
  user: User | null;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [name, setName] = useState(user?.name || '')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
    }
  }, [user])

  const handleNameChange = (value: string) => {
    setName(value)
    setAlert(null) // Limpar alertas ao digitar
  }

  const validateForm = () => {
    if (!name.trim()) {
      setAlert({ type: 'error', message: 'O nome é obrigatório' })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Verificar se houve mudanças
    if (name === (user?.name || '')) {
      setAlert({ type: 'error', message: 'Nenhuma alteração foi feita' })
      return
    }

    setIsLoading(true)
    
    try {
      const result = await updateUserProfile({
        name: name.trim()
      })

      if (result.success) {
        setAlert({ type: 'success', message: result.message })
        // Recarregar a página após sucesso para atualizar os dados
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setAlert({ type: 'error', message: result.message })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Erro ao atualizar perfil. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Carregando informações do usuário...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {alert && (
        <Alert className={`${
          alert.type === 'error' 
            ? 'border-red-500/50 bg-red-500/10 text-red-400' 
            : 'border-green-500/50 bg-green-500/10 text-green-400'
        }`}>
          {alert.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Nome Completo
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Digite seu nome completo"
            disabled={isLoading}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email (Somente Leitura)
          </Label>
          <div className="bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-gray-300">
            {user?.email || 'Não disponível'}
          </div>
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <InfoIcon className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-400 text-sm">
              Para alterar seu email, entre em contato com o suporte através do email: suporte@myfinance.com
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Informações da conta */}
      <div className="pt-4 border-t border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Informações da Conta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Membro desde:</span>
            <p className="text-gray-300">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <span className="text-gray-400">Última atualização:</span>
            <p className="text-gray-300">{formatDate(user.updatedAt)}</p>
          </div>
          <div>
            <span className="text-gray-400">Método de autenticação:</span>
            <p className="text-gray-300">Magic Link (Email)</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}
