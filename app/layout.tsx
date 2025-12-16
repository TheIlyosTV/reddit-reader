import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

// Metadata for SEO
export const metadata: Metadata = {
  title: {
    default: "Reddit Reader - Browse Reddit Without an Account",
    template: "%s | Reddit Reader"
  },
  description: "A modern, mobile-friendly Reddit client that lets you browse Reddit posts without an account. Read popular posts, search across subreddits, and enjoy ad-free browsing.",
  keywords: [
    "Reddit",
    "Reddit reader",
    "Reddit client",
    "social media",
    "news aggregator",
    "tech news",
    "programming",
    "entertainment"
  ],
  authors: [{ name: "Reddit Reader Team" }],
  creator: "Reddit Reader",
  publisher: "Reddit Reader",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Open Graph for social media
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://reddit-reader-web.vercel.app/",
    title: "Reddit Reader - Browse Reddit Without an Account",
    description: "A modern, mobile-friendly Reddit client that lets you browse Reddit posts without an account.",
    siteName: "Reddit Reader",
    images: [
      {
        url: "https://reddit-reader-web.vercel.app//og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Reddit Reader - Browse Reddit Without an Account",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Reddit Reader - Browse Reddit Without an Account",
    description: "A modern, mobile-friendly Reddit client that lets you browse Reddit posts without an account.",
    images: ["https://reddit-reader-web.vercel.app//og-image.jpg"],
    creator: "@redditreader",
  },
  
  // Additional metadata
  metadataBase: new URL("https://reddit-reader-web.vercel.app/"),
  alternates: {
    canonical: "https://reddit-reader-web.vercel.app/",
  },
  verification: {
    google: "zpzSjFvX8F6mIHXNTD9gkwKrwz5EHGNcsGHULbej48E", // Add your Google verification code
    yandex: "yandex-verification-code", // Add your Yandex verification code
  },
  category: "social media",
  
  // App Links
  appLinks: {
    web: {
      url: "https://reddit-reader-web.vercel.app/",
      should_fallback: true,
    },
  },
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#ff4500",
      },
    ],
  },
  
  // Manifest
  manifest: "/manifest.json",
  
  // Other metadata
  other: {
    "msapplication-TileColor": "#ff4500",
    "msapplication-config": "/browserconfig.xml",
  },
};

// Viewport settings
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};

// JSON-LD Structured Data
function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Reddit Reader",
          "url": "https://reddit-reader-web.vercel.app/",
          "description": "A modern, mobile-friendly Reddit client",
          "applicationCategory": "SocialMediaApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Organization",
            "name": "Reddit Reader",
            "url": "https://reddit-reader-web.vercel.app/"
          },
          "featureList": [
            "Browse Reddit without account",
            "Mobile-friendly interface",
            "Dark/Light mode",
            "Search functionality",
            "Infinite scroll"
          ]
        })
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://www.reddit.com" />
        <link rel="preconnect" href="https://www.redditstatic.com" />
        <link rel="preconnect" href="https://www.redditmedia.com" />
        
        {/* Preload critical resources */}
        <link 
          rel="preload" 
          href="/fonts/inter.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
        />
        
        {/* Structured Data */}
        <StructuredData />
        
        {/* Additional meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* PWA settings */}
        <meta name="application-name" content="Reddit Reader" />
        <meta name="apple-mobile-web-app-title" content="Reddit Reader" />
        <meta name="msapplication-TileColor" content="#ff4500" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
      </head>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
                {children}
              </main>
            </div>
            <Footer />
          </div>
          
          {/* Analytics */}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
        
        {/* Service Worker for PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}