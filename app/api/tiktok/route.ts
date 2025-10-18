import { NextResponse } from "next/server"

const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vt\.tiktok\.com|m\.tiktok\.com)\//

async function tiktok(url: string) {
  if (!tiktokRegex.test(url)) {
    throw new Error("Invalid URL")
  }
  const form = new URLSearchParams()
  form.append("q", url)
  form.append("lang", "id")
  const res = await fetch("https://tiksave.io/api/ajaxSearch", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      origin: "https://tiksave.io",
      referer: "https://tiksave.io/id/download-tiktok-mp3",
      "user-agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
    },
    body: form.toString(),
  })
  if (!res.ok) {
    throw new Error(`TikSave returned ${res.status}: ${res.statusText}`)
  }
  const json: any = await res.json()

  const html = json?.data || json?.data?.data
  if (typeof html !== "string") {
    throw new Error("Unexpected response from TikSave")
  }
  
  let title = ""
  {
    const match = /class\s*=\s*["']tik-left["'][\s\S]*?<div[^>]*class\s*=\s*["']content["'][^>]*>(.*?)<\/div>/i.exec(html)
    if (match) {
      title = match[1].replace(/<[^>]+>/g, "").trim()
    }
  }

  let thumbnail = ""
  {
    const match = /class\s*=\s*["']tik-left["'][\s\S]*?<img[^>]*src="([^"]+)"/i.exec(html)
    if (match) {
      thumbnail = match[1]
    }
  }

  let video = ""
  let audio = ""
  {
    const match = /class\s*=\s*["']dl-action["'][\s\S]*?<p[^>]*>[^]*?<a[^>]*href="([^"]+)"[^>]*>[^]*?<\/a>[^]*?<\/p>[\s\S]*?<p[^>]*>[^]*?<a[^>]*href="([^"]+)"/i.exec(html)
    if (match) {
      video = match[1]
      audio = match[2]
    } else {

      const sectionMatch = /class\s*=\s*["']dl-action["'][\s\S]*?<\/div>/i.exec(html)
      if (sectionMatch) {
        const section = sectionMatch[0]
        const hrefs = [] as string[]
        const hrefRegex = /href="([^"]+)"/g
        let m: RegExpExecArray | null
        while ((m = hrefRegex.exec(section))) {
          hrefs.push(m[1])
        }
        if (hrefs.length > 0) {
          video = hrefs[0]
          if (hrefs.length > 1) audio = hrefs[hrefs.length - 1]
        }
      }
    }
  }

  const slide: string[] = []
  {
    const listMatch = /<ul[^>]*class\s*=\s*["'][^"']*download-box[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i.exec(html)
    if (listMatch) {
      const listHtml = listMatch[1]
      const imgRegex = /<img[^>]*src="([^"]+)"/g
      let m: RegExpExecArray | null
      while ((m = imgRegex.exec(listHtml))) {
        slide.push(m[1])
      }
    }
  }
  return { title, thumbnail, video, audio, slide }
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
      return NextResponse.json({ error: message }, { status: 500 })
    }

    const images: string[] = Array.isArray(result.slide) ? result.slide : []
    const isPhoto = images.length > 0
    const videoUrl = result.video || undefined
    const audioUrl = result.audio || undefined
    const description = result.title || ""

    const response: Record<string, any> = {
      type: isPhoto ? "image" : "video",
      images,
      description,
    }
    if (!isPhoto) {
      if (!videoUrl) {
        return NextResponse.json({ error: "No video URL found in the TikSave response" }, { status: 500 })
      }
      response.video = videoUrl
    }
    if (audioUrl) {
      response.music = audioUrl
    }
    return NextResponse.json(response)
  } catch (err: any) {
    return NextResponse.json(
      { error: `Invalid request: ${err?.message || String(err)}` },
      { status: 400 },
    )
  }
}