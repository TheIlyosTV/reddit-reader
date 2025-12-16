import { useState, useEffect } from 'react'

type Post = {
  data: {
    id: string
    title: string
    url: string
    author: string
  }
}

export const useReddit = (after: string = '') => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/reddit?after=${after}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.data.children)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [after])

  return { posts, loading }
}
