import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

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
