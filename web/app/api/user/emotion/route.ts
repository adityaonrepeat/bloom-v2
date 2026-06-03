import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emotionalTag: true },
  })

  return NextResponse.json({ emotionalTag: user?.emotionalTag ?? null })
}
