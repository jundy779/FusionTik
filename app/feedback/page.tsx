import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Feedback",
  description: "Send feedback, bug reports, or suggestions for FusionTik TikTok downloader.",
  alternates: {
    canonical: `${siteConfig.url}/feedback`,
  },
}

export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">Feedback</h1>
      <p className="text-muted-foreground leading-relaxed">
        We value your feedback about {siteConfig.name}. Share suggestions, report bugs, or tell us
        about your experience using our TikTok downloader.
      </p>

      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="mt-1 block w-full border border-border rounded-md px-3 py-2 bg-background"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            placeholder="Describe your issue or suggestion..."
            className="mt-1 block w-full border border-border rounded-md px-3 py-2 bg-background"
          />
        </div>
        <button
          type="submit"
          disabled
          className="bg-gray-500 text-white px-4 py-2 rounded-md opacity-60 cursor-not-allowed"
          title="Form submission is disabled in this demo"
        >
          Submit
        </button>
      </form>

      <p className="text-sm text-muted-foreground">
        This form is non-functional in the demo. Return to{" "}
        <Link href="/" className="text-blue-500 hover:underline">
          FusionTik
        </Link>
        .
      </p>
    </div>
  )
}
