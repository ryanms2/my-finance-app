import type { Metadata } from "next"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionsTable } from "@/components/transactions-table"
import { Sidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { MobileMenu } from "@/components/mobile-menu"
import { TransactionForm } from "@/components/transaction-form"
import { CardsSummary } from "@/components/dashboard/cards-summary"
import { Wallets } from "@/components/dashboard/wallets"
import { MonthlyExpenses } from "@/components/dashboard/monthly-expenses"
import { ExportDialog } from "@/components/export-dialog"
import { getAccount, getCategoriesUser } from "@/lib/data"
import { getDashboardSummary, getBudgetsData, getMonthlyChartData, getExpensesChartData, getRecentTransactions } from "@/lib/extra"
import Link from "next/link"

export const metadata: Metadata = {
  title: "MyFinance - Gerenciamento de Finanças Pessoais",
  description: "Um aplicativo moderno para gerenciamento de Finanças Pessoais",
}

export default async function Dashboard() {
  const walletsRaw = await getAccount();
  const wallets = Array.isArray(walletsRaw)
    ? walletsRaw.map(w => ({
        ...w,
        balance: w.balance ?? 0,
        totalLimit: w.totalLimit ?? 0,
        institution: w.institution ?? "",
        accountNumber: w.accountNumber ?? "",
        color: w.color ?? "",
      }))
    : false;
  const categories = await getCategoriesUser();
  const summary = await getDashboardSummary();
  const budgetsData = await getBudgetsData();
  const monthlyChartData = await getMonthlyChartData();
  const expensesChartData = await getExpensesChartData();
  const recentTransactionsData = await getRecentTransactions(5);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <Sidebar />
      <MobileMenu />
      <div className="flex-1 overflow-auto pb-20 lg:pb-0">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center">
            <h1 className="text-xl font-bold ml-12 lg:ml-0">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <TransactionForm 
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-1 text-green-400 border-green-400/20 hover:bg-green-400/10"
              account={wallets}
              categories={categories}
            />
            <ExportDialog 
              defaultType="transactions"
              availableWallets={wallets ? wallets.map(w => ({ id: w.id, name: w.name })) : []}
              availableCategories={categories ? categories.map(c => ({ 
                id: c.id, 
                name: c.name, 
                type: c.type as 'income' | 'expense' 
              })) : []}
            >
              <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </ExportDialog>
            <UserNav />
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {/* Cards Summary */}
          <CardsSummary 
            saldoTotal={summary?.saldoTotal ?? 0}
            receitas={summary?.receitas ?? 0}
            despesas={summary?.despesas ?? 0}
            economias={summary?.economias ?? 0}
            variacoes={summary?.variacoes}
          />

          {/* Wallets */}
            <Wallets wallets={wallets} />
          

          {/* Monthly Expenses */}
          <MonthlyExpenses 
            budgetsData={budgetsData}
            monthlyChartData={monthlyChartData}
            expensesChartData={expensesChartData}
          />

          {/* Transactions Table */}
          <div className="mt-4 sm:mt-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Transações Recentes</CardTitle>
                <Link href="/transactions">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    Ver Todas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <TransactionsTable 
                  transactions={recentTransactionsData.transactions}
                  wallets={wallets ? wallets.map(w => ({ id: w.id, name: w.name, type: w.type })) : []}
                  categories={categories ? categories.map(c => ({ 
                    id: c.id, 
                    name: c.name, 
                    type: c.type as 'income' | 'expense',
                    icon: c.icon ?? undefined
                  })) : []}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}