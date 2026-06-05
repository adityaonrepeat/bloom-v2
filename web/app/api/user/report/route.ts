import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { checkRateLimit, reportLimiter } from "@/lib/ratelimit"

const REPORT_THRESHOLD = 5

export async function POST(req: Request) {

  // Reporter identity comes from the authenticated session — never trust the
  // client to say who is reporting, or anyone could mass-report any user.
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limited = await checkRateLimit([reportLimiter], session.user.id)
  if (limited) return limited

  const reporterId = session.user.id
  const { reportedId } = await req.json()

  if (!reportedId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  if (reportedId === reporterId) {
    return NextResponse.json({ error: "Cannot report yourself" }, { status: 400 })
  }

  const existing = await prisma.report.findFirst({
    where: {
      reporterId,
      reportedId,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  })

  if (existing) {
    return NextResponse.json({ error: "Already reported" }, { status: 409 })
  }

  await prisma.report.create({
    data: { reporterId, reportedId }
  })

  const updated = await prisma.user.update({
    where: { id: reportedId },
    data: { reportCount: { increment: 1 } }
  })

  if (updated.reportCount >= REPORT_THRESHOLD) {
    await prisma.user.update({
      where: { id: reportedId },
      data: { isBlocked: true }
    })
  }

  return NextResponse.json({ success: true })
}
