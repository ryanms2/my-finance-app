import type React from "react"
import { NavigationLink } from "@/components/navigation-link"

import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <NavigationLink href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Dashboard
      </NavigationLink>
      <NavigationLink
        href="/transactions"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Transactions
      </NavigationLink>
      <NavigationLink href="/budgets" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Budgets
      </NavigationLink>
      <NavigationLink href="/reports" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Reports
      </NavigationLink>
    </nav>
  )
}
