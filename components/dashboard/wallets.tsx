"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, PiggyBank, Plus, Banknote, LineChart } from "lucide-react"
import { WalletForm } from "@/components/wallet-form"
import { WelcomeDialog } from "./welcome-dialog"
import { formSchemaAccount } from "@/lib/types"
import { z } from "zod"

interface Wallet {
  id: number | string;
  name: string;
  type: string;
  balance: number;
  institution?: string;
  accountNumber?: string;
  color?: string;
  totalLimit?: number;
  isDefault?: boolean;
}

const walletTypeConfig = {
  bank: {
    cardGradient: "from-blue-500/10",
    iconBg: "from-blue-500 to-blue-600",
    IconComponent: CreditCard,
    cardTitle: "Conta Corrente",
    getInfoLine: (wallet: Wallet) => wallet.institution || "",
    extraLine: null,
  },
  credit: {
    cardGradient: "from-purple-500/10",
    iconBg: "from-purple-500 to-purple-600",
    IconComponent: CreditCard,
    cardTitle: "Cartão Crédito",
    getInfoLine: (wallet: Wallet) =>
      `Disponível de R$ ${wallet.totalLimit?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0,00"}`,
    extraLine: (wallet: Wallet) =>
      wallet.institution ? (
        <p className="text-xs text-gray-500 mt-1">{wallet.institution}</p>
      ) : null,
  },
  savings: {
    cardGradient: "from-green-500/10",
    iconBg: "from-green-500 to-green-600",
    IconComponent: PiggyBank,
    cardTitle: "Poupança",
    getInfoLine: (wallet: Wallet) => wallet.institution || "",
    extraLine: null,
  },
  cash: {
    cardGradient: "from-orange-500/10",
    iconBg: "from-orange-500 to-orange-600",
    IconComponent: Banknote,
    cardTitle: "Dinheiro",
    getInfoLine: () => "Em espécie",
    extraLine: null,
  },
  debit: {
    cardGradient: "from-cyan-500/10",
    iconBg: "from-cyan-500 to-cyan-600",
    IconComponent: CreditCard,
    cardTitle: "Cartão Débito",
    getInfoLine: (wallet: Wallet) => wallet.institution || "",
    extraLine: null,
  },
  investment: {
    cardGradient: "from-yellow-500/10",
    iconBg: "from-yellow-500 to-yellow-600",
    IconComponent: LineChart,
    cardTitle: "Investimento",
    getInfoLine: (wallet: Wallet) => wallet.institution || "",
    extraLine: null,
  },
  default: {
    cardGradient: "from-gray-500/10",
    iconBg: "from-gray-500 to-gray-600",
    IconComponent: Plus,
    cardTitle: (wallet: Wallet) => wallet.name,
    getInfoLine: (wallet: Wallet) => wallet.institution || "",
    extraLine: null,
  },
}

export function Wallets({ wallets }: { wallets: Wallet[] | false }) {
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (!wallets) {
      setShowWelcome(true)
    }
  }, [wallets])

  return (
    <>
      <WelcomeDialog open={showWelcome} onOpenChange={setShowWelcome} />

      <div className="mt-4 sm:mt-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Suas Carteiras</CardTitle>
            <WalletForm
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-1 text-green-400 border-green-400/20 hover:bg-green-400/10"
            />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {wallets &&
                wallets.map((wallet) => {
                  const config = walletTypeConfig[wallet.type as keyof typeof walletTypeConfig] || walletTypeConfig.default
                  const CardTitleText =
                    typeof config.cardTitle === "function"
                      ? config.cardTitle(wallet)
                      : config.cardTitle
                  const extraLine =
                    typeof config.extraLine === "function"
                      ? config.extraLine(wallet)
                      : config.extraLine

                  return (
                    <Card key={wallet.id} className={`bg-gray-900/50 border-gray-800 overflow-hidden relative`}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${config.cardGradient} to-transparent rounded-lg`}></div>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded-full bg-gradient-to-r ${config.iconBg} flex items-center justify-center`}>
                            <config.IconComponent className="h-3 w-3 text-white" />
                          </div>
                          <CardTitle className="text-sm font-medium">{CardTitleText}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="text-xl font-bold">
                          R$ {wallet.balance?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0,00"}
                        </div>
                        <p className="text-xs text-gray-400">{config.getInfoLine(wallet)}</p>
                        {extraLine}
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}