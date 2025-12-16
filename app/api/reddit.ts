import type { NextApiRequest, NextApiResponse } from 'next'

type RedditResponse = {
  data: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RedditResponse | { error: string }>
) {
  const { after = '' } = req.query

  try {
    const response = await fetch(`https://www.reddit.com/hot.json?limit=12&after=${after}`)
    if (!response.ok) {
      throw new Error('Failed to fetch from Reddit')
    }
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: 'Reddit API fetch failed' })
  }
}
