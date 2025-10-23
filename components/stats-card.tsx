"use client"

import { motion } from "framer-motion"
import { 
  Download, 
  Video, 
  Image, 
  Music, 
  Calendar, 
  TrendingUp, 
  Clock,
  BarChart3,
  Trash2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDownloadStats, type DownloadStats } from "@/hooks/use-download-stats"

interface StatsCardProps {
  onResetStats?: () => void
}

export function StatsCard({ onResetStats }: StatsCardProps) {
  const { stats } = useDownloadStats()

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getActivityLevel = (downloads: number) => {
    if (downloads === 0) return { level: "Inactive", color: "bg-gray-500" }
    if (downloads < 5) return { level: "Light", color: "bg-green-500" }
    if (downloads < 15) return { level: "Active", color: "bg-blue-500" }
    if (downloads < 30) return { level: "Heavy", color: "bg-orange-500" }
    return { level: "Power User", color: "bg-red-500" }
  }

  const activityLevel = getActivityLevel(stats.totalDownloads)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Personal Stats</h2>
          <p className="text-muted-foreground">Track your personal FusionTik activity</p>
        </div>
        <Badge className={`${activityLevel.color} text-white`}>
          {activityLevel.level}
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Downloads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
            <p className="text-xs text-muted-foreground">
              Your personal downloads
            </p>
          </CardContent>
        </Card>

        {/* Videos Downloaded */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.videosDownloaded}</div>
            <p className="text-xs text-muted-foreground">
              MP4 files downloaded
            </p>
          </CardContent>
        </Card>

        {/* Images Downloaded */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.imagesDownloaded}</div>
            <p className="text-xs text-muted-foreground">
              Photo collections
            </p>
          </CardContent>
        </Card>

        {/* Audio Extracted */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audio</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.audioExtracted}</div>
            <p className="text-xs text-muted-foreground">
              MP3 files extracted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayDownloads}</div>
            <p className="text-xs text-muted-foreground">
              Downloads today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeekDownloads}</div>
            <p className="text-xs text-muted-foreground">
              Downloads this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthDownloads}</div>
            <p className="text-xs text-muted-foreground">
              Downloads this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Activity Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Most active day:</span>
              <Badge variant="outline">{stats.mostActiveDay}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg per day:</span>
              <span className="text-sm font-medium">{stats.averageDownloadsPerDay}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last download:</span>
              <span className="text-sm font-medium">{formatDate(stats.lastDownloadDate)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.reload()}
            >
              <Clock className="mr-2 h-4 w-4" />
              Refresh Stats
            </Button>
            {onResetStats && (
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={onResetStats}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reset Personal Stats
            </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
