import { NextResponse } from "next/server"

export async function GET() {
  const openApiSpec = {
    openapi: "3.0.1",
    info: {
      title: "FusionTik TikTok Downloader API",
      description:
        "API specification for extracting TikTok MP4 videos without watermark, MP3 audio, and Photo Mode slide collections.",
      version: "v2.5.3",
    },
    servers: [
      {
        url: "https://fusiontik.vercel.app",
      },
    ],
    paths: {
      "/api/tiktok": {
        post: {
          summary: "Extract TikTok media content",
          operationId: "extractTikTokMedia",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      description: "Valid TikTok post URL (tiktok.com, vt.tiktok.com, vm.tiktok.com)",
                      example: "https://vt.tiktok.com/ZSPpmWs9j/",
                    },
                  },
                  required: ["url"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Successful extraction response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      type: { type: "string", example: "video" },
                      video: { type: "string" },
                      videoHd: { type: "string" },
                      music: { type: "string" },
                      images: { type: "array", items: { type: "string" } },
                      creator: { type: "string" },
                      description: { type: "string" },
                    },
                  },
                },
              },
            },
            "400": { description: "Invalid URL provided" },
            "500": { description: "Downloader extraction error" },
          },
        },
      },
      "/api/global-stats": {
        get: {
          summary: "Get global download counter",
          operationId: "getGlobalStats",
          responses: {
            "200": {
              description: "Global download counter stats",
            },
          },
        },
      },
    },
  }

  return NextResponse.json(openApiSpec)
}
