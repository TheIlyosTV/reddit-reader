"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, TrendingUp } from "lucide-react"
import type { RedditComment } from "@/lib/reddit-api"

interface CommentTreeProps {
  comment: RedditComment
  depth?: number
}

export function CommentTree({ comment, depth = 0 }: CommentTreeProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const hasReplies = comment.replies && comment.replies.length > 0

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
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={depth > 0 ? "ml-4 border-l-2 border-border pl-4" : ""}
    >
      <Card className="mb-3">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">u/{comment.author}</span>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                {comment.score}
              </Badge>
              <span className="text-muted-foreground">{formatTime(comment.created_utc)}</span>
            </div>
            {hasReplies && (
              <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="gap-1">
                {isCollapsed ? (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-xs">{comment.replies!.length}</span>
                  </>
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0">
                <p className="text-sm leading-relaxed">{comment.body}</p>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <AnimatePresence>
        {!isCollapsed && hasReplies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {comment.replies!.map((reply) => (
              <CommentTree key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
