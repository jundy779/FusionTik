import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site-config"

export const runtime = "edge"
export const alt = "FusionTik - TikTok Downloader Tanpa Watermark"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0891b2 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, marginBottom: 16 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 36, fontWeight: 600, opacity: 0.95, maxWidth: 900 }}>
          TikTok Downloader Tanpa Watermark
        </div>
        <div style={{ fontSize: 28, marginTop: 24, opacity: 0.85 }}>
          MP4 Video · MP3 Audio · Photo Mode
        </div>
      </div>
    ),
    size,
  )
}
