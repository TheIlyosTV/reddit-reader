import { Suspense } from "react"
import { fetchSubredditPosts } from "@/lib/reddit-api"
import { PostCard } from "@/components/post-card"
import { PostSkeleton } from "@/components/post-skeletion"

async function SubredditPosts({ subreddit }: { subreddit: string }) {
  const posts = await fetchSubredditPosts(subreddit)

  if (posts.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Subreddit not found</p>
          <p className="text-sm text-muted-foreground">Please check the name and try again</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  )
}

export default async function SubredditPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-balance text-3xl font-bold tracking-tight">r/{name}</h1>
        <p className="text-muted-foreground">Latest posts from this subreddit</p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        }
      >
        <SubredditPosts subreddit={name} />
      </Suspense>
    </div>
  )
}
