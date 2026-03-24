import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Navbar from "../components/Navbar"
import MoodBanner from "../components/MoodBanner"
import MoodChart from "../components/MoodChart"
import JournalCard from "../components/JournalCard"
import Link from "next/link"

export default async function Dashboard() {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    redirect("/login")
  }

  const userId = session.user.id
  const userName = session.user.name

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  // Redirect blocked users
  if (user?.isBlocked) {
    redirect("/blocked")
  }

  const mood = await prisma.moodLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 7
  })

  const journals = await prisma.journal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3
  })

  const latestMood = user?.emotionalTag

  // Get current hour to show time-appropriate greeting
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-emerald-50/20">

      <Navbar />

      {/* Inline Mood Banner (not popup) */}
      <MoodBanner name={userName} />

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">

        {/* Greeting Section */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700/70 tracking-wide uppercase">
              {greeting}
            </p>
            <h1 className="text-3xl font-bold text-stone-800 mt-1">
              {userName}
            </h1>
            {latestMood && (
              <p className="text-sm text-stone-400 mt-1.5 flex items-center gap-1.5">
                Currently feeling
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 capitalize">
                  {latestMood}
                </span>
              </p>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: Mood Chart — spans 5 cols */}
          <div className="lg:col-span-5">
            <MoodChart data={mood} />
          </div>

          {/* RIGHT: Cards — spans 7 cols */}
          <div className="lg:col-span-7 space-y-6">

            {/* Today's Focus Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-7 rounded-2xl text-white shadow-lg">
              {/* Decorative foliage pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M80 10C60 20 50 50 50 80C50 50 40 20 20 10C40 20 50 0 80 10Z" fill="white"/>
                  <path d="M100 40C80 45 70 60 65 80C65 60 55 45 35 40C55 45 65 25 100 40Z" fill="white"/>
                </svg>
              </div>

              <div className="relative z-10">
                <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                  Today&apos;s Focus
                </p>
                <h2 className="text-xl font-bold mt-2">
                  Mindfulness & Self-Reflection
                </h2>
                <p className="text-emerald-200/70 text-sm mt-2 leading-relaxed max-w-md">
                  Take a moment to reflect on your emotions. Understanding your feelings is the first step toward growth.
                </p>
                <Link href="/quiz">
                  <button className="mt-5 bg-white/15 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/25 transition-all border border-white/10">
                    Take the Quiz: Present Moment
                  </button>
                </Link>
              </div>
            </div>

            {/* Two Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* AI Therapist Card */}
              <Link href="/aastha" className="block group">
                <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-stone-200 transition-all duration-300 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8V4H8"/>
                        <rect width="16" height="12" x="4" y="8" rx="2"/>
                        <path d="M2 14h2"/>
                        <path d="M20 14h2"/>
                        <path d="M15 13v2"/>
                        <path d="M9 13v2"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-stone-800 text-base">Aastha</h3>
                      <p className="text-xs text-stone-400 mt-0.5">AI Therapist</p>
                      <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                        Your AI companion is here to listen and support you.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm font-medium text-violet-600 group-hover:text-violet-700 transition-colors">
                    Start conversation
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5 transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Talk to Someone Card */}
              <Link href="/talk" className="block group">
                <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-stone-200 transition-all duration-300 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-stone-800 text-base">Talk to Someone</h3>
                      <p className="text-xs text-stone-400 mt-0.5">Anonymous & Safe</p>
                      <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                        Connect with someone who understands how you feel.
                      </p>
                    </div>
                  </div>
                  {latestMood && (
                    <p className="text-xs text-stone-400 mt-3">
                      Matching based on: <span className="capitalize font-medium text-emerald-600">{latestMood}</span> mood
                    </p>
                  )}
                  <div className="mt-3 flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700 transition-colors">
                    Find a match
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5 transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </div>

        {/* Journal Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-stone-800">
                Journals
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Your personal reflections
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/journal"
                className="text-sm text-stone-500 hover:text-stone-700 font-medium transition-colors"
              >
                View All
              </Link>
              <Link href="/journal">
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  </svg>
                  New Entry
                </button>
              </Link>
            </div>
          </div>

          {journals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {journals.map((j) => (
                <JournalCard key={j.id} journal={j} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-10 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-50 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </div>
              <p className="text-stone-500 text-sm">
                No journal entries yet.
              </p>
              <Link href="/journal">
                <button className="mt-3 text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors underline underline-offset-2">
                  Write your first entry
                </button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
