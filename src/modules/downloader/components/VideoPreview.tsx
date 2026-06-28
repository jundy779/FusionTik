"use client"

import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Download, Music, Loader2, ChevronLeft, ChevronRight, User, Calendar, MapPin, Eye, Heart, MessageCircle, Star, Share2, Video, Images } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useRef, useCallback, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import {
  downloadWithProgress,
  generateFilename,
  formatFileSize,
  type DownloadProgress,
} from "@/modules/downloader/services/downloadClient"

// ============== Helpers ==============

/**
 * Sanitizes a plain-text TikTok caption and converts URLs, @mentions, and
 * #hashtags into safe anchor tags.  Uses textContent assignment to prevent XSS
 * instead of raw string interpolation.
 */
function makeLinksClickable(text: string): string {
  if (!text) return ""

  // Escape HTML entities first to prevent XSS
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

  const linkClass =
    "text-blue-500 hover:text-blue-700 hover:underline transition-colors"

  // URLs
  let processed = escaped.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    try {
      new URL(url)
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${url}</a>`
    } catch {
      return url
    }
  })

  // @mentions
  processed = processed.replace(/@([a-zA-Z0-9_.]+)/g, (_, username: string) => {
    const safeUsername = encodeURIComponent(username)
    return `<a href="https://tiktok.com/@${safeUsername}" target="_blank" rel="noopener noreferrer" class="${linkClass}">@${username}</a>`
  })

  // #hashtags
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
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getCreatorProfileUrl(username?: string): string | undefined {
  if (!username) return undefined
  return `https://tiktok.com/@${encodeURIComponent(username)}`
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

type DownloadType = "video1" | "video2" | "videoHd" | "audio" | "image" | null

// ============== Component ==============

export function VideoPreview({ result, onDownloadVideo, onDownloadAudio }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  // Register carousel select event
  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi, onSelect])

  const isVideo = result.type === "video"
  const mediaUrl = isVideo ? result.videoUrl : result.imageUrls?.[0]
  const imageCount = result.imageUrls?.length ?? 0
  const creatorLabel = result.creatorName || (result.creatorUsername ? `@${result.creatorUsername}` : result.creator ? `@${result.creator}` : "")
  const creatorProfileUrl = getCreatorProfileUrl(result.creatorUsername || result.creator)
  const postLink = result.postUrl || result.url
  const hasMetaHeader = !!(creatorLabel || result.postedAt || result.regionLabel)
  const hasStats = [result.views, result.likes, result.comments, result.favorites, result.shares].some(
    (value) => typeof value === "number",
  )

  // ---- Video controls ----

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

  // ---- Download ----

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

  const handleDownloadAllImages = async () => {
    if (!result.imageUrls || result.imageUrls.length === 0) return
    setDownloading("image")
    setDownloadProgress(null)

    // Download images sequentially to avoid browser popup blocking
    for (let i = 0; i < result.imageUrls.length; i++) {
      const filename = generateFilename("image", result.creator, i)
      await downloadWithProgress(result.imageUrls[i], filename)
    }

    setDownloading(null)
    setDownloadProgress(null)
  }

  // ---- Render helpers ----

  const renderDownloadButton = (
    label: string,
    url: string,
    type: "video" | "audio" | "image",
    downloadType: DownloadType,
    gradient: string,
    icon: React.ReactNode,
    index?: number,
  ) => {
    const isDownloading = downloading === downloadType

    return (
      <div className="space-y-1">
        <Button
          size="lg"
          onClick={() => handleDownload(url, type, downloadType, index)}
          disabled={!!downloading}
          className={`w-full ${gradient} text-white font-semibold py-4`}
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              {icon}
              {label}
            </>
          )}
        </Button>
        {isDownloading && downloadProgress && (
          <div className="space-y-1">
            <Progress value={downloadProgress.percent} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {downloadProgress.percent}% •{" "}
              {formatFileSize(downloadProgress.loaded)} /{" "}
              {formatFileSize(downloadProgress.total)}
            </p>
          </div>
        )}
      </div>
    )
  }

  // ---- JSX ----

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-blue-600">Download Ready!</h2>
            {result.creator && (
              <p className="text-muted-foreground">
                Video by{" "}
                <span className="font-medium text-blue-600">@{result.creator}</span>
              </p>
            )}
            <div className="flex items-center justify-center gap-3">
              <Badge variant="secondary" className="px-3 py-1 inline-flex items-center gap-1.5">
                {isVideo ? (
                  <>
                    <Video className="h-3.5 w-3.5" />
                    Video
                  </>
                ) : (
                  <>
                    <Images className="h-3.5 w-3.5" />
                    {result.imageUrls && result.imageUrls.length > 0
                      ? `Photo Mode (${result.imageUrls.length} images)`
                      : "Image"}
                  </>
                )}
              </Badge>
              <span className="text-sm text-muted-foreground">{result.date}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Video / Image Preview */}
          <div className="relative bg-black rounded-lg overflow-hidden">
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
                    className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-white" />
                    ) : (
                      <Play className="h-8 w-8 text-white ml-1" />
                    )}
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <div className="flex-1 bg-white/20 rounded-full h-1">
                      <div
                        className="bg-white rounded-full h-1 transition-all duration-300"
                        style={{
                          width: `${videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span>{formatTime(videoDuration)}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={handleMuteToggle}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative bg-gray-100">
                {result.imageUrls && result.imageUrls.length > 0 ? (
                  <>
                    {/* Embla Carousel */}
                    <div className="overflow-hidden" ref={emblaRef}>
                      <div className="flex">
                        {result.imageUrls.map((imgUrl, index) => (
                          <div
                            key={index}
                            className="flex-none w-full flex items-center justify-center min-h-64 max-h-96"
                          >
                            <img
                              src={imgUrl}
                              alt={`TikTok Image ${index + 1}`}
                              className="max-h-96 w-full object-contain"
                              onError={(e) => {
                                if (result.thumbnail) {
                                  (e.target as HTMLImageElement).src = result.thumbnail
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation buttons (only show if more than 1 image) */}
                    {imageCount > 1 && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                          onClick={scrollPrev}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                          onClick={scrollNext}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Slide indicator */}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                          {result.imageUrls.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentSlide
                                  ? "bg-white scale-125"
                                  : "bg-white/50"
                              }`}
                              onClick={() => {
                                emblaApi?.scrollTo(index)
                                setCurrentSlide(index)
                              }}
                            />
                          ))}
                        </div>

                        {/* Counter */}
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
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
                  <div className="flex items-center justify-center min-h-64 text-gray-500">
                    No preview available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Caption</h3>

            {hasMetaHeader && (
              <div className="space-y-2 text-sm text-muted-foreground">
                {creatorLabel && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 shrink-0 mt-0.5" />
                    {creatorProfileUrl ? (
                      <a
                        href={creatorProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
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
                    <Calendar className="h-4 w-4 shrink-0 mt-0.5" />
                    <a
                      href={postLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {formatPostedDate(result.postedAt)}
                    </a>
                  </div>
                )}

                {result.regionLabel && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{result.regionLabel}</span>
                  </div>
                )}
              </div>
            )}

            {result.description ? (
              <div
                className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-sm"
                dangerouslySetInnerHTML={{ __html: makeLinksClickable(result.description) }}
              />
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-sm italic">
                No caption available for this content
              </div>
            )}

            {hasStats && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-sm text-muted-foreground">
                {typeof result.views === "number" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    {formatCount(result.views)}
                  </span>
                )}
                {typeof result.likes === "number" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="h-4 w-4" />
                    {formatCount(result.likes)}
                  </span>
                )}
                {typeof result.comments === "number" && (
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4" />
                    {formatCount(result.comments)}
                  </span>
                )}
                {typeof result.favorites === "number" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4" />
                    {formatCount(result.favorites)}
                  </span>
                )}
                {typeof result.shares === "number" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Share2 className="h-4 w-4" />
                    {formatCount(result.shares)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Download Buttons */}
          <div className="space-y-3">
            {isVideo && result.videos && result.videos.length > 0 ? (
              <div className="space-y-2">
                {renderDownloadButton(
                  "UNDUH MP4 [1]",
                  result.videos[0],
                  "video",
                  "video1",
                  "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600",
                  <Download className="mr-2 h-5 w-5" />,
                )}

                {result.videoHdUrl &&
                  renderDownloadButton(
                    "UNDUH MP4 [2]",
                    result.videoHdUrl,
                    "video",
                    "videoHd",
                    "bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600",
                    <Download className="mr-2 h-5 w-5" />,
                  )}

                {result.videos.length > 1 &&
                  renderDownloadButton(
                    "UNDUH MP4 HD",
                    result.videos[1],
                    "video",
                    "video2",
                    "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600",
                    <Download className="mr-2 h-5 w-5" />,
                  )}
              </div>
            ) : isVideo ? (
              renderDownloadButton(
                "UNDUH MP4",
                result.videoUrl ?? "",
                "video",
                "video1",
                "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600",
                <Download className="mr-2 h-5 w-5" />,
              )
            ) : (
              <Button
                size="lg"
                onClick={handleDownloadAllImages}
                disabled={!!downloading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-4"
              >
                {downloading === "image" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    UNDUH GAMBAR ({result.imageUrls?.length ?? 0})
                  </>
                )}
              </Button>
            )}

            {result.audioUrl &&
              renderDownloadButton(
                "UNDUH MP3",
                result.audioUrl,
                "audio",
                "audio",
                "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",
                <Music className="mr-2 h-5 w-5" />,
              )}
          </div>

          {/* Additional Info */}
          <div className="text-sm text-muted-foreground space-y-1">
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
              <div>Duration: {formatResultDuration(result.duration)}</div>
            )}
            {result.size && <div>Size: {result.size}</div>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
