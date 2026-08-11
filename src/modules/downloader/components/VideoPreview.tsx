"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Music,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  MapPin,
  Eye,
  Heart,
  MessageCircle,
  Star,
  Share2,
  Video,
  Images,
  FolderArchive,
  Copy,
  Check,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import useEmblaCarousel from "embla-carousel-react"
import { useToast } from "@/hooks/use-toast"
import {
  downloadWithProgress,
  downloadImagesAsZip,
  generateFilename,
  formatFileSize,
  type DownloadProgress,
} from "@/modules/downloader/services/downloadClient"

// ============== Helpers ==============

function makeLinksClickable(text: string): string {
  if (!text) return ""

  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

  const linkClass = "text-blue-500 hover:text-blue-700 hover:underline transition-colors"

  let processed = escaped.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    try {
      new URL(url)
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${url}</a>`
    } catch {
      return url
    }
  })

  processed = processed.replace(/@([a-zA-Z0-9_.]+)/g, (_, username: string) => {
    const safeUsername = encodeURIComponent(username)
    return `<a href="https://tiktok.com/@${safeUsername}" target="_blank" rel="noopener noreferrer" class="${linkClass}">@${username}</a>`
  })

  processed = processed.replace(/#([a-zA-Z0-9_]+)/g, (_, hashtag: string) => {
    const safeHashtag = encodeURIComponent(hashtag)
    return `<a href="https://tiktok.com/tag/${safeHashtag}" target="_blank" rel="noopener noreferrer" class="${linkClass}">#${hashtag}</a>`
  })

  return processed
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function formatResultDuration(value?: string): string {
  if (!value) return ""
  const totalSeconds = Number(value)
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return value
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

function formatCount(value?: number): string {
  if (value === undefined || value === null) return ""
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`
  return String(value)
}

function formatPostedDate(value?: string): string {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getCreatorProfileUrl(username?: string): string | undefined {
  if (!username) return undefined
  return `https://tiktok.com/@${encodeURIComponent(username)}`
}

function estimateVideoSize(durationSec?: string): string {
  if (!durationSec) return "~10-20 MB"
  const sec = parseInt(durationSec, 10)
  if (isNaN(sec) || sec <= 0) return "~10-20 MB"
  const estMb = Math.max(2, Math.round(sec * 0.4))
  return `~${estMb} MB`
}

function estimateAudioSize(durationSec?: string): string {
  if (!durationSec) return "~2-4 MB"
  const sec = parseInt(durationSec, 10)
  if (isNaN(sec) || sec <= 0) return "~2-4 MB"
  const estMb = Math.max(1, (sec * 0.02).toFixed(1) as unknown as number)
  return `~${estMb} MB`
}

// ============== Types ==============

interface VideoPreviewProps {
  result: {
    id: number
    url: string
    thumbnail?: string
    type: string
    duration?: string
    size?: string
    date: string
    videoUrl?: string
    videoHdUrl?: string
    videos?: string[]
    audioUrl?: string
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
    imageUrls?: string[]
  }
  onDownloadVideo: () => void
  onDownloadAudio: () => void
}

type DownloadType = "video1" | "video2" | "videoHd" | "audio" | "image" | "zip" | null

// ============== Component ==============

export function VideoPreview({ result }: VideoPreviewProps) {
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Audio Preview player state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Zip compression state
  const [zipProgress, setZipProgress] = useState<{ current: number; total: number } | null>(null)
  const [copied, setCopied] = useState(false)

  const [downloading, setDownloading] = useState<DownloadType>(null)
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null)

  // Carousel for Photo Mode
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [currentSlide, setCurrentSlide] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
      setCurrentSlide(emblaApi.selectedScrollSnap())
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
      setCurrentSlide(emblaApi.selectedScrollSnap())
    }
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (emblaApi) setCurrentSlide(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  const isVideo = result.type === "video"
  const mediaUrl = isVideo ? result.videoUrl : result.imageUrls?.[0]
  const imageCount = result.imageUrls?.length ?? 0
  const creatorLabel =
    result.creatorName ||
    (result.creatorUsername
      ? `@${result.creatorUsername}`
      : result.creator
        ? `@${result.creator}`
        : "")
  const creatorProfileUrl = getCreatorProfileUrl(result.creatorUsername || result.creator)
  const postLink = result.postUrl || result.url
  const hasMetaHeader = !!(creatorLabel || result.postedAt || result.regionLabel)
  const hasStats = [
    result.views,
    result.likes,
    result.comments,
    result.favorites,
    result.shares,
  ].some((value) => typeof value === "number")

  // ---- Controls ----

  const handlePlayPause = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleMuteToggle = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
    setVideoDuration(videoRef.current.duration)
  }

  const handleAudioPlayPause = () => {
    if (!audioRef.current) return
    if (isAudioPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsAudioPlaying(!isAudioPlaying)
  }

  // ---- Quick Share ----

  const handleQuickShare = async () => {
    const siteUrl = "https://fusiontik.vercel.app"
    const shareTitle = `FusionTik - TikTok Downloader`
    const shareText = `Download video/foto TikTok tanpa watermark dari ${creatorLabel || "TikTok"}:`

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: result.url,
        })
        toast({ title: "Shared!", description: "Content link shared successfully" })
        return
      } catch {
        // Share cancelled or unavailable
      }
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(result.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: "Link Salin", description: "Link TikTok telah disalin ke clipboard" })
    } catch {
      toast({ title: "FusionTik", description: result.url })
    }
  }

  const shareToWhatsApp = () => {
    const shareText = `Lihat dan download konten TikTok dari ${creatorLabel || "TikTok"} tanpa watermark di FusionTik:\n${result.url}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank")
  }

  const shareToTelegram = () => {
    const shareText = `Download konten TikTok tanpa watermark dari ${creatorLabel || "TikTok"}`
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(result.url)}&text=${encodeURIComponent(shareText)}`,
      "_blank",
    )
  }

  // ---- Download Handlers ----

  const handleDownload = async (
    url: string,
    type: "video" | "audio" | "image",
    downloadType: DownloadType,
    index?: number,
  ) => {
    setDownloading(downloadType)
    setDownloadProgress(null)

    const filename = generateFilename(type, result.creator, index)
    await downloadWithProgress(url, filename, (progress) => {
      setDownloadProgress(progress)
    })

    setDownloading(null)
    setDownloadProgress(null)
  }

  const handleDownloadAllImagesZip = async () => {
    if (!result.imageUrls || result.imageUrls.length === 0) return
    setDownloading("zip")
    setZipProgress({ current: 0, total: result.imageUrls.length })

    const zipFilename = generateFilename("zip", result.creator)
    await downloadImagesAsZip(result.imageUrls, zipFilename, (current, total) => {
      setZipProgress({ current, total })
    })

    setDownloading(null)
    setZipProgress(null)
    toast({ title: "ZIP Ready", description: `${result.imageUrls.length} foto telah di-download ke file .ZIP!` })
  }

  const handleDownloadAllImages = async () => {
    if (!result.imageUrls || result.imageUrls.length === 0) return
    setDownloading("image")
    setDownloadProgress(null)

    for (let i = 0; i < result.imageUrls.length; i++) {
      const filename = generateFilename("image", result.creator, i)
      await downloadWithProgress(result.imageUrls[i], filename)
    }

    setDownloading(null)
    setDownloadProgress(null)
  }

  // ---- Button Renderer ----

  const renderDownloadButton = (
    label: string,
    url: string,
    type: "video" | "audio" | "image",
    downloadType: DownloadType,
    colorStyle: string,
    icon: React.ReactNode,
    sizeBadge?: string,
    index?: number,
  ) => {
    const isDownloading = downloading === downloadType

    return (
      <div className="space-y-1">
        <Button
          size="lg"
          onClick={() => handleDownload(url, type, downloadType, index)}
          disabled={!!downloading}
          className={`w-full ${colorStyle} text-white font-semibold py-4 flex items-center justify-between px-6 transition-colors`}
        >
          <span className="flex items-center gap-2">
            {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
            <span>{isDownloading ? "Mengunduh..." : label}</span>
          </span>
          {sizeBadge && (
            <Badge variant="outline" className="border-white/30 text-white font-normal text-xs px-2 py-0.5">
              {sizeBadge}
            </Badge>
          )}
        </Button>
        {isDownloading && downloadProgress && (
          <div className="space-y-1 pt-1">
            <Progress value={downloadProgress.percent} className="h-2 bg-muted" />
            <p className="text-xs text-muted-foreground text-center">
              {downloadProgress.percent}% • {formatFileSize(downloadProgress.loaded)} /{" "}
              {formatFileSize(downloadProgress.total)}
            </p>
          </div>
        )}
      </div>
    )
  }

  // ---- JSX ----

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden border border-border shadow-lg">
        <CardHeader className="pb-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Download Ready!</h2>
            {result.creator && (
              <p className="text-muted-foreground">
                Konten oleh <span className="font-medium text-blue-500">@{result.creator}</span>
              </p>
            )}
            <div className="flex items-center justify-center gap-3">
              <Badge variant="secondary" className="px-3 py-1 inline-flex items-center gap-1.5">
                {isVideo ? (
                  <>
                    <Video className="h-3.5 w-3.5 text-blue-500" />
                    <span>Video TikTok</span>
                  </>
                ) : (
                  <>
                    <Images className="h-3.5 w-3.5 text-blue-500" />
                    <span>
                      {result.imageUrls && result.imageUrls.length > 0
                        ? `Photo Mode (${result.imageUrls.length} Foto)`
                        : "Gambar"}
                    </span>
                  </>
                )}
              </Badge>
              <span className="text-sm text-muted-foreground">{result.date}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Video / Image Preview Container */}
          <div className="relative bg-black rounded-xl overflow-hidden shadow-inner">
            {isVideo && mediaUrl ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  poster={result.thumbnail || undefined}
                  className="w-full h-auto max-h-96 object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  muted={isMuted}
                  loop
                />

                {/* Play / Pause overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-transform hover:scale-105"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-white" />
                    ) : (
                      <Play className="h-8 w-8 text-white ml-1" />
                    )}
                  </Button>
                </div>

                {/* Video Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <div className="flex-1 bg-white/20 rounded-full h-1.5">
                      <div
                        className="bg-blue-400 rounded-full h-1.5 transition-all duration-200"
                        style={{
                          width: `${videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span>{formatTime(videoDuration)}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 p-1.5 h-8 w-8"
                      onClick={handleMuteToggle}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative bg-gray-900">
                {result.imageUrls && result.imageUrls.length > 0 ? (
                  <>
                    <div className="overflow-hidden" ref={emblaRef}>
                      <div className="flex">
                        {result.imageUrls.map((imgUrl, index) => (
                          <div
                            key={index}
                            className="flex-none w-full flex items-center justify-center min-h-64 max-h-96"
                          >
                            <img
                              src={imgUrl}
                              alt={`TikTok Photo Slide ${index + 1}`}
                              className="max-h-96 w-full object-contain"
                              onError={(e) => {
                                if (result.thumbnail) {
                                  ;(e.target as HTMLImageElement).src = result.thumbnail
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {imageCount > 1 && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full w-9 h-9 p-0 bg-black/60 hover:bg-black/80 text-white"
                          onClick={scrollPrev}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-9 h-9 p-0 bg-black/60 hover:bg-black/80 text-white"
                          onClick={scrollNext}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>

                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                          {result.imageUrls.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentSlide
                                  ? "bg-blue-400 scale-125"
                                  : "bg-white/50"
                              }`}
                              onClick={() => {
                                emblaApi?.scrollTo(index)
                                setCurrentSlide(index)
                              }}
                            />
                          ))}
                        </div>

                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {currentSlide + 1} / {imageCount}
                        </div>
                      </>
                    )}
                  </>
                ) : result.thumbnail ? (
                  <div className="flex items-center justify-center min-h-64">
                    <img
                      src={result.thumbnail}
                      alt="TikTok Thumbnail"
                      className="max-h-96 object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-64 text-gray-400">
                    No preview available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Caption & Metadata */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-base text-foreground">Caption & Informasi</h3>

            {hasMetaHeader && (
              <div className="space-y-2 text-sm text-muted-foreground">
                {creatorLabel && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                    {creatorProfileUrl ? (
                      <a
                        href={creatorProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline font-medium"
                      >
                        {creatorLabel}
                      </a>
                    ) : (
                      <span className="font-medium text-foreground">{creatorLabel}</span>
                    )}
                  </div>
                )}

                {result.postedAt && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                    <a
                      href={postLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {formatPostedDate(result.postedAt)}
                    </a>
                  </div>
                )}

                {result.regionLabel && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                    <span>{result.regionLabel}</span>
                  </div>
                )}
              </div>
            )}

            {result.description ? (
              <div
                className="text-foreground leading-relaxed whitespace-pre-wrap text-sm"
                dangerouslySetInnerHTML={{ __html: makeLinksClickable(result.description) }}
              />
            ) : (
              <div className="text-muted-foreground text-sm italic">
                Tidak ada deskripsi caption untuk konten ini
              </div>
            )}

            {hasStats && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-border/50 text-sm text-muted-foreground">
                {typeof result.views === "number" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-blue-500" />
                    {formatCount(result.views)}
                  </span>
                )}
                {typeof result.likes === "number" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-red-500" />
                    {formatCount(result.likes)}
                  </span>
                )}
                {typeof result.comments === "number" && (
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    {formatCount(result.comments)}
                  </span>
                )}
                {typeof result.favorites === "number" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {formatCount(result.favorites)}
                  </span>
                )}
                {typeof result.shares === "number" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Share2 className="h-4 w-4 text-purple-500" />
                    {formatCount(result.shares)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* AUDIO PLAYER PREVIEW */}
          {result.audioUrl && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-foreground">Audio Preview (MP3)</span>
                </div>
                <Badge variant="outline" className="border-blue-500/30 text-blue-500 text-xs">
                  Original Sound
                </Badge>
              </div>

              <audio
                ref={audioRef}
                src={result.audioUrl}
                controls
                className="w-full h-10 rounded-md"
                onPlay={() => setIsAudioPlaying(true)}
                onPause={() => setIsAudioPlaying(false)}
                onEnded={() => setIsAudioPlaying(false)}
              />
            </div>
          )}

          {/* DOWNLOAD ACTION BUTTONS & FILE SIZE INDICATORS */}
          <div className="space-y-3">
            {isVideo && result.videos && result.videos.length > 0 ? (
              <div className="space-y-2">
                {renderDownloadButton(
                  "UNDUH MP4 HD (Tanpa Watermark)",
                  result.videos[0],
                  "video",
                  "video1",
                  "bg-blue-600 hover:bg-blue-700",
                  <Download className="h-5 w-5" />,
                  estimateVideoSize(result.duration),
                )}

                {result.videoHdUrl &&
                  renderDownloadButton(
                    "UNDUH MP4 HD [Ultra]",
                    result.videoHdUrl,
                    "video",
                    "videoHd",
                    "bg-emerald-600 hover:bg-emerald-700",
                    <Download className="h-5 w-5" />,
                    "Full Quality",
                  )}
              </div>
            ) : isVideo ? (
              renderDownloadButton(
                "UNDUH MP4 (Tanpa Watermark)",
                result.videoUrl ?? "",
                "video",
                "video1",
                "bg-blue-600 hover:bg-blue-700",
                <Download className="h-5 w-5" />,
                estimateVideoSize(result.duration),
              )
            ) : (
              <div className="space-y-2">
                {/* 1-CLICK ZIP DOWNLOAD BUTTON */}
                <Button
                  size="lg"
                  onClick={handleDownloadAllImagesZip}
                  disabled={!!downloading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 flex items-center justify-between px-6 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {downloading === "zip" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FolderArchive className="h-5 w-5 text-yellow-300" />
                    )}
                    <span>
                      {downloading === "zip"
                        ? zipProgress
                          ? `Mengompres ${zipProgress.current}/${zipProgress.total} foto...`
                          : "Mengompres ke ZIP..."
                        : `UNDUH SEMUA FOTO (.ZIP)`}
                    </span>
                  </span>
                  <Badge variant="outline" className="border-white/30 text-white text-xs">
                    {result.imageUrls?.length ?? 0} Foto • 1-Klik ZIP
                  </Badge>
                </Button>

                {/* Individual slide download fallback */}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleDownloadAllImages}
                  disabled={!!downloading}
                  className="w-full border-border text-foreground hover:bg-accent font-medium py-3"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Unduh Foto Satu-Per-Satu ({result.imageUrls?.length ?? 0} Gambar)
                </Button>
              </div>
            )}

            {/* AUDIO MP3 DOWNLOAD BUTTON WITH ESTIMATED SIZE */}
            {result.audioUrl &&
              renderDownloadButton(
                "UNDUH MP3 (Ekstrak Audio)",
                result.audioUrl,
                "audio",
                "audio",
                "bg-purple-600 hover:bg-purple-700",
                <Music className="h-5 w-5" />,
                estimateAudioSize(result.duration),
              )}
          </div>

          {/* QUICK SHARE BUTTONS */}
          <div className="pt-3 border-t border-border/60">
            <p className="text-xs text-muted-foreground mb-2 text-center font-medium">
              Bagikan Konten Ini (Quick Share)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickShare}
                className="w-full text-xs font-medium border-border hover:bg-accent"
              >
                {copied ? <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                {copied ? "Link Salin!" : "Salin Link"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={shareToWhatsApp}
                className="w-full text-xs font-medium border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                WhatsApp
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={shareToTelegram}
                className="w-full text-xs font-medium border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 col-span-2 sm:col-span-1"
              >
                <Share2 className="mr-1.5 h-3.5 w-3.5" />
                Telegram
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground space-y-1 pt-2">
            <div className="flex items-center gap-2">
              <span>Original URL:</span>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline truncate"
              >
                {result.url}
              </a>
            </div>
            {isVideo && result.duration && (
              <div>Durasi: {formatResultDuration(result.duration)}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
