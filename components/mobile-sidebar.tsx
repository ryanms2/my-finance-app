"use client"

import Link from "next/link"
import { BarChart3, CreditCard, DollarSign, Home, PieChart, Settings, Wallet, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { NavigationLink } from "@/components/navigation-link"

interface MobileSidebarProps {
  onClose: () => void
}

export function MobileSidebar({ onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  const mainNavItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/transactions", icon: CreditCard, label: "Transações" },
    { href: "/wallets", icon: Wallet, label: "Carteiras" },
    { href: "/budgets", icon: Wallet, label: "Orçamentos" },
    { href: "/reports", icon: BarChart3, label: "Relatórios" },
  ]

  const secondaryNavItems = [
    { href: "/settings", icon: Settings, label: "Configurações" },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <NavigationLink href="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">MyFinance</h1>
            <p className="text-xs text-gray-400">Gestão Financeira</p>
          </div>
        </NavigationLink>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <div className="space-y-2">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Principal</p>
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                size="lg"
                className={cn(
                  "w-full justify-start gap-3 h-12 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-white bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50",
                )}
              >
                <NavigationLink href={item.href} onClick={onClose} className="flex items-center gap-3 w-full">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />}
                </NavigationLink>
              </Button>
            )
          })}
        </div>

        <Separator className="my-6 bg-gray-800" />

        <div className="space-y-2">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Outros</p>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                size="lg"
                className={cn(
                  "w-full justify-start gap-3 h-12 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-white bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50",
                )}
              >
                <NavigationLink href={item.href} onClick={onClose} className="flex items-center gap-3 w-full">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />}
                </NavigationLink>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
