import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// ============== Types ==============

interface TikTokAuthor {
  username?: string
  nickname?: string
  unique_id?: string
}

interface ZellResult {
  title?: string
  author?: TikTokAuthor
  thumbnail?: string
  video?: string
  music?: {
    url?: string
    duration?: number
  }
  images?: unknown[]
}

interface ZellResponse {
  status: boolean
  result?: ZellResult
}

interface SankaResult {
  title?: string
  author?: TikTokAuthor
  cover?: string
  play?: string
  music?: string
  music_info?: {
    play?: string
    duration?: number
  }
  images?: unknown[]
  duration?: number
}

interface SankaResponse {
  status: boolean
  result?: SankaResult
}

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
    play?: string
    wmplay?: string
    music?: string
    duration?: number
    images?: unknown[]
  }
}

interface TikTokData {
  title: string
  creator: string
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

// ============== Regex ==============

const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vt\.tiktok\.com|m\.tiktok\.com)\//

// ============== Provider: Zell ==============

async function fetchFromZell(url: string): Promise<TikTokData> {
  const baseUrl = process.env.ZELL_TIKTOK_API_URL || "https://apizell.web.id/download/tiktok"
  const apiUrl = `${baseUrl}?url=${encodeURIComponent(url)}`

  const res = await fetch(apiUrl)

  if (!res.ok) {
    throw new Error(`Zell API returned ${res.status}: ${res.statusText}`)
  }

  const json = (await res.json()) as ZellResponse

  if (!json || json.status !== true || !json.result) {
    throw new Error("Unexpected response from Zell API")
  }

  const result = json.result

  const title = typeof result.title === "string" ? result.title : ""

  const creator =
    typeof result.author?.username === "string"
      ? result.author.username
      : typeof result.author?.nickname === "string"
        ? result.author.nickname
        : ""

  const thumbnail = typeof result.thumbnail === "string" ? result.thumbnail : ""

  const videos: string[] = []
  if (typeof result.video === "string" && result.video.length > 0) {
    videos.push(result.video)
  }

  const audio = typeof result.music?.url === "string" ? result.music.url : ""

  const slide: string[] = Array.isArray(result.images)
    ? result.images.filter((item): item is string => typeof item === "string")
    : []

  const duration =
    typeof result.music?.duration === "number" ? String(result.music.duration) : ""

  return { title, creator, thumbnail, videos, audio, slide, duration }
}

// ============== Provider: Sanka ==============

async function fetchFromSanka(url: string): Promise<TikTokData> {
  const baseUrl =
    process.env.SANKA_TIKTOK_API_URL ||
    "https://www.sankavollerei.com/download/tiktok"
  const apiKey =
    process.env.SANKA_TIKTOK_API_KEY ||
    process.env.SANKA_API_KEY ||
    "planaai"

  const apiUrl = `${baseUrl}?apikey=${encodeURIComponent(apiKey)}&url=${encodeURIComponent(url)}`

  const res = await fetch(apiUrl)

  if (!res.ok) {
    throw new Error(`Sanka API returned ${res.status}: ${res.statusText}`)
  }

  const json = (await res.json()) as SankaResponse

  if (!json || json.status !== true || !json.result) {
    throw new Error("Unexpected response from Sanka API")
  }

  const result = json.result

  const title = typeof result.title === "string" ? result.title : ""

  const creator =
    typeof result.author?.unique_id === "string"
      ? result.author.unique_id
      : typeof result.author?.nickname === "string"
        ? result.author.nickname
        : ""

  const thumbnail = typeof result.cover === "string" ? result.cover : ""

  const videos: string[] = []
  if (typeof result.play === "string" && result.play.length > 0) {
    videos.push(result.play)
  }

  const audio =
    typeof result.music === "string" && result.music.length > 0
      ? result.music
      : typeof result.music_info?.play === "string"
        ? result.music_info.play
        : ""

  const slide: string[] = Array.isArray(result.images)
    ? result.images.filter((item): item is string => typeof item === "string")
    : []

  const duration =
    typeof result.duration === "number" && result.duration > 0
      ? String(result.duration)
      : typeof result.music_info?.duration === "number"
        ? String(result.music_info.duration)
        : ""

  return { title, creator, thumbnail, videos, audio, slide, duration }
}

// ============== Provider: TikWM ==============

async function fetchFromTikWM(url: string): Promise<TikTokData> {
  const baseUrl = process.env.TIKWM_API_URL || "https://tikwm.com/api/"

  const body = new URLSearchParams()
  body.set("url", url)
  body.set("hd", "1")

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Cookie: "current_language=en",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
    },
    body: body.toString(),
  })

  if (!res.ok) {
    throw new Error(`TikWM API returned ${res.status}: ${res.statusText}`)
  }

  const json = (await res.json()) as TikWMData

  if (!json || json.code !== 0 || !json.data) {
    throw new Error(`Unexpected response from TikWM API: ${json.msg ?? "unknown error"}`)
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
  // Prefer no-watermark (play), fallback to watermark (wmplay)
  if (typeof data.play === "string" && data.play.length > 0) {
    videos.push(data.play)
  } else if (typeof data.wmplay === "string" && data.wmplay.length > 0) {
    videos.push(data.wmplay)
  }

  const audio = typeof data.music === "string" ? data.music : ""

  const slide: string[] = Array.isArray(data.images)
    ? data.images.filter((item): item is string => typeof item === "string")
    : []

  const duration = typeof data.duration === "number" ? String(data.duration) : ""

  return { title, creator, thumbnail, videos, audio, slide, duration }
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
      `⚠️ FusionTik downloader error\n` +
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

// ============== Core TikTok Fetch (with fallback) ==============

async function fetchTikTok(url: string): Promise<TikTokData> {
  if (!tiktokRegex.test(url)) {
    throw new Error("Invalid URL")
  }

  let firstError: unknown

  try {
    return await fetchFromZell(url)
  } catch (err) {
    firstError = err
  }

  try {
    return await fetchFromSanka(url)
  } catch {
    // Sanka failed — try TikWM as Provider 3
  }

  try {
    return await fetchFromTikWM(url)
  } catch {
    if (firstError instanceof Error) throw firstError
    throw new Error("All providers failed")
  }
}

// ============== Route Handler ==============

export async function POST(req: Request) {
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
  }

  if (!isPhoto) {
    response.videos = videos
    response.video = videos[0]
    response.videoHd = videos[0]
  }

  if (audioUrl) response.music = audioUrl
  if (duration) response.duration = duration

  return NextResponse.json(response)
}
