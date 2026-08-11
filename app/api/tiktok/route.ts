import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { guardApiRequest } from "@/shared/lib/api-guard"

// Extend serverless execution limit on Vercel
export const maxDuration = 60

// ============== Types ==============

interface TikWMData {
  code: number
  msg?: string
  data?: {
    title?: string
    author?: {
      nickname?: string
      unique_id?: string
    }
    cover?: string
    origin_cover?: string
    /** No-watermark video (standard quality) */
    play?: string
    /** No-watermark video (HD quality) */
    hdplay?: string
    /** Video with watermark */
    wmplay?: string
    music?: string
    duration?: number
    images?: unknown[]
  }
}

interface TikTokData {
  title: string
  creator: string
  creatorName?: string
  creatorUsername?: string
  postUrl?: string
  postedAt?: string
  region?: string
  regionLabel?: string
  views?: number
  likes?: number
  comments?: number
  shares?: number
  favorites?: number
  thumbnail: string
  videos: string[]
  audio: string
  slide: string[]
  duration: string
}

interface AlertPayload {
  source: string
  event: string
  url: string
  error: string
  timestamp: string
}

// ============== Regex & Helpers ==============

const tiktokRegex =
  /^(https?:\/\/)?(www\.|vm\.|vt\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\//

const REGION_LABELS: Record<string, string> = {
  ID: "Indonesia",
  US: "United States",
  GB: "United Kingdom",
  MY: "Malaysia",
  SG: "Singapore",
  PH: "Philippines",
  TH: "Thailand",
  VN: "Vietnam",
  JP: "Japan",
  KR: "South Korea",
}

function formatRegionLabel(region?: string): string | undefined {
  if (!region) return undefined
  const code = region.trim().toUpperCase()
  return REGION_LABELS[code] ?? region
}

function appendPostMeta(response: Record<string, unknown>, result: TikTokData): void {
  if (result.creatorName) response.creatorName = result.creatorName
  if (result.creatorUsername) response.creatorUsername = result.creatorUsername
  if (result.postUrl) response.postUrl = result.postUrl
  if (result.postedAt) response.postedAt = result.postedAt
  if (result.region) response.region = result.region
  if (result.regionLabel) response.regionLabel = result.regionLabel
  if (typeof result.views === "number") response.views = result.views
  if (typeof result.likes === "number") response.likes = result.likes
  if (typeof result.comments === "number") response.comments = result.comments
  if (typeof result.shares === "number") response.shares = result.shares
  if (typeof result.favorites === "number") response.favorites = result.favorites
}

// ============== Provider: TikWM ==============

async function fetchFromTikWM(url: string): Promise<TikTokData> {
  const endpoints = [
    process.env.TIKWM_API_URL || "https://tikwm.com/api/",
    "https://www.tikwm.com/api/",
  ]

  const body = new URLSearchParams()
  body.set("url", url)
  body.set("hd", "1")

  let lastError: Error | null = null

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: "current_language=en",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
        body: body.toString(),
        signal: AbortSignal.timeout(12000),
      })

      if (!res.ok) {
        lastError = new Error(`TikWM API (${endpoint}) returned ${res.status}: ${res.statusText}`)
        continue
      }

      const json = (await res.json()) as TikWMData

      if (!json || json.code !== 0 || !json.data) {
        lastError = new Error(`TikWM API error: ${json?.msg ?? "unknown error"}`)
        continue
      }

      const data = json.data

      const title = typeof data.title === "string" ? data.title : ""

      const creator =
        typeof data.author?.unique_id === "string"
          ? data.author.unique_id
          : typeof data.author?.nickname === "string"
            ? data.author.nickname
            : ""

      const thumbnail =
        typeof data.origin_cover === "string" && data.origin_cover.length > 0
          ? data.origin_cover
          : typeof data.cover === "string"
            ? data.cover
            : ""

      const videos: string[] = []
      if (typeof data.hdplay === "string" && data.hdplay.length > 0) {
        videos.push(data.hdplay)
      }
      if (typeof data.play === "string" && data.play.length > 0 && data.play !== data.hdplay) {
        videos.push(data.play)
      }
      if (videos.length === 0 && typeof data.wmplay === "string" && data.wmplay.length > 0) {
        videos.push(data.wmplay)
      }

      const audio = typeof data.music === "string" ? data.music : ""

      const slide: string[] = Array.isArray(data.images)
        ? data.images.filter((item): item is string => typeof item === "string")
        : []

      const duration = typeof data.duration === "number" ? String(data.duration) : ""

      return { title, creator, thumbnail, videos, audio, slide, duration }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }

  throw lastError ?? new Error("Gagal mengambil data dari TikTok API")
}

// ============== Alert / Notification ==============

async function notifyProviderFailure(url: string, error: string): Promise<void> {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const alertEmailTo = process.env.ALERT_EMAIL_TO

  const hasWebhook = !!webhookUrl
  const hasTelegram = !!(telegramToken && telegramChatId)
  const hasEmail = !!(smtpHost && smtpPort && smtpUser && smtpPass && alertEmailTo)

  if (!hasWebhook && !hasTelegram && !hasEmail) return

  const payload: AlertPayload = {
    source: "fusiontik",
    event: "tiktok_downloader_error",
    url,
    error,
    timestamp: new Date().toISOString(),
  }

  const tasks: Promise<unknown>[] = []

  if (hasWebhook) {
    tasks.push(
      fetch(webhookUrl!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    )
  }

  if (hasTelegram) {
    const text =
      `[WARNING] FusionTik downloader error\n` +
      `URL: ${url}\n` +
      `Error: ${error}\n` +
      `Time: ${payload.timestamp}`

    tasks.push(
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: telegramChatId, text }),
      }),
    )
  }

  if (hasEmail) {
    tasks.push(
      (async () => {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(smtpPort),
          secure: Number(smtpPort) === 465,
          auth: { user: smtpUser, pass: smtpPass },
        })

        await transporter.sendMail({
          from: `"FusionTik Alert" <${smtpUser}>`,
          to: alertEmailTo,
          subject: "FusionTik TikTok downloader error",
          text:
            `FusionTik downloader error\n\n` +
            `URL: ${url}\n` +
            `Error: ${error}\n` +
            `Time: ${payload.timestamp}\n`,
        })
      })(),
    )
  }

  try {
    await Promise.allSettled(tasks)
  } catch {
    // Intentionally swallow — alert failures must not affect the main response
  }
}

// ============== Core TikTok Fetch ==============

async function fetchTikTok(url: string): Promise<TikTokData> {
  if (!tiktokRegex.test(url)) {
    throw new Error("Invalid URL")
  }

  return await fetchFromTikWM(url)
}

// ============== Route Handler ==============

export async function POST(req: Request) {
  const guardError = await guardApiRequest(req, "tiktok")
  if (guardError) return guardError

  let url: string

  try {
    const body = (await req.json()) as { url?: unknown }
    if (!body.url || typeof body.url !== "string") {
      return NextResponse.json({ error: "Invalid TikTok URL" }, { status: 400 })
    }
    url = body.url
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  let result: TikTokData

  try {
    result = await fetchTikTok(url)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await notifyProviderFailure(url, message)
    return NextResponse.json(
      {
        error:
          "Downloader sedang mengalami gangguan. Silakan coba lagi beberapa saat, atau hubungi admin jika masalah berlanjut.",
      },
      { status: 500 },
    )
  }

  const images = Array.isArray(result.slide) ? result.slide : []
  const isPhoto = images.length > 0
  const videos = Array.isArray(result.videos) ? result.videos : []
  const audioUrl = result.audio.length > 0 ? result.audio : undefined
  const description = result.title
  const creator = result.creator
  const duration = result.duration

  if (!isPhoto && videos.length === 0) {
    return NextResponse.json(
      { error: "No video URLs found in the TikTok response" },
      { status: 500 },
    )
  }

  const response: Record<string, unknown> = {
    type: isPhoto ? "image" : "video",
    images,
    description,
    creator,
    thumbnail: result.thumbnail || undefined,
  }

  if (!isPhoto) {
    response.videos = videos
    response.video = videos[0]
    response.videoHd = videos[0]
  }

  if (audioUrl) response.music = audioUrl
  if (duration) response.duration = duration
  appendPostMeta(response, result)

  return NextResponse.json(response)
}
