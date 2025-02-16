import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function CampaignSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card>
        <CardHeader className="space-y-6">
          <div className="flex justify-between items-start">
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-6 w-[100px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Creator Info */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>

            {/* Time Info */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <Skeleton className="h-4 w-[100px] mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            {/* Campaign Info */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <Skeleton className="h-4 w-[120px] mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-[100px]" />
                <Skeleton className="h-6 w-[100px]" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Proposals Section */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between border rounded-lg p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <Skeleton className="h-9 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

