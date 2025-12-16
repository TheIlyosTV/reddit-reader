"use client"

import { useState } from "react"
import { RedditPost, RedditComment } from "@/lib/reddit-api"
import { formatDistanceToNow } from "date-fns"
import { 
  MessageSquare, 
  ArrowUp, 
  ArrowDown, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Clock,
  User,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Heart,
  Award,
  Flag
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PostClientProps {
  post: RedditPost
  comments: RedditComment[]
}

export default function PostClient({ post, comments }: PostClientProps) {
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [showAllComments, setShowAllComments] = useState(false)
  const [sortBy, setSortBy] = useState<"top" | "new" | "controversial">("top")
  const [isExpanded, setIsExpanded] = useState(false)

  const formattedTime = formatDistanceToNow(new Date(post.created_utc * 1000), { addSuffix: true })
  
  // Check for image
  const hasImage = post.preview?.images?.[0]?.source?.url || 
    (post.thumbnail && post.thumbnail.startsWith('http'))
  
  const imageUrl = post.preview?.images?.[0]?.source?.url || post.thumbnail

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "new":
        return b.created_utc - a.created_utc
      case "controversial":
        return Math.abs(b.score) - Math.abs(a.score)
      default:
        return b.score - a.score
    }
  })

  const displayedComments = showAllComments ? sortedComments : sortedComments.slice(0, 5)

  return (
    <div className="px-2 sm:px-4 md:px-6 mobile-container">
      {/* Desktop Back Button */}
      <div className="hidden md:block mb-6">
        <Link href="/">
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <ArrowUp className="h-5 w-5 rotate-90" />
            <span className="text-sm font-medium">Back to posts</span>
          </button>
        </Link>
      </div>

      {/* Post Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        {/* Post Header */}
        <div className="p-3 sm:p-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-2 sm:gap-3 mb-4">
            {/* Subreddit Avatar */}
            <div className="flex-shrink-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">r/</span>
              </div>
            </div>

            {/* Post Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-1 sm:gap-2 mb-1">
                <Link href={`/r/${post.subreddit}`}>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                    r/{post.subreddit}
                  </span>
                </Link>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  u/{post.author}
                </span>
                <span className="text-gray-400 text-xs">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formattedTime}
                  </span>
                </div>
              </div>

              {/* Post Title */}
              <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
                {post.title}
              </h1>

              {/* Stats Row */}
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mx-1">
                      {post.score >= 1000 ? `${(post.score / 1000).toFixed(1)}k` : post.score}
                    </span>
                    <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">points</span>
                </div>

                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 ml-1">
                    {post.num_comments >= 1000 ? `${(post.num_comments / 1000).toFixed(1)}k` : post.num_comments}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">comments</span>
                </div>

                <button className="flex items-center gap-1">
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Share</span>
                </button>
              </div>
            </div>

            {/* More Options */}
            <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Awards - if any */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Award className="h-3 w-3 text-yellow-500" />
              <span className="text-xs font-medium">5</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Heart className="h-3 w-3 text-red-500" />
              <span className="text-xs font-medium">3</span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-0">
          {/* Image or Text Content */}
          {hasImage && imageUrl ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full max-h-[50vh] sm:max-h-[70vh] object-contain bg-gray-100 dark:bg-gray-900"
                onClick={() => window.open(imageUrl, '_blank')}
              />
              {/* Image Zoom Hint */}
              <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                <span className="hidden sm:inline">Tap to open</span>
                <span className="sm:hidden">Open</span>
              </div>
            </div>
          ) : post.selftext ? (
            <div className="p-3 sm:p-5">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {post.selftext.length > 300 && !isExpanded ? (
                  <>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                      {post.selftext.substring(0, 300)}...
                    </p>
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1"
                    >
                      Read more
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                    {post.selftext}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 sm:p-5">
              <a 
                href={post.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    External Link
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {post.url}
                  </p>
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Action Bar - Desktop Only */}
        <div className="hidden md:flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
              <ArrowUp className="h-5 w-5" />
              <span className="font-medium">Upvote</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
              <ArrowDown className="h-5 w-5" />
              <span className="font-medium">Downvote</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Comment</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <Bookmark className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <Flag className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="md:hidden flex items-center justify-around p-3 border-t border-gray-100 dark:border-gray-700">
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-300">
            <ArrowUp className="h-5 w-5" />
            <span className="text-xs">Upvote</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-300">
            <ArrowDown className="h-5 w-5" />
            <span className="text-xs">Downvote</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-300">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Comment</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-300">
            <Bookmark className="h-5 w-5" />
            <span className="text-xs">Save</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-300">
            <Share2 className="h-5 w-5" />
            <span className="text-xs">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        {/* Comments Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
              {comments.length} Comments
            </h2>
          </div>

          {/* Sort Dropdown - Mobile */}
          <div className="relative md:hidden">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-2 sm:px-3 py-1.5 appearance-none"
            >
              <option value="top">Top</option>
              <option value="new">New</option>
              <option value="controversial">Controversial</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Sort Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            {[
              { value: "top", label: "Top" },
              { value: "new", label: "New" },
              { value: "controversial", label: "Controversial" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as any)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  sortBy === option.value
                    ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-gray-100"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Comment Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0"></div>
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-full transition-colors">
              Comment
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-3 sm:space-y-4">
          {displayedComments.length > 0 ? (
            displayedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                level={0}
                isExpanded={expandedComments[comment.id] || false}
                onToggle={() => setExpandedComments(prev => ({
                  ...prev,
                  [comment.id]: !prev[comment.id]
                }))}
              />
            ))
          ) : (
            <div className="text-center py-8 sm:py-12">
              <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No comments yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Be the first to share what you think!
              </p>
            </div>
          )}

          {/* Load More Comments */}
          {comments.length > 5 && !showAllComments && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowAllComments(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-full transition-colors"
              >
                Show all {comments.length} comments
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-20 md:h-8"></div>
    </div>
  )
}

// Comment Item Component
function CommentItem({ 
  comment, 
  level, 
  isExpanded, 
  onToggle 
}: { 
  comment: RedditComment
  level: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const hasReplies = comment.replies && comment.replies.length > 0
  const maxIndent = 4
  const indent = Math.min(level, maxIndent)

  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden",
        level > 0 && "ml-1 sm:ml-2 md:ml-4"
      )}
      style={level > 0 ? { 
        marginLeft: `${indent * 0.25}rem`
      } : {}}
    >
      <div className="p-3 sm:p-4">
        {/* Comment Header */}
        <div className="flex items-start gap-2 sm:gap-3 mb-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
          </div>

          {/* Comment Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-1 sm:gap-2 mb-1">
              <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                u/{comment.author}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(comment.created_utc * 1000), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Comment Score */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3 text-gray-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {comment.score >= 1000 ? `${(comment.score / 1000).toFixed(1)}k` : comment.score}
                </span>
                <ArrowDown className="h-3 w-3 text-gray-400" />
              </div>
              {hasReplies && (
                <button
                  onClick={onToggle}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {isExpanded ? "Hide" : "Show"} {comment.replies?.length} replies
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-1">
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* Comment Body */}
        <div className="mb-3 sm:mb-4">
          <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
            {comment.body}
          </p>
        </div>

        {/* Comment Footer */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <button className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            Reply
          </button>
          <button className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
            Share
          </button>
          <button className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
            Report
          </button>
        </div>
      </div>

      {/* Replies */}
      {hasReplies && isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700">
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              level={level + 1}
              isExpanded={false}
              onToggle={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}