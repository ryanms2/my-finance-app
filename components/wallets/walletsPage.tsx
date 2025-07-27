
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
import { ExportDialog } from "@/components/export-dialog"

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
            <ExportDialog defaultType="wallets">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </ExportDialog>
            <UserNav />
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {/* Mobile month picker */}
          <div className="sm:hidden mb-4">
              <TransferForm
              variant="outline"
              size="sm"
              className="w-full sm:flex gap-1 text-blue-400 border-blue-400/20 hover:bg-blue-400/10"
              wallets={walletsForTransfer}
              />
              <WalletForm
                variant="outline"
                size="sm"
                className="w-full sm:flex gap-1 mt-2 text-green-400 border-green-400/20 hover:bg-green-400/10"
              />
          </div>
          <WalletOverview 
            totalBalance={summary?.totalBalance ?? 0} 
            activeWallets={summary?.activeWallets ?? 0} 
            creditCards={summary?.creditCards ?? []} 
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <TabsList className="bg-gray-800/50 w-full sm:w-auto">
                    <TabsTrigger value="all" className="flex-1 sm:flex-none">Todas</TabsTrigger>
                    <TabsTrigger value="bank" className="flex-1 sm:flex-none">Bancos</TabsTrigger>
                    <TabsTrigger value="cards" className="flex-1 sm:flex-none">Cartões</TabsTrigger>
                    <TabsTrigger value="cash" className="flex-1 sm:flex-none">Dinheiro</TabsTrigger>
                    <TabsTrigger value="investment" className="flex-1 sm:flex-none">Investimentos</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    {wallets.length === 0 ? (
                      <div className="sm:col-span-2 text-center py-12">
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
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    {wallets.filter((w) => ["bank", "savings"].includes(w.type)).length === 0 ? (
                      <div className="sm:col-span-2 text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                          <div className="text-2xl">🏦</div>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Nenhuma conta bancária</h3>
                        <p className="text-gray-400 mb-6">Adicione uma conta corrente ou poupança</p>
                        <WalletForm className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600" />
                      </div>
                    ) : (
                      wallets
                        .filter((w) => ["bank", "savings"].includes(w.type))
                        .map((wallet) => (
                          <WalletCard key={wallet.id} wallet={wallet} />
                        ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="cards" className="mt-0">
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    {wallets.filter((w) => ["credit", "debit"].includes(w.type)).length === 0 ? (
                      <div className="sm:col-span-2 text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                          <div className="text-2xl">💳</div>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Nenhum cartão cadastrado</h3>
                        <p className="text-gray-400 mb-6">Adicione um cartão de crédito ou débito</p>
                        <WalletForm className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" />
                      </div>
                    ) : (
                      wallets
                        .filter((w) => ["credit", "debit"].includes(w.type))
                        .map((wallet) => (
                          <WalletCard key={wallet.id} wallet={wallet} />
                        ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="cash" className="mt-0">
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    {wallets.filter((w) => w.type === "cash").length === 0 ? (
                      <div className="sm:col-span-2 text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                          <div className="text-2xl">💰</div>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Nenhum dinheiro cadastrado</h3>
                        <p className="text-gray-400 mb-6">Adicione uma carteira para dinheiro em espécie</p>
                        <WalletForm className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600" />
                      </div>
                    ) : (
                      wallets
                        .filter((w) => w.type === "cash")
                        .map((wallet) => (
                          <WalletCard key={wallet.id} wallet={wallet} />
                        ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="investment" className="mt-0">
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    {wallets.filter((w) => w.type === "investment").length === 0 ? (
                      <div className="sm:col-span-2 text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                          <div className="text-2xl">📈</div>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Nenhum investimento cadastrado</h3>
                        <p className="text-gray-400 mb-6">Adicione uma conta de investimentos</p>
                        <WalletForm className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600" />
                      </div>
                    ) : (
                      wallets
                        .filter((w) => w.type === "investment")
                        .map((wallet) => (
                          <WalletCard key={wallet.id} wallet={wallet} />
                        ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1 mt-6 lg:mt-0">
              <TransferHistory transfers={transferHistory} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
