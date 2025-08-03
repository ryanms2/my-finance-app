import type { Metadata } from "next"
import { TransactionsPage } from "@/components/transactions/transactionPage"
import { getTransactionsData, getTransactionsSummary, getTransactionsDataFiltered, getTransactionsSummaryFiltered } from "@/lib/extra"
import { getAccount, getCategoriesUser } from "@/lib/data"
import { auth } from "@/app/auth"

// Esta página precisa ser dinâmica devido aos filtros de busca
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Transações - MyFinance",
  description: "Gerencie suas transações financeiras",
}

export default async function Transactions({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string; page?: string; month?: string; year?: string }>
}) {
  try {
    const params = await searchParams;
    const type = params.type as 'income' | 'expense' | 'all' || 'all';
    const search = params.search || '';
    const page = parseInt(params.page || '1');
    const month = params.month ? parseInt(params.month) : new Date().getMonth() + 1;
    const year = params.year ? parseInt(params.year) : new Date().getFullYear();

    // Validar parâmetros de mês e ano
    const isValidMonth = month >= 1 && month <= 12;
    const isValidYear = year >= 2020 && year <= 2030;

    const [transactionsData, summary, walletsRaw, categoriesRaw, session] = await Promise.all([
      isValidMonth && isValidYear 
        ? getTransactionsDataFiltered(month, year, { type, search, page })
        : getTransactionsData({ type, search, page }),
      isValidMonth && isValidYear 
        ? getTransactionsSummaryFiltered(month, year)
        : getTransactionsSummary(),
      getAccount(),
      getCategoriesUser(),
      auth()
    ]);

    // Formatar carteiras
    const wallets = Array.isArray(walletsRaw)
      ? walletsRaw.map(w => ({
          id: w.id,
          name: w.name,
          type: w.type,
          balance: w.balance ?? 0,
          totalLimit: w.totalLimit ?? 0,
          institution: w.institution ?? "",
          accountNumber: w.accountNumber ?? "",
          color: w.color ?? "",
          isDefault: w.isDefault ?? false,
        }))
      : false;

    // Formatar categorias
    const categories = Array.isArray(categoriesRaw)
      ? categoriesRaw.map(c => ({
          id: c.id,
          name: c.name,
          type: c.type as 'income' | 'expense',
          color: c.color ?? undefined,
          icon: c.icon ?? undefined,
        }))
      : false;

    return (
      <TransactionsPage 
        transactionsData={transactionsData}
        summary={summary}
        wallets={wallets}
        categories={categories}
        filters={{ type, search, page }}
        selectedMonth={month}
        selectedYear={year}
        user={session?.user}
      />
    )
  } catch (error) {
    console.error('Erro na página de transações:', error);
    // Retornar uma página de erro ou dados vazios
    const now = new Date();
    return (
      <TransactionsPage 
        transactionsData={{
          transactions: [],
          pagination: { page: 1, limit: 50, total: 0, totalPages: 0 }
        }}
        summary={null}
        wallets={false}
        categories={false}
        filters={{ type: 'all', search: '', page: 1 }}
        selectedMonth={now.getMonth() + 1}
        selectedYear={now.getFullYear()}
        user={undefined}
      />
    )
  }
}
