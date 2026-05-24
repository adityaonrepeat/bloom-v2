import { Sparkles, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AasthaSession } from "@/hooks/useAastha"

interface EmptyStateProps {
  onNewSession: () => void
  isCreating?: boolean
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

export function EmptyState({ onNewSession, isCreating, onToggleSidebar, sidebarOpen }: EmptyStateProps) {
  return (
    <div
      className="flex flex-1 flex-col"
      style={{ background: "#f7f4ef", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center px-4 py-3"
        style={{
          background: "rgba(247,244,239,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(40,49,44,0.08)",
        }}
      >
        {!sidebarOpen && onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg transition-opacity hover:opacity-60"
            style={{ color: "#5D6862" }}
            onClick={onToggleSidebar}
            title="Open sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Centered empty state */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        {/* Aastha avatar ring */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "#28312C" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "#E3A863", color: "#28312C", fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            A
          </div>
        </div>

        <div className="space-y-2">
          <h2
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "26px",
              letterSpacing: "-0.02em",
              color: "#28312C",
              lineHeight: 1.1,
            }}
          >
            Hi, I&apos;m Aastha
          </h2>
          <p
            className="max-w-xs leading-relaxed"
            style={{ fontSize: "15px", color: "#5D6862" }}
          >
            A safe space to talk about whatever&apos;s on your mind. I&apos;m here to listen — without judgment.
          </p>
        </div>

        <button
          onClick={onNewSession}
          disabled={isCreating}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          style={{ background: "#28312C", color: "#f7f4ef", boxShadow: "0 4px 16px rgba(40,49,44,0.2)" }}
        >
          <Sparkles className="h-4 w-4" />
          {isCreating ? "Starting…" : "Start a new session"}
        </button>
      </div>
    </div>
  )
}

interface ChatHeaderProps {
  session: AasthaSession | null
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

export function ChatHeader({ session, onToggleSidebar, sidebarOpen }: ChatHeaderProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{
        background: "rgba(247,244,239,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(40,49,44,0.08)",
        fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif",
      }}
    >
      {!sidebarOpen && onToggleSidebar && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg transition-opacity hover:opacity-60"
          style={{ color: "#5D6862" }}
          onClick={onToggleSidebar}
          title="Open sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Avatar */}
      <div
        className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-sm font-bold"
        style={{
          background: "#E3A863",
          color: "#28312C",
          fontFamily: "var(--font-fraunces), Georgia, serif",
        }}
      >
        A
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold" style={{ color: "#28312C" }}>Aastha</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#7C9885" }} />
          <p className="text-[11px]" style={{ color: "#5D6862" }}>
            {session?.title && session.title !== "New Session"
              ? session.title
              : "Bloom Wellness · Confidential"}
          </p>
        </div>
      </div>
    </div>
  )
}
