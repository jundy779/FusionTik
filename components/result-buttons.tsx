"use client"

import { useState } from "react"
import { ArrowLeft, Copy, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

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
  /** Callback when the user wants to download another item. */
  onDownloadAnother: () => void
}

export function ResultButtons({
  videoUrl,
  videoHdUrl,
  audioUrl,
  imageUrls,
  type,
  onDownloadAnother,
}: ResultButtonsProps) {
  const { toast } = useToast()
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const handleDownload = (url?: string, label = "file") => {
    if (!url) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No ${label} URL available`,
      })
      return
    }
    try {
      window.open(url, "_blank")
    } catch (error) {
      console.error("Error opening URL:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not open download URL",
      })
    }
  }

  const handleDownloadImages = () => {
    if (!imageUrls || imageUrls.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No images available to download`,
      })
      return
    }
    imageUrls.forEach((img) => {
      try {
        window.open(img, "_blank")
      } catch (error) {
        console.error("Error opening image URL:", error)
      }
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
    } catch (error) {
      console.error("Failed to copy:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link to clipboard",
      })
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      {/* Render download buttons based on the type of content */}
      {/* Determine content type on the fly in case the caller passes undefined.  If `type` is undefined we infer it
          from the presence of image URLs. */}
      {(() => {
        const contentType = type ?? (imageUrls && imageUrls.length > 0 ? "image" : "video")
        return contentType === "image"
      })() ? (

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
          {/* Standard MP4 download */}
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-6 rounded-md flex items-center justify-center gap-2"
            onClick={() => handleDownload(videoUrl, "video")}
          >
            <Download className="h-5 w-5" />
            UNDUH MP4
          </Button>
          {/* HD MP4 download – fall back to the standard URL if HD is unavailable */}
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-6 rounded-md flex items-center justify-center gap-2"
            onClick={() => handleDownload(videoHdUrl || videoUrl, "video (HD)")}
          >
            <Download className="h-5 w-5" />
            UNDUH MP4 [HD]
          </Button>
        </>
      )}

      {/* Audio download button (only show if available) */}
      {audioUrl && (
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-6 rounded-md flex items-center justify-center gap-2"
          onClick={() => handleDownload(audioUrl, "audio")}
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
          {(() => {
            const contentType = type ?? (imageUrls && imageUrls.length > 0 ? "image" : "video")
            return contentType === "image" ? "UNDUH TIKTOK LAIN" : "UNDUH VIDEO LAIN"
          })()}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-6 rounded-md flex items-center justify-center gap-2 w-12"
          onClick={() => {
            const firstUrl =
              type === "image"
                ? imageUrls && imageUrls.length > 0
                  ? imageUrls[0]
                  : undefined
                : videoUrl
            copyToClipboard(firstUrl, type === "image" ? "image" : "video")
          }}
        >
          {(() => {
            const firstUrl =
              type === "image"
                ? imageUrls && imageUrls.length > 0
                  ? imageUrls[0]
                  : undefined
                : videoUrl
            return copiedUrl === firstUrl ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />
          })()}
        </Button>
      </div>
    </div>
  )
}
