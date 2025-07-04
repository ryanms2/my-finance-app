import type { Metadata } from "next"
import { BudgetsPage } from "@/components/budgets/budgetsPage"
import { getBudgetsData, getBudgetsSummary } from "@/lib/extra"

export const metadata: Metadata = {
  title: "Orçamentos - MyFinance",
  description: "Gerencie seus orçamentos financeiros",
}

export default async function Budgets() {
  const [budgets, summary] = await Promise.all([
    getBudgetsData(),
    getBudgetsSummary()
  ]);

  return (
    <BudgetsPage 
      budgets={budgets || []}
      summary={summary}
    />
  )
}
