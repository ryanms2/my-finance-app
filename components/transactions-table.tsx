"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, useSearchParams } from "next/navigation"
import type { TransactionData } from '@/lib/types'

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TransactionsTableProps {
  transactions?: TransactionData[];
  pagination?: Pagination;
}

export function TransactionsTable({ transactions = [], pagination }: TransactionsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getTransactionIcon = (category: TransactionData['category']) => {
    if (category.icon) {
      return <span className="text-sm">{category.icon}</span>;
    }
    
    // Ícones padrão baseados no tipo
    if (category.type === 'income') {
      return <span className="text-green-400">📈</span>;
    }
    return <span className="text-red-400">📉</span>;
  };

  const getStatusBadge = (type: string) => {
    if (type === 'income') {
      return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Receita</Badge>;
    }
    return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Despesa</Badge>;
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/transactions?${params.toString()}`);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>Nenhuma transação encontrada.</p>
      </div>
    );
  }
  return (
    <div className="w-full">
      {/* Versão para desktop */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-gray-800 hover:bg-gray-900/30">
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell className={transaction.type === "expense" ? "text-red-400" : "text-green-400"}>
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(transaction.category)}
                    <span>{transaction.category.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-400">{transaction.account.name}</span>
                </TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>
                  {getStatusBadge(transaction.type)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Versão para mobile */}
      <div className="grid gap-4 sm:hidden">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-gray-900/30 p-4 rounded-lg border border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">{transaction.description}</div>
              <div className={transaction.type === "expense" ? "text-red-400" : "text-green-400"}>
                {formatCurrency(transaction.amount)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                {getTransactionIcon(transaction.category)}
                <span className="text-gray-400">{transaction.category.name}</span>
              </div>
              <div className="text-gray-400">{formatDate(transaction.date)}</div>
              <div className="text-gray-400">{transaction.account.name}</div>
              <div>
                {getStatusBadge(transaction.type)}
              </div>
            </div>
            <div className="mt-2 text-right">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                Editar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} transações
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="border-gray-700 hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <span className="text-sm text-gray-400">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="border-gray-700 hover:bg-gray-700"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
