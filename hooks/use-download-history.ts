"use client"

import { useState, useEffect, useRef } from "react"
import { useDownloadStats } from "./use-download-stats"

/** Maximum number of history entries kept in localStorage. */
const MAX_HISTORY_SIZE = 100

const STORAGE_KEY = "tiktok-download-history"

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
  /** All available video URLs (for video posts). */
  videos?: string[]
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

  // Keep a stable ref to updateStats to avoid re-running the effect when it changes
  const updateStatsRef = useRef(updateStats)
  useEffect(() => {
    updateStatsRef.current = updateStats
  }, [updateStats])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as DownloadHistoryItem[]
      setHistory(parsed)
      updateStatsRef.current(parsed)
    } catch (error) {
      console.error("Failed to parse download history:", error)
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const addToHistory = (item: DownloadHistoryItem): void => {
    // Skip duplicates (same URL)
    if (history.some((h) => h.url === item.url)) return

    const newHistory = [item, ...history].slice(0, MAX_HISTORY_SIZE)
    setHistory(newHistory)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    updateStatsRef.current(newHistory)
  }

  const removeFromHistory = (id: number): void => {
    const newHistory = history.filter((item) => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    updateStatsRef.current(newHistory)
  }

  const clearHistory = (): void => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
    updateStatsRef.current([])
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}
