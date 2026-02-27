"use client"

import { useState, useEffect, useCallback, useMemo } from "react"

const STORAGE_KEY = "fusiontik-download-stats"

export interface DownloadStats {
  totalDownloads: number
  videosDownloaded: number
  imagesDownloaded: number
  audioExtracted: number
  todayDownloads: number
  thisWeekDownloads: number
  thisMonthDownloads: number
  lastDownloadDate?: string
  mostActiveDay: string
  averageDownloadsPerDay: number
}

const DEFAULT_STATS: DownloadStats = {
  totalDownloads: 0,
  videosDownloaded: 0,
  imagesDownloaded: 0,
  audioExtracted: 0,
  todayDownloads: 0,
  thisWeekDownloads: 0,
  thisMonthDownloads: 0,
  mostActiveDay: "Monday",
  averageDownloadsPerDay: 0,
}

interface HistoryItem {
  type?: string
  audioUrl?: string
  /** ISO date string or locale date string */
  date?: string
}

function calculateStats(history: HistoryItem[]): DownloadStats {
  if (history.length === 0) return { ...DEFAULT_STATS }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000)

  let videosDownloaded = 0
  let imagesDownloaded = 0
  let audioExtracted = 0
  let todayDownloads = 0
  let thisWeekDownloads = 0
  let thisMonthDownloads = 0
  let lastDownloadDate: string | undefined
  const dayCounts: Record<string, number> = {}

  for (const item of history) {
    // Safely parse the date — fall back to epoch if invalid
    const downloadDate = item.date ? new Date(item.date) : new Date(0)
    const isValidDate = !isNaN(downloadDate.getTime())

    if (item.type === "video") {
      videosDownloaded++
    } else if (item.type === "image") {
      imagesDownloaded++
    }

    if (item.audioUrl) {
      audioExtracted++
    }

    if (isValidDate) {
      if (downloadDate >= todayStart) todayDownloads++
      if (downloadDate >= weekAgo) thisWeekDownloads++
      if (downloadDate >= monthAgo) thisMonthDownloads++

      const dayName = downloadDate.toLocaleDateString("en-US", { weekday: "long" })
      dayCounts[dayName] = (dayCounts[dayName] ?? 0) + 1

      if (!lastDownloadDate || downloadDate > new Date(lastDownloadDate)) {
        lastDownloadDate = item.date
      }
    }
  }

  const mostActiveDay =
    Object.keys(dayCounts).length > 0
      ? Object.keys(dayCounts).reduce((a, b) => (dayCounts[a] > dayCounts[b] ? a : b))
      : "Monday"

  const firstItemDate = history[0]?.date ? new Date(history[0].date) : now
  const totalDays = Math.max(
    1,
    Math.ceil((now.getTime() - firstItemDate.getTime()) / (1000 * 60 * 60 * 24)),
  )
  const averageDownloadsPerDay = Math.round((history.length / totalDays) * 10) / 10

  return {
    totalDownloads: history.length,
    videosDownloaded,
    imagesDownloaded,
    audioExtracted,
    todayDownloads,
    thisWeekDownloads,
    thisMonthDownloads,
    lastDownloadDate,
    mostActiveDay,
    averageDownloadsPerDay,
  }
}

export function useDownloadStats() {
  const [stats, setStats] = useState<DownloadStats>(DEFAULT_STATS)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      setStats(JSON.parse(saved) as DownloadStats)
    } catch (error) {
      console.error("Failed to parse download stats:", error)
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const updateStats = useCallback((history: HistoryItem[]) => {
    const newStats = calculateStats(history)
    setStats(newStats)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats))
  }, [])

  const resetStats = useCallback(() => {
    setStats({ ...DEFAULT_STATS })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATS))
  }, [])

  return {
    stats,
    updateStats,
    resetStats,
  }
}
