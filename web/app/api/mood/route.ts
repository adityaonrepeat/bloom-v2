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
  const body = await req.json()

  await prisma.user.update({
    where: { id: userId },
    data: {
      emotionalTag: body.tag,
      emotionalScore: body.score
    }
  })

  await prisma.moodLog.create({
    data: {
      userId,
      emotionTag: body.tag,
      emotionScore: body.score
    }
  })

  return NextResponse.json({ success: true })
}