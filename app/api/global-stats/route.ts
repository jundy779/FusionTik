import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

const STATS_FILE = path.join(process.cwd(), "data", "global-stats.json")

// ============== File-based storage (fallback for development) ==============

async function ensureDataDirectory() {
  const dataDir = path.dirname(STATS_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readStatsFromFile() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(STATS_FILE, "utf8")
    return JSON.parse(data)
  } catch {
    return { totalDownloads: 0 }
  }
}

async function writeStatsToFile(stats: { totalDownloads: number }) {
  try {
    await ensureDataDirectory()
    await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2))
  } catch (error) {
    console.error("Error writing stats file:", error)
  }
}

// ============== Supabase storage (production) ==============

async function readStatsFromSupabase() {
  if (!supabase) throw new Error("Supabase not configured")

  const { data, error } = await supabase
    .from('global_stats')
    .select('total_downloads')
    .eq('id', 1)
    .single()

  if (error) throw error
  return { totalDownloads: data?.total_downloads || 0 }
}

async function incrementStatsInSupabase() {
  if (!supabase) throw new Error("Supabase not configured")

  // Use RPC function or direct update
  const { data: current } = await supabase
    .from('global_stats')
    .select('total_downloads')
    .eq('id', 1)
    .single()

  const newTotal = (current?.total_downloads || 0) + 1

  const { data, error } = await supabase
    .from('global_stats')
    .update({ total_downloads: newTotal })
    .eq('id', 1)
    .select('total_downloads')
    .single()

  if (error) throw error
  return { totalDownloads: data?.total_downloads || newTotal }
}

// ============== API Handlers ==============

export async function GET() {
  try {
    // Try Supabase first (production), fallback to file (development)
    if (isSupabaseConfigured()) {
      try {
        const stats = await readStatsFromSupabase()
        return NextResponse.json({
          totalDownloads: stats.totalDownloads,
          source: 'supabase'
        })
      } catch (supabaseError) {
        console.error("Supabase read error, falling back to file:", supabaseError)
      }
    }

    // Fallback to file-based storage
    const stats = await readStatsFromFile()
    return NextResponse.json({
      totalDownloads: stats.totalDownloads,
      source: 'file'
    })
  } catch (error) {
    console.error("Error reading global stats:", error)
    return NextResponse.json({ totalDownloads: 0, source: 'error' }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Try Supabase first (production), fallback to file (development)
    if (isSupabaseConfigured()) {
      try {
        const stats = await incrementStatsInSupabase()
        return NextResponse.json({
          totalDownloads: stats.totalDownloads,
          message: "Global counter updated (Supabase)"
        })
      } catch (supabaseError) {
        console.error("Supabase increment error, falling back to file:", supabaseError)
      }
    }

    // Fallback to file-based storage
    const stats = await readStatsFromFile()
    stats.totalDownloads++
    await writeStatsToFile(stats)
    return NextResponse.json({
      totalDownloads: stats.totalDownloads,
      message: "Global counter updated (file)"
    })
  } catch (error) {
    console.error("Error incrementing global stats:", error)
    return NextResponse.json({ totalDownloads: 0 }, { status: 500 })
  }
}
