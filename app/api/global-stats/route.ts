import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { guardApiRequest } from "@/shared/lib/api-guard"
import {
  isMongoConfigured,
  readStatsFromMongo,
  incrementStatsInMongo,
} from "@/shared/lib/mongoClient"

interface Stats {
  totalDownloads: number
}

const STATS_FILE = path.join(process.cwd(), "data", "global-stats.json")

async function ensureDataDirectory(): Promise<void> {
  const dataDir = path.dirname(STATS_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readStatsFromFile(): Promise<Stats> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(STATS_FILE, "utf8")
    return JSON.parse(data) as Stats
  } catch {
    return { totalDownloads: 0 }
  }
}

async function writeStatsToFile(stats: Stats): Promise<void> {
  try {
    await ensureDataDirectory()
    await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2))
  } catch (error) {
    console.error("Error writing stats file:", error)
  }
}

export async function GET(req: Request) {
  const guardError = await guardApiRequest(req, "global-stats-get")
  if (guardError) return guardError

  try {
    if (isMongoConfigured()) {
      try {
        const stats = await readStatsFromMongo()
        return NextResponse.json({
          totalDownloads: stats.totalDownloads,
          source: "mongodb",
        })
      } catch (mongoError) {
        console.error("MongoDB read error, falling back to file:", mongoError)
      }
    }

    const stats = await readStatsFromFile()
    return NextResponse.json({ totalDownloads: stats.totalDownloads, source: "file" })
  } catch (error) {
    console.error("Error reading global stats:", error)
    return NextResponse.json({ totalDownloads: 0, source: "error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const guardError = await guardApiRequest(req, "global-stats-post")
  if (guardError) return guardError

  try {
    if (isMongoConfigured()) {
      try {
        const stats = await incrementStatsInMongo()
        return NextResponse.json({
          totalDownloads: stats.totalDownloads,
          message: "Global counter updated (MongoDB)",
        })
      } catch (mongoError) {
        console.error("MongoDB increment error, falling back to file:", mongoError)
      }
    }

    const stats = await readStatsFromFile()
    stats.totalDownloads++
    await writeStatsToFile(stats)
    return NextResponse.json({
      totalDownloads: stats.totalDownloads,
      message: "Global counter updated (file)",
    })
  } catch (error) {
    console.error("Error incrementing global stats:", error)
    return NextResponse.json({ totalDownloads: 0 }, { status: 500 })
  }
}
