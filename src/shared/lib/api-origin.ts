import { NextResponse } from "next/server"

const DEFAULT_ALLOWED_DOMAINS = [
  "fusiontik.vercel.app",
  "fusiontik.fusionify.biz.id",
  "fusiontik.fusionifydgital.com",
  "fusiontik.fusionifydigital.com",
  "fusiontik.premiumify.my.id",
]

function getAllowedDomains(): string[] {
  const extra = process.env.ALLOWED_ORIGIN_DOMAINS?.trim()
  if (!extra) return DEFAULT_ALLOWED_DOMAINS
  return [...DEFAULT_ALLOWED_DOMAINS, ...extra.split(",").map((d) => d.trim()).filter(Boolean)]
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }
  return req.headers.get("x-real-ip") || "unknown"
}

/**
 * Blocks cross-origin API abuse. Allows localhost in development and
 * requests from configured production domains.
 */
export function checkOrigin(req: Request): NextResponse | null {
  const origin = req.headers.get("origin") || ""
  const referer = req.headers.get("referer") || ""
  const isLocalhost = origin.includes("localhost") || referer.includes("localhost")
  const allowedDomains = getAllowedDomains()
  const isAllowedDomain = allowedDomains.some(
    (domain) => origin.includes(domain) || referer.includes(domain),
  )

  if ((origin || referer) && !isLocalhost && !isAllowedDomain) {
    return NextResponse.json(
      { error: "Unauthorized cross-origin request" },
      { status: 403 },
    )
  }

  return null
}
