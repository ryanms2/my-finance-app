import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Coins, TrendingUp, Wallet } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Floating loading indicators */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 animate-bounce delay-100">
          <Coins className="h-6 w-6 text-yellow-400/30" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-bounce delay-300">
          <TrendingUp className="h-6 w-6 text-green-400/30" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-500">
          <Wallet className="h-6 w-6 text-purple-400/30" />
        </div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 sm:px-6 backdrop-blur-md rounded-lg">
          <Skeleton className="h-8 w-32 bg-gray-800" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24 bg-gray-800" />
            <Skeleton className="h-8 w-8 rounded-full bg-gray-800" />
          </div>
        </div>

        {/* Main content area */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block space-y-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Skeleton className="h-6 w-24 bg-gray-800" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-4 rounded bg-gray-800" />
                    <Skeleton className="h-4 flex-1 bg-gray-800" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main content skeleton */}
          <div className="lg:col-span-3 space-y-6">
            {/* Summary cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-gray-900/50 border-gray-800">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20 bg-gray-800" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24 mb-2 bg-gray-800" />
                    <Skeleton className="h-3 w-16 bg-gray-800" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Chart area */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <Skeleton className="h-6 w-32 bg-gray-800" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="h-3 w-3 rounded-full bg-gray-800" />
                        <Skeleton className="h-3 flex-1 bg-gray-800" />
                        <Skeleton className="h-3 w-16 bg-gray-800" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <Skeleton className="h-6 w-40 bg-gray-800" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full bg-gray-800 rounded" />
                </CardContent>
              </Card>
            </div>

            {/* Table skeleton */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-36 bg-gray-800" />
                  <Skeleton className="h-8 w-24 bg-gray-800" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32 bg-gray-800" />
                        <Skeleton className="h-3 w-24 bg-gray-800" />
                      </div>
                      <Skeleton className="h-4 w-20 bg-gray-800" />
                      <Skeleton className="h-4 w-16 bg-gray-800" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="fixed bottom-8 right-8">
          <div className="flex items-center space-x-2 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-full px-4 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="text-sm text-gray-400">Carregando...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
