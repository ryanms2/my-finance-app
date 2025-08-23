import type { Metadata } from "next"
import { Suspense } from "react"
import { BudgetsPage } from "@/components/budgets/budgetsPage"
import { getBudgetsData, getBudgetsSummary } from "@/lib/extra"
import { getCategoriesUser } from "@/lib/data"
import { BudgetsLoadingSkeleton } from "@/components/budgets/budgets-loading"

export const metadata: Metadata = {
  title: "Orçamentos - MyFinance",
  description: "Gerencie seus orçamentos financeiros",
}

async function BudgetsContent() {
  const [budgets, summary, categories] = await Promise.all([
    getBudgetsData(),
    getBudgetsSummary(),
    getCategoriesUser()
  ]);

  return (
    <BudgetsPage 
      budgets={budgets || []}
      summary={summary}
      categories={categories || []}
    />
  )
}

export default function Budgets() {
  return (
    <Suspense fallback={<BudgetsLoadingSkeleton />}>
      <BudgetsContent />
    </Suspense>
  )
}
