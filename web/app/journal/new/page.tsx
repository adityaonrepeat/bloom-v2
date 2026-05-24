"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

export default function NewJournalPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

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

  return (
    <div
      className="min-h-screen"
      style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(247,244,239,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(40,49,44,0.08)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 h-15 flex items-center justify-between" style={{ height: "60px" }}>
          <Link
            href="/journal"
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-60"
            style={{ color: "#5D6862" }}
          >
            <ArrowLeft size={15} strokeWidth={2} />
            Journal
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: "rgba(93,104,98,0.5)" }}>
              {wordCount} {wordCount === 1 ? "word" : "words"} · {charCount} chars
            </span>
            <button
              onClick={() => handleSubmit()}
              disabled={saving || !title.trim() || !content.trim()}
              className="h-9 px-5 text-sm font-medium rounded-full flex items-center gap-1.5 transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#28312C", color: "#f7f4ef" }}
            >
              {saving ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <Save size={13} />
                  Save Entry
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Date badge */}
        <div className="flex items-center gap-2 mb-8">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(198,113,86,0.1)",
              color: "#C67156",
              border: "1px solid rgba(198,113,86,0.2)",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title…"
            className="w-full bg-transparent border-none outline-none tracking-tight"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "32px",
              color: "#28312C",
              letterSpacing: "-0.02em",
            }}
            maxLength={120}
            autoFocus
          />

          <div style={{ height: "1px", background: "rgba(40,49,44,0.1)" }} />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Write freely — this is your private space…"
            className="w-full bg-transparent border-none outline-none resize-none"
            style={{
              minHeight: "420px",
              fontSize: "16px",
              lineHeight: "2",
              color: "#28312C",
            }}
          />

          {error && (
            <p
              className="text-sm rounded-xl px-4 py-3"
              style={{
                color: "#C67156",
                background: "rgba(198,113,86,0.08)",
                border: "1px solid rgba(198,113,86,0.2)",
              }}
            >
              {error}
            </p>
          )}
        </form>

        {/* Writing prompts */}
        <div className="mt-14" style={{ borderTop: "1px solid rgba(40,49,44,0.1)", paddingTop: "28px" }}>
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
                style={{
                  color: "#5D6862",
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(40,49,44,0.08)",
                }}
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
