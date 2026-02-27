"use client"

import { useState, useEffect } from "react"

export interface GlobalStats {
  totalDownloads: number
}

const DEFAULT_STATS: GlobalStats = { totalDownloads: 0 }

export function useGlobalStats() {
  const [globalStats, setGlobalStats] = useState<GlobalStats>(DEFAULT_STATS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const response = await fetch("/api/global-stats")
        if (!response.ok) {
          throw new Error(`Failed to fetch global stats: ${response.status}`)
        }
        const data = (await response.json()) as GlobalStats
        setGlobalStats(data)
      } catch (error) {
        console.error("Failed to fetch global stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGlobalStats()
  }, [])

  const incrementGlobalCounter = async (): Promise<void> => {
    try {
      const response = await fetch("/api/global-stats", { method: "POST" })
      if (!response.ok) {
        throw new Error(`Failed to increment global counter: ${response.status}`)
      }
      const data = (await response.json()) as GlobalStats
      setGlobalStats(data)
    } catch (error) {
      console.error("Failed to increment global counter:", error)
    }
  }

  return {
    globalStats,
    isLoading,
    incrementGlobalCounter,
  }
}
