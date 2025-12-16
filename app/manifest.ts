import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Reddit Reader',
    short_name: 'Reddit Reader',
    description: 'Browse Reddit without an account',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ff4500',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/mobile.png',
        sizes: '375x667',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile view of Reddit Reader',
      },
      {
        src: '/screenshots/desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Desktop view of Reddit Reader',
      },
    ],
    shortcuts: [
      {
        name: 'Browse Popular',
        short_name: 'Popular',
        description: 'Browse popular Reddit posts',
        url: '/?category=popular',
        icons: [
          {
            src: '/icons/popular.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Search Posts',
        short_name: 'Search',
        description: 'Search across Reddit',
        url: '/search',
        icons: [
          {
            src: '/icons/search.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    ],
    categories: ['social', 'entertainment', 'news'],
  }
}