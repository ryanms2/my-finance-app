import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { MonthlySpendingChart } from "./monthly-spending-chart";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ExpensesDonutChart } from "../expenses-donut-chart";
import { Button } from "../ui/button";

interface BudgetData {
  id: string;
  name: string;
  spent: number;
  total: number;
  percentage: number;
  color: string;
  categoryId: string;
  icon: string | null;
}

interface MonthlyChartData {
  month: string;
  income: number;
  expenses: number;
}

interface ExpensesChartData {
  name: string;
  amount: number;
  color: string;
}

interface MonthlyExpensesProps {
  budgetsData: BudgetData[];
  monthlyChartData: MonthlyChartData[] | null;
  expensesChartData: ExpensesChartData[];
}

export function MonthlyExpenses({ budgetsData, monthlyChartData, expensesChartData }: MonthlyExpensesProps) {
    return (
        <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-7">
            <Card className="lg:col-span-4 bg-gray-900/50 border-gray-800">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Gastos Mensais</CardTitle>
                  <CardDescription className="text-gray-400">
                    Comparativo de receitas vs despesas dos últimos 6 meses
                  </CardDescription>
                </div>
                <Tabs defaultValue="6m" className="w-full sm:w-[200px]">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                    <TabsTrigger value="1m">1M</TabsTrigger>
                    <TabsTrigger value="6m">6M</TabsTrigger>
                    <TabsTrigger value="1y">1A</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <MonthlySpendingChart data={monthlyChartData} />
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <p className="flex items-center text-sm font-medium">
                      {monthlyChartData && monthlyChartData.length >= 2 ? (
                        (() => {
                          const current = monthlyChartData[monthlyChartData.length - 1];
                          const previous = monthlyChartData[monthlyChartData.length - 2];
                          const currentSavings = current.income - current.expenses;
                          const previousSavings = previous.income - previous.expenses;
                          
                          if (previousSavings === 0) {
                            return (
                              <>
                                Dados de comparação indisponíveis
                                <TrendingUp className="ml-1 h-4 w-4 text-gray-400" />
                              </>
                            );
                          }
                          
                          const variation = Math.round(((currentSavings - previousSavings) / Math.abs(previousSavings)) * 100);
                          const isPositive = variation >= 0;
                          
                          return (
                            <>
                              Economia líquida {isPositive ? 'aumentou' : 'diminuiu'} {Math.abs(variation)}%
                              <TrendingUp className={`ml-1 h-4 w-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
                            </>
                          );
                        })()
                      ) : (
                        <>
                          Dados insuficientes para comparação
                          <TrendingUp className="ml-1 h-4 w-4 text-gray-400" />
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date().toLocaleDateString('pt-BR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                      <span className="text-xs text-gray-400">Receitas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-red-800"></div>
                      <span className="text-xs text-gray-400">Despesas</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Progresso do Orçamento</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs text-gray-400">
                    {new Date().toLocaleDateString('pt-BR', { 
                      month: 'long', 
                      year: 'numeric',
                      day: undefined 
                    }).replace(/^\w/, c => c.toUpperCase())}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {budgetsData && budgetsData.length > 0 ? (
                  budgetsData.slice(0, 4).map((budget) => (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          {budget.icon && <span>{budget.icon}</span>}
                          {budget.name}
                        </span>
                        <span className="font-medium">
                          R$ {budget.spent.toLocaleString('pt-BR', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })} / R$ {budget.total.toLocaleString('pt-BR', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="h-2 rounded-full bg-gray-800">
                          <div
                            className={`absolute top-0 h-2 rounded-full bg-gradient-to-r ${
                              budget.percentage > 90 
                                ? 'from-red-400 to-red-600' 
                                : budget.percentage > 70 
                                ? 'from-yellow-400 to-yellow-600'
                                : 'from-green-400 to-green-600'
                            }`}
                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                          ></div>
                        </div>
                        {budget.percentage > 100 && (
                          <p className="text-xs text-red-400 mt-1">
                            {(budget.percentage - 100).toFixed(0)}% acima do orçamento
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">Nenhum orçamento configurado</p>
                    <p className="text-xs text-gray-500 mt-1">Configure orçamentos para acompanhar seus gastos</p>
                  </div>
                )}

                <div className="pt-4">
                  <ExpensesDonutChart data={expensesChartData} />
                </div>
              </CardContent>
            </Card>
          </div>
    )
}