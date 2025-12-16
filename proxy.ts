// proxy.ts - Optimized version
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  
  // Faqat API so'rovlari uchun CORS header'larini qo'shish
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // Reddit API so'rovlari uchun maxsus header'lar
  if (request.url.includes('reddit.com')) {
    response.headers.set('User-Agent', 'RedditReader/1.0 (+https://reddit-reader-web.vercel.app)');
  }
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
};