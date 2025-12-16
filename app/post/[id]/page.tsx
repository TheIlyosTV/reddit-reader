// app/post/[id]/page.tsx
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { fetchPostDetails } from "@/lib/reddit-api"
import PostClient from "@/components/post-client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Next.js config - BUNLARNI QO'SHISH MAJHURIY!
export const dynamic = 'force-dynamic'; // Har safar server-side render
export const revalidate = 0; // Cache ni o'chirish
export const dynamicParams = true; // Yangi route'larga ruxsat

// Generate static params (agar build vaqtida ma'lum postlar bo'lsa)
export async function generateStaticParams() {
  // Agar sizda build vaqtida ma'lum postlar bo'lsa, ularni qaytaring
  // Masalan, popular postlarni fetch qilib
  return [
    // Demo uchun bir nechta post
    { id: '18b6tv6' }, // Masalan, programming subreddit'idan
    { id: '18b8a9x' },
    { id: '18b5yz8' },
  ]
}

// Server component – data ni shu yerda fetch qilamiz
export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ subreddit?: string }>
}) {
  try {
    const resolvedParams = await params
    const resolvedSearchParams = await searchParams

    const { id } = resolvedParams
    const subreddit = resolvedSearchParams.subreddit

    console.log(`📄 [PostPage] Loading post: ${id}, subreddit: ${subreddit}`)

    if (!subreddit) {
      console.error('❌ [PostPage] Subreddit parameter is missing')
      notFound()
    }

    // Subreddit nomini tozalash (agar /r/ bilan boshlansa)
    const cleanSubreddit = subreddit.replace(/^\/?r\//, '')
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile header - sticky back button */}
        <div className="sticky top-0 z-40 md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="truncate flex-1">
              <p className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                r/{cleanSubreddit}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Post details
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 max-w-6xl mx-auto py-4 md:py-8">
          <Suspense fallback={<PostLoadingSkeleton />}>
            <PostContent postId={id} subreddit={cleanSubreddit} />
          </Suspense>
        </div>
        
        {/* Mobile bottom padding */}
        <div className="h-20 md:h-0"></div>
      </div>
    )
  } catch (error) {
    console.error('🔥 [PostPage] Error in page component:', error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load post. Please try again.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }
}

// Loading skeleton - optimized version
function PostLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Desktop back button */}
      <div className="hidden md:block">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </Link>
      </div>

      {/* Post skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header skeleton */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Comments skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Data fetch qiluvchi async komponent
async function PostContent({ postId, subreddit }: { postId: string; subreddit: string }) {
  try {
    console.log(`🔍 [PostContent] Fetching details for: ${postId} in r/${subreddit}`)
    
    const result = await fetchPostDetails(postId, subreddit)
    
    if (!result) {
      console.warn(`⚠️ [PostContent] No result returned for post: ${postId}`)
      notFound()
    }
    
    console.log(`✅ [PostContent] Successfully loaded post: ${result.post.title.substring(0, 50)}...`)
    
    return <PostClient post={result.post} comments={result.comments} />
  } catch (error) {
    console.error('🔥 [PostContent] Error fetching post details:', error)
    notFound()
  }
}