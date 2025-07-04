"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, CreditCard, TrendingUp, AlertTriangle } from "lucide-react"

interface WalletOverviewProps {
  totalBalance: number
  activeWallets: number
  creditCards: Array<{
    id: string | number
    name: string
    balance: number
    limit?: number | null
  }>
}

export function WalletOverview({ totalBalance, activeWallets, creditCards }: WalletOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const totalCreditUsed = creditCards.reduce((sum, card) => {
    if (card.limit) {
      return sum + (card.limit - card.balance)
    }
    return sum
  }, 0)

  const totalCreditLimit = creditCards.reduce((sum, card) => sum + (card.limit || 0), 0)

  const creditUsagePercentage = totalCreditLimit > 0 ? (totalCreditUsed / totalCreditLimit) * 100 : 0

  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gray-900/50 border-gray-800 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium">Patrimônio Total</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight">{formatCurrency(totalBalance)}</div>
          <div className="flex items-center mt-1">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <p className="text-xs text-green-400">Todas as carteiras</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-800 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium">Carteiras Ativas</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-green-400" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight">{activeWallets}</div>
          <p className="text-xs text-gray-400 mt-1">Com saldo positivo</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-800 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium">Crédito Usado</CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight">{formatCurrency(totalCreditUsed)}</div>
          <div className="flex items-center mt-1">
            <div className="flex items-center gap-1">
              <div className="w-full bg-gray-800 rounded-full h-1.5 max-w-[60px]">
                <div
                  className={`h-1.5 rounded-full ${
                    creditUsagePercentage > 80
                      ? "bg-red-500"
                      : creditUsagePercentage > 60
                        ? "bg-orange-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(creditUsagePercentage, 100)}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400">{creditUsagePercentage.toFixed(0)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-800 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium">Limite Disponível</CardTitle>
          <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center">
            {creditUsagePercentage > 80 ? (
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            ) : (
              <CreditCard className="h-4 w-4 text-orange-400" />
            )}
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight">
            {formatCurrency(totalCreditLimit - totalCreditUsed)}
          </div>
          <p className="text-xs text-gray-400 mt-1">De {formatCurrency(totalCreditLimit)} total</p>
        </CardContent>
      </Card>
    </div>
  )
}
