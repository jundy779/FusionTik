import { NextResponse } from "next/server"
import { checkOrigin, getClientIp } from "@/shared/lib/api-origin"
import { enforceRateLimit, type RateLimitBucket } from "@/shared/lib/rate-limit"

/**
 * Runs origin validation then distributed rate limiting for API routes.
 * Returns a NextResponse when the request must be blocked, otherwise null.
 */
export async function guardApiRequest(
  req: Request,
  bucket: RateLimitBucket,
): Promise<NextResponse | null> {
  const originError = checkOrigin(req)
  if (originError) return originError

  const ip = getClientIp(req)
  return enforceRateLimit(bucket, ip)
}
