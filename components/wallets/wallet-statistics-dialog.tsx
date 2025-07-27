"use client"

import { useState, useEffect } from "react"
import { BarChart3, Calendar, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getWalletStatistics } from "@/lib/dashboardActions/walletActions"

interface WalletStatisticsDialogProps {
  wallet: {
    id: string | number
    name: string
    type: string
  }
  trigger?: React.ReactNode
}

interface WalletStats {
  totalTransactions: number
  incomeCount: number
  expenseCount: number
  totalIncome: number
  totalExpenses: number
  netFlow: number
  averageTransactionValue: number
  monthlyIncome: number
  monthlyExpenses: number
  monthlyTransactions: number
  firstTransaction: Date | null
  lastTransaction: Date | null
}

export function WalletStatisticsDialog({ wallet, trigger }: WalletStatisticsDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<WalletStats | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A"
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  useEffect(() => {
    if (open) {
      loadStatistics()
    }
  }, [open])

  async function loadStatistics() {
    setLoading(true)
    try {
      const result = await getWalletStatistics(wallet.id.toString())
      if (result.success && result.data) {
        setStats(result.data)
      } else {
        toast.error(result.error || "Erro ao carregar estatísticas")
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
      toast.error("Erro interno do servidor")
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, className = "" }: {
    title: string
    value: string | number
    icon: any
    className?: string
  }) => (
    <Card className="bg-gray-800/30 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-gray-300">{title}</CardTitle>
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-lg font-bold ${className}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  )

  const StatSkeleton = () => (
    <Card className="bg-gray-800/30 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20 bg-gray-600" />
          <Skeleton className="h-4 w-4 bg-gray-600" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-16 bg-gray-600" />
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-1">
            <BarChart3 className="h-3 w-3" />
            Estatísticas
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estatísticas - {wallet.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Análise detalhada das movimentações desta carteira
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <>
              {/* Estatísticas gerais */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Visão Geral</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <StatSkeleton key={i} />
                  ))}
                </div>
              </div>

              {/* Estatísticas mensais */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Mês Atual</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <StatSkeleton key={i} />
                  ))}
                </div>
              </div>
            </>
          ) : stats ? (
            <>
              {/* Estatísticas gerais */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Visão Geral</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <StatCard
                    title="Total de Transações"
                    value={stats.totalTransactions}
                    icon={Activity}
                  />
                  <StatCard
                    title="Receitas"
                    value={stats.incomeCount}
                    icon={TrendingUp}
                    className="text-green-400"
                  />
                  <StatCard
                    title="Despesas"
                    value={stats.expenseCount}
                    icon={TrendingDown}
                    className="text-red-400"
                  />
                  <StatCard
                    title="Total Recebido"
                    value={formatCurrency(stats.totalIncome)}
                    icon={TrendingUp}
                    className="text-green-400"
                  />
                  <StatCard
                    title="Total Gasto"
                    value={formatCurrency(stats.totalExpenses)}
                    icon={TrendingDown}
                    className="text-red-400"
                  />
                  <StatCard
                    title="Fluxo Líquido"
                    value={formatCurrency(stats.netFlow)}
                    icon={stats.netFlow >= 0 ? TrendingUp : TrendingDown}
                    className={stats.netFlow >= 0 ? "text-green-400" : "text-red-400"}
                  />
                </div>
              </div>

              {/* Estatísticas mensais */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Mês Atual</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard
                    title="Transações"
                    value={stats.monthlyTransactions}
                    icon={Activity}
                  />
                  <StatCard
                    title="Receitas"
                    value={formatCurrency(stats.monthlyIncome)}
                    icon={TrendingUp}
                    className="text-green-400"
                  />
                  <StatCard
                    title="Despesas"
                    value={formatCurrency(stats.monthlyExpenses)}
                    icon={TrendingDown}
                    className="text-red-400"
                  />
                </div>
              </div>

              {/* Informações adicionais */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Informações Adicionais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard
                    title="Valor Médio"
                    value={formatCurrency(stats.averageTransactionValue)}
                    icon={BarChart3}
                  />
                  <StatCard
                    title="Primeira Transação"
                    value={formatDate(stats.firstTransaction)}
                    icon={Calendar}
                  />
                  <StatCard
                    title="Última Transação"
                    value={formatDate(stats.lastTransaction)}
                    icon={Calendar}
                  />
                </div>
              </div>

              {stats.totalTransactions === 0 && (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma transação encontrada</h3>
                  <p className="text-gray-400 text-sm">
                    Esta carteira ainda não possui transações registradas.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Erro ao carregar estatísticas</h3>
              <p className="text-gray-400 text-sm">
                Não foi possível carregar as estatísticas desta carteira.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
