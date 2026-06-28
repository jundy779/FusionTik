import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Get help using FusionTik TikTok downloader. Troubleshooting tips, supported URL formats, and how to report download issues.",
  alternates: {
    canonical: `${siteConfig.url}/help-center`,
  },
}

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">Help Center</h1>
      <p className="text-muted-foreground leading-relaxed">
        Need help using {siteConfig.name}? Start with our{" "}
        <Link href="/faq" className="text-blue-500 hover:underline">
          FAQ page
        </Link>{" "}
        for common questions about downloading TikTok videos, MP3 audio, and Photo Mode images.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Supported TikTok links</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>https://www.tiktok.com/@username/video/...</li>
          <li>https://vt.tiktok.com/...</li>
          <li>https://vm.tiktok.com/...</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Download not working?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Make sure the TikTok post is public. Private or restricted posts cannot be downloaded. Try
          copying the link again from the TikTok share menu, then paste it on the{" "}
          <Link href="/" className="text-blue-500 hover:underline">
            FusionTik homepage
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Still need help?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Send feedback via the{" "}
          <Link href="/feedback" className="text-blue-500 hover:underline">
            feedback page
          </Link>
          . Include the TikTok URL and any error message you see.
        </p>
      </section>
    </div>
  )
}
