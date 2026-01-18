import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vt\.tiktok\.com|m\.tiktok\.com)\//

async function fetchFromZell(url: string) {
  const baseUrl = process.env.ZELL_TIKTOK_API_URL || "https://apizell.web.id/download/tiktok"
  const apiUrl = `${baseUrl}?url=${encodeURIComponent(url)}`

  const res = await fetch(apiUrl)

  if (!res.ok) {
    throw new Error(`Zell API returned ${res.status}: ${res.statusText}`)
  }

  const json: any = await res.json()

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
    ? result.images.filter((item: unknown) => typeof item === "string")
    : []

  const duration =
    typeof result.music?.duration === "number" ? String(result.music.duration) : ""

  return { title, creator, thumbnail, videos, audio, slide, duration }
}

async function fetchFromSanka(url: string) {
  const baseUrl =
    process.env.SANKA_TIKTOK_API_URL ||
    "https://www.sankavollerei.com/download/tiktok"
  const apiKey =
    process.env.SANKA_TIKTOK_API_KEY ||
    process.env.SANKA_API_KEY ||
    "planaai"

  const apiUrl = `${baseUrl}?apikey=${encodeURIComponent(
    apiKey,
  )}&url=${encodeURIComponent(url)}`

  const res = await fetch(apiUrl)

  if (!res.ok) {
    throw new Error(`Sanka API returned ${res.status}: ${res.statusText}`)
  }

  const json: any = await res.json()

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
    ? result.images.filter((item: unknown) => typeof item === "string")
    : []

  const duration =
    typeof result.duration === "number" && result.duration > 0
      ? String(result.duration)
      : typeof result.music_info?.duration === "number"
        ? String(result.music_info.duration)
        : ""

  return { title, creator, thumbnail, videos, audio, slide, duration }
}

async function notifyProviderFailure(url: string, error: string) {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const alertEmailTo = process.env.ALERT_EMAIL_TO

  if (
    !webhookUrl &&
    !telegramToken &&
    !telegramChatId &&
    !(smtpHost && smtpPort && smtpUser && smtpPass && alertEmailTo)
  ) {
    return
  }

  const payload = {
    source: "fusiontik",
    event: "tiktok_downloader_error",
    url,
    error,
    timestamp: new Date().toISOString(),
  }

  const tasks: Promise<unknown>[] = []

  if (webhookUrl) {
    tasks.push(
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    )
  }

  if (telegramToken && telegramChatId) {
    const text =
      `⚠️ FusionTik downloader error\n` +
      `URL: ${url}\n` +
      `Error: ${error}\n` +
      `Time: ${payload.timestamp}`

    const tgUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`

    tasks.push(
      fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text,
        }),
      }),
    )
  }

  if (smtpHost && smtpPort && smtpUser && smtpPass && alertEmailTo) {
    tasks.push(
      (async () => {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(smtpPort),
          secure: Number(smtpPort) === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        })

        const text =
          `FusionTik downloader error\n\n` +
          `URL: ${url}\n` +
          `Error: ${error}\n` +
          `Time: ${payload.timestamp}\n`

        await transporter.sendMail({
          from: `"FusionTik Alert" <${smtpUser}>`,
          to: alertEmailTo,
          subject: "FusionTik TikTok downloader error",
          text,
        })
      })(),
    )
  }

  if (tasks.length === 0) return

  try {
    await Promise.allSettled(tasks)
  } catch {
  }
}

async function tiktok(url: string) {
  if (!tiktokRegex.test(url)) {
    throw new Error("Invalid URL")
  }

  let lastError: unknown

  try {
    return await fetchFromZell(url)
  } catch (error) {
    lastError = error
  }

  try {
    return await fetchFromSanka(url)
  } catch {
    if (lastError instanceof Error) {
      throw lastError
    }
    throw new Error("All providers failed")
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid TikTok URL" }, { status: 400 })
    }

    let result: any

    try {
      result = await tiktok(url)
    } catch (err: any) {
      const message = err?.message || String(err)
      await notifyProviderFailure(url, message)
      return NextResponse.json(
        {
          error: "Downloader sedang mengalami gangguan. Silakan coba lagi beberapa saat, atau hubungi admin jika masalah berlanjut.",
        },
        { status: 500 },
      )
    }

    const images: string[] = Array.isArray(result.slide) ? result.slide : []
    const isPhoto = images.length > 0
    const videos: string[] = Array.isArray(result.videos) ? result.videos : []
    const audioUrl: string | undefined =
      typeof result.audio === "string" && result.audio.length > 0 ? result.audio : undefined
    const description: string = result.title || ""
    const creator: string = result.creator || ""
    const duration: string = result.duration || ""

    const response: Record<string, any> = {
      type: isPhoto ? "image" : "video",
      images,
      description,
      creator,
    }

    if (!isPhoto) {
      if (videos.length === 0) {
        return NextResponse.json(
          { error: "No video URLs found in the TikTok response" },
          { status: 500 },
        )
      }

      response.videos = videos
      response.video = videos[0]
      response.videoHd = videos[0]
    }

    if (audioUrl) {
      response.music = audioUrl
    }

    if (duration) {
      response.duration = duration
    }

    return NextResponse.json(response)
  } catch (err: any) {
    return NextResponse.json(
      { error: `Invalid request: ${err?.message || String(err)}` },
      { status: 400 },
    )
  }
}
