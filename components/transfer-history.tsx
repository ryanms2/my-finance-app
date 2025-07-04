"use client"

import { ArrowRightLeft, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TransferHistoryItem {
  id: string
  fromWallet: string
  toWallet: string
  amount: number
  description: string
  date: string
  status: 'completed'
}

interface TransferHistoryProps {
  transfers?: TransferHistoryItem[]
}

export function TransferHistory({ transfers = [] }: TransferHistoryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Histórico de Transferências
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transfers.length === 0 ? (
            <div className="text-center py-8">
              <ArrowRightLeft className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma transferência encontrada</p>
            </div>
          ) : (
            transfers.map((transfer) => (
              <div
                key={transfer.id}
                className="flex items-center justify-between flex-col p-3 rounded-lg bg-gray-800/50 border border-gray-700 md:flex-col sm:flex-row"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <ArrowRightLeft className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{transfer.fromWallet}</span>
                      <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                      <span className="font-medium text-sm">{transfer.toWallet}</span>
                    </div>
                    <p className="text-xs text-gray-400">{transfer.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 items-center justify-center text-gray-500" />
                      <span className="text-xs text-gray-500">{formatDate(transfer.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{formatCurrency(transfer.amount)}</div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                    Concluída
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
