import { ReportsPage } from "@/components/reports/reportsPage"
import { getReportsData, getAdvancedMetrics, getMonthlyChartData, getReportsDataFiltered, getAdvancedMetricsFiltered, getMonthlyChartDataFiltered } from "@/lib/extra"
import { auth } from "@/app/auth"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Relatórios - MyFinance",
  description: "Visualize relatórios detalhados das suas finanças",
}

interface ReportsProps {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}

export default async function Reports({ searchParams }: ReportsProps) {
  const session = await auth()
  const user = session?.user
  
  const params = await searchParams;
  const month = params.month ? parseInt(params.month) : new Date().getMonth() + 1;
  const year = params.year ? parseInt(params.year) : new Date().getFullYear();
  
  // Validar parâmetros
  const isValidMonth = month >= 1 && month <= 12;
  const isValidYear = year >= 2020 && year <= 2030;
  
  // Usar funções filtradas se parâmetros válidos forem fornecidos, senão usar as funções padrão
  const [reportsData, advancedMetrics, monthlyChartData] = await Promise.all([
    isValidMonth && isValidYear ? getReportsDataFiltered(month, year) : getReportsData(),
    isValidMonth && isValidYear ? getAdvancedMetricsFiltered(month, year) : getAdvancedMetrics(),
    isValidYear ? getMonthlyChartDataFiltered(year) : getMonthlyChartData(),
  ]);

  return (
    <ReportsPage 
      reportsData={reportsData}
      advancedMetrics={advancedMetrics}
      monthlyChartData={monthlyChartData}
      selectedMonth={month}
      selectedYear={year}
      user={user}
    />
  )
}
