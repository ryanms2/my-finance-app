"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteTransactionAction } from "@/lib/dashboardActions/transactionActions"
import type { TransactionData } from "@/lib/types"

interface DeleteTransactionDialogProps {
  transaction: TransactionData
}

export function DeleteTransactionDialog({ transaction }: DeleteTransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  async function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteTransactionAction(transaction.id)
        
        if (result.success) {
          toast.success("Transação excluída com sucesso!")
          setOpen(false)
          
          // Aguardar o dialog fechar completamente antes de revalidar
          setTimeout(() => {
            router.refresh()
          }, 300)
        } else {
          toast.error(result.error || "Erro ao excluir transação")
        }
      } catch (error) {
        console.error("Erro ao excluir transação:", error)
        toast.error("Erro interno do servidor")
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-red-400 hover:text-red-300 hover:bg-red-400/10">
          <Trash2 className="h-3 w-3" />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Tem certeza de que deseja excluir esta transação? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: transaction.category.color || '#6B7280' }}>
              {transaction.category.icon ? (
                <span className="text-sm">{transaction.category.icon}</span>
              ) : (
                <span className="text-xs font-bold">
                  {transaction.category.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{transaction.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{transaction.category.name}</span>
                <span>•</span>
                <span>{transaction.account.name}</span>
                <span>•</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${
                transaction.category.type === 'income' ? 'text-green-400' : 'text-red-400'
              }`}>
                {transaction.category.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isPending ? "Excluindo..." : "Excluir Transação"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
