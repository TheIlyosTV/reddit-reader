"use client"

import { useState, useEffect } from "react"
import type { RedditPost } from "@/lib/reddit-api"

const FAVORITES_KEY = "reddit_reader_favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<RedditPost[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const toggleFavorite = (post: RedditPost) => {
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === post.id)
      if (exists) {
        return prev.filter((p) => p.id !== post.id)
      }
      return [...prev, post]
    })
  }

  const isFavorite = (postId: string) => {
    return favorites.some((p) => p.id === postId)
  }

  return { favorites, toggleFavorite, isFavorite, isLoaded }
}
