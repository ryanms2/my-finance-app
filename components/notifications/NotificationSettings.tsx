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
    return <div>Carregando configurações...</div>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Status das Notificações
          </CardTitle>
          <CardDescription>
            Verifique o status e as configurações do seu navegador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span>Suporte do navegador</span>
            </div>
            <Badge variant={isSupported ? "default" : "destructive"}>
              {isSupported ? "Suportado" : "Não suportado"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Permissão do navegador</span>
            </div>
            <Badge variant={
              permission === 'granted' ? 'default' : 
              permission === 'denied' ? 'destructive' : 'secondary'
            }>
              {permission === 'granted' ? 'Concedida' : 
               permission === 'denied' ? 'Negada' : 'Pendente'}
            </Badge>
          </div>

          {permission !== 'granted' && isSupported && (
            <Button 
              onClick={requestPermission} 
              disabled={isLoading}
              className="w-full"
            >
              Solicitar Permissão
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Canais de Notificação */}
      <Card>
        <CardHeader>
          <CardTitle>Canais de Notificação</CardTitle>
          <CardDescription>
            Escolha como você quer receber as notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <div>
                <Label htmlFor="in-app">Notificações no App</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações em tempo real dentro do aplicativo
                </p>
              </div>
            </div>
            <Switch
              id="in-app"
              checked={localPreferences.enableInApp}
              onCheckedChange={(value) => handleSwitchChange('enableInApp', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <div>
                <Label htmlFor="push">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
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
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <div>
                <Label htmlFor="email">Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações importantes por email
                </p>
              </div>
            </div>
            <Switch
              id="email"
              checked={localPreferences.enableEmail}
              onCheckedChange={(value) => handleSwitchChange('enableEmail', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Notificação */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Notificação</CardTitle>
          <CardDescription>
            Controle quais tipos de notificação você quer receber
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <div>
                <Label htmlFor="transactions">Transações</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre criação, edição e exclusão de transações
                </p>
              </div>
            </div>
            <Switch
              id="transactions"
              checked={localPreferences.transactionAlerts}
              onCheckedChange={(value) => handleSwitchChange('transactionAlerts', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              <div>
                <Label htmlFor="budgets">Orçamentos</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas sobre limites de orçamento e metas
                </p>
              </div>
            </div>
            <Switch
              id="budgets"
              checked={localPreferences.budgetAlerts}
              onCheckedChange={(value) => handleSwitchChange('budgetAlerts', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <div>
                <Label htmlFor="security">Segurança</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas importantes de segurança (sempre habilitado)
                </p>
              </div>
            </div>
            <Switch
              id="security"
              checked={localPreferences.securityAlerts}
              onCheckedChange={(value) => handleSwitchChange('securityAlerts', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <div>
                <Label htmlFor="marketing">Atualizações e Promoções</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre novos recursos e ofertas
                </p>
              </div>
            </div>
            <Switch
              id="marketing"
              checked={localPreferences.marketingAlerts}
              onCheckedChange={(value) => handleSwitchChange('marketingAlerts', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modo Silencioso */}
      <Card>
        <CardHeader>
          <CardTitle>Modo Silencioso</CardTitle>
          <CardDescription>
            Configure horários para não receber notificações não urgentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="quiet-hours">Ativar modo silencioso</Label>
            <Switch
              id="quiet-hours"
              checked={localPreferences.quietHours.enabled}
              onCheckedChange={(value) => handleQuietHoursChange('enabled', value)}
            />
          </div>

          {localPreferences.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Início</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={localPreferences.quietHours.startTime}
                  onChange={(e) => handleQuietHoursChange('startTime', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-time">Fim</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={localPreferences.quietHours.endTime}
                  onChange={(e) => handleQuietHoursChange('endTime', e.target.value)}
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
          className="w-full sm:w-auto"
        >
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  )
}
