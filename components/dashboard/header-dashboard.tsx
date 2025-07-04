import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { UserNav } from "../user-nav";
import { TransactionForm } from "../transaction-form";

interface HeaderDashboardProps {
  wallets?: any;
  categories?: any;
}

export function HeaderDashboard({ wallets, categories }: HeaderDashboardProps) {
    return (
        <header className=" top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center">
            <h1 className="text-xl font-bold ml-10 lg:ml-0">Dashboard</h1>
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
            <UserNav />
          </div>
        </header>
    )
        
}