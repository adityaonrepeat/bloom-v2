import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import TopNav from "../components/bloom/TopNav"
import MoodView from "../components/bloom/views/MoodView"

export default async function MoodPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/login")

  const nintyDaysAgo = new Date()
  nintyDaysAgo.setDate(nintyDaysAgo.getDate() - 90)

  const rawLogs = await prisma.moodLog.findMany({
    where: {
      userId: session.user.id,
      createdAt: { gte: nintyDaysAgo },
    },
    orderBy: { createdAt: "desc" },
  })

  const logs = rawLogs.map((l) => ({
    id: l.id,
    emotionScore: l.emotionScore,
    emotionTag: l.emotionTag as string,
    note: l.note ?? null,
    createdAt: l.createdAt.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-bloom-cream text-bloom-ink">
      <TopNav />
      <main className="pt-16">
        <div className="animate-fade-up">
          <MoodView logs={logs} />
        </div>
      </main>
    </div>
  )
}
