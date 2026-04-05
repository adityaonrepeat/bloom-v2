import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

const REPORT_THRESHOLD = 5

export async function POST(req: Request) {

  const { reporterId, reportedId } = await req.json()

  if (!reporterId || !reportedId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
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
