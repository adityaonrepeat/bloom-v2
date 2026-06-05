import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

// Shared Upstash REST client — reuses the same Upstash instance the realtime
// service already runs on. If the creds are absent (e.g. local dev without
// Upstash) rate limiting disables itself rather than breaking every API route.
// Set BOTH vars in production to actually enforce the limits.
const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN
const redis = url && token ? new Redis({ url, token }) : null

if (!redis && process.env.NODE_ENV === "production") {
  console.warn(
    "[ratelimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — API rate limiting is DISABLED",
  )
}

type Duration = Parameters<typeof Ratelimit.slidingWindow>[1]

function limiter(tokens: number, window: Duration, prefix: string) {
  if (!redis) return null
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix,
    analytics: false,
  })
}

// Each chat call streams a Gemini completion — guard both bursts and the daily
// spend so a runaway client can't quietly rack up the bill.
export const chatBurstLimiter = limiter(15, "1 m", "rl:chat:burst")
export const chatDailyLimiter = limiter(200, "1 d", "rl:chat:day")

// Reports auto-block a peer once they pass the threshold — keep them rare.
export const reportLimiter = limiter(5, "1 h", "rl:report")

// General authenticated writes (journal, mood, sessions, score, token mint).
export const writeLimiter = limiter(40, "1 m", "rl:write")

// Best-effort client IP for endpoints that have no authenticated user to key on.
export function ipFromRequest(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]!.trim()
  return req.headers.get("x-real-ip")?.trim() || "anonymous"
}

// Runs each limiter for `identifier`; returns a 429 response if any trips, or
// null to let the request proceed. `message` is surfaced in the error body.
export async function checkRateLimit(
  limiters: Array<Ratelimit | null>,
  identifier: string,
  message = "Too many requests. Please slow down and try again shortly.",
): Promise<NextResponse | null> {
  for (const lim of limiters) {
    if (!lim) continue
    const { success, limit, remaining, reset } = await lim.limit(identifier)
    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
      return NextResponse.json(
        { error: message },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
          },
        },
      )
    }
  }
  return null
}
