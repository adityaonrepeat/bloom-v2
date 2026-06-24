import { useState } from "react"
import { createPortal } from "react-dom"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AasthaSession } from "@/hooks/useAastha"

function formatSessionDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()

  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()

  if (sameDay) return now.getHours() >= 18 ? "TONIGHT" : "TODAY"

  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 7) {
    return d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()
  }

  return d
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase()
}

interface SessionItemProps {
  session: AasthaSession
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  isDeleting?: boolean
}

export function SessionItem({ session, isActive, onSelect, onDelete, isDeleting }: SessionItemProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowConfirm(true)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          if (!isDeleting) onSelect()
        }
      }}
      onClick={() => { if (!isDeleting) onSelect() }}
      aria-disabled={isDeleting}
      className={cn(
        "group relative w-full rounded-xl px-3 py-2.5 text-left transition-all cursor-pointer focus-visible:outline-none",
        isDeleting && "opacity-50 pointer-events-none"
      )}
      style={{ background: isActive ? "rgba(244, 234, 225, 0.7)" : "transparent" }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "rgba(40,49,44,0.04)"
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent"
      }}
    >
      <div className="flex items-start gap-2 pr-6">
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-[13px] font-medium leading-snug"
            style={{ color: isActive ? "#28312C" : "#3D4A45" }}
          >
            {session.title}
          </p>
          {session.messages?.[0]?.content && (
            <p
              className="truncate text-[11.5px] italic leading-snug mt-0.5"
              style={{ color: isActive ? "rgba(40,49,44,0.55)" : "rgba(40,49,44,0.38)" }}
            >
              {session.messages[0].content}
            </p>
          )}
          <span
            className="mt-1 block text-[10px] font-semibold tracking-wider"
            style={{ color: isActive ? "rgba(40,49,44,0.5)" : "rgba(40,49,44,0.28)" }}
          >
            {formatSessionDate(session.updatedAt)}
          </span>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 opacity-0 group-hover:opacity-100 transition-all"
        style={{ color: "rgba(40,49,44,0.35)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#D96A4E")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(40,49,44,0.35)")}
        title="Delete session"
        tabIndex={-1}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {showConfirm && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(28,42,37,0.4)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { e.stopPropagation(); setShowConfirm(false) }}
        >
          <div
            className="bg-bloom-cream rounded-3xl border border-bloom-line/70 p-8 max-w-sm w-full space-y-5"
            style={{ boxShadow: "0 32px 80px -20px rgba(28,42,37,0.5)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto bg-bloom-terracotta/10">
                <Trash2 size={20} strokeWidth={1.75} className="text-bloom-terracotta" />
              </div>
              <h2 className="font-display text-xl text-bloom-ink">Delete this session?</h2>
              <p className="text-sm text-bloom-inkSoft">
                This cannot be undone. Your conversation will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-11 rounded-full text-sm border border-bloom-line text-bloom-inkSoft hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowConfirm(false); onDelete() }}
                disabled={isDeleting}
                className="flex-1 h-11 rounded-full text-sm bg-bloom-terracotta text-bloom-cream hover:bg-bloom-terracottaHover transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export function SessionItemSkeleton() {
  return (
    <div className="rounded-xl px-3 py-2.5">
      <div className="h-3 w-3/4 animate-pulse rounded" style={{ background: "rgba(40,49,44,0.07)" }} />
      <div className="mt-2 h-2 w-1/3 animate-pulse rounded" style={{ background: "rgba(40,49,44,0.05)" }} />
    </div>
  )
}
