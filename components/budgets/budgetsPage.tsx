import { Download, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { MobileMenu } from "@/components/mobile-menu"
import { ExpensesDonutChart } from "@/components/expenses-donut-chart"
import { ExportDialog } from "@/components/export-dialog"

interface Budget {
  id: string
  name: string
  spent: number
  total: number
  percentage: number
  color: string
  categoryId: string
  icon: string | null
}

interface BudgetsSummary {
  totalBudgeted: number
  totalSpent: number
  overallPercentage: number
  chartData: Array<{
    label: string
    value: number
    color: string | null
  }>
}

interface BudgetsPageProps {
  budgets: Budget[]
  summary: BudgetsSummary | null
}

export function BudgetsPage({ budgets, summary }: BudgetsPageProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <Sidebar />
      <MobileMenu />
      <div className="flex-1 overflow-auto pb-20 lg:pb-0">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center">
            <h1 className="text-xl font-bold ml-10 lg:ml-0">Orçamentos</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-1 text-green-400 border-green-400/20 hover:bg-green-400/10"
            >
              <Plus className="h-4 w-4" />
              Novo Orçamento
            </Button>
            <ExportDialog defaultType="budgets">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </ExportDialog>
            <UserNav />
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Visão Geral do Orçamento</CardTitle>
                <CardDescription className="text-gray-400">
                  Distribuição dos seus orçamentos para o mês atual
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2 max-w-[300px] mx-auto">
                  <ExpensesDonutChart data={summary?.chartData?.map(item => ({
                    name: item.label,
                    amount: item.value,
                    color: item.color || '#6B7280'
                  }))} />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Total Orçado</p>
                      <p className="text-2xl font-bold">{formatCurrency(summary?.totalBudgeted ?? 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-right">Total Gasto</p>
                      <p className="text-2xl font-bold text-right">{formatCurrency(summary?.totalSpent ?? 0)}</p>
                    </div>
                  </div>
                  <Progress
                    value={summary?.overallPercentage ?? 0}
                    className="h-2 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500"
                  />
                  <p className="text-sm text-gray-400 text-center">
                    Você já utilizou {summary?.overallPercentage ?? 0}% do seu orçamento mensal
                  </p>
                </div>
              </CardContent>
            </Card>

            {budgets.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Nenhum orçamento encontrado</h3>
                <p className="text-gray-400 mb-6">Crie seu primeiro orçamento para começar a controlar seus gastos</p>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  Novo Orçamento
                </Button>
              </div>
            ) : (
              <>
                {budgets.map((budget) => (
                  <Card key={budget.id} className="bg-gray-900/50 border-gray-800">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{budget.icon}</span>
                          <CardTitle className="text-lg">{budget.name}</CardTitle>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            budget.percentage >= 90
                              ? "bg-red-500/20 text-red-300"
                              : budget.percentage >= 75
                                ? "bg-orange-500/20 text-orange-300"
                                : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {budget.percentage}%
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Gasto</span>
                          <span>
                            {formatCurrency(budget.spent)} / {formatCurrency(budget.total)}
                          </span>
                        </div>
                        <div className="relative pt-1">
                          <div className="h-2 rounded-full bg-gray-800">
                            <div
                              className={`absolute top-0 h-2 rounded-full bg-gradient-to-r ${budget.color || 'from-gray-400 to-gray-600'}`}
                              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Restante: {formatCurrency(Math.max(budget.total - budget.spent, 0))}</span>
                          {budget.percentage > 100 && (
                            <span className="text-red-400">Excedeu em {formatCurrency(budget.spent - budget.total)}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        Ver Detalhes
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                <Card className="bg-gray-900/50 border-gray-800 border-dashed flex flex-col items-center justify-center p-6">
                  <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Adicionar Orçamento</h3>
                  <p className="text-sm text-gray-400 text-center mb-4">
                    Crie um novo orçamento para controlar seus gastos
                  </p>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    Novo Orçamento
                  </Button>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
