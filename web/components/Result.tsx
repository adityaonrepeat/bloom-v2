"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getEmotionLevel, getEmotionEmoji, getEmotionMessage } from "@/utils/emotion"
import { authClient } from "@/lib/auth-client"

const emotionConfig: Record<string, { accent: string; bg: string }> = {
  happy:    { accent: "#7C9885", bg: "rgba(124,152,133,0.12)" },
  calm:     { accent: "#A6B3A8", bg: "rgba(166,179,168,0.12)" },
  stressed: { accent: "#E3A863", bg: "rgba(227,168,99,0.12)"  },
  anxious:  { accent: "#C67156", bg: "rgba(198,113,86,0.12)"  },
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f7f4ef" }}
      >
        <div
          className="w-10 h-10 rounded-full border-4 animate-spin"
          style={{ borderColor: "rgba(40,49,44,0.1)", borderTopColor: "#C67156" }}
        />
      </div>
    )
  }

  const c = emotionConfig[level] ?? emotionConfig.calm
  const maxScore = 50
  const percentage = Math.round((score / maxScore) * 100)

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      <div className="w-full max-w-md space-y-5">

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(40,49,44,0.08)",
            boxShadow: "0 8px 40px rgba(40,49,44,0.08)",
          }}
        >
          {/* Accent line */}
          <div className="h-1" style={{ background: c.accent }} />

          <div className="p-8 md:p-10 space-y-7 text-center">

            {/* Emoji ring + badge */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: c.bg, border: `2px solid ${c.accent}40` }}
              >
                <span className="text-4xl">{getEmotionEmoji(level)}</span>
              </div>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{ background: c.bg, color: c.accent }}
              >
                {level}
              </span>
            </div>

            {/* Score bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium" style={{ color: "#A6B3A8" }}>
                <span>Wellbeing Score</span>
                <span style={{ color: c.accent }}>{score} / {maxScore}</span>
              </div>
              <div
                className="h-2 w-full rounded-full overflow-hidden"
                style={{ background: "rgba(40,49,44,0.07)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${percentage}%`, background: c.accent }}
                />
              </div>
            </div>

            {/* Message */}
            <p className="text-sm leading-relaxed px-2" style={{ color: "#5D6862" }}>
              {getEmotionMessage(level)}
            </p>

            {/* Actions */}
            <div className="space-y-3 pt-1">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full h-12 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.99]"
                style={{ background: "#28312C", color: "#f7f4ef" }}
              >
                Go to Dashboard
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push("/aastha")}
                  className="h-11 rounded-full text-sm font-medium transition-all hover:opacity-75"
                  style={{
                    border: "1px solid rgba(40,49,44,0.15)",
                    color: "#28312C",
                    background: "transparent",
                  }}
                >
                  Talk to Aastha
                </button>
                <button
                  onClick={() => router.push("/talk")}
                  className="h-11 rounded-full text-sm font-medium transition-all hover:opacity-75"
                  style={{
                    border: "1px solid rgba(40,49,44,0.15)",
                    color: "#28312C",
                    background: "transparent",
                  }}
                >
                  Talk to Someone
                </button>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("emotion-score")
                  localStorage.removeItem("emotion-tag")
                  router.push("/quiz")
                }}
                className="text-xs transition-opacity hover:opacity-70"
                style={{ color: "rgba(93,104,98,0.5)" }}
              >
                Retake quiz
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs" style={{ color: "rgba(93,104,98,0.4)" }}>
          Your result has been saved privately to your profile.
        </p>
      </div>
    </div>
  )
}
