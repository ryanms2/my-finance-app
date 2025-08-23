import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// Loading skeleton para a página de orçamentos
export function BudgetsLoadingSkeleton() {
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
            <Skeleton className="h-9 w-24 hidden sm:block animate-shimmer stagger-delay-2" />
            <Skeleton className="h-9 w-9 rounded-full animate-pulse-subtle stagger-delay-3" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="p-4 sm:p-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Visão geral do orçamento skeleton */}
            <Card className="col-span-full bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2 max-w-[300px] mx-auto">
                  <Skeleton className="h-64 w-64 rounded-full mx-auto" />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-4 w-60 mx-auto" />
                </div>
              </CardContent>
            </Card>

            {/* Cards de orçamento skeleton */}
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Card de adicionar orçamento */}
            <Card className="bg-gray-900/50 border-gray-800 border-dashed flex flex-col items-center justify-center p-6">
              <Skeleton className="h-12 w-12 rounded-full mb-4" />
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-60 mb-4" />
              <Skeleton className="h-10 w-40" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
