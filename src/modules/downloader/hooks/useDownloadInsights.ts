"use client"

import { useMemo } from "react"
import type { DownloadHistoryItem } from "./useDownloadHistory"

export interface RankedEntry {
  /** Display label (creator handle or region name). */
  label: string
  /** Number of downloads attributed to this label. */
  count: number
}

export interface EngagementTotals {
  views: number
  likes: number
  comments: number
  shares: number
}

export interface DownloadInsights {
  /** Content type breakdown for chart rendering. */
  contentTypeBreakdown: { type: "Video" | "Image"; count: number }[]
  /** Top creators ranked by number of downloaded posts. */
  topCreators: RankedEntry[]
  /** Top regions ranked by number of downloaded posts. */
  topRegions: RankedEntry[]
  /** Sum of engagement metrics across all history items that reported them. */
  totalEngagement: EngagementTotals
  /** Number of history items that actually carried engagement metadata. */
  itemsWithEngagement: number
  /** Whether there is enough data to render meaningful insights. */
  hasData: boolean
}

const EMPTY_INSIGHTS: DownloadInsights = {
  contentTypeBreakdown: [
    { type: "Video", count: 0 },
    { type: "Image", count: 0 },
  ],
  topCreators: [],
  topRegions: [],
  totalEngagement: { views: 0, likes: 0, comments: 0, shares: 0 },
  itemsWithEngagement: 0,
  hasData: false,
}

function rankByLabel(counts: Map<string, number>, limit: number): RankedEntry[] {
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

function computeInsights(history: DownloadHistoryItem[]): DownloadInsights {
  if (history.length === 0) return EMPTY_INSIGHTS

  let videoCount = 0
  let imageCount = 0
  const creatorCounts = new Map<string, number>()
  const regionCounts = new Map<string, number>()
  const totalEngagement: EngagementTotals = { views: 0, likes: 0, comments: 0, shares: 0 }
  let itemsWithEngagement = 0

  for (const item of history) {
    if (item.type === "video") videoCount++
    else if (item.type === "image") imageCount++

    const creatorLabel = item.creatorUsername || item.creator || item.creatorName
    if (creatorLabel) {
      creatorCounts.set(creatorLabel, (creatorCounts.get(creatorLabel) ?? 0) + 1)
    }

    if (item.regionLabel) {
      regionCounts.set(item.regionLabel, (regionCounts.get(item.regionLabel) ?? 0) + 1)
    }

    const hasEngagement =
      typeof item.views === "number" ||
      typeof item.likes === "number" ||
      typeof item.comments === "number" ||
      typeof item.shares === "number"

    if (hasEngagement) {
      itemsWithEngagement++
      totalEngagement.views += item.views ?? 0
      totalEngagement.likes += item.likes ?? 0
      totalEngagement.comments += item.comments ?? 0
      totalEngagement.shares += item.shares ?? 0
    }
  }

  return {
    contentTypeBreakdown: [
      { type: "Video", count: videoCount },
      { type: "Image", count: imageCount },
    ],
    topCreators: rankByLabel(creatorCounts, 5),
    topRegions: rankByLabel(regionCounts, 5),
    totalEngagement,
    itemsWithEngagement,
    hasData: true,
  }
}

export function useDownloadInsights(history: DownloadHistoryItem[]): DownloadInsights {
  return useMemo(() => computeInsights(history), [history])
}
