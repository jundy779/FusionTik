"use client"

import { useState } from "react"
import { ArrowLeft, Copy, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { downloadWithProgress, generateFilename } from "@/lib/download-utils"

// ============== Types ==============

interface ResultButtonsProps {
  /** URL to the video file (if the post is a video). */
  videoUrl?: string
  /** High quality video URL, if available. */
  videoHdUrl?: string
  /** URL to the audio track (if available). */
  audioUrl?: string
  /** List of image URLs for photo mode posts. */
  imageUrls?: string[]
  /** Content type of the result: "video" or "image". */
  type?: string
  /** TikTok creator username (used for filename generation). */
  creator?: string
  /** Callback when the user wants to download another item. */
  onDownloadAnother: () => void
}

// ============== Component ==============

export function ResultButtons({
  videoUrl,
  videoHdUrl,
  audioUrl,
  imageUrls,
  type,
  creator,
  onDownloadAnother,
}: ResultButtonsProps) {
  const { toast } = useToast()
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  // Infer content type from props when `type` is not explicitly provided
  const contentType = type ?? (imageUrls && imageUrls.length > 0 ? "image" : "video")
  const isImage = contentType === "image"

  // ---- Download helpers ----

  const handleDownloadVideo = (url?: string, label = "video") => {
    if (!url) {
      toast({ variant: "destructive", title: "Error", description: `No ${label} URL available` })
      return
    }
    const filename = generateFilename("video", creator)
    downloadWithProgress(url, filename).catch(() => {
      toast({ variant: "destructive", title: "Error", description: "Could not download file" })
    })
  }

  const handleDownloadImages = () => {
    if (!imageUrls || imageUrls.length === 0) {
      toast({ variant: "destructive", title: "Error", description: "No images available to download" })
      return
    }
    imageUrls.forEach((imgUrl, index) => {
      const filename = generateFilename("image", creator, index)
      downloadWithProgress(imgUrl, filename).catch((err) =>
        console.error("Failed to download image:", err),
      )
    })
  }

  const handleDownloadAudio = () => {
    if (!audioUrl) {
      toast({ variant: "destructive", title: "Error", description: "No audio URL available" })
      return
    }
    const filename = generateFilename("audio", creator)
    downloadWithProgress(audioUrl, filename).catch(() => {
      toast({ variant: "destructive", title: "Error", description: "Could not download audio" })
    })
  }

  const copyToClipboard = async (url?: string, label = "file") => {
    if (!url) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No ${label} URL available to copy`,
      })
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      toast({
        title: "Link copied!",
        description: `${label.charAt(0).toUpperCase() + label.slice(1)} link copied to clipboard`,
      })
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to copy link to clipboard" })
    }
  }

  // The URL used for the copy button
  const primaryUrl = isImage ? imageUrls?.[0] : videoUrl

  // ---- JSX ----

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      {isImage ? (
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-6 rounded-md flex items-center justify-center gap-2"
          onClick={handleDownloadImages}
        >
          <Download className="h-5 w-5" />
          UNDUH GAMBAR
        </Button>
      ) : (
        <>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-6 rounded-md flex items-center justify-center gap-2"
            onClick={() => handleDownloadVideo(videoUrl, "video")}
          >
            <Download className="h-5 w-5" />
            UNDUH MP4
          </Button>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-6 rounded-md flex items-center justify-center gap-2"
            onClick={() => handleDownloadVideo(videoHdUrl ?? videoUrl, "video (HD)")}
          >
            <Download className="h-5 w-5" />
            UNDUH MP4 [HD]
          </Button>
        </>
      )}

      {audioUrl && (
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-6 rounded-md flex items-center justify-center gap-2"
          onClick={handleDownloadAudio}
        >
          <Download className="h-5 w-5" />
          UNDUH MP3
        </Button>
      )}

      <div className="flex gap-3">
        <Button
          size="lg"
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-6 rounded-md flex-1 flex items-center justify-center gap-2"
          onClick={onDownloadAnother}
        >
          <ArrowLeft className="h-5 w-5" />
          {isImage ? "UNDUH TIKTOK LAIN" : "UNDUH VIDEO LAIN"}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-6 rounded-md flex items-center justify-center gap-2 w-12"
          onClick={() => copyToClipboard(primaryUrl, isImage ? "image" : "video")}
        >
          {copiedUrl === primaryUrl ? (
            <Check className="h-5 w-5" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  )
}
