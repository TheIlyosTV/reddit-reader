// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.redditmedia.com',
      },
      {
        protocol: 'https',
        hostname: '**.redd.it',
      },
    ],
  },
  // Agar CORS muammosi bo'lsa
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://www.reddit.com/:path*',
      }
    ]
  }
}

module.exports = nextConfig