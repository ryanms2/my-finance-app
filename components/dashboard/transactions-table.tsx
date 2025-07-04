"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ShoppingCart, Briefcase, Film, Car } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Transaction = {
  id: string
  description: string
  amount: number
  category: string
  categoryIcon: React.ReactNode
  date: string
  status: "completed" | "pending" | "failed"
}

const transactions: Transaction[] = [
  {
    id: "1",
    description: "Supermercado",
    amount: -250.75,
    category: "Alimentação",
    categoryIcon: <ShoppingCart className="h-4 w-4 text-green-400" />,
    date: "14/11/2023",
    status: "completed",
  },
  {
    id: "2",
    description: "Salário",
    amount: 3500.0,
    category: "Rendimento",
    categoryIcon: <Briefcase className="h-4 w-4 text-blue-400" />,
    date: "09/11/2023",
    status: "completed",
  },
  {
    id: "3",
    description: "Netflix",
    amount: -15.99,
    category: "Entretenimento",
    categoryIcon: <Film className="h-4 w-4 text-purple-400" />,
    date: "05/11/2023",
    status: "completed",
  },
  {
    id: "4",
    description: "Uber",
    amount: -24.5,
    category: "Transporte",
    categoryIcon: <Car className="h-4 w-4 text-orange-400" />,
    date: "03/11/2023",
    status: "completed",
  },
]

export function TransactionsTable() {
  return (
    <div className="w-full overflow-auto">
      {/* Versão para desktop */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-gray-800 hover:bg-gray-900/30">
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell className={transaction.amount < 0 ? "text-red-400" : "text-green-400"}>
                  {transaction.amount < 0 ? "-R$ " : "+R$ "}
                  {Math.abs(transaction.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {transaction.categoryIcon}
                    <span>{transaction.category}</span>
                  </div>
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-800/50 text-white border-gray-700">
                    {transaction.status === "completed" ? "Concluído" : transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
              <div className={transaction.amount < 0 ? "text-red-400" : "text-green-400"}>
                {transaction.amount < 0 ? "-R$ " : "+R$ "}
                {Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                {transaction.categoryIcon}
                <span className="text-gray-400">{transaction.category}</span>
              </div>
              <div className="text-gray-400">{transaction.date}</div>
              <div>
                <Badge variant="outline" className="bg-gray-800/50 text-white border-gray-700">
                  {transaction.status === "completed" ? "Concluído" : transaction.status}
                </Badge>
              </div>
              <div className="text-right">
                <Button variant="ghost" size="sm">
                  Editar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
