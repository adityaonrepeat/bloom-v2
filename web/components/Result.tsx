"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getEmotionLevel, getEmotionMessage } from "@/utils/emotion"
import { authClient } from "@/lib/auth-client"

const TAG_LABELS: Record<string, string> = {
  happy:    "Sunny & open",
  calm:     "Steady & grounded",
  stressed: "Under pressure",
  anxious:  "On edge",
}

export default function Result() {
  const router = useRouter()
  const [score, setScore] = useState<number | null>(null)
  const [level, setLevel] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const storedScore = Number(localStorage.getItem("emotion-score") || 0)
    const tag = getEmotionLevel(storedScore)
    localStorage.setItem("emotion-tag", tag)
    Promise.resolve().then(() => {
      setScore(storedScore)
      setLevel(tag)
    })
  }, [])

  useEffect(() => {
    if (score === null || !level || saved) return

    const save = async () => {
      try {
        const res = await authClient.getSession()
        const session = "data" in res ? res.data : null
        if (!session?.user?.id) return

        await fetch("/api/mood", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag: level, score }),
        })
        setSaved(true)
      } catch (e) {
        console.error("Failed to save mood:", e)
      }
    }

    save()
  }, [score, level, saved])

  if (score === null) {
    return (
      <div className="min-h-screen bg-bloom-cream flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-bloom-line border-t-bloom-terracotta animate-spin" />
      </div>
    )
  }

  const percentage = Math.round((score / 50) * 100)

  return (
    <div className="min-h-screen bg-bloom-cream font-sans flex flex-col items-center justify-center px-4 py-12">

      <div className="w-full max-w-md mb-6">
        <Link href="/dashboard" className="text-xs text-bloom-inkSoft hover:text-bloom-ink transition-colors">
          ← Dashboard
        </Link>
      </div>

      <div className="w-full max-w-md space-y-4">

        <div className="bg-white rounded-3xl border border-bloom-line/70 shadow-[0_18px_50px_-30px_rgba(42,47,45,0.18)] overflow-hidden">
          <div className="h-1 bg-bloom-terracotta" />

          <div className="p-8 md:p-10 space-y-7">

            {/* Score */}
            <div className="text-center">
              <p className="eyebrow text-bloom-inkSoft mb-3">Your result</p>
              <div className="flex items-baseline gap-3 justify-center">
                <span className="font-display text-7xl text-bloom-ink leading-none">{score}</span>
                <span className="font-display text-xl italic text-bloom-inkSoft/40">/50</span>
              </div>
              <p className="font-display italic text-xl text-bloom-terracotta mt-2">
                {TAG_LABELS[level] ?? level}
              </p>
            </div>

            {/* Progress bar */}
            <div>
              <div className="h-1 rounded-full bg-bloom-line/60 overflow-hidden">
                <div
                  className="h-full bg-bloom-terracotta rounded-full transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-bloom-inkSoft/40 mt-1.5">
                <span>10</span>
                <span>50</span>
              </div>
            </div>

            <div className="h-px bg-bloom-line/60" />

            {/* Message */}
            <p className="text-sm text-bloom-inkSoft leading-relaxed">
              {getEmotionMessage(level)}
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full h-12 rounded-full text-sm font-semibold bg-bloom-forest text-bloom-cream hover:bg-bloom-forestSoft transition-colors active:scale-[0.99]"
              >
                Go to Dashboard
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push("/aastha")}
                  className="h-11 rounded-full text-sm font-medium border border-bloom-line text-bloom-ink hover:bg-bloom-peach/50 transition-colors"
                >
                  Talk to Aastha
                </button>
                <button
                  onClick={() => router.push("/talk")}
                  className="h-11 rounded-full text-sm font-medium border border-bloom-line text-bloom-ink hover:bg-bloom-peach/50 transition-colors"
                >
                  Talk to Someone
                </button>
              </div>
              <div className="text-center">
                <button
                  onClick={() => {
                    localStorage.removeItem("emotion-score")
                    localStorage.removeItem("emotion-tag")
                    router.push("/quiz")
                  }}
                  className="text-xs text-bloom-inkSoft/40 hover:text-bloom-inkSoft transition-colors"
                >
                  Retake quiz
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-bloom-inkSoft/40">
          Your result has been saved privately to your profile.
        </p>
      </div>
    </div>
  )
}
