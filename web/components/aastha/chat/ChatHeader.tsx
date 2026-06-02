import { Sparkles, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSessions, type AasthaSession } from "@/hooks/useAastha"

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
      style={{ background: "#1C2A25", fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center px-4 py-3"
        style={{
          background: "rgba(28,42,37,0.97)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(54,74,65,0.5)",
        }}
      >
        {!sidebarOpen && onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg transition-opacity hover:opacity-60"
            style={{ color: "rgba(249,246,240,0.6)" }}
            onClick={onToggleSidebar}
            title="Open sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Centered empty state */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        {/* Aastha avatar */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(37,54,48,0.8)", border: "1px solid rgba(54,74,65,0.6)" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: "#D96A4E",
              color: "#F9F6F0",
              fontFamily: "var(--font-fraunces), Georgia, serif",
            }}
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
              color: "#F9F6F0",
              lineHeight: 1.1,
            }}
          >
            Hi, I&apos;m Aastha
          </h2>
          <p
            className="max-w-xs leading-relaxed"
            style={{ fontSize: "15px", color: "rgba(249,246,240,0.55)" }}
          >
            A safe space to talk about whatever&apos;s on your mind. I&apos;m here to listen — without judgment.
          </p>
        </div>

        <button
          onClick={onNewSession}
          disabled={isCreating}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          style={{
            background: "#D96A4E",
            color: "#F9F6F0",
            boxShadow: "0 4px 16px rgba(217,106,78,0.3)",
          }}
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
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions()

  const sessionNum = (() => {
    if (!session || sessionsLoading) return null
    const idx = sessions.findIndex((s) => s.id === session.id)
    if (idx === -1) return null
    return sessions.length - idx
  })()

  return (
    <div
      className="flex items-center gap-3 px-6 py-4"
      style={{
        background: "rgba(28,42,37,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(54,74,65,0.5)",
        fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif",
      }}
    >
      {!sidebarOpen && onToggleSidebar && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg transition-opacity hover:opacity-60 mr-1"
          style={{ color: "rgba(249,246,240,0.6)" }}
          onClick={onToggleSidebar}
          title="Open sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Avatar */}
      <div
        className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-display text-xl"
        style={{
          background: "#D96A4E",
          color: "#F9F6F0",
        }}
      >
        A
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-display text-lg leading-none" style={{ color: "#F9F6F0" }}>
          Aastha
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
          />
          <p className="truncate text-[11px]" style={{ color: "rgba(249,246,240,0.5)" }}>
            here when you are{sessionNum != null ? ` · session ${sessionNum}` : ""}
          </p>
        </div>
      </div>

      <p
        className="shrink-0 text-[9px] font-semibold tracking-widest uppercase"
        style={{ color: "rgba(249,246,240,0.22)" }}
      >
        Private · Encrypted
      </p>
    </div>
  )
}
