"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Journal {
  id: string
  title: string
  content: string
  createdAt: string
}

export default function JournalEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [journal, setJournal] = useState<Journal | null>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  const fetchJournal = useCallback(async (journalId: string) => {
    try {
      const res = await fetch(`/api/journal/${journalId}`)
      if (!res.ok) { router.push("/journal"); return }
      const data: Journal = await res.json()
      setJournal(data)
      setTitle(data.title)
      setContent(data.content)
    } catch {
      router.push("/journal")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (id) fetchJournal(id)
  }, [id, fetchJournal])

  // Autosave: fires 2s after the last keystroke
  useEffect(() => {
    if (!isDirty || !id || !title.trim() || !content.trim()) return
    const timer = setTimeout(async () => {
      setSaving(true)
      try {
        const res = await fetch(`/api/journal/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        })
        if (res.ok) {
          setLastSaved(new Date())
          setIsDirty(false)
          setSaveError(null)
        } else {
          setSaveError("Autosave failed. Click Save to retry.")
        }
      } finally {
        setSaving(false)
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [isDirty, id, title, content])

  const handleManualSave = async () => {
    if (!id || !title.trim() || !content.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })
      if (res.ok) {
        setLastSaved(new Date())
        setIsDirty(false)
        setSaveError(null)
      } else {
        setSaveError("Failed to save. Please try again.")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/journal/${id}`, { method: "DELETE" })
      if (!res.ok) {
        setSaveError("Failed to delete. Please try again.")
        setDeleting(false)
        setShowDeleteConfirm(false)
        return
      }
      router.push("/journal")
    } catch {
      setSaveError("Failed to delete. Please try again.")
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  function getLastSavedLabel(): string {
    if (!lastSaved) return ""
    if (saving) return "saving…"
    const diff = Math.floor((Date.now() - lastSaved.getTime()) / 1000)
    if (diff < 10) return "autosaved just now"
    const mins = Math.floor(diff / 60)
    if (mins < 60) return `autosaved ${mins || 1} min ago`
    return "autosaved earlier"
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f7f4ef" }}>
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: "rgba(40,49,44,0.1)", borderTopColor: "#C67156" }}
        />
      </div>
    )
  }

  if (!journal) return null

  const date = new Date(journal.createdAt)
  const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
  const timeLabel = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

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
              onChange={(e) => { setTitle(e.target.value); setIsDirty(true) }}
              className="w-full bg-transparent border-none outline-none"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(22px, 4vw, 32px)",
                color: "#28312C",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
              maxLength={120}
            />
          </div>

          <div className="mx-8 h-px" style={{ background: "rgba(40,49,44,0.08)" }} />

          {/* Content */}
          <div className="px-8 py-4">
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setIsDirty(true) }}
              className="w-full bg-transparent border-none outline-none resize-none"
              style={{ minHeight: "320px", fontSize: "16px", lineHeight: "2", color: "#28312C" }}
            />
          </div>

          {/* Card footer */}
          <div
            className="px-8 py-5 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(40,49,44,0.06)" }}
          >
            <p className="text-xs" style={{ color: saveError ? "#C67156" : "#9CA3AF" }}>
              {saveError ? saveError : (
                <>
                  <span className="font-medium" style={{ color: "#6B7280" }}>{wordCount}</span>
                  {" "}words{lastSaved ? ` · ${getLastSavedLabel()}` : ""}
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="h-9 px-4 text-sm font-medium rounded-full transition-all hover:opacity-80"
                style={{ border: "1px solid rgba(40,49,44,0.12)", color: "#5D6862", background: "transparent" }}
              >
                Delete
              </button>
              <button
                onClick={handleManualSave}
                disabled={saving}
                className="h-9 px-5 text-sm font-medium rounded-full transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "#28312C", color: "#f7f4ef" }}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(40,49,44,0.4)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="rounded-2xl p-8 max-w-sm w-full mx-4 space-y-5"
            style={{ background: "#f7f4ef", boxShadow: "0 32px 64px rgba(40,49,44,0.24)" }}
          >
            <div className="text-center space-y-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "rgba(198,113,86,0.12)" }}
              >
                <svg width="20" height="20" fill="none" stroke="#C67156" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "20px",
                  letterSpacing: "-0.01em",
                  color: "#28312C",
                }}
              >
                Delete this entry?
              </h2>
              <p style={{ fontSize: "14px", color: "#5D6862" }}>
                This cannot be undone. Your journal entry will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-11 rounded-full text-sm font-medium transition-all hover:opacity-80"
                style={{ border: "1px solid rgba(40,49,44,0.15)", color: "#5D6862", background: "transparent" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-11 rounded-full text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "#C67156", color: "#fff" }}
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
