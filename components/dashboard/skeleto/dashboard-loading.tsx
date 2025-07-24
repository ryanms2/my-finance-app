import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardLoadingSkeleton() {
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
            <Skeleton className="h-6 w-32 ml-10 lg:ml-0" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 hidden sm:block" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Welcome section */}
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-5 rounded" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main chart */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-60" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-80 w-full" />
                </CardContent>
              </Card>

              {/* Recent transactions */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar content */}
            <div className="space-y-6">
              {/* Expenses donut */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-48 w-full mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Budget progress */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <Skeleton className="h-6 w-28" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
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
