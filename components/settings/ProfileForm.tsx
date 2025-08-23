"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Save, 
  AlertCircle, 
  CheckCircle, 
  User, 
  Mail, 
  InfoIcon, 
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck
} from "lucide-react"
import { updateUserProfile, updateUserPassword } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
  const [activeTab, setActiveTab] = useState('profile')
  const [name, setName] = useState(user?.name || "")
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const router = useRouter()
  
  // Estados para gerenciar a troca de senha
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

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

  const validatePasswordForm = () => {
    const errors: string[] = []

    if (!currentPassword) {
      errors.push('A senha atual é obrigatória')
    }

    if (!newPassword) {
      errors.push('A nova senha é obrigatória')
    } else if (newPassword.length < 6) {
      errors.push('A nova senha deve ter pelo menos 6 caracteres')
    }

    if (newPassword !== confirmPassword) {
      errors.push('As senhas não coincidem')
    }

    setPasswordErrors(errors)
    return errors.length === 0
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
          router.refresh()
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) return

    setIsLoading(true)
    setPasswordErrors([])
    
    try {
      const result = await updateUserPassword({
        currentPassword,
        newPassword
      })

      if (result.success) {
        setAlert({ type: 'success', message: result.message })
        // Limpar os campos após sucesso
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordErrors([result.message])
      }
    } catch (error) {
      setPasswordErrors(['Erro ao atualizar senha. Tente novamente.'])
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
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid grid-cols-2 bg-gray-800/50 border border-gray-700">
        <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
          <User className="h-4 w-4 mr-2" /> Perfil
        </TabsTrigger>
        <TabsTrigger value="security" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
          <KeyRound className="h-4 w-4 mr-2" /> Segurança
        </TabsTrigger>
      </TabsList>

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

      <TabsContent value="profile" className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <p className="text-gray-300">Credenciais (Email e Senha)</p>
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
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-400" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Sua senha deve ter no mínimo 6 caracteres e ser diferente da senha atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordErrors.length > 0 && (
                <Alert className="border-red-500/50 bg-red-500/10 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-1">
                      {passwordErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-300">
                  Senha Atual
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white pr-10"
                    placeholder="Digite sua senha atual"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? 
                      <EyeOff className="h-4 w-4" /> : 
                      <Eye className="h-4 w-4" />
                    }
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-300">
                  Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white pr-10"
                    placeholder="Digite sua nova senha"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? 
                      <EyeOff className="h-4 w-4" /> : 
                      <Eye className="h-4 w-4" />
                    }
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirmar Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white pr-10"
                    placeholder="Confirme sua nova senha"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 
                      <EyeOff className="h-4 w-4" /> : 
                      <Eye className="h-4 w-4" />
                    }
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isLoading ? 'Atualizando...' : 'Atualizar Senha'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <InfoIcon className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-400 text-sm">
            Mantenha sua senha segura. Use uma combinação de letras, números e caracteres especiais.
          </AlertDescription>
        </Alert>
      </TabsContent>
    </Tabs>
  )
}
