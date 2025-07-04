"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, AlertCircle, Trash2 } from "lucide-react"
import { deleteUserAccount } from "@/lib/data"
import { signOut } from "next-auth/react"

interface DeleteAccountProps {
  userEmail: string | null;
}

export function DeleteAccount({ userEmail }: DeleteAccountProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'error'; message: string } | null>(null)
  
  const CONFIRM_TEXT = 'EXCLUIR MINHA CONTA'

  const handleInputChange = (value: string) => {
    setConfirmText(value.toUpperCase())
    setAlert(null)
  }

  const validateForm = () => {
    if (confirmText !== CONFIRM_TEXT) {
      setAlert({ type: 'error', message: `Digite exatamente: ${CONFIRM_TEXT}` })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      const result = await deleteUserAccount()

      if (result.success) {
        // Fazer logout e redirecionar
        await signOut({ callbackUrl: '/signin?message=account-deleted' })
      } else {
        setAlert({ type: 'error', message: result.message })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Erro ao excluir conta. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setConfirmText('')
    setAlert(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive"
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-red-500/50 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Excluir Conta Permanentemente
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Esta ação não pode ser desfeita. Todos os seus dados serão perdidos permanentemente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className="border-red-500/50 bg-red-500/10 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Atenção!</strong> Ao excluir sua conta, você perderá:
              <ul className="mt-2 ml-4 list-disc text-sm">
                <li>Todas as transações registradas</li>
                <li>Histórico de contas e carteiras</li>
                <li>Orçamentos e categorias personalizadas</li>
                <li>Todos os relatórios e dados financeiros</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="p-3 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong>Conta a ser excluída:</strong>
            </p>
            <p className="text-lg font-mono">{userEmail || 'Email não disponível'}</p>
          </div>

          {alert && (
            <Alert className="border-red-500/50 bg-red-500/10 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirmText" className="text-sm">
                Para confirmar, digite <strong className="text-red-400">{CONFIRM_TEXT}</strong>:
              </Label>
              <Input
                id="confirmText"
                type="text"
                value={confirmText}
                onChange={(e) => handleInputChange(e.target.value)}
                className="bg-gray-800 border-red-500/50 text-white"
                placeholder={CONFIRM_TEXT}
                disabled={isLoading}
              />
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
                className="border-gray-700 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || confirmText !== CONFIRM_TEXT}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? 'Excluindo...' : 'Excluir Conta Definitivamente'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
