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

export function SessionItem({
  session,
  isActive,
  onSelect,
  onDelete,
  isDeleting,
}: SessionItemProps) {
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
      onClick={() => {
        if (!isDeleting) onSelect()
      }}
      aria-disabled={isDeleting}
      className={cn(
        "group relative w-full rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "hover:bg-accent/60",
        isActive && "bg-accent",
        isDeleting && "opacity-50 pointer-events-none cursor-not-allowed"
      )}
    >
      <div className="flex items-start gap-2 pr-6">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-[13px] font-medium leading-snug",
              isActive ? "text-foreground" : "text-foreground/80"
            )}
          >
            {session.title}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">
              {timeAgo(session.updatedAt)}
            </span>
            {session._count && (
              <span className="rounded-full bg-muted px-1.5 py-px text-[10px] text-muted-foreground">
                {session._count.messages}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delete button — only visible on hover */}
      <button
        onClick={handleDelete}
        className={cn(
          "absolute right-2 top-2.5 rounded-md p-1",
          "text-muted-foreground/0 transition-all",
          "group-hover:text-muted-foreground hover:!text-destructive hover:bg-destructive/10"
        )}
        title="Delete session"
        tabIndex={-1}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

export function SessionItemSkeleton() {
  return (
    <div className="rounded-xl px-3 py-2.5">
      <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-2.5 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  )
}
