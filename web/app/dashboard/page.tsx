import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import TopNav from "../components/bloom/TopNav"
import TodayView from "../components/bloom/views/TodayView"

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/login")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })

  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
  const moodLogs = await prisma.moodLog.findMany({
    where: { userId: session.user.id, createdAt: { gte: sixtyDaysAgo } },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  })

  function sameDay(a: Date, b: Date) {
    return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
  }

  let streak = 0
  const check = new Date()
  while (true) {
    const hasEntry = moodLogs.some((l) => sameDay(new Date(l.createdAt), check))
    if (!hasEntry) break
    streak++
    check.setDate(check.getDate() - 1)
  }

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return moodLogs.some((l) => sameDay(new Date(l.createdAt), d))
  })

  return (
    <div className="min-h-screen bg-bloom-cream text-bloom-ink">
      <TopNav />
      <main className="pt-16">
        <div className="animate-fade-up">
          <TodayView
            emotionalScore={user?.emotionalScore ?? null}
            emotionalTag={(user?.emotionalTag as "happy" | "calm" | "stressed" | "anxious") ?? null}
            streak={streak}
            last7Days={last7Days}
          />
        </div>
      </main>
    </div>
  )
}
