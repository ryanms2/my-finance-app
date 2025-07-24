"use client"

import { useState, useMemo, useTransition } from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonthYearPicker } from "@/components/ui/month-year-picker"
import { Sidebar } from "@/components/sidebar"
import { UserNavClient } from "@/components/user-nav-client"
import { MobileNav } from "@/components/mobile-nav"
import { MobileMenu } from "@/components/mobile-menu"
import { MonthlySpendingChart } from "@/components/monthly-spending-chart"
import { ExpensesDonutChart } from "@/components/expenses-donut-chart"
import { AdvancedMetrics } from "@/components/advanced-metrics"
import { ComparisonChart } from "@/components/comparison-chart"
import { ExportDialog } from "@/components/export-dialog"
import type { ReportsData, AdvancedMetricsData, MonthlyChartDataItem } from "@/lib/types"

import { useRouter, useSearchParams } from "next/navigation"

interface ReportsPageProps {
  reportsData: ReportsData | null;
  advancedMetrics: AdvancedMetricsData | null;
  monthlyChartData: MonthlyChartDataItem[] | null;
  selectedMonth: number;
  selectedYear: number;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function ReportsPage({ 
  reportsData, 
  advancedMetrics, 
  monthlyChartData, 
  selectedMonth: initialMonth, 
  selectedYear: initialYear,
  user
}: ReportsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [isPending, startTransition] = useTransition();

  // Função para lidar com mudança de filtro
  const handleFilterChange = (value: { month: number; year: number }) => {
    if (value.month === selectedMonth && value.year === selectedYear) return;

    setSelectedMonth(value.month);
    setSelectedYear(value.year);

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('month', value.month.toString());
      params.set('year', value.year.toString());
      router.push(`/reports?${params.toString()}`);
    });
  };
  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para formatar variação percentual
  const formatVariation = (variation: number) => {
    const sign = variation >= 0 ? '+' : '';
    return `${sign}${variation.toFixed(1)}%`;
  };

  // Função para determinar a cor da variação
  const getVariationColor = (variation: number, isInverse = false) => {
    const isPositive = isInverse ? variation < 0 : variation > 0;
    return isPositive ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white overflow-x-hidden">
      <Sidebar />
      <MobileMenu />
      <div className="flex-1 overflow-auto pb-20 lg:pb-0 min-w-0">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 sm:px-6 backdrop-blur-md overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold ml-10 lg:ml-0 truncate">Relatórios</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Desktop month picker */}
            <MonthYearPicker
              value={{ month: selectedMonth, year: selectedYear }}
              onChange={handleFilterChange}
              disabled={isPending}
              className="hidden sm:flex"
            />
            <ExportDialog defaultType="reports">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </ExportDialog>
            <UserNavClient user={user} />
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {/* Mobile month picker */}
          <div className="sm:hidden mb-4">
            <MonthYearPicker
              value={{ month: selectedMonth, year: selectedYear }}
              onChange={handleFilterChange}
              disabled={isPending}
              className="w-full"
            />
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="bg-gray-800/50 mb-6 w-full min-w-max">
                <TabsTrigger value="overview" className="whitespace-nowrap">Visão Geral</TabsTrigger>
                <TabsTrigger value="comparison" className="whitespace-nowrap">Comparação</TabsTrigger>
                <TabsTrigger value="trends" className="whitespace-nowrap">Tendências</TabsTrigger>
                <TabsTrigger value="categories" className="whitespace-nowrap">Categorias</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Saldo Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold">
                      {reportsData ? formatCurrency(reportsData.summary.totalBalance) : 'R$ 0,00'}
                    </div>
                    <p className={`text-xs mt-1 ${reportsData ? getVariationColor(reportsData.summary.variations.totalBalance) : 'text-gray-400'}`}>
                      {reportsData && reportsData.summary.variations.totalBalance !== 0 
                      ? `${formatVariation(reportsData.summary.variations.totalBalance)} em relação ao mês anterior`
                      : 'Sem dados do mês anterior'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Receitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">
                    {reportsData ? formatCurrency(reportsData.summary.currentIncome) : 'R$ 0,00'}
                  </div>
                  <p className={`text-xs mt-1 ${reportsData ? getVariationColor(reportsData.summary.variations.income) : 'text-gray-400'}`}>
                    {reportsData && reportsData.summary.variations.income !== 0 
                      ? `${formatVariation(reportsData.summary.variations.income)} em relação ao mês anterior`
                      : 'Sem dados do mês anterior'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">
                    {reportsData ? formatCurrency(reportsData.summary.currentExpenses) : 'R$ 0,00'}
                  </div>
                  <p className={`text-xs mt-1 ${reportsData ? getVariationColor(reportsData.summary.variations.expenses, true) : 'text-gray-400'}`}>
                    {reportsData && reportsData.summary.variations.expenses !== 0 
                      ? `${formatVariation(reportsData.summary.variations.expenses)} em relação ao mês anterior`
                      : 'Sem dados do mês anterior'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Economia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">
                    {reportsData ? formatCurrency(reportsData.summary.currentBalance) : 'R$ 0,00'}
                  </div>
                  <p className={`text-xs mt-1 ${reportsData ? getVariationColor(reportsData.summary.variations.balance) : 'text-gray-400'}`}>
                    {reportsData && reportsData.summary.variations.balance !== 0 
                      ? `${formatVariation(reportsData.summary.variations.balance)} em relação ao mês anterior`
                      : 'Sem dados do mês anterior'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            <AdvancedMetrics data={advancedMetrics} />

            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-7">
                <Card className="lg:col-span-4 bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle>Gastos Mensais</CardTitle>
                    <CardDescription className="text-gray-400">
                      Comparativo de receitas vs despesas dos últimos 6 meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-hidden">
                    <MonthlySpendingChart data={monthlyChartData} />
                  </CardContent>
                </Card>

                <Card className="lg:col-span-3 bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle>Distribuição de Despesas</CardTitle>
                    <CardDescription className="text-gray-400">Categorias de despesas do mês atual</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] flex items-center justify-center">
                      <ExpensesDonutChart data={reportsData?.categoryExpenses} />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {reportsData?.categoryExpenses && reportsData.categoryExpenses.length > 0 ? (
                        reportsData.categoryExpenses.slice(0, 5).map((category, index) => {
                          // Mapear cores das classes CSS para cores hexadecimais
                          const getColorFromClass = (colorClass: string) => {
                            const colorMap: Record<string, string> = {
                              'bg-orange-400': '#fb923c',
                              'bg-rose-500': '#f43f5e',  
                              'bg-indigo-500': '#6366f1',
                              'bg-cyan-500': '#06b6d4',
                              'bg-yellow-400': '#facc15',
                              'bg-purple-800': '#6b21a8',
                              'bg-slate-500': '#64748b',
                              'bg-green-500': '#22c55e',
                              'bg-blue-500': '#3b82f6',
                              'bg-red-500': '#ef4444',
                              'bg-gray-500': '#6b7280',
                            };
                            return colorMap[colorClass] || '#6b7280';
                          };

                          return (
                            <div key={category.name} className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: getColorFromClass(category.color) }}
                              ></div>
                              <span className="text-xs">
                                {category.name}: {formatCurrency(category.amount)}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 text-center text-gray-400 text-sm">
                          Nenhuma despesa registrada no mês atual
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Comparação Mensal Detalhada</CardTitle>
                  <CardDescription className="text-gray-400">
                    Comparação diária entre o mês atual e o mês anterior
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-hidden">
                  <ComparisonChart data={reportsData?.dailyData} />
                </CardContent>
              </Card>

              <AdvancedMetrics data={advancedMetrics} />

              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle>Análise de Variação</CardTitle>
                    <CardDescription className="text-gray-400">
                      Principais mudanças em relação ao mês anterior
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportsData ? (
                        <>
                          <div className={`flex justify-between items-center p-3 rounded-lg ${
                            reportsData.summary.variations.balance >= 0 
                              ? 'bg-green-500/10 border border-green-500/20' 
                              : 'bg-red-500/10 border border-red-500/20'
                          }`}>
                            <div>
                              <p className={`font-medium ${
                                reportsData.summary.variations.balance >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                Economia
                              </p>
                              <p className="text-sm text-gray-400">
                                {reportsData.summary.variations.balance >= 0 ? 'Aumento' : 'Redução'} na economia
                              </p>
                            </div>
                            <div className={`font-bold ${
                              reportsData.summary.variations.balance >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {formatVariation(reportsData.summary.variations.balance)}
                            </div>
                          </div>
                          <div className={`flex justify-between items-center p-3 rounded-lg ${
                            reportsData.summary.variations.income >= 0 
                              ? 'bg-blue-500/10 border border-blue-500/20' 
                              : 'bg-red-500/10 border border-red-500/20'
                          }`}>
                            <div>
                              <p className={`font-medium ${
                                reportsData.summary.variations.income >= 0 ? 'text-blue-400' : 'text-red-400'
                              }`}>
                                Receitas
                              </p>
                              <p className="text-sm text-gray-400">
                                {reportsData.summary.variations.income >= 0 ? 'Crescimento' : 'Redução'} nas receitas
                              </p>
                            </div>
                            <div className={`font-bold ${
                              reportsData.summary.variations.income >= 0 ? 'text-blue-400' : 'text-red-400'
                            }`}>
                              {formatVariation(reportsData.summary.variations.income)}
                            </div>
                          </div>
                          <div className={`flex justify-between items-center p-3 rounded-lg ${
                            reportsData.summary.variations.expenses <= 0 
                              ? 'bg-green-500/10 border border-green-500/20' 
                              : 'bg-red-500/10 border border-red-500/20'
                          }`}>
                            <div>
                              <p className={`font-medium ${
                                reportsData.summary.variations.expenses <= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                Despesas
                              </p>
                              <p className="text-sm text-gray-400">
                                {reportsData.summary.variations.expenses <= 0 ? 'Redução' : 'Aumento'} nas despesas
                              </p>
                            </div>
                            <div className={`font-bold ${
                              reportsData.summary.variations.expenses <= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {formatVariation(reportsData.summary.variations.expenses)}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-gray-400">
                          Não há dados suficientes para análise de variação
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle>Metas vs Realizado</CardTitle>
                    <CardDescription className="text-gray-400">
                      Performance em relação às metas estabelecidas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportsData ? (
                        <>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Economia Atual</span>
                              <span>{formatCurrency(reportsData.summary.currentBalance)}</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  reportsData.summary.currentBalance > 0 ? 'bg-green-500' : 'bg-red-500'
                                }`} 
                                style={{ 
                                  width: reportsData.summary.currentBalance > 0 ? '100%' : '0%' 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Receitas do Mês</span>
                              <span>{formatCurrency(reportsData.summary.currentIncome)}</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Despesas do Mês</span>
                              <span>{formatCurrency(reportsData.summary.currentExpenses)}</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-gray-400">
                          Não há dados suficientes para exibir metas
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Análise de Tendências</CardTitle>
                  <CardDescription className="text-gray-400">
                    Tendências e previsões baseadas no histórico financeiro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportsData ? (
                    <div className="space-y-6">
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <h3 className="font-medium text-blue-400 mb-2">Tendência de Receitas</h3>
                          <p className="text-sm text-gray-300">
                            {reportsData.summary.variations.income >= 0 ? 'Crescimento' : 'Declínio'} de{' '}
                            <span className={reportsData.summary.variations.income >= 0 ? 'text-green-400' : 'text-red-400'}>
                              {formatVariation(reportsData.summary.variations.income)}
                            </span> em relação ao mês anterior
                          </p>
                        </div>
                        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <h3 className="font-medium text-purple-400 mb-2">Tendência de Despesas</h3>
                          <p className="text-sm text-gray-300">
                            {reportsData.summary.variations.expenses >= 0 ? 'Aumento' : 'Redução'} de{' '}
                            <span className={reportsData.summary.variations.expenses <= 0 ? 'text-green-400' : 'text-red-400'}>
                              {formatVariation(reportsData.summary.variations.expenses)}
                            </span> em relação ao mês anterior
                          </p>
                        </div>
                      </div>
                      
                      {advancedMetrics && (
                        <div>
                          <h3 className="font-medium text-white mb-3">Projeções</h3>
                          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                            <div className="p-3 bg-gray-800/50 rounded-lg">
                              <p className="text-xs text-gray-400">Média diária atual</p>
                              <p className="font-medium">{formatCurrency(advancedMetrics.dailyAverage.current)}</p>
                            </div>
                            <div className="p-3 bg-gray-800/50 rounded-lg">
                              <p className="text-xs text-gray-400">Projeção semanal</p>
                              <p className="font-medium">{formatCurrency(advancedMetrics.weeklyAverage.current)}</p>
                            </div>
                            <div className="p-3 bg-gray-800/50 rounded-lg">
                              <p className="text-xs text-gray-400">Total mensal atual</p>
                              <p className="font-medium">{formatCurrency(advancedMetrics.monthlyTotal.current)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400">Não há dados suficientes para análise de tendências.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Análise por Categorias</CardTitle>
                  <CardDescription className="text-gray-400">
                    Detalhamento das despesas e receitas por categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportsData && reportsData.categoryExpenses.length > 0 ? (
                    <div className="space-y-4">
                      {reportsData.categoryExpenses.map((category, index) => {
                        const percentage = reportsData.summary.currentExpenses > 0 
                          ? (category.amount / reportsData.summary.currentExpenses) * 100 
                          : 0;
                        
                        return (
                          <div key={category.name} className="p-4 bg-gray-800/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="h-4 w-4 rounded-full"
                                  style={{ 
                                    backgroundColor: (() => {
                                      const colorMap: Record<string, string> = {
                                        'bg-orange-400': '#fb923c',
                                        'bg-rose-500': '#f43f5e',  
                                        'bg-indigo-500': '#6366f1',
                                        'bg-cyan-500': '#06b6d4',
                                        'bg-yellow-400': '#facc15',
                                        'bg-purple-800': '#6b21a8',
                                        'bg-slate-500': '#64748b',
                                        'bg-green-500': '#22c55e',
                                        'bg-blue-500': '#3b82f6',
                                        'bg-red-500': '#ef4444',
                                        'bg-gray-500': '#6b7280',
                                      };
                                      return colorMap[category.color] || '#6b7280';
                                    })()
                                  }}
                                ></div>
                                <span className="font-medium">{category.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{formatCurrency(category.amount)}</div>
                                <div className="text-xs text-gray-400">{percentage.toFixed(1)}% do total</div>
                              </div>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full"
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: (() => {
                                    const colorMap: Record<string, string> = {
                                      'bg-orange-400': '#fb923c',
                                      'bg-rose-500': '#f43f5e',  
                                      'bg-indigo-500': '#6366f1',
                                      'bg-cyan-500': '#06b6d4',
                                      'bg-yellow-400': '#facc15',
                                      'bg-purple-800': '#6b21a8',
                                      'bg-slate-500': '#64748b',
                                      'bg-green-500': '#22c55e',
                                      'bg-blue-500': '#3b82f6',
                                      'bg-red-500': '#ef4444',
                                      'bg-gray-500': '#6b7280',
                                    };
                                    return colorMap[category.color] || '#6b7280';
                                  })()
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400">Não há dados de categorias disponíveis para exibição.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
