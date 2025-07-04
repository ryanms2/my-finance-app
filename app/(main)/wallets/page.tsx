import type { Metadata } from "next"
import { Suspense } from "react"
import { WalletsPage } from "@/components/wallets/walletsPage"
import { getWalletsData, getWalletsSummary, getTransferHistory } from "@/lib/extra"

export const metadata: Metadata = {
  title: "Carteiras - MyFinance",
  description: "Gerencie suas carteiras e contas financeiras",
}

function WalletsPageSkeleton() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-800 rounded mb-6"></div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-48 bg-gray-800 rounded"></div>
                <div className="h-48 bg-gray-800 rounded"></div>
              </div>
            </div>
            <div className="h-96 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function WalletsContent() {
  const [wallets, summary, transferHistory] = await Promise.all([
    getWalletsData(),
    getWalletsSummary(),
    getTransferHistory()
  ]);

  return (
    <WalletsPage 
      wallets={wallets || []}
      summary={summary}
      transferHistory={transferHistory || []}
    />
  )
}

export default function Wallets() {
  return (
    <Suspense fallback={<WalletsPageSkeleton />}>
      <WalletsContent />
    </Suspense>
  )
}
