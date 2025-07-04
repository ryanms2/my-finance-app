import type React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Dashboard
      </Link>
      <Link
        href="/transactions"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Transactions
      </Link>
      <Link href="/budgets" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Budgets
      </Link>
      <Link href="/reports" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Reports
      </Link>
    </nav>
  )
}
