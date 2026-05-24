"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, Save, X } from "lucide-react"

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
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !id) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })
      if (!res.ok) { setError("Failed to save."); setSaving(false); return }
      const updated: Journal = await res.json()
      setJournal(updated)
      setEditing(false)
    } catch {
      setError("Something went wrong.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setDeleting(true)
    try {
      await fetch(`/api/journal/${id}`, { method: "DELETE" })
      router.push("/journal")
    } catch {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f7f4ef" }}
      >
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: "rgba(40,49,44,0.1)", borderTopColor: "#C67156" }}
        />
      </div>
    )
  }

  if (!journal) return null

  const date = new Date(journal.createdAt)
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  const wordCount = journal.content.trim().split(/\s+/).length

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
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between" style={{ height: "60px" }}>
          <Link
            href="/journal"
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-60"
            style={{ color: "#5D6862" }}
          >
            <ArrowLeft size={15} strokeWidth={2} />
            Journal
          </Link>

          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => { setEditing(false); setTitle(journal.title); setContent(journal.content) }}
                  className="h-9 px-4 text-sm font-medium rounded-full flex items-center gap-1.5 transition-all hover:opacity-70"
                  style={{
                    color: "#5D6862",
                    background: "rgba(40,49,44,0.06)",
                    border: "1px solid rgba(40,49,44,0.1)",
                  }}
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-9 px-5 text-sm font-medium rounded-full flex items-center gap-1.5 transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#28312C", color: "#f7f4ef" }}
                >
                  {saving ? (
                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : <Save size={13} />}
                  {saving ? "Saving…" : "Save"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="h-9 px-4 text-sm font-medium rounded-full flex items-center gap-1.5 transition-all hover:opacity-80"
                  style={{
                    color: "#28312C",
                    background: "rgba(40,49,44,0.06)",
                    border: "1px solid rgba(40,49,44,0.1)",
                  }}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="h-9 px-4 text-sm font-medium rounded-full flex items-center gap-1.5 transition-all hover:opacity-80"
                  style={{
                    color: "#C67156",
                    background: "rgba(198,113,86,0.08)",
                    border: "1px solid rgba(198,113,86,0.15)",
                  }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {[
            { icon: (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
            ), text: formattedDate },
            { icon: (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            ), text: formattedTime },
            { icon: null, text: `${wordCount} words` },
          ].map((badge, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
              style={{
                background: i === 2 ? "rgba(198,113,86,0.1)" : "rgba(40,49,44,0.06)",
                color: i === 2 ? "#C67156" : "#5D6862",
                border: i === 2 ? "1px solid rgba(198,113,86,0.2)" : "1px solid rgba(40,49,44,0.08)",
              }}
            >
              {badge.icon}
              {badge.text}
            </div>
          ))}
        </div>

        {editing ? (
          <div className="space-y-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              className="w-full bg-transparent border-none outline-none resize-none"
              style={{ minHeight: "420px", fontSize: "16px", lineHeight: "2", color: "#28312C" }}
            />
            {error && (
              <p
                className="text-sm rounded-xl px-4 py-3"
                style={{ color: "#C67156", background: "rgba(198,113,86,0.08)", border: "1px solid rgba(198,113,86,0.2)" }}
              >
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <h1
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "32px",
                letterSpacing: "-0.02em",
                color: "#28312C",
                lineHeight: 1.15,
              }}
            >
              {journal.title}
            </h1>
            <div style={{ height: "1px", background: "rgba(40,49,44,0.1)" }} />
            <div
              className="whitespace-pre-wrap"
              style={{ fontSize: "16px", lineHeight: "2", color: "#28312C" }}
            >
              {journal.content}
            </div>
          </div>
        )}
      </main>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(40,49,44,0.4)", backdropFilter: "blur(8px)" }}>
          <div
            className="rounded-2xl p-8 max-w-sm w-full mx-4 space-y-5"
            style={{ background: "#f7f4ef", boxShadow: "0 32px 64px rgba(40,49,44,0.24)" }}
          >
            <div className="text-center space-y-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "rgba(198,113,86,0.12)" }}
              >
                <Trash2 size={20} style={{ color: "#C67156" }} />
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
