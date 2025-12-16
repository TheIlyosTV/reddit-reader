import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <FileQuestion className="h-8 w-8 text-gray-600 dark:text-gray-400" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">
            The post you're looking for doesn't exist or has been removed.
          </p>
        </div>
        
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}