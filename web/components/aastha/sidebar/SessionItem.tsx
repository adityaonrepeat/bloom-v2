import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AasthaSession } from "@/hooks/useAastha"

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

interface SessionItemProps {
  session: AasthaSession
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  isDeleting?: boolean
}

export function SessionItem({ session, isActive, onSelect, onDelete, isDeleting }: SessionItemProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Delete this session? This can't be undone.")) onDelete()
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
        "group relative w-full rounded-xl px-3 py-2.5 text-left transition-all focus-visible:outline-none cursor-pointer",
        isDeleting && "opacity-50 pointer-events-none"
      )}
      style={{
        background: isActive ? "rgba(40,49,44,0.08)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "rgba(40,49,44,0.05)"
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent"
      }}
    >
      <div className="flex items-start gap-2 pr-6">
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-[13px] font-medium leading-snug"
            style={{ color: isActive ? "#28312C" : "#5D6862" }}
          >
            {session.title}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[11px]" style={{ color: "rgba(93,104,98,0.6)" }}>
              {timeAgo(session.updatedAt)}
            </span>
            {session._count && (
              <span
                className="rounded-full px-1.5 py-px text-[10px]"
                style={{ background: "rgba(40,49,44,0.07)", color: "#5D6862" }}
              >
                {session._count.messages}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="absolute right-2 top-2.5 rounded-md p-1 opacity-0 group-hover:opacity-100 transition-all hover:text-[#C67156]"
        style={{ color: "#5D6862" }}
        title="Delete session"
        tabIndex={-1}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function SessionItemSkeleton() {
  return (
    <div className="rounded-xl px-3 py-2.5">
      <div className="h-3 w-3/4 animate-pulse rounded" style={{ background: "rgba(40,49,44,0.08)" }} />
      <div className="mt-2 h-2.5 w-1/2 animate-pulse rounded" style={{ background: "rgba(40,49,44,0.06)" }} />
    </div>
  )
}
