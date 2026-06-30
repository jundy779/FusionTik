import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

export type RateLimitBucket = "tiktok" | "global-stats-get" | "global-stats-post"

interface BucketConfig {
  max: number
  windowMs: number
  prefix: string
}

const BUCKET_CONFIG: Record<RateLimitBucket, BucketConfig> = {
  tiktok: { max: 10, windowMs: 60_000, prefix: "fusiontik:rl:tiktok" },
  "global-stats-get": { max: 60, windowMs: 60_000, prefix: "fusiontik:rl:stats-get" },
  "global-stats-post": { max: 10, windowMs: 60_000, prefix: "fusiontik:rl:stats-post" },
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

function getRedisClient(): Redis | null {
  const url =
    process.env.KV_REST_API_URL?.trim() ||
    process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token =
    process.env.KV_REST_API_TOKEN?.trim() ||
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim()

  if (!url || !token) return null
  return new Redis({ url, token })
}

const redis = getRedisClient()

const upstashLimiters: Partial<Record<RateLimitBucket, Ratelimit>> = {}

if (redis) {
  for (const [bucket, config] of Object.entries(BUCKET_CONFIG) as [
    RateLimitBucket,
    BucketConfig,
  ][]) {
    upstashLimiters[bucket] = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.max, "1 m"),
      prefix: config.prefix,
      analytics: true,
    })
  }
}

const memoryStores = new Map<string, Map<string, { count: number; resetTime: number }>>()

function memoryRateLimit(bucket: RateLimitBucket, identifier: string): RateLimitResult {
  const config = BUCKET_CONFIG[bucket]
  const now = Date.now()

  if (!memoryStores.has(bucket)) {
    memoryStores.set(bucket, new Map())
  }

  const store = memoryStores.get(bucket)!
  const record = store.get(identifier)

  if (!record || now > record.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + config.windowMs })
    return {
      success: true,
      limit: config.max,
      remaining: config.max - 1,
      reset: now + config.windowMs,
    }
  }

  if (record.count >= config.max) {
    return {
      success: false,
      limit: config.max,
      remaining: 0,
      reset: record.resetTime,
    }
  }

  record.count += 1
  return {
    success: true,
    limit: config.max,
    remaining: config.max - record.count,
    reset: record.resetTime,
  }
}

export function isDistributedRateLimitConfigured(): boolean {
  return redis !== null
}

export async function enforceRateLimit(
  bucket: RateLimitBucket,
  identifier: string,
): Promise<NextResponse | null> {
  const limiter = upstashLimiters[bucket]
  let result: RateLimitResult

  if (limiter) {
    const upstashResult = await limiter.limit(identifier)
    result = {
      success: upstashResult.success,
      limit: upstashResult.limit,
      remaining: upstashResult.remaining,
      reset: upstashResult.reset,
    }
  } else {
    result = memoryRateLimit(bucket, identifier)
  }

  if (result.success) return null

  const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))

  return NextResponse.json(
    { error: "Too many requests. Please try again in a minute." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(result.reset),
      },
    },
  )
}
