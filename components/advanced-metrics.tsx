"use client"

import type React from "react"

import { TrendingUp, TrendingDown, Calendar, BarChart3, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AdvancedMetricsData } from "@/lib/types"

interface MetricCardProps {
  title: string
  value: string
  previousValue: string
  change: number
  icon: React.ReactNode
  color: string
}

interface AdvancedMetricsProps {
  data: AdvancedMetricsData | null;
}

function MetricCard({ title, value, previousValue, change, icon, color }: MetricCardProps) {
  const isPositive = change > 0
  const isNegative = change < 0

  return (
    <Card className="bg-gray-900/50 border-gray-800 overflow-hidden relative">
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-lg`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${color} opacity-20 flex items-center justify-center`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            {isPositive && <TrendingUp className="h-3 w-3 text-green-400" />}
            {isNegative && <TrendingDown className="h-3 w-3 text-red-400" />}
            {!isPositive && !isNegative && <Activity className="h-3 w-3 text-gray-400" />}
            <span
              className={`text-xs ${isPositive ? "text-green-400" : isNegative ? "text-red-400" : "text-gray-400"}`}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          </div>
          <span className="text-xs text-gray-400">vs mês anterior</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Anterior: {previousValue}</div>
      </CardContent>
    </Card>
  )
}

export function AdvancedMetrics({ data }: AdvancedMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Se não há dados, mostrar estado vazio
  if (!data) {
    return (
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-400">R$ 0,00</div>
              <p className="text-xs text-gray-400 mt-1">Sem dados disponíveis</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Média Diária"
        value={formatCurrency(data.dailyAverage.current)}
        previousValue={formatCurrency(data.dailyAverage.previous)}
        change={data.dailyAverage.change}
        icon={<Calendar className="h-4 w-4 text-blue-400" />}
        color="from-blue-500 to-blue-600"
      />

      <MetricCard
        title="Média Semanal"
        value={formatCurrency(data.weeklyAverage.current)}
        previousValue={formatCurrency(data.weeklyAverage.previous)}
        change={data.weeklyAverage.change}
        icon={<BarChart3 className="h-4 w-4 text-green-400" />}
        color="from-green-500 to-green-600"
      />

      <MetricCard
        title="Total Mensal"
        value={formatCurrency(data.monthlyTotal.current)}
        previousValue={formatCurrency(data.monthlyTotal.previous)}
        change={data.monthlyTotal.change}
        icon={<TrendingUp className="h-4 w-4 text-purple-400" />}
        color="from-purple-500 to-purple-600"
      />

      <MetricCard
        title="Transações/Mês"
        value={data.transactionCount.current.toString()}
        previousValue={data.transactionCount.previous.toString()}
        change={data.transactionCount.change}
        icon={<Activity className="h-4 w-4 text-orange-400" />}
        color="from-orange-500 to-orange-600"
      />
    </div>
  )
}
