import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | FusionTik",
  description: "FusionTik Privacy Policy - Learn how we protect your data and privacy",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 3, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to FusionTik. We are committed to protecting your privacy and ensuring
              you have a positive experience on our website. This Privacy Policy explains how
              we collect, use, and safeguard your information when you use our TikTok video
              downloading service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong className="text-foreground">Information You Provide:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>TikTok URLs that you submit for downloading</li>
              </ul>

              <p><strong className="text-foreground">Automatically Collected:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Anonymous usage statistics</li>
              </ul>

              <p><strong className="text-foreground">Local Storage (on your device only):</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Download history</li>
                <li>Personal download statistics</li>
                <li>Theme preferences</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Data Storage</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do <strong className="text-foreground">NOT</strong> store any downloaded videos,
              images, or audio files on our servers. All downloads are processed in real-time
              and delivered directly to your device. Your download history is stored only in
              your browser's local storage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Third-Party Services</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Vercel Analytics - Anonymous usage statistics</li>
              <li>Supabase - Global download counter (no personal data)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Clear your local download history at any time</li>
              <li>Reset your personal statistics</li>
              <li>Opt-out of analytics tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Contact</h2>
            <p className="text-muted-foreground">
              Questions? Contact us via our GitHub repository.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <Link href="/" className="text-blue-500 hover:text-blue-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}