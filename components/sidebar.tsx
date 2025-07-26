"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, DollarSign, Home, Settings, Wallet, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NavigationLink } from "@/components/navigation-link"

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className={cn("pb-12 w-64 border-r border-gray-800 bg-gray-950 hidden lg:block", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <NavigationLink href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <span>MyFinance</span>
          </NavigationLink>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2", isActive("/dashboard") ? "text-white" : "text-gray-400")}
            >
              <NavigationLink href="/dashboard">
                <Home className="h-4 w-4" />
                Dashboard
              </NavigationLink>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2", isActive("/transactions") ? "text-white" : "text-gray-400")}
            >
              <NavigationLink href="/transactions">
                <CreditCard className="h-4 w-4" />
                Transações
              </NavigationLink>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2", isActive("/wallets") ? "text-white" : "text-gray-400")}
            >
              <NavigationLink href="/wallets">
                <Wallet className="h-4 w-4" />
                Carteiras
              </NavigationLink>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2", isActive("/budgets") ? "text-white" : "text-gray-400")}
            >
              <NavigationLink href="/budgets">
                <Wallet className="h-4 w-4" />
                Orçamentos
              </NavigationLink>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("w-full justify-start gap-2", isActive("/reports") ? "text-white" : "text-gray-400")}
            >
              <NavigationLink href="/reports">
                <BarChart3 className="h-4 w-4" />
                Relatórios
              </NavigationLink>
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
              <NavigationLink href="/settings">
                <Settings className="h-4 w-4" />
                Preferências
              </NavigationLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
