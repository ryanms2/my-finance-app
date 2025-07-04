
import { Download, Plus, ArrowRightLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { MobileMenu } from "@/components/mobile-menu"
import { WalletForm } from "@/components/wallet-form"
import { WalletCard } from "@/components/wallet-card"
import { WalletOverview } from "@/components/wallet-overview"
import { TransferForm } from "@/components/transfer-form"
import { TransferHistory } from "@/components/transfer-history"

// Tipo simplificado para as carteiras no TransferForm
type TransferWallet = {
  id: string
  name: string
  balance: number | null
}

interface Wallet {
  id: string
  name: string
  type: string
  balance: number
  bank?: string | null
  accountNumber?: string
  color: string
  limit?: number | null
  isDefault: boolean
}

interface WalletsSummary {
  totalBalance: number
  activeWallets: number
  creditCards: Array<{
    id: string
    name: string
    balance: number
    limit?: number | null
  }>
}

interface TransferHistoryItem {
  id: string
  fromWallet: string
  toWallet: string
  amount: number
  description: string
  date: string
  status: 'completed'
}

interface WalletsPageProps {
  wallets: Wallet[]
  summary: WalletsSummary | null
  transferHistory: TransferHistoryItem[]
}

export function WalletsPage({ wallets, summary, transferHistory }: WalletsPageProps) {
  // Converter wallets para o formato esperado pelo TransferForm
  const walletsForTransfer: TransferWallet[] = wallets.map(wallet => ({
    id: wallet.id,
    name: wallet.name,
    balance: wallet.balance,
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <Sidebar />
      <MobileMenu />
      <div className="flex-1 overflow-auto pb-20 lg:pb-0">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center">
            <h1 className="text-xl font-bold ml-10 lg:ml-0">Carteiras</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <TransferForm
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-1 text-blue-400 border-blue-400/20 hover:bg-blue-400/10"
              wallets={walletsForTransfer}
            />
            <WalletForm
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-1 text-green-400 border-green-400/20 hover:bg-green-400/10"
            />
            <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <UserNav />
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <WalletOverview 
            totalBalance={summary?.totalBalance ?? 0} 
            activeWallets={summary?.activeWallets ?? 0} 
            creditCards={summary?.creditCards ?? []} 
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <TabsList className="bg-gray-800/50">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="bank">Contas Bancárias</TabsTrigger>
                    <TabsTrigger value="cards">Cartões</TabsTrigger>
                    <TabsTrigger value="cash">Dinheiro</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    {wallets.length === 0 ? (
                      <div className="col-span-2 text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                          <Plus className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Nenhuma carteira encontrada</h3>
                        <p className="text-gray-400 mb-6">Adicione sua primeira carteira para começar a gerenciar suas finanças</p>
                        <WalletForm className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" />
                      </div>
                    ) : (
                      <>
                        {wallets.map((wallet) => (
                          <WalletCard key={wallet.id} wallet={wallet} />
                        ))}

                        <Card className="bg-gray-900/50 border-gray-800 border-dashed flex flex-col items-center justify-center p-6">
                          <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Adicionar Carteira</h3>
                          <p className="text-sm text-gray-400 text-center mb-4">Adicione uma nova conta ou carteira</p>
                          <WalletForm className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" />
                        </Card>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="bank" className="mt-0">
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    {wallets
                      .filter((w) => ["bank", "savings"].includes(w.type))
                      .map((wallet) => (
                        <WalletCard key={wallet.id} wallet={wallet} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="cards" className="mt-0">
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    {wallets
                      .filter((w) => ["credit", "debit"].includes(w.type))
                      .map((wallet) => (
                        <WalletCard key={wallet.id} wallet={wallet} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="cash" className="mt-0">
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    {wallets
                      .filter((w) => w.type === "cash")
                      .map((wallet) => (
                        <WalletCard key={wallet.id} wallet={wallet} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <TransferHistory transfers={transferHistory} />
            </div>
          </div>
        </main>

        <MobileNav />
      </div>
    </div>
  )
}
