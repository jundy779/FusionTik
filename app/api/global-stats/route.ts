import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

// ============== Types ==============

interface Stats {
  totalDownloads: number
}

// ============== Constants ==============

const STATS_FILE = path.join(process.cwd(), "data", "global-stats.json")

// ============== File-based storage (fallback for development) ==============

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

// ============== Supabase storage (production) ==============

async function readStatsFromSupabase(): Promise<Stats> {
  if (!supabase) throw new Error("Supabase not configured")

  const { data, error } = await supabase
    .from("global_stats")
    .select("total_downloads")
    .eq("id", 1)
    .single()

  if (error) throw error
  return { totalDownloads: data?.total_downloads ?? 0 }
}

/**
 * Atomically increments the global download counter in Supabase using an RPC call.
 * Falls back to a read-then-write if the RPC is not available.
 */
async function incrementStatsInSupabase(): Promise<Stats> {
  if (!supabase) throw new Error("Supabase not configured")

  // Attempt atomic increment via Supabase RPC (requires a DB function named
  // `increment_global_downloads` that returns the new total_downloads value).
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "increment_global_downloads",
  )

  if (!rpcError && typeof rpcData === "number") {
    return { totalDownloads: rpcData }
  }

  // Fallback: read-then-write (non-atomic, acceptable for low-traffic scenarios)
  const { data: current } = await supabase
    .from("global_stats")
    .select("total_downloads")
    .eq("id", 1)
    .single()

  const newTotal = (current?.total_downloads ?? 0) + 1

  const { data, error } = await supabase
    .from("global_stats")
    .update({ total_downloads: newTotal })
    .eq("id", 1)
    .select("total_downloads")
    .single()

  if (error) throw error
  return { totalDownloads: data?.total_downloads ?? newTotal }
}

// ============== API Handlers ==============

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      try {
        const stats = await readStatsFromSupabase()
        return NextResponse.json({ totalDownloads: stats.totalDownloads, source: "supabase" })
      } catch (supabaseError) {
        console.error("Supabase read error, falling back to file:", supabaseError)
      }
    }

    const stats = await readStatsFromFile()
    return NextResponse.json({ totalDownloads: stats.totalDownloads, source: "file" })
  } catch (error) {
    console.error("Error reading global stats:", error)
    return NextResponse.json({ totalDownloads: 0, source: "error" }, { status: 500 })
  }
}

export async function POST() {
  try {
    if (isSupabaseConfigured()) {
      try {
        const stats = await incrementStatsInSupabase()
        return NextResponse.json({
          totalDownloads: stats.totalDownloads,
          message: "Global counter updated (Supabase)",
        })
      } catch (supabaseError) {
        console.error("Supabase increment error, falling back to file:", supabaseError)
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
