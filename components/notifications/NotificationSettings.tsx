"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/lib/notifications/client"
import { Bell, Shield, CreditCard, PiggyBank, Mail, Smartphone, Monitor } from "lucide-react"
import { toast } from "sonner"

export function NotificationSettings() {
  const {
    preferences,
    isSupported,
    permission,
    updatePreferences,
    requestPermission,
    enablePushNotifications,
    disablePushNotifications,
  } = useNotifications()

  const [localPreferences, setLocalPreferences] = useState(preferences)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setLocalPreferences(preferences)
  }, [preferences])

  if (!localPreferences) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <div className="text-gray-400">Carregando configurações...</div>
        </div>
      </div>
    )
  }

  const handleSwitchChange = (key: string, value: boolean) => {
    setLocalPreferences(prev => prev ? { ...prev, [key]: value } : null)
  }

  const handleQuietHoursChange = (field: string, value: string | boolean) => {
    setLocalPreferences(prev => {
      if (!prev) return null
      return {
        ...prev,
        quietHours: {
          ...prev.quietHours,
          [field]: value
        }
      }
    })
  }

  const handleSave = async () => {
    if (!localPreferences) return

    setIsLoading(true)
    try {
      const success = await updatePreferences(localPreferences)
      if (success) {
        toast.success("Configurações salvas com sucesso!")
      }
    } catch (error) {
      toast.error("Erro ao salvar configurações")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnablePush = async () => {
    setIsLoading(true)
    try {
      if (permission !== 'granted') {
        const granted = await requestPermission()
        if (!granted) {
          toast.error("Permissão negada para notificações")
          return
        }
      }

      const success = await enablePushNotifications()
      if (success) {
        handleSwitchChange('enablePush', true)
      }
    } catch (error) {
      toast.error("Erro ao habilitar notificações push")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisablePush = async () => {
    setIsLoading(true)
    try {
      const success = await disablePushNotifications()
      if (success) {
        handleSwitchChange('enablePush', false)
      }
    } catch (error) {
      toast.error("Erro ao desabilitar notificações push")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Status das Notificações */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-100">
            <Bell className="h-5 w-5 text-blue-400" />
            Status das Notificações
          </CardTitle>
          <CardDescription className="text-gray-400">
            Verifique o status e as configurações do seu navegador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-gray-400" />
              <span className="text-gray-200">Suporte do navegador</span>
            </div>
            <Badge variant={isSupported ? "default" : "destructive"} 
                   className={isSupported ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}>
              {isSupported ? "Suportado" : "Não suportado"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-400" />
              <span className="text-gray-200">Permissão do navegador</span>
            </div>
            <Badge variant={
              permission === 'granted' ? 'default' : 
              permission === 'denied' ? 'destructive' : 'secondary'
            } className={
              permission === 'granted' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
              permission === 'denied' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }>
              {permission === 'granted' ? 'Concedida' : 
               permission === 'denied' ? 'Negada' : 'Pendente'}
            </Badge>
          </div>

          {permission !== 'granted' && isSupported && (
            <Button 
              onClick={requestPermission} 
              disabled={isLoading}
              className="w-full bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
              variant="outline"
            >
              Solicitar Permissão
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Canais de Notificação */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Canais de Notificação</CardTitle>
          <CardDescription className="text-gray-400">
            Escolha como você quer receber as notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-purple-400" />
              <div>
                <Label htmlFor="in-app" className="text-gray-200">Notificações no App</Label>
                <p className="text-sm text-gray-400">
                  Notificações em tempo real dentro do aplicativo
                </p>
              </div>
            </div>
            <Switch
              id="in-app"
              checked={localPreferences.enableInApp}
              onCheckedChange={(value) => handleSwitchChange('enableInApp', value)}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-400" />
              <div>
                <Label htmlFor="push" className="text-gray-200">Push Notifications</Label>
                <p className="text-sm text-gray-400">
                  Notificações push do navegador mesmo quando o app estiver fechado
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="push"
                checked={localPreferences.enablePush}
                onCheckedChange={(value) => {
                  if (value) {
                    handleEnablePush()
                  } else {
                    handleDisablePush()
                  }
                }}
                disabled={!isSupported || isLoading}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-green-400" />
              <div>
                <Label htmlFor="email" className="text-gray-200">Notificações por Email</Label>
                <p className="text-sm text-gray-400">
                  Receber notificações importantes por email
                </p>
              </div>
            </div>
            <Switch
              id="email"
              checked={localPreferences.enableEmail}
              onCheckedChange={(value) => handleSwitchChange('enableEmail', value)}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Notificação */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Tipos de Notificação</CardTitle>
          <CardDescription className="text-gray-400">
            Controle quais tipos de notificação você quer receber
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-yellow-400" />
              <div>
                <Label htmlFor="transactions" className="text-gray-200">Transações</Label>
                <p className="text-sm text-gray-400">
                  Notificações sobre criação, edição e exclusão de transações
                </p>
              </div>
            </div>
            <Switch
              id="transactions"
              checked={localPreferences.transactionAlerts}
              onCheckedChange={(value) => handleSwitchChange('transactionAlerts', value)}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-emerald-400" />
              <div>
                <Label htmlFor="budgets" className="text-gray-200">Orçamentos</Label>
                <p className="text-sm text-gray-400">
                  Alertas sobre limites de orçamento e metas
                </p>
              </div>
            </div>
            <Switch
              id="budgets"
              checked={localPreferences.budgetAlerts}
              onCheckedChange={(value) => handleSwitchChange('budgetAlerts', value)}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-400" />
              <div>
                <Label htmlFor="security" className="text-gray-200">Segurança</Label>
                <p className="text-sm text-gray-400">
                  Alertas importantes de segurança (sempre habilitado)
                </p>
              </div>
            </div>
            <Switch
              id="security"
              checked={localPreferences.securityAlerts}
              onCheckedChange={(value) => handleSwitchChange('securityAlerts', value)}
              className="data-[state=checked]:bg-red-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-400" />
              <div>
                <Label htmlFor="marketing" className="text-gray-200">Atualizações e Promoções</Label>
                <p className="text-sm text-gray-400">
                  Notificações sobre novos recursos e ofertas
                </p>
              </div>
            </div>
            <Switch
              id="marketing"
              checked={localPreferences.marketingAlerts}
              onCheckedChange={(value) => handleSwitchChange('marketingAlerts', value)}
              className="data-[state=checked]:bg-indigo-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Modo Silencioso */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Modo Silencioso</CardTitle>
          <CardDescription className="text-gray-400">
            Configure horários para não receber notificações não urgentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="quiet-hours" className="text-gray-200">Ativar modo silencioso</Label>
            <Switch
              id="quiet-hours"
              checked={localPreferences.quietHours.enabled}
              onCheckedChange={(value) => handleQuietHoursChange('enabled', value)}
              className="data-[state=checked]:bg-orange-500"
            />
          </div>

          {localPreferences.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time" className="text-gray-200">Início</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={localPreferences.quietHours.startTime}
                  onChange={(e) => handleQuietHoursChange('startTime', e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="end-time" className="text-gray-200">Fim</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={localPreferences.quietHours.endTime}
                  onChange={(e) => handleQuietHoursChange('endTime', e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-orange-500"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
        >
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  )
}
