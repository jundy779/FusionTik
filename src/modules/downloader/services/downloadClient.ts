import JSZip from "jszip"

/**
 * Download utility functions using fetch + blob approach
 * for better UX compared to window.open()
 */

export interface DownloadProgress {
  loaded: number
  total: number
  percent: number
}

export type ProgressCallback = (progress: DownloadProgress) => void

/**
 * Download a file with progress tracking and custom filename
 */
export async function downloadWithProgress(
  url: string,
  filename: string,
  onProgress?: ProgressCallback,
): Promise<void> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`)
    }

    const contentLength = response.headers.get("content-length")
    const total = contentLength ? parseInt(contentLength, 10) : 0

    if (!response.body) {
      const blob = await response.blob()
      triggerDownload(blob, filename)
      return
    }

    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let loaded = 0

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      chunks.push(value)
      loaded += value.length

      if (onProgress && total > 0) {
        onProgress({
          loaded,
          total,
          percent: Math.round((loaded / total) * 100),
        })
      }
    }

    const blob = new Blob(chunks as BlobPart[])
    triggerDownload(blob, filename)
  } catch (error) {
    console.error("Download error:", error)
    // Fallback to window.open if fetch fails (e.g., CORS issues)
    window.open(url, "_blank")
  }
}

/**
 * Download multiple images as a single ZIP archive
 */
export async function downloadImagesAsZip(
  imageUrls: string[],
  zipFilename: string,
  onProgress?: (current: number, total: number) => void,
): Promise<void> {
  const zip = new JSZip()
  const total = imageUrls.length

  for (let i = 0; i < total; i++) {
    const url = imageUrls[i]
    try {
      const response = await fetch(url)
      if (response.ok) {
        const blob = await response.blob()
        const ext = blob.type.includes("png") ? "png" : "jpg"
        zip.file(`fusiontik_foto_${i + 1}.${ext}`, blob)
      }
    } catch (err) {
      console.error(`Failed to include image ${i + 1} in zip:`, err)
    }

    if (onProgress) {
      onProgress(i + 1, total)
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" })
  triggerDownload(zipBlob, zipFilename.endsWith(".zip") ? zipFilename : `${zipFilename}.zip`)
}

/**
 * Trigger browser download with custom filename
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const blobUrl = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = blobUrl
  a.download = filename
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(blobUrl)
}

/**
 * Get file extension from URL
 */
export function getFileExtension(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const lastDot = pathname.lastIndexOf(".")
    if (lastDot > 0) {
      const ext = pathname.substring(lastDot + 1).toLowerCase()
      if (["mp4", "mp3", "jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
        return ext
      }
    }
  } catch {
    // Ignore URL parsing errors
  }
  return "mp4"
}

/**
 * Generate descriptive filename for downloaded content
 */
export function generateFilename(
  type: "video" | "audio" | "image" | "zip",
  creator?: string,
  index?: number,
): string {
  const timestamp = Date.now()
  const creatorSlug = creator
    ? creator.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20)
    : "tiktok"

  const extensions: Record<string, string> = {
    video: "mp4",
    audio: "mp3",
    image: "jpg",
    zip: "zip",
  }

  const extension = extensions[type] || "mp4"
  const indexSuffix = index !== undefined ? `_${index + 1}` : ""

  return `FusionTik_${creatorSlug}${indexSuffix}_${timestamp}.${extension}`
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Estimates or fetches file size from URL
 */
export async function fetchEstimatedFileSize(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    const length = response.headers.get("content-length")
    if (length) {
      const bytes = parseInt(length, 10)
      if (!isNaN(bytes) && bytes > 0) {
        return formatFileSize(bytes)
      }
    }
  } catch {
    // CORS or HEAD request failed
  }
  return null
}
