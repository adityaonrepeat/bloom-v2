import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

// GET /api/journal/[id] — get single journal
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const journal = await prisma.journal.findUnique({ where: { id } })

  if (!journal || journal.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(journal)
}

// PUT /api/journal/[id] — update journal
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const existing = await prisma.journal.findUnique({ where: { id } })

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const { title, content } = body

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
  }

  const updated = await prisma.journal.update({
    where: { id },
    data: { title: title.trim(), content: content.trim() },
  })

  return NextResponse.json(updated)
}

// DELETE /api/journal/[id] — delete journal
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const existing = await prisma.journal.findUnique({ where: { id } })

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.journal.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
