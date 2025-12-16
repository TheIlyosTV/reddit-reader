import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '25';
  const sort = searchParams.get('sort') || 'relevance';
  const t = searchParams.get('t') || 'all';

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=${limit}&sort=${sort}&t=${t}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RedditReader/1.0'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Reddit API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Ma'lumotlarni formatlash
    const posts = data.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      author: child.data.author,
      subreddit: child.data.subreddit,
      score: child.data.score,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      thumbnail: child.data.thumbnail?.replace(/&amp;/g, '&'),
      url: child.data.url?.replace(/&amp;/g, '&'),
      selftext: child.data.selftext,
      permalink: child.data.permalink,
      preview: child.data.preview
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}