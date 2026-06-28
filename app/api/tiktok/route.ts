import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// ============== Types ==============

interface YupraAuthor {
  username?: string
  nickname?: string
  avatar?: string
}

interface YupraMusic {
  url?: string
  duration?: string
  thumbnail?: string
}

interface YupraResult {
  id?: string
  like?: number
  views?: number
  share?: number
  comment?: number
  region?: string
  isVideo?: boolean
  title?: string
  duration?: string
  download?: string | string[]
  author?: YupraAuthor
  music?: YupraMusic
}

interface YupraResponse {
  status?: number
  content?: string
  result?: YupraResult
}

interface TheresavMedia {
  url?: string
  quality?: string
  type?: string
}

interface TheresavAioResult {
  title?: string
  thumbnail?: string
  duration?: number | string
  source?: string
  medias?: TheresavMedia[]
}

interface TheresavSavetikResult {
  type?: string
  title?: string
  thumbnail?: string
  hd?: string | null
  mp4?: string | null
  mp3?: string | null
  images?: string[] | null
}

interface TheresavResponse<T> {
  status?: boolean
  result?: T
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

// ============== Regex ==============

const tiktokRegex =
  /^(https?:\/\/)?(www\.|vm\.|vt\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\//

// Rate limiting cache (In-memory per serverless instance)
const rateLimitCache = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window
  const maxRequests = 10 // Max 10 requests per minute per IP

  const record = rateLimitCache.get(ip)
  if (!record || now > record.resetTime) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count += 1
  return true
}

// Memory cleanup for rate limit cache (prevents memory leak over long-running instances)
setInterval(() => {
  const now = Date.now()
  rateLimitCache.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitCache.delete(key)
    }
  })
}, 60 * 1000)

function parseDurationValue(value: unknown): string {
  if (typeof value === "number" && value > 0) {
    if (value > 1000) return String(Math.round(value / 1000))
    return String(value)
  }
  if (typeof value !== "string") return ""
  const match = value.match(/\d+/)
  return match?.[0] ?? ""
}

function extractCreatorFromSource(source?: string): string {
  if (!source) return ""
  const match = source.match(/@([^/?]+)/)
  return match?.[1] ?? ""
}

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

function cleanTikTokPostUrl(source?: string): string | undefined {
  if (!source) return undefined
  try {
    const parsed = new URL(source)
    return `${parsed.origin}${parsed.pathname}`
  } catch {
    return undefined
  }
}

function parsePostedAtFromSource(source?: string): string | undefined {
  if (!source) return undefined
  const match = source.match(/[?&]timestamp=(\d+)/)
  if (!match) return undefined
  const timestamp = Number(match[1])
  if (!Number.isFinite(timestamp) || timestamp <= 0) return undefined
  return new Date(timestamp * 1000).toISOString()
}

function buildYupraPostUrl(
  username: string,
  postId: string,
  isVideo: boolean,
): string | undefined {
  if (!username || !postId) return undefined
  const path = isVideo ? "video" : "photo"
  return `https://www.tiktok.com/@${username}/${path}/${postId}`
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

async function fetchTheresav<T>(path: string, url: string): Promise<T> {
  const apiKey = process.env.THERESAV_API_KEY?.trim()
  if (!apiKey) {
    throw new Error("Theresav API key not configured")
  }

  const baseUrl = process.env.THERESAV_API_URL || "https://api.theresav.biz.id"
  const apiUrl =
    `${baseUrl}${path}?apikey=${encodeURIComponent(apiKey)}` +
    `&url=${encodeURIComponent(url)}`

  const res = await fetch(apiUrl)

  if (!res.ok) {
    throw new Error(`Theresav API returned ${res.status}: ${res.statusText}`)
  }

  const json = (await res.json()) as TheresavResponse<T>

  if (!json || json.status !== true || !json.result) {
    throw new Error("Unexpected response from Theresav API")
  }

  return json.result
}

function dedupeSlideImages(urls: string[]): string[] {
  const seen = new Set<string>()
  const unique: string[] = []

  for (const url of urls) {
    const match = url.match(/\/([a-f0-9]{32})~/)
    const key = match?.[1] ?? url
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(url)
  }

  return unique
}

// ============== Provider: Yupra ==============

async function fetchFromYupra(url: string): Promise<TikTokData> {
  const baseUrl =
    process.env.YUPRA_TIKTOK_API_URL ||
    "https://api.yupra.my.id/api/downloader/tiktok"
  const apiUrl = `${baseUrl}?url=${encodeURIComponent(url)}`

  const res = await fetch(apiUrl)

  if (!res.ok) {
    throw new Error(`Yupra API returned ${res.status}: ${res.statusText}`)
  }

  const json = (await res.json()) as YupraResponse

  if (!json || json.status !== 200 || !json.result) {
    throw new Error(
      `Unexpected response from Yupra API: ${json?.content ?? "unknown error"}`,
    )
  }

  const result = json.result
  const title = typeof result.title === "string" ? result.title : ""

  const creatorUsername =
    typeof result.author?.username === "string" ? result.author.username : ""
  const creatorName =
    typeof result.author?.nickname === "string" ? result.author.nickname : ""

  const creator = creatorUsername || creatorName
  const postId = typeof result.id === "string" ? result.id : ""
  const postUrl = buildYupraPostUrl(
    creatorUsername,
    postId,
    result.isVideo === true,
  )

  const thumbnail =
    typeof result.author?.avatar === "string" && result.author.avatar.length > 0
      ? result.author.avatar
      : typeof result.music?.thumbnail === "string"
        ? result.music.thumbnail
        : ""

  const videos: string[] = []
  const slide: string[] = []

  if (result.isVideo === true && typeof result.download === "string" && result.download.length > 0) {
    videos.push(result.download)
  } else if (Array.isArray(result.download)) {
    const images = result.download.filter((item): item is string => typeof item === "string")
    slide.push(...dedupeSlideImages(images))
  }

  const audio = typeof result.music?.url === "string" ? result.music.url : ""

  const duration =
    parseDurationValue(result.duration) || parseDurationValue(result.music?.duration)

  return {
    title,
    creator,
    creatorName: creatorName || undefined,
    creatorUsername: creatorUsername || undefined,
    postUrl,
    region: typeof result.region === "string" ? result.region : undefined,
    regionLabel: formatRegionLabel(result.region),
    views: typeof result.views === "number" ? result.views : undefined,
    likes: typeof result.like === "number" ? result.like : undefined,
    comments: typeof result.comment === "number" ? result.comment : undefined,
    shares: typeof result.share === "number" ? result.share : undefined,
    thumbnail,
    videos,
    audio,
    slide,
    duration,
  }
}

// ============== Provider: Theresav AIO ==============

async function fetchFromTheresavAio(url: string): Promise<TikTokData> {
  const result = await fetchTheresav<TheresavAioResult>("/download/aio", url)

  const title = typeof result.title === "string" ? result.title : ""
  const creatorUsername = extractCreatorFromSource(result.source)
  const thumbnail = typeof result.thumbnail === "string" ? result.thumbnail : ""

  const medias = Array.isArray(result.medias) ? result.medias : []
  const videos: string[] = []
  const slide: string[] = []
  let audio = ""

  const hdVideo = medias.find(
    (media) =>
      media.type === "video" &&
      typeof media.url === "string" &&
      media.quality === "hd_no_watermark",
  )
  const noWatermarkVideo = medias.find(
    (media) =>
      media.type === "video" &&
      typeof media.url === "string" &&
      media.quality !== "watermark",
  )
  const anyVideo = medias.find(
    (media) => media.type === "video" && typeof media.url === "string",
  )

  const videoUrl = hdVideo?.url || noWatermarkVideo?.url || anyVideo?.url
  if (videoUrl) videos.push(videoUrl)

  const imageUrls = medias
    .filter((media) => media.type === "image" && typeof media.url === "string")
    .map((media) => media.url as string)
  slide.push(...dedupeSlideImages(imageUrls))

  const audioMedia = medias.find(
    (media) => media.type === "audio" && typeof media.url === "string",
  )
  if (audioMedia?.url) audio = audioMedia.url

  const duration = parseDurationValue(result.duration)
  const postUrl = cleanTikTokPostUrl(result.source)
  const postedAt = parsePostedAtFromSource(result.source)

  return {
    title,
    creator: creatorUsername,
    creatorUsername: creatorUsername || undefined,
    postUrl,
    postedAt,
    thumbnail,
    videos,
    audio,
    slide,
    duration,
  }
}

// ============== Provider: Theresav Savetik ==============

async function fetchFromTheresavSavetik(url: string): Promise<TikTokData> {
  const result = await fetchTheresav<TheresavSavetikResult>("/download/savetik", url)

  const title = typeof result.title === "string" ? result.title : ""
  const thumbnail = typeof result.thumbnail === "string" ? result.thumbnail : ""

  const videos: string[] = []
  if (typeof result.hd === "string" && result.hd.length > 0) {
    videos.push(result.hd)
  } else if (typeof result.mp4 === "string" && result.mp4.length > 0) {
    videos.push(result.mp4)
  }

  const slide: string[] = Array.isArray(result.images)
    ? result.images.filter((item): item is string => typeof item === "string")
    : []

  const audio = typeof result.mp3 === "string" ? result.mp3 : ""
  const duration = ""

  return { title, creator: "", thumbnail, videos, audio, slide, duration }
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
  // Priority: hdplay (HD no-watermark) → play (SD no-watermark) → wmplay (watermark)
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

// ============== Core TikTok Fetch (with fallback) ==============

async function fetchTikTok(url: string): Promise<TikTokData> {
  if (!tiktokRegex.test(url)) {
    throw new Error("Invalid URL")
  }

  let firstError: unknown

  try {
    return await fetchFromYupra(url)
  } catch (err) {
    firstError = err
  }

  try {
    return await fetchFromTheresavAio(url)
  } catch {
    // Theresav AIO failed — try Savetik
  }

  try {
    return await fetchFromTheresavSavetik(url)
  } catch {
    // Savetik failed — try TikWM
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
  // 1. Check Origin (Anti-CSRF & Anti-Abuse)
  const origin = req.headers.get("origin") || ""
  const referer = req.headers.get("referer") || ""
  const isLocalhost = origin.includes("localhost") || referer.includes("localhost")
  
  const allowedDomains = [
    "fusiontik.vercel.app",
    "fusiontik.fusionify.biz.id",
    "fusiontik.fusionifydgital.com",
    "fusiontik.fusionifydigital.com", // Adding the correctly spelled version just in case
    "fusiontik.premiumify.my.id"
  ]
  
  const isAllowedDomain = allowedDomains.some(domain => origin.includes(domain) || referer.includes(domain))
  
  // Require requests to come from our frontend (if origin/referer is present)
  if ((origin || referer) && !isLocalhost && !isAllowedDomain) {
    return NextResponse.json(
      { error: "Unauthorized cross-origin request" },
      { status: 403 }
    )
  }

  // 2. Rate Limiting (10 requests / minute)
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { 
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0"
        }
      }
    )
  }

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
