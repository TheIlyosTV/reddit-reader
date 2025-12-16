import { fetchSubredditPosts } from "@/lib/reddit-api"
import { PostCard } from "@/components/post-card"

interface ServerPostsProps {
  subreddit: string
}

export default async function ServerPosts({ subreddit }: ServerPostsProps) {
  // "home" → bo'sh string (Reddit front page)
  const actualSubreddit = subreddit === "home" ? "" : subreddit

  const posts = await fetchSubredditPosts(actualSubreddit)

  if (posts.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">No posts found. Try again later.</p>
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