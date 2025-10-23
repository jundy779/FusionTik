"use client"

import { useState, useEffect } from "react"
import { useDownloadStats } from "./use-download-stats"

export interface DownloadHistoryItem {
  /** Unique identifier for each entry. */
  id: number
  /** Original TikTok URL that was downloaded. */
  url: string
  /** Content type: "video" or "image". */
  type: string
  /** ISO date string when the download occurred. */
  date: string
  /** URL to the video file (only for video posts). */
  videoUrl?: string
  /** High definition video URL, if available. */
  videoHdUrl?: string
  /** URL to the audio file (if available). */
  audioUrl?: string
  /** List of image URLs (for photo posts). */
  imageUrls?: string[]
  /** Caption or description of the post. */
  description?: string
  /** TikTok username of the creator. */
  creator?: string
  /** Duration of the video in seconds as a string. */
  duration?: string
}

export function useDownloadHistory() {
  const [history, setHistory] = useState<DownloadHistoryItem[]>([])
  const { updateStats } = useDownloadStats()

  useEffect(() => {
    const savedHistory = localStorage.getItem("tiktok-download-history")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(parsedHistory)
        updateStats(parsedHistory)
      } catch (error) {
        console.error("Failed to parse download history:", error)
        localStorage.removeItem("tiktok-download-history")
      }
    }
  }, [])

  const addToHistory = (item: DownloadHistoryItem) => {
    const exists = history.some((historyItem) => historyItem.url === item.url)

    if (!exists) {
      const newHistory = [item, ...history]
      setHistory(newHistory)
      localStorage.setItem("tiktok-download-history", JSON.stringify(newHistory))
      updateStats(newHistory)
    }
  }

  const removeFromHistory = (id: number) => {
    const newHistory = history.filter((item) => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem("tiktok-download-history", JSON.stringify(newHistory))
    updateStats(newHistory)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("tiktok-download-history")
    updateStats([])
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}
