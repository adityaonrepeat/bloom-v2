"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewJournalPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError("Both title and content are required.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save entry.")
        setSaving(false)
        return
      }
      const journal = await res.json()
      router.push(`/journal/${journal.id}`)
    } catch {
      setError("Something went wrong. Please try again.")
      setSaving(false)
    }
  }

  const today = new Date()
  const dayLabel = today.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
  const timeLabel = today.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

  return (
    <div className="min-h-screen" style={{ background: "#f7f4ef" }}>
      <header className="px-6 py-5">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-60"
          style={{ color: "#5D6862" }}
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Journal
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-16 pt-2">
        <form onSubmit={handleSubmit}>
          <div
            className="bg-white rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 4px 32px rgba(40,49,44,0.06), 0 1px 4px rgba(40,49,44,0.04)" }}
          >
            {/* Card header row */}
            <div className="px-8 pt-7">
              <p className="text-xs font-medium tracking-wide" style={{ color: "#9CA3AF" }}>
                {dayLabel} · {timeLabel}
              </p>
            </div>

            {/* Title */}
            <div className="px-8 pt-6 pb-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title…"
                className="w-full bg-transparent border-none outline-none"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "clamp(22px, 4vw, 32px)",
                  color: "#28312C",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
                maxLength={120}
                autoFocus
              />
            </div>

            <div className="mx-8 h-px" style={{ background: "rgba(40,49,44,0.08)" }} />

            {/* Content */}
            <div className="px-8 py-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind today? Write freely — this is your private space…"
                className="w-full bg-transparent border-none outline-none resize-none"
                style={{ minHeight: "300px", fontSize: "16px", lineHeight: "2", color: "#28312C" }}
              />
            </div>

            {/* Card footer */}
            <div
              className="px-8 py-5 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(40,49,44,0.06)" }}
            >
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                <span className="font-medium" style={{ color: "#6B7280" }}>{wordCount}</span> words
              </p>
              <button
                type="submit"
                disabled={saving || !title.trim() || !content.trim()}
                className="h-9 px-5 text-sm font-medium rounded-full transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#28312C", color: "#f7f4ef" }}
              >
                {saving ? "Saving…" : "Save Entry"}
              </button>
            </div>
          </div>

          {error && (
            <p
              className="mt-4 text-sm rounded-xl px-4 py-3"
              style={{ color: "#C67156", background: "rgba(198,113,86,0.08)", border: "1px solid rgba(198,113,86,0.2)" }}
            >
              {error}
            </p>
          )}
        </form>

        {/* Writing prompts */}
        <div className="mt-10" style={{ borderTop: "1px solid rgba(40,49,44,0.1)", paddingTop: "28px" }}>
          <p
            className="mb-4 uppercase tracking-wider"
            style={{ fontSize: "11px", fontWeight: 600, color: "rgba(93,104,98,0.5)" }}
          >
            Need inspiration?
          </p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {[
              "What made me smile today?",
              "What's weighing on my mind?",
              "What am I grateful for right now?",
              "What do I need to let go of?",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setContent((c) => c ? `${c}\n\n${prompt}\n` : `${prompt}\n`)}
                className="text-left text-sm rounded-xl px-4 py-3 transition-all hover:opacity-80"
                style={{ color: "#5D6862", background: "rgba(255,255,255,0.72)", border: "1px solid rgba(40,49,44,0.08)" }}
              >
                ✦ {prompt}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
