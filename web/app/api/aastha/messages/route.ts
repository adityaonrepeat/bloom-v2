import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")
  if (!sessionId) return NextResponse.json({ error: "Session ID required" }, { status: 400 })

  const aasthaSession = await prisma.aasthaSession.findFirst({
    where: { id: sessionId, userId: session.user.id },
  })
  if (!aasthaSession) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const messages = await prisma.aasthaMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({ messages, sessionMeta: aasthaSession })
}
