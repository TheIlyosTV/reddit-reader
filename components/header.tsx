"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Moon, Sun, Search, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
  const [subreddit, setSubreddit] = useState("")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleSubredditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (subreddit.trim()) {
      router.push(`/r/${subreddit.trim()}`)
      setSubreddit("")
      setShowMobileSearch(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2"
        >
          {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">R</span>
          </div>
          <span className="text-lg font-semibold hidden sm:inline">Reddit Reader</span>
          <span className="text-lg font-semibold sm:hidden">RR</span>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSubredditSubmit} className="hidden md:flex mx-auto w-full max-w-md items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter subreddit name..."
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" size="sm">
            Go
          </Button>
        </form>

        {/* Mobile search button */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden ml-auto p-2"
        >
          <Search className="h-5 w-5" />
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="ml-0 md:ml-auto"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Mobile search bar */}
      {showMobileSearch && (
        <div className="md:hidden px-4 py-3 border-t border-border">
          <form onSubmit={handleSubredditSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter subreddit..."
                value={subreddit}
                onChange={(e) => setSubreddit(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            <Button type="submit" size="sm">
              Go
            </Button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4">
            <Link 
              href="/" 
              onClick={() => setShowMobileMenu(false)}
              className="py-2 px-3 hover:bg-accent rounded-md"
            >
              Home
            </Link>
            <Link 
              href="/search" 
              onClick={() => setShowMobileMenu(false)}
              className="py-2 px-3 hover:bg-accent rounded-md"
            >
              Search
            </Link>
            <Link 
              href="/favorites" 
              onClick={() => setShowMobileMenu(false)}
              className="py-2 px-3 hover:bg-accent rounded-md"
            >
              Favorites
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}