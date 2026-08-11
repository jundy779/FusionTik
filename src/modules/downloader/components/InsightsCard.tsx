"use client"

import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts"
import { Eye, Heart, MessageCircle, Share2, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { DownloadInsights } from "@/modules/downloader/hooks/useDownloadInsights"

interface InsightsCardProps {
  insights: DownloadInsights
}

const contentTypeConfig: ChartConfig = {
  count: { label: "Downloads" },
  Video: { label: "Video", color: "hsl(var(--chart-1))" },
  Image: { label: "Image", color: "hsl(var(--chart-2))" },
}

const rankingConfig: ChartConfig = {
  count: { label: "Downloads", color: "hsl(var(--chart-1))" },
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
}

export function InsightsCard({ insights }: InsightsCardProps) {
  if (!insights.hasData) {
    return (
      <Card className="glass-card">
        <CardContent className="py-12 text-center text-muted-foreground">
          <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p>Download something first to see your personal insights here.</p>
        </CardContent>
      </Card>
    )
  }

  const { contentTypeBreakdown, topCreators, topRegions, totalEngagement, itemsWithEngagement } =
    insights

  const pieData = contentTypeBreakdown
    .filter((entry) => entry.count > 0)
    .map((entry) => ({ name: entry.type, count: entry.count, fill: `var(--color-${entry.type})` }))

  const engagementStats = [
    { label: "Views", value: totalEngagement.views, icon: Eye },
    { label: "Likes", value: totalEngagement.likes, icon: Heart },
    { label: "Comments", value: totalEngagement.comments, icon: MessageCircle },
    { label: "Shares", value: totalEngagement.shares, icon: Share2 },
  ]

  return (
    <div className="space-y-6">
      {/* Engagement totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {engagementStats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="stats-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCompactNumber(value)}</div>
              <p className="text-xs text-muted-foreground">
                Across {itemsWithEngagement} tracked post{itemsWithEngagement === 1 ? "" : "s"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Content type breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Content Mix</CardTitle>
            <CardDescription>Video vs. image downloads</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ChartContainer config={contentTypeConfig} className="mx-auto aspect-square max-h-[250px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                  <Pie data={pieData} dataKey="count" nameKey="name" innerRadius={50}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No content yet</p>
            )}
          </CardContent>
        </Card>

        {/* Top creators */}
        <Card>
          <CardHeader>
            <CardTitle>Top Creators</CardTitle>
            <CardDescription>Who you download from the most</CardDescription>
          </CardHeader>
          <CardContent>
            {topCreators.length > 0 ? (
              <ChartContainer config={rankingConfig} className="max-h-[250px] w-full">
                <BarChart data={topCreators} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" hide />
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Not enough creator data yet
              </p>
            )}
            {topCreators.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-sm">
                {topCreators.map((entry) => (
                  <li key={entry.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground truncate">@{entry.label}</span>
                    <Badge variant="secondary">{entry.count}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top regions */}
      {topRegions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Regions</CardTitle>
            <CardDescription>Where the content you download comes from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topRegions.map((entry) => (
                <Badge key={entry.label} variant="outline" className="px-3 py-1.5 text-sm">
                  {entry.label}
                  <span className="ml-2 text-muted-foreground">{entry.count}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
