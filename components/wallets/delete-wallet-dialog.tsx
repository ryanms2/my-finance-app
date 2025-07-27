"use client"

import { useState, useTransition, useEffect } from "react"
import { Trash2, AlertTriangle, Info } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  deleteWalletAction, 
  deleteWalletCascadeAction, 
  ActionResponse, 
  CascadeDeleteData 
} from "@/lib/dashboardActions/walletActions"

interface DeleteWalletDialogProps {
  wallet: {
    id: string | number
    name: string
    type: string
    balance: number
    bank?: string | null
  }
  trigger?: React.ReactNode
}

const walletTypeLabels = {
  bank: "Conta Corrente",
  savings: "Poupança",
  credit: "Cartão de Crédito",
  debit: "Cartão de Débito",
  cash: "Dinheiro",
  investment: "Investimentos",
}

export function DeleteWalletDialog({ wallet, trigger }: DeleteWalletDialogProps) {
  const [open, setOpen] = useState(false)
  const [deleteMode, setDeleteMode] = useState<'safe' | 'cascade'>('safe')
  const [isPending, startTransition] = useTransition()
  const [hasRelatedData, setHasRelatedData] = useState(false)
  const router = useRouter()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Math.abs(value))
  }

  // Verificar se há dados relacionados ao abrir o diálogo
  useEffect(() => {
    if (open) {
      // Simular verificação - em produção isso viria de uma API
      setHasRelatedData(true) // Assumindo que sempre há dados relacionados
    }
  }, [open])

  const handleDelete = () => {
    startTransition(async () => {
      try {
        let result;
        
        if (deleteMode === 'cascade') {
          result = await deleteWalletCascadeAction(wallet.id.toString())
        } else {
          result = await deleteWalletAction(wallet.id.toString())
        }

        if (result.success) {
          if (deleteMode === 'cascade') {
            const cascadeResult = result as ActionResponse<CascadeDeleteData>;
            if (cascadeResult.data) {
              toast.success(cascadeResult.data.message, {
                description: `${cascadeResult.data.details.transactionsDeleted} transações e ${cascadeResult.data.details.transfersDeleted} transferências foram removidas.`
              });
            } else {
              toast.success("Carteira excluída com sucesso!");
            }
          } else {
            toast.success("Carteira excluída com sucesso!");
          }
          setOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Erro ao excluir carteira");
        }
      } catch (error) {
        console.error("Erro ao excluir carteira:", error)
        toast.error("Erro interno do servidor")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-400 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Excluir Carteira
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Esta ação afetará a carteira "{wallet.name}". Escolha como proceder:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações da carteira */}
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{wallet.name}</h4>
                <p className="text-sm text-gray-400">
                  {walletTypeLabels[wallet.type as keyof typeof walletTypeLabels]}
                </p>
                {wallet.bank && (
                  <p className="text-xs text-gray-500">{wallet.bank}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(wallet.balance)}</p>
              </div>
            </div>
          </div>

          {/* Aviso sobre dados relacionados */}
          {hasRelatedData && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-400 font-medium">Atenção!</p>
                  <p className="text-yellow-300">
                    Esta carteira pode ter transações e transferências vinculadas.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator className="bg-gray-700" />

          {/* Opções de exclusão */}
          <RadioGroup value={deleteMode} onValueChange={(value: 'safe' | 'cascade') => setDeleteMode(value)}>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="safe" id="safe" className="mt-1" />
                <Label htmlFor="safe" className="flex-1 cursor-pointer">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Exclusão Segura</span>
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                        Recomendado
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      Só permite excluir se não houver transações ou transferências vinculadas
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="cascade" id="cascade" className="mt-1" />
                <Label htmlFor="cascade" className="flex-1 cursor-pointer">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-red-400">Exclusão Forçada</span>
                      <Badge variant="outline" className="text-xs bg-red-500/10 text-red-400 border-red-500/30">
                        Irreversível
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      Remove a carteira, todas as transações e reverte transferências
                    </p>
                    <div className="bg-red-500/5 border border-red-500/20 rounded p-2 mt-2">
                      <div className="flex items-start gap-1">
                        <Info className="h-3 w-3 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-300">
                          Esta operação não pode ser desfeita e pode afetar saldos de outras carteiras.
                        </p>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className={deleteMode === 'cascade' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Excluindo...
              </div>
            ) : (
              deleteMode === 'cascade' ? 'Excluir Tudo' : 'Excluir'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
