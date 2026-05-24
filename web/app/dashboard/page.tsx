import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Navbar from "../components/Navbar"
import MoodBanner from "../components/MoodBanner"
import MoodChart from "../components/MoodChart"
import JournalCard from "../components/JournalCard"
import Link from "next/link"
import { Users, ChevronRight, PenLine, Sparkles } from "lucide-react"

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/login")

  const userId = session.user.id
  const userName = session.user.name

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user?.isBlocked) redirect("/blocked")

  const mood = await prisma.moodLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 7,
  })

  const journals = await prisma.journal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
  })

  const today = new Date()
  const latestMoodLogDate = mood.length > 0 ? new Date(mood[0].createdAt) : null
  const hasLoggedMoodToday =
    latestMoodLogDate &&
    latestMoodLogDate.getDate() === today.getDate() &&
    latestMoodLogDate.getMonth() === today.getMonth() &&
    latestMoodLogDate.getFullYear() === today.getFullYear()

  const firstName = userName?.split(" ")[0] ?? "there"

  return (
    <div
      className="min-h-screen"
      style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 pb-16 space-y-6">

        {/* Mood banner */}
        {!hasLoggedMoodToday && <MoodBanner name={firstName} />}

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

          {/* Mood chart */}
          <div
            className="md:col-span-5 rounded-2xl overflow-hidden"
            style={{ minHeight: 280, boxShadow: "0 4px 24px rgba(40,49,44,0.08)" }}
          >
            <MoodChart data={mood} />
          </div>

          {/* Right action area */}
          <div className="md:col-span-7 flex flex-col gap-4">

            {/* Quiz + Aastha row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ minHeight: 175 }}>

              {/* Quiz card */}
              <div
                className="relative overflow-hidden flex flex-col justify-between rounded-2xl p-5 group cursor-pointer transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(40,49,44,0.08)",
                  boxShadow: "0 2px 12px rgba(40,49,44,0.04)",
                }}
              >
                <div
                  aria-hidden
                  className="absolute -bottom-10 -right-10 w-36 h-36 opacity-[0.04] pointer-events-none"
                >
                  <svg viewBox="0 0 100 100" fill="#28312C">
                    <path d="M50 0C50 0 20 20 20 50C20 80 50 100 50 100C50 100 80 80 80 50C80 20 50 0 50 0Z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <h3
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "17px",
                      color: "#28312C",
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Take the Quiz:<br />Present Moment
                  </h3>
                  <p className="mt-2" style={{ fontSize: "13px", color: "#5D6862", lineHeight: 1.5 }}>
                    Check in with your feelings right now.
                  </p>
                </div>
                <Link href="/quiz" className="relative z-10 mt-5">
                  <button
                    className="text-[13px] font-medium px-4 py-2 rounded-full flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "#28312C", color: "#f7f4ef" }}
                  >
                    Start Quiz <ChevronRight size={13} strokeWidth={2.5} />
                  </button>
                </Link>
              </div>

              {/* Aastha card */}
              <Link href="/aastha" className="group block">
                <div
                  className="h-full flex flex-col rounded-2xl p-5 transition-all duration-200 cursor-pointer"
                  style={{
                    background: "#28312C",
                    boxShadow: "0 4px 20px rgba(40,49,44,0.18)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: "#E3A863", color: "#28312C" }}
                    >
                      A
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0EBE1", lineHeight: 1 }}>Aastha</p>
                      <p style={{ fontSize: "11px", color: "#A6B3A8" }}>AI Therapist</p>
                    </div>
                    <span
                      className="ml-auto w-2 h-2 rounded-full animate-pulse shrink-0"
                      style={{ background: "#7C9885" }}
                    />
                  </div>
                  <p className="mt-2 leading-relaxed" style={{ fontSize: "13px", color: "rgba(240,235,225,0.7)" }}>
                    Talk anytime, judgment-free.
                  </p>
                  <div
                    className="mt-auto pt-4 rounded-xl px-3 py-2.5"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "12px",
                      color: "rgba(240,235,225,0.8)",
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;Hi {firstName}, let&apos;s chat 🌸&rdquo;
                  </div>
                </div>
              </Link>
            </div>

            {/* Talk card */}
            <Link href="/talk" className="group block">
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(40,49,44,0.08)",
                  boxShadow: "0 2px 12px rgba(40,49,44,0.04)",
                  minHeight: "80px",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(40,49,44,0.06)" }}
                  >
                    <Users size={20} strokeWidth={1.5} style={{ color: "#28312C" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 500, color: "#28312C", lineHeight: 1.2 }}>
                      Talk to Someone
                    </h3>
                    <p style={{ fontSize: "13px", color: "#5D6862", marginTop: "2px" }}>
                      Match with a real human who feels the same shade of blue.
                    </p>
                  </div>
                </div>
                <button
                  className="shrink-0 text-[13px] font-medium px-5 py-2 rounded-full transition-all hover:opacity-90"
                  style={{ background: "#28312C", color: "#f7f4ef" }}
                >
                  Get Support
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* ── Journals section ── */}
        <section
          className="rounded-2xl px-6 py-5"
          style={{
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(40,49,44,0.08)",
            boxShadow: "0 2px 12px rgba(40,49,44,0.04)",
          }}
        >
          <div className="flex items-center justify-between mb-5 px-1">
            <h2
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "20px",
                letterSpacing: "-0.01em",
                color: "#28312C",
              }}
            >
              Journals
            </h2>
            <Link
              href="/journal"
              className="flex items-center gap-0.5 text-[13px] font-medium transition-opacity hover:opacity-60"
              style={{ color: "#5D6862" }}
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="relative">
            {journals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {journals.map((j) => (
                  <JournalCard key={j.id} journal={j} />
                ))}
              </div>
            ) : (
              <div
                className="py-14 text-center rounded-xl"
                style={{ background: "rgba(40,49,44,0.03)", border: "1px dashed rgba(40,49,44,0.1)" }}
              >
                <p style={{ fontSize: "14px", color: "#5D6862", marginBottom: "12px" }}>No journal entries yet.</p>
                <Link href="/journal">
                  <button
                    className="text-[13px] font-medium px-5 py-2.5 rounded-full transition-all hover:opacity-90"
                    style={{ background: "#28312C", color: "#f7f4ef" }}
                  >
                    Write your first entry
                  </button>
                </Link>
              </div>
            )}

            {journals.length > 0 && (
              <Link href="/journal/new" className="absolute bottom-2 right-2">
                <button
                  className="text-[13px] font-medium px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "#28312C",
                    color: "#f7f4ef",
                    boxShadow: "0 4px 16px rgba(40,49,44,0.2)",
                  }}
                >
                  New Entry <PenLine size={13} />
                </button>
              </Link>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}
