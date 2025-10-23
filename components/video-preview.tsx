"use client"

import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Download, Music, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useRef } from "react"

const makeLinksClickable = (text: string): string => {
  if (!text) return ""

  let processedText = text

  const urlRegex = /(https?:\/\/[^\s]+)/g
  processedText = processedText.replace(urlRegex, (url) => {
    try {
      new URL(url)
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 hover:underline transition-colors">${url}</a>`
    } catch (e) {
      return url
    }
  })

  const mentionRegex = /@([a-zA-Z0-9_.]+)/g
  processedText = processedText.replace(mentionRegex, (match, username) => {
    return `<a href="https://tiktok.com/@${username}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 hover:underline transition-colors">@${username}</a>`
  })

  const hashtagRegex = /#([a-zA-Z0-9_]+)/g
  processedText = processedText.replace(hashtagRegex, (match, hashtag) => {
    return `<a href="https://tiktok.com/tag/${hashtag}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 hover:underline transition-colors">#${hashtag}</a>`
  })
  
  return processedText
}

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
    imageUrls?: string[]
  }
  onDownloadVideo: () => void
  onDownloadAudio: () => void
}

export function VideoPreview({ result, onDownloadVideo, onDownloadAudio }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const isVideo = result.type === "video"
  const mediaUrl = isVideo ? result.videoUrl : result.imageUrls?.[0]

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
                Video by <span className="font-medium text-blue-600">@{result.creator}</span>
              </p>
            )}
            <div className="flex items-center justify-center gap-3">
              <Badge variant="secondary" className="px-3 py-1">
                {isVideo ? "🎥 Video" : "🖼️ Image"}
              </Badge>
              <span className="text-sm text-muted-foreground">{result.date}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Video/Image Preview */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            {isVideo && mediaUrl ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  className="w-full h-auto max-h-96 object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  muted={isMuted}
                  loop
                />
                
                {/* Video Controls Overlay */}
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

                {/* Video Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <div className="flex-1 bg-white/20 rounded-full h-1">
                      <div 
                        className="bg-white rounded-full h-1 transition-all duration-300"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                      />
                    </div>
                    <span>{formatTime(duration)}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={handleMuteToggle}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {result.imageUrls && result.imageUrls.length > 0 ? (
                  <img 
                    src={result.imageUrls[0]} 
                    alt="TikTok Image" 
                    className="max-h-96 object-contain"
                  />
                ) : (
                  <div className="text-gray-500">No preview available</div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Caption</h3>
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
          </div>

          {/* Download Buttons */}
          <div className="space-y-3">
            {isVideo && result.videos && result.videos.length > 0 ? (
              <div className="space-y-2">
                {/* Primary video - MP4 [1] */}
                <Button
                  size="lg"
                  onClick={() => window.open(result.videos![0], '_blank')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-4"
                >
                  <Download className="mr-2 h-5 w-5" />
                  UNDUH MP4 [1]
                </Button>
                
                {/* HD video from snapcdn.app (if available) */}
                {result.videoHdUrl && (
                  <Button
                    size="lg"
                    onClick={() => window.open(result.videoHdUrl!, '_blank')}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white font-semibold py-4"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    UNDUH MP4 [2]
                  </Button>
                )}
                
                {/* Secondary video - MP4 [2] (if available) */}
                {result.videos!.length > 1 && (
                  <Button
                    size="lg"
                    onClick={() => window.open(result.videos![1], '_blank')}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold py-4"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    UNDUH MP4 HD
                  </Button>
                )}
              </div>
            ) : isVideo ? (
              <Button
                size="lg"
                onClick={onDownloadVideo}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-4"
              >
                <Download className="mr-2 h-5 w-5" />
                UNDUH MP4
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={onDownloadVideo}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-4"
              >
                <Download className="mr-2 h-5 w-5" />
                UNDUH GAMBAR
              </Button>
            )}
            
            {result.audioUrl && (
              <Button
                size="lg"
                onClick={onDownloadAudio}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-4"
              >
                <Music className="mr-2 h-5 w-5" />
                UNDUH MP3
              </Button>
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
            {result.duration && (
              <div>Duration: {result.duration}</div>
            )}
            {result.size && (
              <div>Size: {result.size}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
