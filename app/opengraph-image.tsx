import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Reddit Reader - Browse Reddit Without an Account'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {


  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#ff4500',
            }}
          >
            R
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            Reddit Reader
          </div>
        </div>
        
        <div
          style={{
            fontSize: '48px',
            color: 'white',
            textAlign: 'center',
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          Browse Reddit Without an Account
        </div>
        
        <div
          style={{
            fontSize: '32px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          Modern, mobile-friendly Reddit client with dark mode, search, and infinite scroll
        </div>
        
        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginTop: '48px',
          }}
        >
          {['📱 Mobile-Friendly', '🌙 Dark Mode', '🔍 Search', '♾️ Infinite Scroll'].map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '16px 24px',
                fontSize: '24px',
                color: 'white',
                backdropFilter: 'blur(10px)',
              }}
            >
              {feature}
            </div>
          ))}
        </div>
        
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '48px',
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          reddit-reader.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}