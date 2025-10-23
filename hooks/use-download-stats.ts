"use client"

import { useState, useEffect, useCallback } from "react"

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

export function useDownloadStats() {
  const [stats, setStats] = useState<DownloadStats>({
    totalDownloads: 0,
    videosDownloaded: 0,
    imagesDownloaded: 0,
    audioExtracted: 0,
    todayDownloads: 0,
    thisWeekDownloads: 0,
    thisMonthDownloads: 0,
    mostActiveDay: "Monday",
    averageDownloadsPerDay: 0,
  })

  useEffect(() => {
    const savedStats = localStorage.getItem("fusiontik-download-stats")
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats))
      } catch (error) {
        console.error("Failed to parse download stats:", error)
        localStorage.removeItem("fusiontik-download-stats")
      }
    }
  }, [])

  const calculateStats = (history: any[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    let videosDownloaded = 0
    let imagesDownloaded = 0
    let audioExtracted = 0
    let todayDownloads = 0
    let thisWeekDownloads = 0
    let thisMonthDownloads = 0
    let lastDownloadDate: string | undefined
    const dayCounts: { [key: string]: number } = {}

    history.forEach((item) => {
      const downloadDate = new Date(item.date)
      
      if (item.type === "video") {
        videosDownloaded++
      } else if (item.type === "image") {
        imagesDownloaded++
      }
      
      if (item.audioUrl) {
        audioExtracted++
      }

      if (downloadDate >= today) {
        todayDownloads++
      }
      if (downloadDate >= weekAgo) {
        thisWeekDownloads++
      }
      if (downloadDate >= monthAgo) {
        thisMonthDownloads++
      }

      const dayName = downloadDate.toLocaleDateString('en-US', { weekday: 'long' })
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1

      if (!lastDownloadDate || downloadDate > new Date(lastDownloadDate)) {
        lastDownloadDate = item.date
      }
    })

    const mostActiveDay = Object.keys(dayCounts).reduce((a, b) => 
      dayCounts[a] > dayCounts[b] ? a : b, "Monday"
    )

    const totalDays = Math.max(1, Math.ceil((now.getTime() - new Date(history[0]?.date || now).getTime()) / (1000 * 60 * 60 * 24)))
    const averageDownloadsPerDay = history.length / totalDays

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
      averageDownloadsPerDay: Math.round(averageDownloadsPerDay * 10) / 10,
    }
  }

  const updateStats = useCallback((history: any[]) => {
    const newStats = calculateStats(history)
    setStats(newStats)
    localStorage.setItem("fusiontik-download-stats", JSON.stringify(newStats))
  }, [])

  const resetStats = useCallback(() => {
    const defaultStats: DownloadStats = {
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
    setStats(defaultStats)
    localStorage.setItem("fusiontik-download-stats", JSON.stringify(defaultStats))
  }, [])

  return {
    stats,
    updateStats,
    resetStats,
  }
}
