export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Frequently Asked Questions (FAQ)</h1>
      <div>
        <h2 className="text-xl font-semibold mb-2">Is this service free?</h2>
        <p className="text-muted-foreground">
          Yes, SlowTik is completely free to use. There are no hidden fees or subscriptions
          required.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Is it legal to download TikTok videos?</h2>
        <p className="text-muted-foreground">
          Downloading videos for personal use is generally acceptable. However, you should not redistribute
          or use the content commercially without permission from the creator.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">What formats can I download?</h2>
        <p className="text-muted-foreground">
          You can download TikTok content as MP4 videos, MP3 audio files, or JPG/PNG images depending on
          the original content type.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Do you store the downloaded videos?</h2>
        <p className="text-muted-foreground">
          No, we don't store any downloaded videos or user data on our servers. Your download history is
          saved locally on your device only.
        </p>
      </div>
    </div>
  )
}