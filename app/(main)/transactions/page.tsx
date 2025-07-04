import type { Metadata } from "next"
import { TransactionsPage } from "@/components/transactions/transactionPage"
import { getTransactionsData, getTransactionsSummary } from "@/lib/extra"
import { getAccount, getCategoriesUser } from "@/lib/data"
import { auth } from "@/app/auth"

export const metadata: Metadata = {
  title: "Transações - MyFinance",
  description: "Gerencie suas transações financeiras",
}

export default async function Transactions({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string; page?: string }>
}) {
  try {
    const params = await searchParams;
    const type = params.type as 'income' | 'expense' | 'all' || 'all';
    const search = params.search || '';
    const page = parseInt(params.page || '1');

    console.log('Filtros de transações:', { type, search, page });

    const [transactionsData, summary, walletsRaw, categoriesRaw, session] = await Promise.all([
      getTransactionsData({ type, search, page }),
      getTransactionsSummary(),
      getAccount(),
      getCategoriesUser(),
      auth()
    ]);

    console.log('Dados das transações:', {
      transactionsCount: transactionsData.transactions.length,
      pagination: transactionsData.pagination,
    });

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
        user={session?.user}
      />
    )
  } catch (error) {
    console.error('Erro na página de transações:', error);
    // Retornar uma página de erro ou dados vazios
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
        user={undefined}
      />
    )
  }
}
