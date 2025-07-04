"use client"

import { MoreHorizontal, CreditCard, Banknote, PiggyBank, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface WalletCardProps {
  wallet: {
    id: string | number
    name: string
    type: string
    balance: number
    bank?: string | null
    accountNumber?: string
    color: string
    limit?: number | null
    isDefault: boolean
  }
}

const walletIcons = {
  bank: CreditCard,
  savings: PiggyBank,
  credit: CreditCard,
  debit: CreditCard,
  cash: Banknote,
  investment: TrendingUp,
}

const walletTypeLabels = {
  bank: "Conta Corrente",
  savings: "Poupança",
  credit: "Cartão de Crédito",
  debit: "Cartão de Débito",
  cash: "Dinheiro",
  investment: "Investimentos",
}

export function WalletCard({ wallet }: WalletCardProps) {
  const Icon = walletIcons[wallet.type as keyof typeof walletIcons] || Wallet
  const isNegative = wallet.balance < 0
  const isCredit = wallet.type === "credit"

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Math.abs(value))
  }

  const getUsagePercentage = () => {
    if (isCredit && wallet.limit) {
      const used = wallet.limit - wallet.balance
      return (used / wallet.limit) * 100
    }
    return 0
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 overflow-hidden relative group hover:bg-gray-900/70 transition-colors">
      <div className={`absolute inset-0 bg-gradient-to-r ${wallet.color} opacity-10 rounded-lg`}></div>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${wallet.color} flex items-center justify-center`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{wallet.name}</h3>
            <p className="text-xs text-gray-400">{walletTypeLabels[wallet.type as keyof typeof walletTypeLabels]}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {wallet.isDefault && (
            <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
              Padrão
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Ver Histórico</DropdownMenuItem>
              <DropdownMenuItem>Definir como Padrão</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{isCredit ? "Disponível" : "Saldo"}</span>
            <div className="flex items-center gap-1">
              {isNegative ? (
                <TrendingDown className="h-4 w-4 text-red-400" />
              ) : (
                <TrendingUp className="h-4 w-4 text-green-400" />
              )}
            </div>
          </div>

          <div className={`text-2xl font-bold ${isNegative ? "text-red-400" : "text-white"}`}>
            {isNegative && !isCredit && "-"}
            {formatCurrency(wallet.balance)}
          </div>

          {isCredit && wallet.limit && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Usado: {formatCurrency(wallet.limit - wallet.balance)}</span>
                <span>Limite: {formatCurrency(wallet.limit)}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full bg-gradient-to-r ${
                    getUsagePercentage() > 80
                      ? "from-red-500 to-red-600"
                      : getUsagePercentage() > 60
                        ? "from-orange-500 to-orange-600"
                        : "from-green-500 to-green-600"
                  }`}
                  style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {wallet.bank && (
            <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
              <span>{wallet.bank}</span>
              {wallet.accountNumber && <span>{wallet.accountNumber}</span>}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 relative">
        {/* <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-gray-800/50">
          Ver Transações
        </Button> */}
      </CardFooter>
    </Card>
  )
}
