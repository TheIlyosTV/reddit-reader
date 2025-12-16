// app/post/[id]/page.tsx
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { fetchPostDetails } from "@/lib/reddit-api"
import PostClient from "@/components/post-client"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Server component – data ni shu yerda fetch qilamiz
export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ subreddit?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const { id } = resolvedParams
  const subreddit = resolvedSearchParams.subreddit

  if (!subreddit) notFound()

  return (
    <div className="min-h-screen">
      {/* Mobile header - sticky back button */}
      <div className="sticky top-0 z-40 md:hidden bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="truncate">
            <p className="text-sm font-medium truncate">r/{subreddit}</p>
            <p className="text-xs text-muted-foreground truncate">Post details</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-0 max-w-5xl mx-auto py-4 md:py-8">
        <Suspense fallback={<PostLoadingSkeleton />}>
          <PostContent postId={id} subreddit={subreddit} />
        </Suspense>
      </div>
    </div>
  )
}

// Loading skeleton
function PostLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Desktop back button */}
      <div className="hidden md:block">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </Link>
      </div>

      {/* Loading skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-3/4 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Comments loading */}
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded space-y-2">
            <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Data fetch qiluvchi async komponent
async function PostContent({ postId, subreddit }: { postId: string; subreddit: string }) {
  const result = await fetchPostDetails(postId, subreddit)
  if (!result) notFound()

  const { post, comments } = result

  return <PostClient post={post} comments={comments} />
}