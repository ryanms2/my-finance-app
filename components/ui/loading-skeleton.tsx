import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// Loading skeleton para páginas principais
export function PageLoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 border-r border-gray-800 bg-gray-950/50 backdrop-blur-md">
        <div className="p-6 w-full animate-fade-in">
          <Skeleton className="h-8 w-32 mb-8 animate-shimmer" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className={`h-10 w-full rounded-lg animate-shimmer stagger-delay-${i}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 overflow-auto pb-20 lg:pb-0">
        {/* Header skeleton */}
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Skeleton className="h-6 w-32 animate-shimmer" />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Skeleton className="h-9 w-24 hidden sm:block animate-shimmer stagger-delay-1" />
            <Skeleton className="h-9 w-9 rounded-full animate-pulse-subtle stagger-delay-2" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="p-4 sm:p-6">
          <div className="space-y-6">
            {/* Cards grid skeleton */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main content skeleton */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-60" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton para wallets específico
export function WalletsLoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 border-r border-gray-800 bg-gray-950/50 backdrop-blur-md">
        <div className="p-6 w-full">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto pb-20 lg:pb-0">
        {/* Header */}
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center">
            <Skeleton className="h-6 w-24 ml-10 lg:ml-0" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 hidden sm:block" />
            <Skeleton className="h-9 w-24 hidden sm:block" />
            <Skeleton className="h-9 w-20 hidden sm:block" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Mobile buttons */}
          <div className="sm:hidden mb-4 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Wallet overview */}
          <Card className="bg-gray-900/50 border-gray-800 mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-8 w-24 mx-auto mb-2" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Wallets grid */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="mb-4">
                <div className="bg-gray-800/50 rounded-lg p-1 w-full sm:w-auto">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-8 flex-1 sm:flex-none sm:w-20" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Wallet cards */}
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="bg-gray-900/50 border-gray-800">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-32 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Transfer history */}
            <div>
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton para transações
export function TransactionsLoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 border-r border-gray-800 bg-gray-950/50 backdrop-blur-md">
        <div className="p-6 w-full">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto pb-20 lg:pb-0">
        {/* Header */}
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-28 ml-10 lg:ml-0" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 hidden sm:block" />
            <Skeleton className="h-9 w-24 hidden sm:block" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Mobile date picker */}
          <div className="sm:hidden mb-4">
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Transactions table */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-9 w-28" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-40 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton para relatórios
export function ReportsLoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 border-r border-gray-800 bg-gray-950/50 backdrop-blur-md">
        <div className="p-6 w-full">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto pb-20 lg:pb-0">
        {/* Header */}
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Skeleton className="h-6 w-24 ml-10 lg:ml-0" />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Skeleton className="h-9 w-32 hidden sm:block" />
            <Skeleton className="h-9 w-24 hidden sm:block" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Mobile date picker */}
          <div className="sm:hidden mb-4">
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Tabs */}
          <div className="overflow-x-auto mb-6">
            <div className="bg-gray-800/50 rounded-lg p-1 min-w-max">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-24" />
                ))}
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-28 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-7">
            <Card className="lg:col-span-4 bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full mb-4" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
