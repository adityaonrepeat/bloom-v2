import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const { tag, score, note } = await req.json()

  await prisma.user.update({
    where: { id: userId },
    data: { emotionalTag: tag, emotionalScore: score },
  })

  await prisma.moodLog.create({
    data: { userId, emotionTag: tag, emotionScore: score, note: note?.trim() || null },
  })

  return NextResponse.json({ success: true })
}
