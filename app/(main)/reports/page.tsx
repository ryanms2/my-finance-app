import { ReportsPage } from "@/components/reports/reportsPage"
import { getReportsData, getAdvancedMetrics, getMonthlyChartData } from "@/lib/extra"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Relatórios - MyFinance",
  description: "Visualize relatórios detalhados das suas finanças",
}

export default async function Reports() {
  const [reportsData, advancedMetrics, monthlyChartData] = await Promise.all([
    getReportsData(),
    getAdvancedMetrics(),
    getMonthlyChartData(),
  ]);

  return (
    <ReportsPage 
      reportsData={reportsData}
      advancedMetrics={advancedMetrics}
      monthlyChartData={monthlyChartData}
    />
  )
}
