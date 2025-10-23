"use client"

import { motion } from "framer-motion"
import { Download, FileAudio, FileVideo, ImageIcon, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ResultCardProps {
  result: {
    id: number
    url: string
    thumbnail?: string
    type: string
    duration?: string
    size?: string
    date: string
    videoUrl?: string
    audioUrl?: string
    description?: string
    creator?: string
  }
  onDownloadVideo: () => void
  onDownloadAudio: () => void
  onDelete?: () => void
  isHistoryItem?: boolean
}

export function ResultCard({
  result,
  onDownloadVideo,
  onDownloadAudio,
  onDelete,
  isHistoryItem = false,
}: ResultCardProps) {
  const isVideo = result.type === "video"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <CardContent className="flex-grow p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="px-2 py-1">
                {isVideo ? (
                  <>
                    <FileVideo className="h-3 w-3 mr-1" /> Video
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-3 w-3 mr-1" /> Image
                  </>
                )}
              </Badge>
              <span className="text-xs text-muted-foreground">{result.date}</span>
            </div>

            <h3 className="font-medium line-clamp-1 mt-1">
              {result.creator ? `@${result.creator}` : "TikTok Content"}
            </h3>

            {result.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{result.description}</p>
            )}

            {result.duration && <div className="text-xs text-muted-foreground mt-1">Duration: {result.duration}</div>}

            <div className="text-xs text-muted-foreground truncate mt-1">{result.url}</div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 gap-2 flex-wrap">
          {isVideo ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onDownloadVideo}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Video
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download video</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onDownloadVideo}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Image
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Only show the audio button if an audio URL is available.  This prevents attempting to download undefined URLs. */}
          {result.audioUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={onDownloadAudio} variant="outline" className="flex-1">
                    <FileAudio className="mr-2 h-4 w-4" />
                    Audio
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download audio</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {isHistoryItem && onDelete && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onDelete}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 flex-none text-red-500 hover:text-red-600 hover:bg-red-100/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete from history</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove from history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
