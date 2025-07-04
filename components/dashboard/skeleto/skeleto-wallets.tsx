import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"

export function SkeletoWallets() {
  return (
    <div className="mt-4 sm:mt-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md hidden sm:flex" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i} className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </CardContent>
              </Card>
            ))}
            <Card className="bg-gray-800/50 border-gray-700 border-dashed flex flex-col items-center justify-center p-6">
              <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <Skeleton className="h-6 w-32 mb-2 rounded-md" />
              <Skeleton className="h-4 w-40 mb-4 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Conteúdo estático e interfaces ao final do arquivo, se necessário
