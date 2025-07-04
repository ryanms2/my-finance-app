"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, DollarSign, Home, Settings, Wallet, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className={cn("pb-12 w-64 border-r border-gray-800 bg-gray-950 hidden lg:block", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <span>MyFinance</span>
          </Link>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2", isActive("/dashboard") ? "text-white" : "text-gray-400")}
            >
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2", isActive("/transactions") ? "text-white" : "text-gray-400")}
            >
              <Link href="/transactions">
                <CreditCard className="h-4 w-4" />
                Transações
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2", isActive("/wallets") ? "text-white" : "text-gray-400")}
            >
              <Link href="/wallets">
                <Wallet className="h-4 w-4" />
                Carteiras
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2", isActive("/budgets") ? "text-white" : "text-gray-400")}
            >
              <Link href="/budgets">
                <Wallet className="h-4 w-4" />
                Orçamentos
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2", isActive("/reports") ? "text-white" : "text-gray-400")}
            >
              <Link href="/reports">
                <BarChart3 className="h-4 w-4" />
                Relatórios
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold text-gray-400">Configurações</h2>
          <div className="space-y-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2", isActive("/settings") ? "text-white" : "text-gray-400")}
            >
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                Preferências
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
