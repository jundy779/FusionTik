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
  let creator = ""
  {
    const patterns = [
      /<div[^>]*class\s*=\s*["']content["'][^>]*>([\s\S]*?)<\/div>/i,
      /class\s*=\s*["']content["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class\s*=\s*["']desc["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class\s*=\s*["']description["'][^>]*>([\s\S]*?)<\/div>/i,
      /<p[^>]*class\s*=\s*["']desc["'][^>]*>([\s\S]*?)<\/p>/i,
      /<span[^>]*class\s*=\s*["']desc["'][^>]*>([\s\S]*?)<\/span>/i,
      /class\s*=\s*["']tik-left["'][\s\S]*?<div[^>]*class\s*=\s*["']content["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class\s*=\s*["']content["'][^>]*>([\s\S]*?)(?:<\/div>|$)/i,
      /<div[^>]*class\s*=\s*["']text["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class\s*=\s*["']caption["'][^>]*>([\s\S]*?)<\/div>/i
    ]
    
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      const match = pattern.exec(html)
      if (match && match[1]) {
        const rawContent = match[1]
        title = rawContent.replace(/<[^>]+>/g, "").trim()
        if (title && title.length > 0) {
          break
        }
      }
    }
    
    const textContentPatterns = [
      /<div[^>]*>([^<]*#[^<]*?)<\/div>/i,
      /<p[^>]*>([^<]*#[^<]*?)<\/p>/i,
      /<span[^>]*>([^<]*#[^<]*?)<\/span>/i
    ]
    
    if (!title || title.length === 0) {
      for (let i = 0; i < textContentPatterns.length; i++) {
        const pattern = textContentPatterns[i]
        const match = pattern.exec(html)
        if (match && match[1]) {
          const foundText = match[1].trim()
          if (foundText && foundText.length > 5) {
            title = foundText
            break
          }
        }
      }
    }
    
    const creatorMatch = /class\s*=\s*["']tik-left["'][\s\S]*?<div[^>]*class\s*=\s*["']user["'][^>]*>.*?<a[^>]*>@([^<]+)<\/a>/i.exec(html)
    if (creatorMatch) {
      creator = creatorMatch[1]
    } else {
      const altCreatorMatch = /@([a-zA-Z0-9_.]+)/i.exec(html)
      if (altCreatorMatch) {
        creator = altCreatorMatch[1]
      }
    }
  }

  let thumbnail = ""
  {
    const match = /class\s*=\s*["']tik-left["'][\s\S]*?<img[^>]*src="([^"]+)"/i.exec(html)
    if (match) {
      thumbnail = match[1]
    }
  }

  let videos: string[] = []
  let audio = ""
  {
    const patterns = [
      /class\s*=\s*["']dl-action["'][\s\S]*?<\/div>/i,
      /class\s*=\s*["']download["'][\s\S]*?<\/div>/i,
      /class\s*=\s*["']download-box["'][\s\S]*?<\/div>/i,
      /<div[^>]*class\s*=\s*["'][^"']*download[^"']*["'][^>]*>[\s\S]*?<\/div>/i
    ]
    
    let section = ""
    for (const pattern of patterns) {
      const match = pattern.exec(html)
      if (match && match[0]) {
        section = match[0]
        break
      }
    }
    
    if (section) {
      const hrefs = [] as string[]
      const hrefRegex = /href="([^"]+)"/g
      let m: RegExpExecArray | null
      while ((m = hrefRegex.exec(section))) {
        hrefs.push(m[1])
      }
      
      const videoUrls = hrefs.filter(url => 
        url.includes('.mp4') || 
        url.includes('video') || 
        (!url.includes('.mp3') && !url.includes('audio'))
      )
      const audioUrls = hrefs.filter(url => 
        url.includes('.mp3') || 
        url.includes('audio')
      )
      
      const snapcdnUrls = videoUrls.filter(url => url.includes('snapcdn.app'))
      const otherVideoUrls = videoUrls.filter(url => !url.includes('snapcdn.app'))
      
      videos = [...snapcdnUrls, ...otherVideoUrls].slice(0, 2)
      
      if (audioUrls.length > 0) {
        audio = audioUrls[0]
      }
      
      console.log("=== TIKSAVE.IO EXTRACTION DEBUG ===")
      console.log("All hrefs found:", hrefs)
      console.log("Video URLs:", videoUrls)
      console.log("Audio URLs:", audioUrls)
      console.log("snapcdn URLs:", snapcdnUrls)
      console.log("Other video URLs:", otherVideoUrls)
      console.log("Final videos array:", videos)
      console.log("Final audio:", audio)
      console.log("===================================")
    } else {
      console.log("=== FALLBACK: SEARCHING ALL HREFS ===")
      const allHrefs = [] as string[]
      const allHrefRegex = /href="([^"]+)"/g
      let m: RegExpExecArray | null
      while ((m = allHrefRegex.exec(html))) {
        allHrefs.push(m[1])
      }
      
      const fallbackVideoUrls = allHrefs.filter(url => 
        url.includes('.mp4') || 
        url.includes('video') || 
        (!url.includes('.mp3') && !url.includes('audio') && !url.includes('http'))
      )
      const fallbackAudioUrls = allHrefs.filter(url => 
        url.includes('.mp3') || 
        url.includes('audio')
      )
      
      if (fallbackVideoUrls.length > 0) {
        videos = fallbackVideoUrls.slice(0, 2)
      }
      if (fallbackAudioUrls.length > 0) {
        audio = fallbackAudioUrls[0]
      }
      
      console.log("All hrefs in HTML:", allHrefs)
      console.log("Fallback video URLs:", fallbackVideoUrls)
      console.log("Fallback audio URLs:", fallbackAudioUrls)
      console.log("Final fallback videos:", videos)
      console.log("Final fallback audio:", audio)
      console.log("===================================")
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
  return { title, creator, thumbnail, videos, audio, slide }
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
    const videos = result.videos || []
    const audioUrl = result.audio || undefined
    const description = result.title || ""
    const creator = result.creator || ""

    const response: Record<string, any> = {
      type: isPhoto ? "image" : "video",
      images,
      description,
      creator,
    }
    
    if (!isPhoto) {
      if (videos.length === 0) {
        return NextResponse.json({ error: "No video URLs found in the TikSave response" }, { status: 500 })
      }
      
      response.videos = videos
      response.video = videos[0]
      
      const hdVideo = videos.find((url: string) => 
        url.includes('snapcdn.app') || 
        url.includes('hd') || 
        url.includes('HD')
      )
      
      if (hdVideo) {
        response.videoHd = hdVideo
      } else if (videos.length > 1) {
        response.videoHd = videos[1]
      }
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