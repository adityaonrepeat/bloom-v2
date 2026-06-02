"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Trash2, Lock } from "lucide-react"

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
      <div className="min-h-screen bg-bloom-cream flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-bloom-line border-t-bloom-terracotta animate-spin" />
      </div>
    )
  }

  if (!journal) return null

  const date = new Date(journal.createdAt)
  const dateLabel = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  const timeLabel = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

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
          <p className="eyebrow text-bloom-inkSoft mb-2">{dateLabel}</p>
          <h1 className="font-display text-3xl md:text-4xl leading-tight tracking-tight">
            An entry you{" "}
            <span className="italic font-light text-bloom-terracotta">already started.</span>
          </h1>
        </div>

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
              onChange={(e) => { setTitle(e.target.value); setIsDirty(true) }}
              className="w-full bg-transparent outline-none font-display text-2xl md:text-3xl text-bloom-ink leading-tight placeholder:text-bloom-inkSoft/35"
              maxLength={120}
            />
          </div>

          <div className="mx-8 h-px bg-bloom-line/70" />

          {/* Content */}
          <div className="px-8 py-5">
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setIsDirty(true) }}
              className="w-full bg-transparent outline-none resize-none text-bloom-ink"
              style={{ minHeight: "320px", fontSize: "16px", lineHeight: "1.9" }}
            />
          </div>

          {/* Footer */}
          <div className="px-8 py-5 flex items-center justify-between border-t border-bloom-line/60 bg-bloom-cream/40">
            <p className={`text-xs ${saveError ? "text-bloom-terracotta" : "text-bloom-inkSoft"}`}>
              {saveError ? saveError : (
                <>
                  <span className="font-medium text-bloom-ink">{wordCount}</span>
                  {" "}{wordCount === 1 ? "word" : "words"}{lastSaved ? ` · ${getLastSavedLabel()}` : ""}
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm border border-bloom-line text-bloom-inkSoft hover:border-bloom-terracotta/50 hover:text-bloom-terracotta transition-colors"
              >
                <Trash2 size={14} strokeWidth={1.75} />
                Delete
              </button>
              <button
                onClick={handleManualSave}
                disabled={saving}
                className="inline-flex items-center rounded-full px-6 py-2.5 text-sm bg-bloom-forest text-bloom-cream hover:bg-bloom-forestSoft transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* Privacy reassurance */}
        <p className="mt-5 px-2 inline-flex items-center gap-2 text-xs text-bloom-inkSoft/70">
          <Lock size={12} strokeWidth={1.5} className="text-bloom-terracotta" />
          Only you can read this. Changes autosave as you write.
        </p>
      </main>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bloom-forest/40 backdrop-blur-sm px-4">
          <div className="bg-bloom-cream rounded-3xl border border-bloom-line/70 shadow-[0_32px_80px_-20px_rgba(28,42,37,0.5)] p-8 max-w-sm w-full space-y-5 animate-scale-in">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto bg-bloom-terracotta/12">
                <Trash2 size={20} strokeWidth={1.75} className="text-bloom-terracotta" />
              </div>
              <h2 className="font-display text-xl text-bloom-ink">Delete this entry?</h2>
              <p className="text-sm text-bloom-inkSoft">
                This cannot be undone. Your journal entry will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-11 rounded-full text-sm border border-bloom-line text-bloom-inkSoft hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-11 rounded-full text-sm bg-bloom-terracotta text-bloom-cream hover:bg-bloom-terracottaHover transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
