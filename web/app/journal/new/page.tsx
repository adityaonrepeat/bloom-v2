"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Sparkles, Lock } from "lucide-react"

const PROMPTS = [
  "What made me smile today?",
  "What's weighing on my mind?",
  "What am I grateful for right now?",
  "What do I need to let go of?",
]

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
  const dateLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
  const timeLabel = today.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

  return (
    <div className="min-h-screen bg-bloom-cream text-bloom-ink font-sans">
      <header className="px-6 md:px-10 py-6">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-sm text-bloom-inkSoft hover:text-bloom-ink transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          Journal
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-20 pt-2">
        {/* Editorial intro */}
        <div className="px-2 mb-6">
          <p className="eyebrow text-bloom-inkSoft mb-2 inline-flex items-center gap-2">
            <Sparkles size={11} strokeWidth={1.5} />
            New entry · {dateLabel}
          </p>
          <h1 className="font-display text-3xl md:text-4xl leading-tight tracking-tight">
            Whatever&apos;s{" "}
            <span className="italic font-light text-bloom-terracotta">true tonight.</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl border border-bloom-line/70 shadow-[0_18px_50px_-30px_rgba(42,47,45,0.2)] overflow-hidden">
            {/* terracotta accent bar */}
            <div className="h-1 bg-bloom-terracotta" />

            <div className="px-8 pt-7">
              <p className="eyebrow text-bloom-inkSoft">{timeLabel}</p>
            </div>

            {/* Title */}
            <div className="px-8 pt-4 pb-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give it a title…"
                className="w-full bg-transparent outline-none font-display text-2xl md:text-3xl text-bloom-ink leading-tight placeholder:text-bloom-inkSoft/35 placeholder:not-italic"
                maxLength={120}
                autoFocus
              />
            </div>

            <div className="mx-8 h-px bg-bloom-line/70" />

            {/* Content */}
            <div className="px-8 py-5">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind today? Write freely — this is your private space…"
                className="w-full bg-transparent outline-none resize-none text-bloom-ink placeholder:text-bloom-inkSoft/45 placeholder:italic"
                style={{ minHeight: "320px", fontSize: "16px", lineHeight: "1.9" }}
              />
            </div>

            {/* Footer */}
            <div className="px-8 py-5 flex items-center justify-between border-t border-bloom-line/60 bg-bloom-cream/40">
              <p className="text-xs text-bloom-inkSoft">
                <span className="font-medium text-bloom-ink">{wordCount}</span>{" "}
                {wordCount === 1 ? "word" : "words"}
              </p>
              <button
                type="submit"
                disabled={saving || !title.trim() || !content.trim()}
                className="inline-flex items-center rounded-full px-6 py-2.5 text-sm bg-bloom-forest text-bloom-cream hover:bg-bloom-forestSoft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : "Save entry"}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm rounded-2xl px-4 py-3 text-bloom-terracotta bg-bloom-terracotta/8 border border-bloom-terracotta/20">
              {error}
            </p>
          )}
        </form>

        {/* Privacy reassurance */}
        <p className="mt-5 px-2 inline-flex items-center gap-2 text-xs text-bloom-inkSoft/70">
          <Lock size={12} strokeWidth={1.5} className="text-bloom-terracotta" />
          Only you can read this. Entries are private to your account.
        </p>

        {/* Writing prompts */}
        <div className="mt-10 pt-7 border-t border-bloom-line">
          <p className="eyebrow text-bloom-inkSoft/60 mb-4">Need a place to start?</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setContent((c) => (c ? `${c}\n\n${prompt}\n` : `${prompt}\n`))}
                className="group flex items-center gap-3 text-left text-sm rounded-2xl px-4 py-3 bg-white border border-bloom-line/70 text-bloom-inkSoft hover:border-bloom-terracotta/50 hover:text-bloom-ink transition-colors"
              >
                <span className="shrink-0 text-bloom-terracotta/70 group-hover:text-bloom-terracotta transition-colors">
                  <Sparkles size={13} strokeWidth={1.5} />
                </span>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
