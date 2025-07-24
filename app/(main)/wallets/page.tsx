import type { Metadata } from "next"
import { Suspense } from "react"
import { WalletsPage } from "@/components/wallets/walletsPage"
import { WalletsLoadingSkeleton } from "@/components/ui/loading-skeleton"
import { getWalletsData, getWalletsSummary, getTransferHistory } from "@/lib/extra"

export const metadata: Metadata = {
  title: "Carteiras - MyFinance",
  description: "Gerencie suas carteiras e contas financeiras",
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
    <Suspense fallback={<WalletsLoadingSkeleton />}>
      <WalletsContent />
    </Suspense>
  )
}
