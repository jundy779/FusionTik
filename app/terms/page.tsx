import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | FusionTik",
  description: "FusionTik Terms of Service - Read our terms and conditions",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 3, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using FusionTik, you accept and agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Service Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              FusionTik is a free online tool that allows users to download TikTok videos,
              images, and audio without watermarks. We do not host any TikTok content on our
              servers - all content is fetched directly from TikTok.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Acceptable Use</h2>
            <div className="text-muted-foreground space-y-2">
              <p>You agree to use the service only for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Personal, non-commercial purposes</li>
                <li>Downloading content you have rights to</li>
                <li>Respecting content creators' intellectual property</li>
              </ul>
              <p className="mt-3">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use downloaded content for commercial purposes without permission</li>
                <li>Redistribute or claim ownership of others' content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Abuse or overload our service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content downloaded through FusionTik remains the intellectual property of
              the original creators. We do not claim ownership of any TikTok content. Users
              are responsible for respecting copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              FusionTik is provided "as is" without warranties of any kind. We are not
              responsible for the content you download or how you use it. We reserve the
              right to modify or discontinue the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              FusionTik and its operators shall not be liable for any damages arising from
              the use or inability to use our service, including but not limited to direct,
              indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of
              the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms, please contact us via our GitHub repository.
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