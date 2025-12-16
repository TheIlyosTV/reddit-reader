import { NextRequest, NextResponse } from 'next/server';

// Reddit API uchun user agent
const USER_AGENT = "NextJS-Reddit-Reader/1.0 (by /u/AmazingCelebration65)";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'popular';
    const limit = searchParams.get('limit') || '12';
    const after = searchParams.get('after') || '';

    console.log(`📡 API Called: category=${category}, limit=${limit}, after=${after}`);

    // Reddit API URL
    const redditUrl = `https://www.reddit.com/r/${category}.json?limit=${limit}${after ? `&after=${after}` : ""}`;
    
    console.log(`🔗 Reddit URL: ${redditUrl}`);

    const response = await fetch(redditUrl, {
      headers: { 
        "User-Agent": USER_AGENT,
        "Accept": "application/json"
      },
      // Timeout qo'shish
      signal: AbortSignal.timeout(10000),
    });

    console.log(`📊 Reddit Response: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Reddit API Error:', response.status, errorText);
      
      return NextResponse.json(
        { 
          error: `Reddit API xatosi: ${response.status}`,
          details: errorText.substring(0, 200)
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Ma'lumotni formatlash
    const formattedData = {
      ...data,
      data: {
        ...data.data,
        children: data.data.children.map((child: any) => ({
          ...child,
          data: {
            ...child.data,
            // URL'larni to'g'rilash
            thumbnail: child.data.thumbnail?.replace(/&amp;/g, '&'),
            url: child.data.url?.replace(/&amp;/g, '&'),
          }
        }))
      }
    };

    return NextResponse.json(formattedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error: any) {
    console.error('🔥 API Internal Error:', error);
    
    return NextResponse.json(
      { 
        error: "Ichki server xatosi",
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// OPTIONS metodini qo'shish (CORS uchun)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}