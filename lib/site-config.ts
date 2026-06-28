export const siteConfig = {
  name: "FusionTik",
  tagline: "TikTok Downloader Tanpa Watermark (Video, Foto, MP3)",
  description:
    "FusionTik is a free online TikTok downloader. Save TikTok videos without watermark as MP4, extract audio as MP3, and download Photo Mode slides as images. Fast, no login, works on mobile and desktop.",
  descriptionId:
    "Download video TikTok tanpa watermark, simpan Photo Mode jadi gambar, dan ekstrak audio MP3 secara gratis dengan kualitas tinggi langsung dari browser.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://fusiontik.vercel.app",
  ogImagePath: "/opengraph-image",
  keywords: [
    "TikTok downloader",
    "download TikTok video",
    "TikTok no watermark",
    "TikTok video download",
    "download TikTok tanpa watermark",
    "TikTok audio download",
    "TikTok image download",
    "TikTok downloader Indonesia",
    "download video TikTok tanpa watermark",
    "download TikTok MP4",
    "download TikTok MP3",
    "TikTok Photo Mode download",
    "free TikTok downloader",
    "TikTok MP4 download",
    "TikTok MP3 download",
    "save TikTok video",
    "FusionTik",
  ],
  author: "Fusionify Digital",
  twitter: "@fusiontik",
} as const

export const publicRoutes = [
  { path: "", priority: 1, changeFrequency: "daily" as const },
  { path: "/faq", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/help-center", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/feedback", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" as const },
]
