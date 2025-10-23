"use client"

import { useState, useEffect } from "react"

export interface GlobalStats {
  totalDownloads: number
}

export function useGlobalStats() {
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalDownloads: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const response = await fetch('/api/global-stats')
        const data = await response.json()
        setGlobalStats(data)
      } catch (error) {
        console.error('Failed to fetch global stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGlobalStats()
  }, [])

  const incrementGlobalCounter = async () => {
    try {
      const response = await fetch('/api/global-stats', {
        method: 'POST'
      })
      const data = await response.json()
      setGlobalStats(data)
    } catch (error) {
      console.error('Failed to increment global counter:', error)
    }
  }

  return {
    globalStats,
    isLoading,
    incrementGlobalCounter
  }
}
