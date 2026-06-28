import type { Metadata } from "next"
import Link from "next/link"
import { StructuredData } from "@/components/structured-data"
import { siteConfig } from "@/lib/site-config"
import { buildFaqSchema, faqItems } from "@/lib/structured-data"

export const metadata: Metadata = {
  title: "FAQ - TikTok Downloader Help",
  description:
    "Frequently asked questions about FusionTik: free TikTok downloader, no watermark MP4, MP3 audio, Photo Mode images, privacy, and legal use.",
  alternates: {
    canonical: `${siteConfig.url}/faq`,
  },
}

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Answers about using {siteConfig.name} to download TikTok videos, audio, and photos without
          watermark.
        </p>
      </div>

      {faqItems.map((item) => (
        <section key={item.question}>
          <h2 className="text-xl font-semibold mb-2">{item.question}</h2>
          <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
        </section>
      ))}

      <p className="text-sm text-muted-foreground pt-4 border-t">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to FusionTik downloader
        </Link>
      </p>

      <StructuredData data={buildFaqSchema()} />
    </div>
  )
}
