import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const STATS_FILE = path.join(process.cwd(), "data", "global-stats.json")

async function ensureDataDirectory() {
  const dataDir = path.dirname(STATS_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readStats() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(STATS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return { totalDownloads: 0 }
  }
}

async function writeStats(stats: { totalDownloads: number }) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2))
  } catch (error) {
    console.error("Error writing stats file:", error)
  }
}

export async function GET() {
  try {
    const stats = await readStats()
    return NextResponse.json({ 
      totalDownloads: stats.totalDownloads 
    })
  } catch (error) {
    console.error("Error reading global stats:", error)
    return NextResponse.json({ totalDownloads: 0 }, { status: 500 })
  }
}

export async function POST() {
  try {
    const stats = await readStats()
    stats.totalDownloads++
    await writeStats(stats)
    return NextResponse.json({ 
      totalDownloads: stats.totalDownloads,
      message: "Global counter updated"
    })
  } catch (error) {
    console.error("Error incrementing global stats:", error)
    return NextResponse.json({ totalDownloads: 0 }, { status: 500 })
  }
}
