import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { checkRateLimit, writeLimiter, ipFromRequest } from "@/lib/ratelimit"

// NOTE: this route trusts `uid` from the body and has no auth check — anyone
// could set any user's score. That IDOR is out of scope here; for now the rate
// limit is keyed by client IP since there's no session to key on.
export async function POST(req: Request) {

  const limited = await checkRateLimit([writeLimiter], ipFromRequest(req))
  if (limited) return limited

  const { uid, emotionalScore, emotionalTag } = await req.json()

  if (!uid || !emotionalScore || !emotionalTag) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: uid },
    data: {
      emotionalScore,
      emotionalTag
    }
  })

  await prisma.moodLog.create({
    data: {
      userId: uid,
      emotionTag: emotionalTag,
      emotionScore: emotionalScore
    }
  })

  return NextResponse.json({ success: true })
}
