import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { checkRateLimit, writeLimiter } from "@/lib/ratelimit"

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limited = await checkRateLimit([writeLimiter], session.user.id)
  if (limited) return limited

  const { emotionalScore, emotionalTag } = await req.json()

  if (!emotionalScore || !emotionalTag) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { emotionalScore, emotionalTag },
  })

  await prisma.moodLog.create({
    data: {
      userId: session.user.id,
      emotionTag: emotionalTag,
      emotionScore: emotionalScore,
    },
  })

  return NextResponse.json({ success: true })
}
