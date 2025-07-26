"use client"

import { CreditCard, Home, Plus, BarChart3, Wallet, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NavigationLink } from "@/components/navigation-link"
import { TransactionForm } from "@/components/transaction-form"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Início",
    },
    {
      href: "/transactions",
      icon: CreditCard,
      label: "Transações",
    },
    {
      href: "/wallets",
      icon: Wallet,
      label: "Carteiras",
    },
    {
      href: "/reports",
      icon: BarChart3,
      label: "Relatórios",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Config",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-20 bg-gray-950/95 backdrop-blur-md border-t border-gray-800 lg:hidden">
      <div className="grid h-full grid-cols-5 mx-auto max-w-lg">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isCenter = index === 2 // Wallet é o centro

          if (isCenter) {
            return (
              <div key={item.href} className="flex items-center justify-center">
                <button className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg -mt-6 active:scale-95 transition-transform">
                  <Plus className="h-7 w-7 text-white" />
                </button>
              </div>
            )
          }

          return (
            <NavigationLink
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-2 py-2 hover:bg-gray-900/50 group transition-all duration-200 active:scale-95",
                isActive && "text-purple-400",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isActive ? "bg-purple-500/20" : "group-hover:bg-gray-800/50",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {isActive && <div className="w-1 h-1 bg-purple-400 rounded-full mt-1 animate-pulse" />}
            </NavigationLink>
          )
        })}
      </div>
    </div>
  )
}
