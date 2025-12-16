"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post-card"
import { PostSkeleton } from "@/components/post-skeletion"
import { Search, X, TrendingUp, Clock, BarChart3 } from "lucide-react"
import { searchReddit, type RedditPost } from "@/lib/reddit-api"
import { useRouter } from "next/navigation"

// Search tarixi uchun localStorage funksiyasi
const useSearchHistory = () => {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('search-history')
    if (saved) {
      setHistory(JSON.parse(saved).slice(0, 10))
    }
  }, [])

  const addToHistory = (query: string) => {
    if (!query.trim()) return
    
    const updated = [query, ...history.filter(q => q !== query)].slice(0, 10)
    setHistory(updated)
    localStorage.setItem('search-history', JSON.stringify(updated))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('search-history')
  }

  return { history, addToHistory, clearHistory }
}

// Trenddagi search so'rovlari
const trendingSearches = [
  "programming",
  "web development",
  "react js",
  "nextjs",
  "tailwind css",
  "typescript",
  "open source",
  "AI",
  "machine learning",
  "devops"
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<RedditPost[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"relevance" | "new" | "top">("relevance")
  const [timeRange, setTimeRange] = useState<"all" | "year" | "month" | "week" | "day">("all")
  
  const router = useRouter()
  const { history, addToHistory, clearHistory } = useSearchHistory()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setHasSearched(true)
    
    try {
      // To'g'ridan API ga so'rov yuborish
      const posts = await searchReddit(query)
      setResults(posts)
      addToHistory(query)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleQuickSearch = (quickQuery: string) => {
    setQuery(quickQuery)
    // Avtomatik search qilish
    setTimeout(() => {
      const form = document.querySelector('form')
      form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }, 100)
  }

  const handleClearSearch = () => {
    setQuery("")
    setResults([])
    setHasSearched(false)
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Mobile uchun qisqartirilgan header */}
      <div className="md:hidden">
        <h1 className="text-xl font-bold">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">Find posts across Reddit</p>
      </div>

      {/* Desktop uchun header */}
      <div className="hidden md:block space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Search Reddit</h1>
        <p className="text-muted-foreground">Find posts across all subreddits</p>
      </div>

      {/* Search form - Responsive */}
      <motion.form
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-2 md:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 md:pl-10 text-sm md:text-base"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={isSearching}
            className="flex-1 md:flex-none"
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4 animate-pulse" />
                <span className="hidden sm:inline">Searching</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </span>
            )}
          </Button>
          
          {/* Mobile filter toggle */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </Button>
        </div>
      </motion.form>

      {/* Mobile filters dropdown */}
      {showMobileFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-card border rounded-lg p-4 space-y-3"
        >
          <div>
            <label className="text-sm font-medium mb-1 block">Sort by</label>
            <div className="flex gap-2 overflow-x-auto">
              {[
                { value: "relevance", label: "Relevance", icon: TrendingUp },
                { value: "new", label: "New", icon: Clock },
                { value: "top", label: "Top", icon: BarChart3 }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSortBy(option.value as any)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm whitespace-nowrap ${
                    sortBy === option.value 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <option.icon className="h-3 w-3" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Time range</label>
            <div className="flex gap-2 overflow-x-auto">
              {[
                { value: "all", label: "All time" },
                { value: "year", label: "Year" },
                { value: "month", label: "Month" },
                { value: "week", label: "Week" },
                { value: "day", label: "Today" }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTimeRange(option.value as any)}
                  className={`px-3 py-2 rounded-full text-sm whitespace-nowrap ${
                    timeRange === option.value 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Desktop filters */}
      <div className="hidden md:flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <div className="flex gap-1">
              {[
                { value: "relevance", label: "Relevance", icon: TrendingUp },
                { value: "new", label: "New", icon: Clock },
                { value: "top", label: "Top", icon: BarChart3 }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSortBy(option.value as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                    sortBy === option.value 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <option.icon className="h-3 w-3" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time:</span>
            <div className="flex gap-1">
              {[
                { value: "all", label: "All time" },
                { value: "year", label: "Year" },
                { value: "month", label: "Month" },
                { value: "week", label: "Week" },
                { value: "day", label: "Today" }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTimeRange(option.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    timeRange === option.value 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {results.length > 0 && `${results.length} results found`}
        </div>
      </div>

      {/* Search suggestions - Faqat search qilinmaganda */}
      {!hasSearched && (
        <div className="space-y-4 md:space-y-6">
          {/* Search history */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent searches</h3>
                <button
                  onClick={clearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleQuickSearch(item)}
                    className="px-3 py-1.5 text-sm bg-muted rounded-full hover:bg-accent transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Trending searches */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Trending searches</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {trendingSearches.map((item) => (
                <button
                  key={item}
                  onClick={() => handleQuickSearch(item)}
                  className="px-3 py-2 text-sm bg-muted rounded-lg hover:bg-accent transition-colors text-left truncate"
                  title={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Categories grid */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Popular categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {[
                { name: "Technology", icon: "💻", color: "bg-blue-100 dark:bg-blue-900" },
                { name: "Programming", icon: "👨‍💻", color: "bg-green-100 dark:bg-green-900" },
                { name: "Gaming", icon: "🎮", color: "bg-purple-100 dark:bg-purple-900" },
                { name: "Science", icon: "🔬", color: "bg-red-100 dark:bg-red-900" },
                { name: "Music", icon: "🎵", color: "bg-yellow-100 dark:bg-yellow-900" },
                { name: "Movies", icon: "🎬", color: "bg-pink-100 dark:bg-pink-900" },
                { name: "Sports", icon: "⚽", color: "bg-orange-100 dark:bg-orange-900" },
                { name: "Art", icon: "🎨", color: "bg-indigo-100 dark:bg-indigo-900" },
              ].map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleQuickSearch(category.name.toLowerCase())}
                  className={`flex items-center gap-2 p-3 rounded-lg ${category.color} hover:opacity-90 transition-opacity`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium truncate">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isSearching && (
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {!isSearching && hasSearched && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex min-h-[300px] md:min-h-[400px] items-center justify-center"
        >
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try different keywords or check your spelling
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setHasSearched(false)}
              className="mt-2"
            >
              Back to suggestions
            </Button>
          </div>
        </motion.div>
      )}

      {/* Search results */}
      {!isSearching && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Results header - mobile */}
          <div className="md:hidden flex items-center justify-between">
            <h2 className="text-lg font-semibold">Results</h2>
            <span className="text-sm text-muted-foreground">
              {results.length} found
            </span>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((post, index) => (
              <PostCard key={`${post.id}-${index}`} post={post} index={index} />
            ))}
          </div>

          {/* Load more button - Agar API pagination qo'llab-quvvatlasa */}
          {results.length >= 25 && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => {/* Load more logic */}}
                className="w-full md:w-auto"
              >
                Load more results
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty state - Hech qanday search qilinmaganda */}
      {!hasSearched && !isSearching && query.length === 0 && (
        <div className="hidden md:flex min-h-[400px] items-center justify-center border-2 border-dashed border-muted rounded-lg">
          <div className="text-center space-y-3">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Search for anything</p>
              <p className="text-sm text-muted-foreground">
                Find posts, communities, and discussions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom padding */}
      <div className="h-16 md:h-0"></div>
    </div>
  )
}