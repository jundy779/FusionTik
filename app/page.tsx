"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Info, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/components/ui/use-toast"
import { ResultButtons } from "@/components/result-buttons"
import { ResultCard } from "@/components/result-card"
import { useDownloadHistory, type DownloadHistoryItem } from "@/hooks/use-download-history"

async function fetchTikTokData(url: string) {
  try {
    console.log("Fetching TikTok data for URL:", url)

    const res = await fetch("/api/tiktok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
    const data = await res.json()

    console.log("API response:", data)
    if (!res.ok) {
      throw new Error(data.error || `Server returned ${res.status}: ${res.statusText}`)
    }
    if (data.error) {
      throw new Error(data.error)
    }

    if (data.type === "video") {
      if (!data.video) {
        throw new Error("No video URL found in the response")
      }
    } else if (data.type === "image") {
      if (!Array.isArray(data.images) || data.images.length === 0) {
        throw new Error("No images found in the response")
      }
    } else {
      throw new Error("Unknown content type returned from API")
    }
    return data
  } catch (error) {
    console.error("Error in fetchTikTokData:", error)
    throw error
  }
}

interface TikTokResult {
  id: number
  url: string
  type: string
  date: string
  videoUrl?: string
  videoHdUrl?: string
  audioUrl?: string
  imageUrls?: string[]
  description?: string
  creator?: string
  duration?: string
}

export default function TikTokDownloader() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentResult, setCurrentResult] = useState<TikTokResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { history, addToHistory, removeFromHistory, clearHistory } = useDownloadHistory()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchTikTokData(url)

      const newResult: TikTokResult = {
        id: Date.now(),
        url: url,
        type: data.type || "video",
        date: new Date().toLocaleDateString(),
        videoUrl: data.type === "video" ? data.video : undefined,
        videoHdUrl: data.type === "video" ? data.video : undefined,
        audioUrl: data.music || undefined,
        imageUrls: data.type === "image" ? (data.images as string[]) : undefined,
        description: data.description,
        creator: data.creator,
        duration: data.duration,
      }
      console.log("Created result:", newResult)
      setCurrentResult(newResult)

      addToHistory(newResult as DownloadHistoryItem)

      toast({
        title: "Download ready!",
        description: "Your TikTok video has been processed successfully.",
      })
    } catch (error) {
      console.error("Error downloading TikTok:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to download TikTok"
      setError(errorMessage)

      toast({
        variant: "destructive",
        title: "Download failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadAnother = () => {
    setCurrentResult(null)
    setUrl("")
  }

  const handlePasteClick = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText()
        if (text) {
          setUrl(text.trim())
          toast({ title: "Pasted URL", description: "URL loaded from clipboard" })
          return
        }
      }

      const manual = window.prompt("Paste TikTok URL here:", "")
      if (manual) {
        setUrl(manual.trim())
        toast({ title: "URL set", description: "URL pasted manually" })
      } else {
        toast({ variant: "destructive", title: "No URL provided", description: "Could not obtain URL from clipboard" })
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err)

      const manual = window.prompt("Paste TikTok URL here:", "")
      if (manual) {
        setUrl(manual.trim())
        toast({ title: "URL set", description: "URL pasted manually" })
      } else {
        toast({ variant: "destructive", title: "Clipboard error", description: "Could not read from clipboard" })
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {!currentResult && (
          <motion.section
            id="download"
            className="mb-16"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">Download TikTok Videos & Images</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Easily download your favorite TikTok videos, images, and audio with our fast and free online tool.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Enter TikTok URL</CardTitle>
                  <CardDescription>Paste the link to the TikTok video or image you want to download</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="flex gap-2 flex-col sm:flex-row">
                    <div className="flex flex-1 gap-2">
                      <Input
                        type="text"
                        placeholder="https://www.tiktok.com/@username/video/1234567890123456789"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="focus-visible:ring-primary flex-1"
                      />
                      {/* Paste button: reads the clipboard and populates the URL field */}
                      <Button
                        type="button"
                        variant="outline"
                     onClick={handlePasteClick}
                      >
                        Paste
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading || !url}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        "Download"
                      )}
                    </Button>
                  </form>

                  {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                  By using our service, you agree to our Terms of Service and Privacy Policy
                </CardFooter>
              </Card>
            </motion.div>
          </motion.section>
        )}

        {/* Results Section - Simple Button Style */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
            <h3 className="text-xl font-medium">Processing your download...</h3>
            <p className="text-muted-foreground mt-2">This may take a few moments</p>
          </div>
        )}

        {currentResult && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
            <div className="bg-gradient-to-br from-purple-700 to-pink-700 rounded-lg p-8 max-w-md mx-auto shadow-lg">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Download Ready!</h2>
                {currentResult.creator && (
                  <p className="text-white/80">
                    Video by <span className="font-medium">@{currentResult.creator}</span>
                  </p>
                )}
              </div>

              <ResultButtons
                videoUrl={currentResult.videoUrl}
                videoHdUrl={currentResult.videoHdUrl}
                audioUrl={currentResult.audioUrl}
                imageUrls={currentResult.imageUrls}
                type={currentResult.type}
                onDownloadAnother={handleDownloadAnother}
              />
            </div>
          </motion.section>
        )}

        {/* About Section */}
        {!currentResult && (
          <motion.section
            id="about"
            className="mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">About Our Service</h2>
              <p className="text-muted-foreground">Learn more about SlowTik and how it works</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-purple-500" />
                      How It Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      SlowTik allows you to save TikTok videos, images, and audio files to your
                      device without watermarks. Here's how it works:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Copy the URL of the TikTok video or image you want to download</li>
                      <li>Paste the URL in the input field above</li>
                      <li>Click the "Download" button</li>
                      <li>Choose the format you want to download (video, audio, or image)</li>
                      <li>Save the file to your device</li>
                    </ol>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-purple-500" />
                      Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Badge className="mt-1 bg-purple-600">Free</Badge>
                        <span>Our service is completely free to use with no hidden fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge className="mt-1 bg-purple-600">No Watermarks</Badge>
                        <span>Download TikTok videos without the TikTok watermark</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge className="mt-1 bg-purple-600">High Quality</Badge>
                        <span>Download videos and images in the highest available quality</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge className="mt-1 bg-purple-600">Audio Extraction</Badge>
                        <span>Extract and download only the audio from TikTok videos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge className="mt-1 bg-purple-600">Download History</Badge>
                        <span>Keep track of your downloaded content with our history feature</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Download History Section */}
        {!currentResult && (
          <motion.section
            id="history"
            className="mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Download History</h2>
              <p className="text-muted-foreground">Your downloaded TikTok videos and images</p>
            </div>
            {history.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {history.map((item) => (
                    <ResultCard
                      key={item.id}
                      result={{
                        id: item.id,
                        url: item.url,
                        type: item.type,
                        date: item.date,
                        description: item.description,
                        creator: item.creator,
                        duration: item.duration,
                      }}
                      onDownloadVideo={() => {
                        if (item.type === "image") {
                          item.imageUrls?.forEach((img) => {
                            try {
                              window.open(img, "_blank")
                            } catch (e) {
                              console.error("Failed to open image:", e)
                            }
                          })
                        } else {
                          if (item.videoUrl) {
                            window.open(item.videoUrl, "_blank")
                          }
                        }
                      }}
                      onDownloadAudio={() => {
                        if (item.audioUrl) {
                          try {
                            window.open(item.audioUrl, "_blank")
                          } catch (e) {
                            console.error("Failed to open audio:", e)
                          }
                        }
                      }}
                      onDelete={() => removeFromHistory(item.id)}
                      isHistoryItem
                    />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="outline" onClick={clearHistory}>
                    Clear History
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center">You have no download history yet.</p>
            )}
          </motion.section>
        )}

        {/* FAQ Section */}
        {!currentResult && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Get answers to common questions about our service</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is this service free?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                      Yes, SlowTik is completely free to use. There are no hidden fees or subscriptions
                      required.
                    </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is it legal to download TikTok videos?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Downloading videos for personal use is generally acceptable. However, you should not redistribute or
                    use the content commercially without permission from the creator.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What formats can I download?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You can download TikTok content as MP4 videos, MP3 audio files, or JPG/PNG images depending on the
                    original content type.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you store the downloaded videos?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No, we don't store any downloaded videos or user data on our servers. Your download history is saved
                    locally on your device only.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        className="border-t py-8 mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-500" />
                <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  SlowTik
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">Download TikTok videos, images, and audio easily</p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 text-sm">
              <div>
                <h3 className="font-medium mb-2">Links</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="#download" className="hover:text-purple-400 transition-colors">
                      Download
                    </a>
                  </li>
                  <li>
                    <a href="#history" className="hover:text-purple-400 transition-colors">
                      History
                    </a>
                  </li>
                  <li>
                    <a href="#about" className="hover:text-purple-400 transition-colors">
                      About
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Legal</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="/terms" className="hover:text-purple-400 transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="hover:text-purple-400 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Support</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="/faq" className="hover:text-purple-400 transition-colors">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="/help-center" className="hover:text-purple-400 transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="/feedback" className="hover:text-purple-400 transition-colors">
                      Feedback
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} SlowTik. All rights reserved.</p>
            <p className="mt-1">This service is not affiliated with TikTok or ByteDance Ltd.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
