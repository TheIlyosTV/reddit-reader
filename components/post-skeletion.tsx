import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PostSkeleton() {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="space-y-2 p-4">
        <Skeleton className="h-6 w-full max-w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-16" />
      </CardFooter>
    </Card>
  )
}