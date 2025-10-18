"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileAudio, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VideoPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  video: {
    id: number
    url: string
    thumbnail: string
    type: string
    duration: string
    size: string
    date: string
    videoUrl?: string
    audioUrl?: string
    description?: string
    creator?: string
  } | null
}

export function VideoPreviewModal({ isOpen, onClose, video }: VideoPreviewModalProps) {
  const [videoError, setVideoError] = useState(false)

  if (!video) return null

  const videoUrl = video.videoUrl || ""

  const handleVideoError = () => {
    console.error("Video failed to load:", videoUrl)
    setVideoError(true)
  }

  const handleDownload = (url?: string, type = "video") => {
    if (!url) {
      console.error(`No ${type} URL available`)
      return
    }

    try {
      window.open(url, "_blank")
    } catch (error) {
      console.error(`Error opening ${type} URL:`, error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background">
        <DialogHeader className="p-4 flex flex-row items-center justify-between">
          <DialogTitle>Video Preview</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="relative aspect-video w-full bg-black">
          {videoError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <Alert variant="destructive" className="max-w-[90%]">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Video preview failed to load. You can still download the video using the buttons below.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <video
              src={videoUrl}
              poster={video.thumbnail}
              controls
              className="w-full h-full"
              autoPlay
              onError={handleVideoError}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className="p-4 space-y-3">
          {video.description && (
            <div className="flex flex-col gap-1">
              <div className="text-sm text-muted-foreground">Description</div>
              <div className="text-sm max-h-20 overflow-y-auto">{video.description}</div>
            </div>
          )}

          {video.creator && (
            <div className="flex flex-col gap-1">
              <div className="text-sm text-muted-foreground">Creator</div>
              <div className="text-sm">{video.creator}</div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div className="text-sm text-muted-foreground">Original URL</div>
            <div className="text-sm truncate">{video.url}</div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground">Type</div>
              <div>{video.type}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Duration</div>
              <div>{video.duration}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Size</div>
              <div>{video.size}</div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={() => handleDownload(video.videoUrl, "video")}
              disabled={!video.videoUrl}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Video
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleDownload(video.audioUrl, "audio")}
              disabled={!video.audioUrl}
            >
              <FileAudio className="mr-2 h-4 w-4" />
              Download Audio
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
