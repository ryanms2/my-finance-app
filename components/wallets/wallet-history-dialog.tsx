"use client"

import { useState, useEffect } from "react"
import { History, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { getWalletTransactions } from "@/lib/dashboardActions/walletActions"

interface WalletHistoryDialogProps {
  wallet: {
    id: string | number
    name: string
    type: string
  }
  trigger?: React.ReactNode
}

interface Transaction {
  id: string
  description: string
  amount: number
  date: Date | string
  category: {
    id: string
    name: string
    type: string
    icon?: string | null
    color?: string | null
  }
  account: {
    id: string
    name: string
    type: string
  }
}

export function WalletHistoryDialog({ wallet, trigger }: WalletHistoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDateTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    if (open) {
      loadTransactions()
    }

    // Adicionar listener para atalho de teclado
    const handleKeyPress = (e: KeyboardEvent) => {
      if (open && e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        handleNavigateToTransactions()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyPress)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [open, wallet.id])

  async function loadTransactions() {
    setLoading(true)
    try {
      const result = await getWalletTransactions(wallet.id.toString(), 50)
      if (result.success) {
        setTransactions(result.data)
      } else {
        toast.error(result.error || "Erro ao carregar transações")
      }
    } catch (error) {
      console.error("Erro ao carregar transações:", error)
      toast.error("Erro interno do servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleNavigateToTransactions = async () => {
    setIsNavigating(true)
    try {
      await router.push(`/transactions?wallet=${wallet.id}`)
    } catch (error) {
      toast.error("Erro ao navegar para transações")
      setIsNavigating(false)
    }
  }

  const TransactionSkeleton = () => (
    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
      <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32 bg-gray-700" />
        <Skeleton className="h-3 w-24 bg-gray-700" />
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-4 w-20 bg-gray-700" />
        <Skeleton className="h-3 w-16 bg-gray-700" />
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-1">
            <History className="h-3 w-3" />
            Ver Histórico
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 text-white max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Transações
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Últimas transações da carteira <strong>{wallet.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3">
            {loading ? (
              // Skeletons durante carregamento
              Array.from({ length: 5 }).map((_, index) => (
                <TransactionSkeleton key={index} />
              ))
            ) : transactions.length === 0 ? (
              // Estado vazio
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Nenhuma transação encontrada</h3>
                <p className="text-gray-400 text-sm">
                  Esta carteira ainda não possui transações registradas.
                </p>
              </div>
            ) : (
              // Lista de transações
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: transaction.category.color || '#6B7280' }}
                  >
                    {transaction.category.icon ? (
                      <span className="text-sm">{transaction.category.icon}</span>
                    ) : (
                      <span className="text-xs font-bold text-white">
                        {transaction.category.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{transaction.category.name}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold flex items-center gap-1 ${
                      transaction.category.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.category.type === 'income' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {transaction.category.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDateTime(transaction.date)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {transactions.length > 0 && (
          <div className="flex justify-center pt-4 border-t border-gray-800">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleNavigateToTransactions}
              disabled={isNavigating}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {isNavigating ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  Carregando...
                </div>
              ) : (
                "Ver Todas as Transações (Ctrl+Enter)"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
