import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"
import { checkRateLimit, writeLimiter } from "@/lib/ratelimit"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const journals = await prisma.journal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(journals)
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const limited = await checkRateLimit([writeLimiter], session.user.id)
  if (limited) return limited

  const body = await req.json()
  const { title, content } = body

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
  }

  const journal = await prisma.journal.create({
    data: {
      userId: session.user.id,
      title: title.trim(),
      content: content.trim(),
    },
  })

  return NextResponse.json(journal, { status: 201 })
}
