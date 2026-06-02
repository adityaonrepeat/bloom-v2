import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

// GET /api/aastha/sessions - list all sessions for user
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const sessions = await prisma.aasthaSession.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        where: { role: "user" },
        orderBy: { createdAt: "desc" },
        take: 1, // last user message for preview
      },
      _count: { select: { messages: true } },
    },
  })

  return NextResponse.json({ sessions })
}

// POST /api/aastha/sessions - create new session
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emotionalTag: true, emotionalScore: true },
  })

  const body = await req.json().catch(() => ({}))
  const title = body.title || "New Session"

  const newSession = await prisma.aasthaSession.create({
    data: {
      userId: session.user.id,
      title,
      emotionTag: user?.emotionalTag ?? undefined,
      emotionScore: user?.emotionalScore ?? undefined,
    },
  })

  return NextResponse.json({ session: newSession })
}

// DELETE /api/aastha/sessions?id=xxx - delete a session
export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Session ID required" }, { status: 400 })

  // Verify ownership
  const aasthaSession = await prisma.aasthaSession.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!aasthaSession) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.aasthaSession.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
