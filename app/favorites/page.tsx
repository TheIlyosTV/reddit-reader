"use client"

import { motion } from "framer-motion"
import { PostCard } from "@/components/post-card"
import { useFavorites } from "@/hooks/use-favorites"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites()

  if (!isLoaded) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-balance text-3xl font-bold tracking-tight">Favorites</h1>
        </div>
        <p className="text-muted-foreground">
          {favorites.length > 0
            ? `You have ${favorites.length} saved ${favorites.length === 1 ? "post" : "posts"}`
            : "No saved posts yet"}
        </p>
      </div>

      {favorites.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {favorites.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </motion.div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No favorites yet</p>
            <p className="text-sm text-muted-foreground">Click the heart icon on any post to save it here</p>
          </div>
        </div>
      )}
    </div>
  )
}
