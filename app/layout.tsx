import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const siteConfig = {
  name: "FusionTik",
  description: "Download TikTok videos, images, and audio without watermark. Free, fast, and high quality TikTok downloader.",
  url: "https://fusiontik.vercel.app",
  ogImage: "https://fusiontik.vercel.app/og-image.png",
  keywords: [
    "TikTok downloader",
    "download TikTok video",
    "TikTok no watermark",
    "TikTok video download",
    "download TikTok tanpa watermark",
    "TikTok audio download",
    "TikTok image download",
    "free TikTok downloader",
    "TikTok MP4 download",
    "TikTok MP3 download",
    "save TikTok video",
    "FusionTik"
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Download TikTok Videos, Images & Audio Without Watermark`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "FusionTik Team" }],
  creator: "FusionTik",
  publisher: "FusionTik",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "id_ID",
    url: siteConfig.url,
    title: `${siteConfig.name} - Free TikTok Video Downloader`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "FusionTik - TikTok Downloader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Download TikTok Without Watermark`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@fusiontik",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual code
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
