/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://*.tiktokcdn.com https://*.tiktokcdn-us.com https://*.tiktokv.com https://*.tiktok.com https://p16-sign-sg.tiktokcdn.com https://*.akamaized.net https://*.alisg.com https://*.alicdn.com;
              media-src 'self' blob: https://*.tiktokcdn.com https://*.tiktokcdn-us.com https://*.tiktokv.com https://*.snapcdn.app https://*.akamaized.net;
              connect-src 'self' https://*.supabase.co https://*.tiksave.io https://*.tiktokcdn.com https://*.tiktokcdn-us.com https://*.tiktokv.com https://*.snapcdn.app https://*.akamaized.net;
              font-src 'self' data:;
              frame-src 'self' https://www.tiktok.com;
              object-src 'none';
              base-uri 'self';
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  },
}

export default nextConfig
