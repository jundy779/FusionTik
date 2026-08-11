"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, Info, Loader2, AlertCircle, Globe, ClipboardPaste, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { DownloadSkeleton } from "@/modules/downloader/components/DownloadSkeleton"
import { InsightsCard } from "@/modules/downloader/components/InsightsCard"
import { ResultCard } from "@/modules/downloader/components/ResultCard"
import { StatsCard } from "@/modules/downloader/components/StatsCard"
import { VideoPreview } from "@/modules/downloader/components/VideoPreview"
import { useDownloadHistory, type DownloadHistoryItem } from "@/modules/downloader/hooks/useDownloadHistory"
import { useDownloadInsights } from "@/modules/downloader/hooks/useDownloadInsights"
import { useDownloadStats } from "@/modules/downloader/hooks/useDownloadStats"
import { useGlobalStats } from "@/modules/downloader/hooks/useGlobalStats"
import { downloadWithProgress, generateFilename } from "@/modules/downloader/services/downloadClient"

// ============== Types ==============

interface TikTokApiResponse {
  type: "video" | "image"
  video?: string
  videoHd?: string
  videos?: string[]
  images?: string[]
  music?: string
  description?: string
  creator?: string
  creatorName?: string
  creatorUsername?: string
  postUrl?: string
  postedAt?: string
  region?: string
  regionLabel?: string
  views?: number
  likes?: number
  comments?: number
  shares?: number
  favorites?: number
  duration?: string
  thumbnail?: string
  error?: string
}

interface TikTokResult {
  id: number
  url: string
  type: string
  date: string
  videoUrl?: string
  videoHdUrl?: string
  videos?: string[]
  audioUrl?: string
  imageUrls?: string[]
  description?: string
  creator?: string
  creatorName?: string
  creatorUsername?: string
  postUrl?: string
  postedAt?: string
  regionLabel?: string
  views?: number
  likes?: number
  comments?: number
  shares?: number
  favorites?: number
  duration?: string
  thumbnail?: string
}

// ============== API helper ==============

async function fetchTikTokData(url: string): Promise<TikTokApiResponse> {
  let res: Response
  try {
    res = await fetch("/api/tiktok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
  } catch {
    throw new Error("Gagal terhubung ke server. Periksa koneksi internet Anda.")
  }

  const responseText = await res.text()
  let data: TikTokApiResponse

  try {
    data = JSON.parse(responseText) as TikTokApiResponse
  } catch {
    if (res.status === 403) {
      throw new Error("Permintaan ditolak oleh server (Akses 403 Forbidden).")
    } else if (res.status === 429) {
      throw new Error("Batas download terlampaui. Silakan tunggu beberapa saat lagi.")
    } else {
      throw new Error("Server mengalami gangguan saat memproses link TikTok ini. Silakan coba lagi.")
    }
  }

  if (!res.ok || data.error) {
    throw new Error(
      data.error ?? `Gagal memproses link TikTok (${res.status}). Silakan coba lagi.`,
    )
  }

  if (data.type === "video") {
    if (!data.video) throw new Error("Video TikTok tidak ditemukan atau berstatus privat.")
  } else if (data.type === "image") {
    if (!Array.isArray(data.images) || data.images.length === 0) {
      throw new Error("Gambar Photo Mode TikTok tidak ditemukan.")
    }
  } else {
    throw new Error("Format konten TikTok tidak didukung.")
  }

  return data
}

// ============== Page Component ==============

export default function TikTokDownloader() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentResult, setCurrentResult] = useState<TikTokResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [detectedClipboardUrl, setDetectedClipboardUrl] = useState<string | null>(null)

  const { toast } = useToast()
  const { history, addToHistory, removeFromHistory, clearHistory } = useDownloadHistory()
  const { resetStats } = useDownloadStats()
  const { globalStats, incrementGlobalCounter } = useGlobalStats()
  const insights = useDownloadInsights(history)

  // ---- Auto-detect clipboard TikTok URL on mount & focus ----
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
          const text = await navigator.clipboard.readText()
          if (
            text &&
            /^(https?:\/\/)?(www\.|vm\.|vt\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\//.test(
              text.trim(),
            ) &&
            text.trim() !== url
          ) {
            setDetectedClipboardUrl(text.trim())
          }
        }
      } catch {
        // Permission denied or clipboard unreadable automatically
      }
    }

    checkClipboard()
    window.addEventListener("focus", checkClipboard)
    return () => window.removeEventListener("focus", checkClipboard)
  }, [url])

  // ---- Handlers ----

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchTikTokData(url)

      const newResult: TikTokResult = {
        id: Date.now(),
        url,
        type: data.type,
        date: new Date().toISOString(),
        videoUrl: data.type === "video" ? data.video : undefined,
        videoHdUrl: data.type === "video" ? data.videoHd : undefined,
        videos: data.type === "video" ? data.videos : undefined,
        audioUrl: data.music,
        imageUrls: data.type === "image" ? data.images : undefined,
        description: data.description,
        creator: data.creator,
        creatorName: data.creatorName,
        creatorUsername: data.creatorUsername,
        postUrl: data.postUrl,
        postedAt: data.postedAt,
        regionLabel: data.regionLabel,
        views: data.views,
        likes: data.likes,
        comments: data.comments,
        shares: data.shares,
        favorites: data.favorites,
        duration: data.duration,
        thumbnail: data.thumbnail,
      }

      setCurrentResult(newResult)
      addToHistory(newResult as DownloadHistoryItem)
      await incrementGlobalCounter()

      toast({
        title: "Download ready!",
        description: "Your TikTok video has been processed successfully.",
      })
    } catch (err) {
      console.error("Error downloading TikTok:", err)
      const message = err instanceof Error ? err.message : "Failed to download TikTok"
      setError(message)
      toast({ variant: "destructive", title: "Download failed", description: message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadAnother = () => {
    setCurrentResult(null)
    setUrl("")
  }

  const handlePasteClick = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText()
        if (text) {
          setUrl(text.trim())
          toast({ title: "Pasted URL", description: "URL loaded from clipboard" })
          return
        }
      }
    } catch {
      // Clipboard API not available or denied — fall through to manual prompt
    }

    const manual = window.prompt("Paste TikTok URL here:", "")
    if (manual) {
      setUrl(manual.trim())
      toast({ title: "URL set", description: "URL pasted manually" })
    } else {
      toast({
        variant: "destructive",
        title: "No URL provided",
        description: "Could not obtain URL from clipboard",
      })
    }
  }

  // ---- History download helpers ----

  const handleHistoryDownloadVideo = (item: DownloadHistoryItem) => {
    if (item.type === "image") {
      item.imageUrls?.forEach((imgUrl, index) => {
        const filename = generateFilename("image", item.creator, index)
        downloadWithProgress(imgUrl, filename).catch((err) =>
          console.error("Failed to download image:", err),
        )
      })
    } else if (item.videoUrl) {
      const filename = generateFilename("video", item.creator)
      downloadWithProgress(item.videoUrl, filename).catch((err) =>
        console.error("Failed to download video:", err),
      )
    }
  }

  const handleHistoryDownloadAudio = (item: DownloadHistoryItem) => {
    if (!item.audioUrl) return
    const filename = generateFilename("audio", item.creator)
    downloadWithProgress(item.audioUrl, filename).catch((err) =>
      console.error("Failed to download audio:", err),
    )
  }

  // ---- JSX ----

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero / Download Section */}
        {!currentResult && (
          <section id="download" className="mb-16">
            {/* Hero Entrance Header */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-600 dark:text-blue-400">
                FusionTik
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground/90 mb-3">
                TikTok Downloader Tanpa Watermark (Video, Foto, MP3)
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6 text-base">
                Download video TikTok tanpa watermark, simpan Photo Mode jadi gambar, dan ekstrak
                audio MP3 secara gratis dengan kualitas tinggi langsung dari browser kamu.
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-5 py-2.5 rounded-xl font-medium text-sm">
                <Globe className="h-4 w-4 shrink-0" />
                <span>{globalStats.totalDownloads.toLocaleString()} Downloads Worldwide</span>
              </div>
            </motion.div>

            {/* Core Action: Input Form Card (Instant - NO Motion Delay) */}
            <Card className="border border-border bg-card shadow-lg overflow-hidden max-w-3xl mx-auto">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl font-bold text-foreground">Enter TikTok URL</CardTitle>
                <CardDescription className="text-sm">
                  Paste the link to the TikTok video or image you want to download
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row">
                  <div className="flex flex-1 gap-3">
                    <Input
                      type="text"
                      placeholder="https://www.tiktok.com/@username/video/..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 h-12 text-base bg-background border-input focus:border-blue-500 transition-colors"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePasteClick}
                      className="h-12 px-5 transition-colors"
                    >
                      <ClipboardPaste className="mr-2 h-4 w-4" />
                      Paste
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !url}
                    className="h-12 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Download
                      </>
                    )}
                  </Button>
                </form>

                {detectedClipboardUrl && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2 truncate text-blue-600 dark:text-blue-400 font-medium">
                      <Sparkles className="h-4 w-4 shrink-0 text-blue-500" />
                      <span className="truncate">Link TikTok terdeteksi di clipboard: {detectedClipboardUrl}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setUrl(detectedClipboardUrl)
                        setDetectedClipboardUrl(null)
                        toast({ title: "Link Ditempel", description: "URL TikTok dari clipboard telah diisi" })
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 text-xs h-8"
                    >
                      Tempel Sekarang
                    </Button>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive" className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t border-border/50 pt-3 justify-center">
                By using our service, you agree to our Terms of Service and Privacy Policy
              </CardFooter>
            </Card>
          </section>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="py-8">
            <div className="flex items-center justify-center gap-2 mb-6 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing your download, this may take a few moments...</span>
            </div>
            <DownloadSkeleton />
          </div>
        )}

        {/* Result */}
        {currentResult && (
          <section className="py-8">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 border border-green-500/30 rounded-full px-4 py-1.5 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Ready to download
              </div>
            </div>
            <VideoPreview
              result={currentResult}
              onDownloadVideo={() => {
                if (currentResult.videoUrl) {
                  const filename = generateFilename("video", currentResult.creator)
                  downloadWithProgress(currentResult.videoUrl, filename)
                } else if (currentResult.imageUrls && currentResult.imageUrls.length > 0) {
                  currentResult.imageUrls.forEach((imgUrl, index) => {
                    const filename = generateFilename("image", currentResult.creator, index)
                    downloadWithProgress(imgUrl, filename)
                  })
                }
              }}
              onDownloadAudio={() => {
                if (currentResult.audioUrl) {
                  const filename = generateFilename("audio", currentResult.creator)
                  downloadWithProgress(currentResult.audioUrl, filename)
                }
              }}
            />

            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={handleDownloadAnother}
                className="bg-card hover:bg-accent text-foreground border-border"
              >
                Download Video Lain
              </Button>
            </div>
          </section>
        )}

        {/* About Section (Subtle Scroll Reveal OK) */}
        {!currentResult && (
          <motion.section
            id="about"
            className="mb-16"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Tentang FusionTik</h2>
              <p className="text-muted-foreground">
                FusionTik adalah TikTok downloader tanpa watermark untuk video, foto (Photo Mode),
                dan audio MP3.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    Dengan FusionTik kamu bisa menyimpan video TikTok, gambar, dan audio tanpa
                    watermark langsung ke perangkat kamu. Cara pakainya sangat mudah:
                  </p>
                  <ol className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-bold">1</span>
                      <span>Copy link video atau foto TikTok yang ingin kamu download</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-bold">2</span>
                      <span>Paste link tersebut ke kolom input di atas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-bold">3</span>
                      <span>Klik tombol "Download"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-bold">4</span>
                      <span>Pilih format yang kamu mau (video MP4, audio MP3, atau gambar)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-bold">5</span>
                      <span>Simpan hasil download ke perangkat kamu</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Badge className="mt-1 bg-blue-600 hover:bg-blue-700">Free</Badge>
                      <span>Layanan gratis 100% tanpa biaya tersembunyi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="mt-1 bg-blue-600 hover:bg-blue-700">No Watermarks</Badge>
                      <span>Download video TikTok tanpa watermark TikTok</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="mt-1 bg-blue-600 hover:bg-blue-700">High Quality</Badge>
                      <span>Download video dan gambar dengan kualitas setinggi mungkin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="mt-1 bg-blue-600 hover:bg-blue-700">Audio Extraction</Badge>
                      <span>Ekstrak dan download hanya audio dari video TikTok (MP3)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="mt-1 bg-blue-600 hover:bg-blue-700">Download History</Badge>
                      <span>
                        Lihat riwayat konten yang sudah kamu download dengan fitur history
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* GEO Comparison Table for AI Search & Citations */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Mengapa Memilih FusionTik Downloader?</CardTitle>
                  <CardDescription>
                    Perbandingan keunggulan FusionTik dengan downloader TikTok biasa lainnya
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="p-3 font-semibold">Fitur / Layanan</th>
                        <th className="p-3 font-semibold text-blue-500">FusionTik Downloader</th>
                        <th className="p-3 font-semibold text-muted-foreground">Downloader Lain</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      <tr>
                        <td className="p-3 font-medium">Video Tanpa Watermark (HD MP4)</td>
                        <td className="p-3 text-green-500 font-medium">100% Gratis & Bersih</td>
                        <td className="p-3 text-muted-foreground">Sering ada logo/iklan</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Download TikTok Photo Mode (Slide Foto)</td>
                        <td className="p-3 text-green-500 font-medium">Mendukung semua slide JPG/PNG</td>
                        <td className="p-3 text-muted-foreground">Banyak yang tidak mendukung</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Ekstraksi Musik Audio (MP3)</td>
                        <td className="p-3 text-green-500 font-medium">Kualitas audio original tertinggi</td>
                        <td className="p-3 text-muted-foreground">Terbatas / Kompresi rendah</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Privasi & Keamanan Data</td>
                        <td className="p-3 text-green-500 font-medium">0% Simpan File di Server</td>
                        <td className="p-3 text-muted-foreground">Simpan riwayat di server</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Kecepatan & Tanpa Login</td>
                        <td className="p-3 text-green-500 font-medium">Instan, Tanpa Akun / Pendaftaran</td>
                        <td className="p-3 text-muted-foreground">Perlu login / captcha rumit</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}

        {/* Download History (Instant Data Section - NO Motion Delay) */}
        {!currentResult && (
          <section id="history" className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Download History</h2>
              <p className="text-muted-foreground">Your downloaded TikTok videos and images</p>
            </div>

            {history.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {history.map((item) => (
                    <ResultCard
                      key={item.id}
                      result={{
                        id: item.id,
                        url: item.url,
                        type: item.type,
                        date: item.date,
                        description: item.description,
                        creator: item.creator,
                        duration: item.duration,
                        audioUrl: item.audioUrl,
                      }}
                      onDownloadVideo={() => handleHistoryDownloadVideo(item)}
                      onDownloadAudio={() => handleHistoryDownloadAudio(item)}
                      onDelete={() => removeFromHistory(item.id)}
                      isHistoryItem
                    />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="outline" onClick={clearHistory}>
                    Clear History
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center">
                You have no download history yet.
              </p>
            )}
          </section>
        )}

        {/* Personal Stats (Instant Data Section - NO Motion Delay) */}
        {!currentResult && (
          <section id="stats" className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Your Personal Download Statistics</h2>
              <p className="text-muted-foreground">
                Track your personal download activity. These stats are stored locally and can be
                reset without affecting the global counter.
              </p>
            </div>
            <StatsCard
              onResetStats={() => {
                resetStats()
                clearHistory()
                toast({
                  title: "Local Stats Reset",
                  description:
                    "Your personal download statistics have been cleared. Global counter remains unchanged.",
                })
              }}
            />
          </section>
        )}

        {/* Download Insights (Instant Data Section - NO Motion Delay) */}
        {!currentResult && (
          <section id="insights" className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Download Insights</h2>
              <p className="text-muted-foreground">
                A breakdown of what you download, from whom, and where it's from
              </p>
            </div>
            <InsightsCard insights={insights} />
          </section>
        )}

        {/* FAQ Section (Instant Section - NO Motion Delay) */}
        {!currentResult && (
          <section id="faq" className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Get answers to common questions about our service
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is this service free?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, FusionTik is completely free to use. There are no hidden fees or
                    subscriptions required.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Is it legal to download TikTok videos?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Downloading videos for personal use is generally acceptable. However, you should
                    not redistribute or use the content commercially without permission from the
                    creator.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What formats can I download?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You can download TikTok content as MP4 videos, MP3 audio files, or JPG/PNG
                    images depending on the original content type.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you store the downloaded videos?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No, we don&apos;t store any downloaded videos or user data on our servers. Your
                    download history is saved locally on your device only.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-500" />
                <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                  FusionTik
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                TikTok downloader tanpa watermark untuk video, foto, dan audio MP3
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 text-sm">
              <div>
                <h3 className="font-medium mb-2">Links</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="#download" className="hover:text-blue-400 transition-colors">
                      Download
                    </a>
                  </li>
                  <li>
                    <a href="#history" className="hover:text-blue-400 transition-colors">
                      History
                    </a>
                  </li>
                  <li>
                    <a href="#stats" className="hover:text-blue-400 transition-colors">
                      Stats
                    </a>
                  </li>
                  <li>
                    <a href="#insights" className="hover:text-blue-400 transition-colors">
                      Insights
                    </a>
                  </li>
                  <li>
                    <a href="#about" className="hover:text-blue-400 transition-colors">
                      About
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Legal</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="/terms" className="hover:text-blue-400 transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="hover:text-blue-400 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Support</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="/faq" className="hover:text-blue-400 transition-colors">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="/help-center" className="hover:text-blue-400 transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="/feedback" className="hover:text-blue-400 transition-colors">
                      Feedback
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} Fusionify.ID. All rights reserved.</p>
            <p className="mt-1">
              This service is not affiliated with TikTok or ByteDance Ltd.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
