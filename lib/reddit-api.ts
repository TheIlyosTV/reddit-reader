export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  thumbnail: string;
  url: string;
  selftext: string;
  permalink: string;
  preview?: {
    images: Array<{
      source: {
        url: string;
      };
    }>;
  };
}

export interface RedditComment {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: number;
  replies?: RedditComment[];
}

// Utility: Reddit encoded URL'larni to'g'rilaydi (&amp; → &)
function decodeRedditUrl(url: string): string {
  return url ? url.replace(/&amp;/g, '&') : url;
}

// User-Agent ni o'zgartiring! Unique qiling
 const USER_AGENT = 'MyRedditApp/1.0 (by /u/AmazingCelebration65)'; // <--- Bu yerni o'zgartiring!



export async function fetchRedditPosts(
  category: string = "popular", // string qilib o'zgartiring
  limit = 12,
  after?: string
): Promise<{ posts: RedditPost[]; after: string | null }> {
  console.log("🚀 fetchRedditPosts ishga tushdi", { category, limit, after });
  
  try {
    // Har xil category uchun to'g'ri URL
    let url: string;
    
    // Agar bu asosiy category bo'lsa (popular, hot, top, new)
    if (["popular", "hot", "top", "new"].includes(category)) {
      url = `https://www.reddit.com/${category}.json?limit=${limit}${after ? `&after=${after}` : ""}`;
    } else {
      // Subreddit nomi bo'lsa
      url = `https://www.reddit.com/r/${category}.json?limit=${limit}${after ? `&after=${after}` : ""}`;
    }
    
    console.log("🌐 URL:", url);

    const response = await fetch(url, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json"
      },
    });

    console.log("📊 Response status:", response.status);

    if (!response.ok) {
      console.error("❌ Response not OK:", response.status);
      return getFallbackData(category); // category parametri bilan fallback
    }

    const data = await response.json();
    console.log("✅ Data received, children:", data.data.children?.length || 0);

    const posts = data.data.children.map((c: any) => c.data);

    return {
      posts: posts.map((post: RedditPost) => ({
        ...post,
        thumbnail: decodeRedditUrl(post.thumbnail),
        url: decodeRedditUrl(post.url),
        preview: post.preview
          ? {
              images: post.preview.images.map((img: any) => ({
                source: { url: decodeRedditUrl(img.source.url) },
              })),
            }
          : undefined,
      })),
      after: data.data.after,
    };
  } catch (error: any) {
    console.error("🔥 fetchRedditPosts xatosi:", error.message);
    return getFallbackData(category);
  }
}

export async function fetchPosts(
  endpoint: string,
  limit = 12,
  after?: string
): Promise<{ posts: RedditPost[]; after: string | null }> {
  try {
    let url: string;
    
    // 1. Agar endpoint "r/" bilan boshlansa
    if (endpoint.startsWith('r/')) {
      // To'g'ri format: /r/programming/.json
      url = `https://www.reddit.com/${endpoint}/.json?limit=${limit}${after ? `&after=${after}` : ""}`;
    } 
    // 2. Agar bu asosiy kategoriya (popular, hot, top, new) bo'lsa
    else {
      // To'g'ri format: /popular/.json, /hot/.json, /top/.json, /new/.json
      url = `https://www.reddit.com/${endpoint}/.json?limit=${limit}${after ? `&after=${after}` : ""}`;
    }

    console.log("🌐 Fetching from URL:", url);

    const response = await fetch(url, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json"
      },
    });

    if (!response.ok) {
      console.error("❌ Reddit API Error:", response.status, response.statusText);
      // Fallback ma'lumotlar qaytarish
      return getFallbackData(endpoint);
    }

    const data = await response.json();
    const posts = data.data.children.map((c: any) => c.data);

    return {
      posts: posts.map((post: RedditPost) => ({
        ...post,
        thumbnail: decodeRedditUrl(post.thumbnail),
        url: decodeRedditUrl(post.url),
        preview: post.preview
          ? {
              images: post.preview.images.map((img: any) => ({
                source: { url: decodeRedditUrl(img.source.url) },
              })),
            }
          : undefined,
      })),
      after: data.data.after,
    };
  } catch (error) {
    console.error("[fetchPosts] Xato:", error);
    return { posts: [], after: null };
  }
}


// Fallback ma'lumotlar
function getFallbackData(category: string = "popular"): { posts: RedditPost[]; after: string | null } {
  console.log("🔄 Fallback ma'lumotlar ishlatilmoqda:", category);
  
  const basePosts: RedditPost[] = [
    {
      id: "1",
      title: `Welcome to ${category} - Demo Mode`,
      author: "system",
      subreddit: category,
      score: 123,
      num_comments: 45,
      created_utc: Date.now() / 1000,
      thumbnail: "",
      url: "#",
      selftext: `This is a demo post for ${category}. The Reddit API connection could not be established.`,
      permalink: `/r/${category}/comments/demo`,
    },
    {
      id: "2",
      title: `Latest news about ${category}`,
      author: "demo_bot",
      subreddit: category,
      score: 89,
      num_comments: 23,
      created_utc: Date.now() / 1000 - 3600,
      thumbnail: "",
      url: "#",
      selftext: `Check back later for real ${category} content from Reddit.`,
      permalink: `/r/${category}/comments/news`,
    },
  ];

  return {
    posts: basePosts,
    after: null
  };
}



export async function fetchSubredditPosts(subreddit: string = '', limit = 25): Promise<RedditPost[]> {
  try {
    // Front page uchun '' yoki bo'sh string
    const path = subreddit ? `r/${subreddit}` : '';
    const url = `https://www.reddit.com/${path}.json?limit=${limit}`;

    const response = await fetch(url, {
      next: { revalidate: 300 }, // 5 minut cache
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const posts = data.data.children.map((child: any) => child.data);

    // Rasmlarni decode qilish
    return posts.map((post: RedditPost) => ({
      ...post,
      thumbnail: decodeRedditUrl(post.thumbnail),
      url: decodeRedditUrl(post.url),
      preview: post.preview
        ? {
            images: post.preview.images.map((img: any) => ({
              source: { url: decodeRedditUrl(img.source.url) },
            })),
          }
        : undefined,
    }));
  } catch (error) {
    console.error('[Error] fetchSubredditPosts:', error);
    return [];
  }
}




export async function fetchPostDetails(postId: string, subreddit: string) {
  try {
    console.log(`🔄 [fetchPostDetails] Fetching: r/${subreddit}/comments/${postId}`);
    
    // Production va development uchun turli User-Agent
    const USER_AGENT = process.env.NODE_ENV === 'production' 
      ? 'RedditReader/1.0 (+https://reddit-reader-web.vercel.app)'
      : 'MyRedditApp/1.0 (by /u/AmazingCelebration65)';
    
    const url = `https://www.reddit.com/r/${subreddit}/comments/${postId}.json`;
    console.log(`🌐 [fetchPostDetails] URL: ${url}`);
    
    // Production uchun timeout va signal qo'shamiz
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 soniya
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      },
      signal: controller.signal,
      // Cache settings
      cache: 'no-store', // Har safar yangi ma'lumot olish
    });
    
    clearTimeout(timeoutId);
    
    console.log(`📊 [fetchPostDetails] Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      // Agar 404 yoki 403 bo'lsa, notFound qaytaramiz
      if (response.status === 404 || response.status === 403) {
        console.warn(`⚠️ [fetchPostDetails] Post not found or forbidden: ${postId}`);
        return null;
      }
      
      // Boshqa xatolar uchun error throw qilamiz
      const errorText = await response.text().catch(() => 'No error text');
      console.error(`❌ [fetchPostDetails] API Error: ${response.status}`, errorText.substring(0, 200));
      throw new Error(`Reddit API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Ma'lumot strukturasi to'g'ri ekanligini tekshirish
    if (!data || !data[0] || !data[0].data || !data[0].data.children || !data[0].data.children[0]) {
      console.error(`❌ [fetchPostDetails] Invalid data structure for post: ${postId}`);
      return null;
    }
    
    const rawPost = data[0].data.children[0].data;
    const comments = parseComments(data[1]?.data?.children || []);
    
    console.log(`✅ [fetchPostDetails] Success: ${rawPost.title.substring(0, 50)}...`);
    
    // Post rasmlarini decode qilish
    const post: RedditPost = {
      ...rawPost,
      id: rawPost.id || postId,
      title: rawPost.title || 'Untitled',
      author: rawPost.author || '[deleted]',
      subreddit: rawPost.subreddit || subreddit,
      score: rawPost.score || 0,
      num_comments: rawPost.num_comments || 0,
      created_utc: rawPost.created_utc || Date.now() / 1000,
      thumbnail: decodeRedditUrl(rawPost.thumbnail || ''),
      url: decodeRedditUrl(rawPost.url || '#'),
      selftext: rawPost.selftext || '',
      permalink: rawPost.permalink || `/r/${subreddit}/comments/${postId}`,
      preview: rawPost.preview
        ? {
            images: rawPost.preview.images.map((img: any) => ({
              source: { url: decodeRedditUrl(img.source.url) },
            })),
          }
        : undefined,
    };
    
    return { post, comments };
  } catch (error: any) {
    console.error('🔥 [fetchPostDetails] Error:', error.message);
    
    // Agar timeout bo'lsa yoki network error bo'lsa
    if (error.name === 'AbortError') {
      console.error('⏰ [fetchPostDetails] Request timeout');
    }
    
    // Fallback data
    return {
      post: {
        id: postId,
        title: "Post Not Available",
        author: "system",
        subreddit: subreddit,
        score: 0,
        num_comments: 0,
        created_utc: Date.now() / 1000,
        thumbnail: "",
        url: "#",
        selftext: `Unable to load post from r/${subreddit}. The post may have been removed or Reddit API is temporarily unavailable.`,
        permalink: `/r/${subreddit}/comments/${postId}`,
      },
      comments: []
    };
  }
}

function parseComments(commentData: any[]): RedditComment[] {
  return commentData
    .filter((item) => item.kind === 't1')
    .map((item) => {
      const comment = item.data;
      return {
        id: comment.id,
        author: comment.author || '[deleted]',
        body: comment.body || '',
        score: comment.score || 0,
        created_utc: comment.created_utc,
        replies: comment.replies ? parseComments(comment.replies.data.children) : [],
      };
    });
}

export async function searchReddit(query: string, limit = 25): Promise<RedditPost[]> {
  try {
    const targetUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
    
    // CORS proxy – bu browserdan so'rovni chetlab o'tadi
    const proxyUrl = 'https://corsproxy.io/?';
    const fullUrl = proxyUrl + encodeURIComponent(targetUrl);

    const response = await fetch(fullUrl, {
      // next: { revalidate: 300 } clientda kerak emas, olib tashladim
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const posts = data.data.children.map((child: any) => child.data);

    // Rasmlarni decode qilish
    return posts.map((post: RedditPost) => ({
      ...post,
      thumbnail: decodeRedditUrl(post.thumbnail),
      url: decodeRedditUrl(post.url),
      preview: post.preview
        ? {
            images: post.preview.images.map((img: any) => ({
              source: { url: decodeRedditUrl(img.source.url) },
            })),
          }
        : undefined,
    }));
  } catch (error) {
    console.error('[Error] searchReddit:', error);
    return [];
  }
}

