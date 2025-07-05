"use client"

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Filter, Download } from 'lucide-react';
import { TransactionForm } from '../transaction-form';
import { MobileNav } from '../mobile-nav';
import { MobileMenu } from '../mobile-menu';
import { TransactionsTable } from '../transactions-table';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { UserNavClient } from '../user-nav-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sidebar } from '../sidebar';
import { useRouter, useSearchParams } from 'next/navigation';
import type { TransactionData, TransactionsData, TransactionsSummary, Wallet, Category } from '@/lib/types';

interface Filters {
  type: 'income' | 'expense' | 'all';
  search: string;
  page: number;
}

interface TransactionsPageProps {
  transactionsData: TransactionsData;
  summary: TransactionsSummary | null;
  wallets: Wallet[] | false;
  categories: Category[] | false;
  filters: Filters;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function TransactionsPage({ 
  transactionsData, 
  summary, 
  wallets, 
  categories, 
  filters,
  user
}: TransactionsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(filters.search);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', value);
    params.delete('page'); // Reset to first page when changing type
    router.push(`/transactions?${params.toString()}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset to first page when searching
    router.push(`/transactions?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
                <h1 className="text-xl font-bold ml-10 lg:ml-0">Transações</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <TransactionForm
                variant="outline"
                size="sm"
                className="hidden sm:flex gap-1 text-green-400 border-green-400/20 hover:bg-green-400/10"
                account={wallets}
                categories={categories}
                />
                <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                <Download className="h-4 w-4" />
                Exportar
                </Button>
                <UserNavClient user={user} />
            </div>
            </header>

            <main className="p-4 sm:p-6">
            {/* Summary Cards */}
            {summary && (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total do Mês</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(summary.monthly.balance)}</div>
                    <p className="text-xs text-gray-400">
                      {summary.monthly.totalCount} transações
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">{formatCurrency(summary.monthly.totalIncome)}</div>
                    <p className="text-xs text-gray-400">
                      {summary.monthly.incomeCount} transações
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-400">{formatCurrency(summary.monthly.totalExpenses)}</div>
                    <p className="text-xs text-gray-400">
                      {summary.monthly.expenseCount} transações
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Top Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {summary.topCategories[0]?.name || 'N/A'}
                    </div>
                    <p className="text-xs text-gray-400">
                      {summary.topCategories[0] ? formatCurrency(summary.topCategories[0].amount) : ''}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="mb-6">
                <Tabs value={filters.type} onValueChange={handleTabChange} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <TabsList className="bg-gray-800/50">
                    <TabsTrigger value="all">Todas ({transactionsData.pagination.total})</TabsTrigger>
                    <TabsTrigger value="income">Receitas ({summary?.monthly.incomeCount || 0})</TabsTrigger>
                    <TabsTrigger value="expense">Despesas ({summary?.monthly.expenseCount || 0})</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                    <div className="relative flex-1 sm:min-w-[200px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                        placeholder="Buscar transações..."
                        className="pl-8 bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        />
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-gray-700 hover:bg-gray-700"
                      onClick={handleSearch}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                    </div>
                </div>
                <TabsContent value="all" className="mt-0">
                    <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle>Todas as Transações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TransactionsTable 
                          transactions={transactionsData.transactions}
                          pagination={transactionsData.pagination}
                          wallets={wallets ? wallets.map(w => ({ id: w.id, name: w.name, type: w.type })) : []}
                          categories={categories ? categories.map(c => ({ id: c.id, name: c.name, type: c.type, icon: c.icon })) : []}
                        />
                    </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="income" className="mt-0">
                    <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle>Receitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TransactionsTable 
                          transactions={transactionsData.transactions}
                          pagination={transactionsData.pagination}
                          wallets={wallets ? wallets.map(w => ({ id: w.id, name: w.name, type: w.type })) : []}
                          categories={categories ? categories.map(c => ({ id: c.id, name: c.name, type: c.type, icon: c.icon })) : []}
                        />
                    </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="expense" className="mt-0">
                    <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle>Despesas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TransactionsTable 
                          transactions={transactionsData.transactions}
                          pagination={transactionsData.pagination}
                          wallets={wallets ? wallets.map(w => ({ id: w.id, name: w.name, type: w.type })) : []}
                          categories={categories ? categories.map(c => ({ id: c.id, name: c.name, type: c.type, icon: c.icon })) : []}
                        />
                    </CardContent>
                    </Card>
                </TabsContent>
                </Tabs>
            </div>
            </main>

            <MobileNav />
        </div>
    </div>
    );
}
