"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, TrendingUp, Heart } from "lucide-react"
import type { RedditPost } from "@/lib/reddit-api"
import { useFavorites } from "@/hooks/use-favorites"

interface PostCardProps {
  post: RedditPost
  index?: number
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(post.id)

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now() / 1000
    const diff = now - timestamp
    const hours = Math.floor(diff / 3600)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return `${Math.floor(diff / 60)}m ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/post/${post.id}?subreddit=${post.subreddit}`} className="flex-1">
              <h3 className="text-balance font-semibold leading-tight hover:text-primary transition-colors">
                {post.title}
              </h3>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => toggleFavorite(post)} className="shrink-0">
              <Heart className={`h-5 w-5 ${favorite ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>

          {/* Chiroyli info qatori – Redditga o'xshash */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="font-medium">
              <Link href={`/r/${post.subreddit}`} className="hover:underline">
                r/{post.subreddit}
              </Link>
            </Badge>
            <span className="select-none">•</span>
            <Link href={`/user/${post.author}`} className="hover:text-primary hover:underline transition-colors">
              u/{post.author}
            </Link>
            <span className="select-none">•</span>
            <span>{formatTime(post.created_utc)}</span>
          </div>
        </CardHeader>

        {post.selftext && (
          <CardContent>
            <p className="line-clamp-3 text-sm text-muted-foreground">{post.selftext}</p>
          </CardContent>
        )}

        {/* Thumbnail yoki preview rasm (agar bor bo'lsa) */}
        {post.thumbnail && post.thumbnail !== "self" && post.thumbnail !== "default" && !post.selftext && (
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </div>
          </CardContent>
        )}

        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">{formatNumber(post.score)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>{formatNumber(post.num_comments)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}